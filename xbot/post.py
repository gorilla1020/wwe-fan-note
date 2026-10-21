# X 自動投稿（GitHub Actions で動く）
# xbot/queue/*.json を古い順に読み、番組の回ごとに「ネタバレ注意」の親ポストを1つ立て、
# その下に訳を返信でつないでいく。どこまで投稿したかは xbot/state.json に残す。
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


def tweet(text, reply_to=None):
    """投稿してIDを返す。重複で断られたら None（その1件は飛ばす）。それ以外の失敗は Stop。"""
    body = {'text': text}
    if reply_to:
        body['reply'] = {'in_reply_to_tweet_id': reply_to}
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
    log('投稿失敗 %s %s' % (r.status_code, r.text[:300].replace('\n', ' ')))
    raise Stop()


def parent_text(show, date):
    y, m, d = date.split('-')
    return ('【⚠️ネタバレ注意】\n'
            'WWE %s（%d/%d 米国放送）のマイク日本語訳を、このポストへの返信で放送中から順につないでいきます。\n'
            '録画・見逃しで観る方はご注意ください。\n'
            '%s #WWE' % (show, int(m), int(d), TAG.get(show, '')))


STALE_HOURS = 24  # 置かれてから24時間以上たった投稿待ちは出さない（キー設定前にたまった分などが一気に流れないように）


def queued_at(name):
    # ファイル名の末尾 -YYYYmmddHHMMSS.json（UTC）
    try:
        t = datetime.datetime.strptime(name.rsplit('-', 1)[1][:14], '%Y%m%d%H%M%S')
        return t.replace(tzinfo=datetime.timezone.utc)
    except Exception:
        return None


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
            k = sum(len(seg['posts']) for seg in q['segments'])
            n += k
        log('DRY RUN：Xのキーが未設定のため送っていない（未投稿の待ち %d 件）' % n)
        return
    s = load()
    posted = 0
    now = datetime.datetime.now(datetime.timezone.utc)
    try:
        for path in sorted(glob.glob(os.path.join(D, 'queue', '*.json'))):
            name = os.path.basename(path)
            with open(path, encoding='utf-8') as f:
                q = json.load(f)
            fs = s['files'].setdefault(name, {'n': 0})
            flat = [p for seg in q['segments'] for p in seg['posts']]
            if fs['n'] >= len(flat):
                continue
            t = queued_at(name)
            if t and (now - t).total_seconds() > STALE_HOURS * 3600:
                fs['n'] = len(flat)
                fs['stale'] = True
                save(s)
                log('%s は古いので投稿せずに閉じた' % name)
                continue
            ep = s['eps'].setdefault(q['ep'], {})
            if not ep.get('parent'):
                pid = tweet(parent_text(q['show'], q['date']))
                ep['parent'] = ep['last'] = pid
                save(s)
                log('%s 親ポスト %s' % (q['ep'], pid))
                time.sleep(2)
            while fs['n'] < len(flat):
                if posted >= MAX_PER_RUN:
                    log('1回の上限（%d件）に達したので、残りは次の実行で投稿する' % MAX_PER_RUN)
                    raise Stop()
                tid = tweet(flat[fs['n']], ep.get('last'))
                if tid:
                    ep['last'] = tid
                    posted += 1
                fs['n'] += 1
                save(s)
                time.sleep(2)
            log('%s 完了（%d件）' % (name, len(flat)))
    except Stop:
        pass
    save(s)
    log('今回 %d 件投稿' % posted)


if __name__ == '__main__':
    main()
