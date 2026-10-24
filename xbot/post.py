# X 自動投稿（GitHub Actions で動く）
# xbot/queue/*.json を古い順に読み、番組の回ごとに「ネタバレ注意」の親ポストを1つ立て、
# その下に訳を返信でつないでいく。どこまで投稿したかは xbot/state.json に残す。
# xbot/scheduled/*.json は予約投稿。各投稿の at（日時）を過ぎたら単独のポストとして出す。
# X のキー（リポジトリの Secrets）が無いときは DRY RUN（X には送らず、ログだけ書く）。
import datetime
import glob
import json
import os
import time

import requests
from requests_oauthlib import OAuth1

D = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(D, 'state.json')
LOG = os.path.join(D, 'log.txt')
MAX_PER_RUN = 40  # 1回の実行で投稿する上限（暴走して料金がかさむのを防ぐ）

KEYS = [os.environ.get(k, '').strip() for k in ('X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET')]
DRY = (not all(KEYS)) or os.environ.get('DRY_RUN') == '1'
AUTH = None if DRY else OAuth1(*KEYS)

TAG = {'RAW': '#WWERaw', 'SmackDown': '#SmackDown', 'NXT': '#WWENXT'}


class Stop(Exception):
    pass


def log(msg):
    line = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ ') + msg
    print(line)
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(line + '\n')


def load():
    if os.path.exists(STATE):
        with open(STATE, encoding='utf-8') as f:
            return json.load(f)
    return {'eps': {}, 'files': {}}


def save(s):
    with open(STATE, 'w', encoding='utf-8') as f:
        json.dump(s, f, ensure_ascii=False, indent=1)


def tweet(text, reply_to=None, quote=None):
    """投稿してIDを返す。重複で断られたら None（その1件は飛ばす）。それ以外の失敗は Stop。
    quote があれば、そのポストを引用する（返信と同時に引用できなければ、引用なしの返信で出し直す）。"""
    body = {'text': text}
    if reply_to:
        body['reply'] = {'in_reply_to_tweet_id': reply_to}
    if quote:
        body['quote_tweet_id'] = str(quote)
    try:
        r = requests.post('https://api.x.com/2/tweets', json=body, auth=AUTH, timeout=30)
    except requests.RequestException as e:
        log('通信エラー %s' % type(e).__name__)
        raise Stop()
    if r.status_code in (200, 201):
        return r.json()['data']['id']
    if r.status_code == 403 and 'duplicate' in r.text.lower():
        log('重複のため1件飛ばした')
        return None
    if quote and r.status_code in (400, 403):
        log('引用つきで断られた（%s %s）。引用なしで出し直す' % (r.status_code, r.text[:200].replace('\n', ' ')))
        return tweet(text, reply_to)
    log('投稿失敗 %s %s' % (r.status_code, r.text[:300].replace('\n', ' ')))
    raise Stop()


def parent_text(show, date):
    y, m, d = date.split('-')
    return ('【⚠️ネタバレ注意】\n'
            'WWE %s（%d/%d 米国放送）のマイク日本語訳を、このポストへの返信で放送中から順につないでいきます。\n'
            '録画・見逃しで観る方はご注意ください。\n'
            '%s #WWE' % (show, int(m), int(d), TAG.get(show, '')))


def tease_text(show, date, tease):
    y, m, d = date.split('-')
    return ('【⚠️ネタバレ注意】WWE %s（%d/%d 米国放送）🎤\n\n%s\n\n▼マイク日本語訳は返信で\n%s #WWE'
            % (show, int(m), int(d), tease.strip(), TAG.get(show, '')))


STALE_HOURS = 24  # 置かれてから24時間以上たった投稿待ちは出さない（キー設定前にたまった分などが一気に流れないように）


def queued_at(name):
    # ファイル名の末尾 -YYYYmmddHHMMSS.json（UTC）
    try:
        t = datetime.datetime.strptime(name.rsplit('-', 1)[1][:14], '%Y%m%d%H%M%S')
        return t.replace(tzinfo=datetime.timezone.utc)
    except Exception:
        return None


LATE_HOURS = 6  # 予約時刻から6時間以上遅れたもの（パソコンや GitHub の停止など）は出さずに閉じる


def parse_at(v):
    t = datetime.datetime.fromisoformat(v)
    if t.tzinfo is None:
        t = t.replace(tzinfo=datetime.timezone(datetime.timedelta(hours=9)))  # 日本時間
    return t


def run_scheduled(s, now, budget):
    """予約投稿のうち時刻を過ぎたものを出す。出した件数を返す。"""
    done = s.setdefault('sched', {})
    n = 0
    for path in sorted(glob.glob(os.path.join(D, 'scheduled', '*.json'))):
        name = os.path.basename(path)
        with open(path, encoding='utf-8') as f:
            q = json.load(f)
        fin = done.setdefault(name, [])
        for i, p in enumerate(q.get('posts', [])):
            if i in fin:
                continue
            at = parse_at(p['at'])
            if at > now:
                continue
            if (now - at).total_seconds() > LATE_HOURS * 3600:
                fin.append(i)
                save(s)
                log('%s #%d は予約時刻を大きく過ぎたので出さずに閉じた' % (name, i + 1))
                continue
            if n >= budget:
                return n
            tid = tweet(p['text'])
            fin.append(i)
            save(s)
            if tid:
                n += 1
                log('予約投稿 %s #%d %s' % (name, i + 1, tid))
            time.sleep(2)
    return n


def main():
    if DRY:
        # 試運転：何も記録せず、投稿されるはずだった件数だけログに書く
        n = 0
        for path in sorted(glob.glob(os.path.join(D, 'queue', '*.json'))):
            name = os.path.basename(path)
            if name in load()['files']:
                continue
            with open(path, encoding='utf-8') as f:
                q = json.load(f)
            k = sum(len(seg['posts']) + (1 if seg.get('tease') else 0) for seg in q.get('segments', []))
            n += k
        log('DRY RUN：Xのキーが未設定のため送っていない（未投稿の待ち %d 件）' % n)
        return
    s = load()
    posted = 0
    now = datetime.datetime.now(datetime.timezone.utc)
    try:
        posted += run_scheduled(s, now, MAX_PER_RUN)
        for path in sorted(glob.glob(os.path.join(D, 'queue', '*.json'))):
            name = os.path.basename(path)
            with open(path, encoding='utf-8') as f:
                q = json.load(f)
            fs = s['files'].setdefault(name, {'n': 0})
            # (本文, 引用するポストID) の並び。引用は各場面の最初の投稿にだけ付ける。匂わせ親の分も数に入れる
            flat = [(p, seg.get('qt') if i == 0 else None) for seg in q['segments'] for i, p in enumerate(seg['posts'])]
            total = len(flat) + sum(1 for seg in q['segments'] if (seg.get('tease') or '').strip())
            if fs['n'] >= total:
                continue
            t = queued_at(name)
            if t and (now - t).total_seconds() > STALE_HOURS * 3600:
                fs['n'] = total
                fs['stale'] = True
                save(s)
                log('%s は古いので投稿せずに閉じた' % name)
                continue
            if q.get('test'):
                # テスト投稿：親ポストを作らず単独で投稿する
                while fs['n'] < len(flat):
                    tid = tweet(*flat[fs['n']])
                    log('テスト投稿 %s' % tid)
                    fs['n'] += 1
                    posted += 1
                    save(s)
                continue
            # 場面ごとに tease（匂わせ）があれば、その場面だけの親ポストを単独で立て、訳はその下につなぐ。
            # tease のない場面は、従来どおり回ごとの「ネタバレ注意」親ポストの下につなぐ。
            items = []  # (種類, 本文, 引用ID)  種類: T=匂わせ親 / P=匂わせ親の下 / E=回の親の下
            for seg in q['segments']:
                t = (seg.get('tease') or '').strip()
                if t:
                    items.append(('T', tease_text(q['show'], q['date'], t), None))
                for i, p in enumerate(seg['posts']):
                    items.append(('P' if t else 'E', p, seg.get('qt') if i == 0 else None))
            ep = s['eps'].setdefault(q['ep'], {})
            while fs['n'] < len(items):
                if posted >= MAX_PER_RUN:
                    log('1回の上限（%d件）に達したので、残りは次の実行で投稿する' % MAX_PER_RUN)
                    raise Stop()
                kind, text, qt = items[fs['n']]
                if kind == 'T':
                    tid = tweet(text) or tweet(text.replace('\n\n▼', ' ②\n\n▼', 1))
                    if not tid:
                        log('匂わせポストが重複で出せなかったので、この場面を飛ばす')
                        n = fs['n'] + 1
                        while n < len(items) and items[n][0] == 'P':
                            n += 1
                        fs['n'] = n
                        save(s)
                        continue
                    fs['last'] = tid
                    log('%s 匂わせ親ポスト %s' % (q['ep'], tid))
                elif kind == 'P':
                    tid = tweet(text, fs.get('last'), qt)
                    if tid:
                        fs['last'] = tid
                else:
                    if not ep.get('parent'):
                        pid = tweet(parent_text(q['show'], q['date']))
                        ep['parent'] = ep['last'] = pid
                        save(s)
                        log('%s 親ポスト %s' % (q['ep'], pid))
                        time.sleep(2)
                    tid = tweet(text, ep.get('last'), qt)
                    if tid:
                        ep['last'] = tid
                if tid:
                    posted += 1
                fs['n'] += 1
                save(s)
                time.sleep(2)
            flat = items
            log('%s 完了（%d件）' % (name, len(flat)))
    except Stop:
        pass
    save(s)
    if posted:
        log('今回 %d 件投稿' % posted)


if __name__ == '__main__':
    main()
