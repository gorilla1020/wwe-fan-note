# X クリップ取得：WWE公式のXアカウントに放送中に上がった動画ポストを読み、
# 音声を文字起こしして xbot/clips/<米国の日付>/<ポストID>.json に保存する（GitHub Actions で動く）。
# 訳と投稿は別（Claude の定期タスクが clips を読み、引用ポストの下書きを xbot/queue に置く）。
import datetime
import glob
import json
import os
import subprocess
import sys
import tempfile
from zoneinfo import ZoneInfo

import requests
from requests_oauthlib import OAuth1

D = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(D, 'xclips_state.json')
LOG = os.path.join(D, 'log.txt')
ACCOUNTS = ['WWE', 'WWENXT']
MIN_SEC, MAX_SEC = 20, 20 * 60     # 短すぎる煽り動画と、長い試合動画は除く
MAX_CLIPS = 15                      # 1回に文字起こしする上限
MODEL = os.environ.get('WHISPER_MODEL', 'small.en')
ET = ZoneInfo('America/New_York')

KEYS = [os.environ.get(k, '').strip() for k in ('X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET')]
AUTH = OAuth1(*KEYS) if all(KEYS) else None


def log(msg):
    line = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ ') + 'clips ' + msg
    print(line)
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(line + '\n')


def load():
    if os.path.exists(STATE):
        with open(STATE, encoding='utf-8') as f:
            return json.load(f)
    return {'uid': {}, 'since': {}, 'last': {}, 'done': []}


def save(s):
    s['done'] = s['done'][-3000:]
    with open(STATE, 'w', encoding='utf-8') as f:
        json.dump(s, f, ensure_ascii=False, indent=1)


def get(url, params=None):
    r = requests.get(url, params=params, auth=AUTH, timeout=30)
    if r.status_code != 200:
        raise RuntimeError('%s %s' % (r.status_code, r.text[:300].replace('\n', ' ')))
    return r.json()


def uid_of(s, name):
    if name not in s['uid']:
        s['uid'][name] = get('https://api.x.com/2/users/by/username/' + name)['data']['id']
    return s['uid'][name]


def fetch(s, name, now, hours):
    """新着の動画ポスト（返信・リポスト除く）を古い順に返す。"""
    p = {'max_results': 100, 'exclude': 'retweets,replies',
         'tweet.fields': 'created_at,attachments,text',
         'expansions': 'attachments.media_keys',
         'media.fields': 'type,duration_ms,variants'}
    last = s['last'].get(name)
    recent = last and (now - datetime.datetime.fromisoformat(last)).total_seconds() < 2 * 3600
    if hours is None and recent and s['since'].get(name):
        p['since_id'] = s['since'][name]
    else:
        p['start_time'] = (now - datetime.timedelta(hours=hours or 1)).strftime('%Y-%m-%dT%H:%M:%SZ')
    j = get('https://api.x.com/2/users/%s/tweets' % uid_of(s, name), p)
    tw = j.get('data', [])
    if tw:
        s['since'][name] = max(tw, key=lambda t: int(t['id']))['id']
    s['last'][name] = now.isoformat()
    media = {m['media_key']: m for m in j.get('includes', {}).get('media', [])}
    out = []
    for t in tw:
        for k in t.get('attachments', {}).get('media_keys', []):
            m = media.get(k)
            if not m or m.get('type') != 'video':
                continue
            sec = (m.get('duration_ms') or 0) / 1000
            mp4 = [v for v in m.get('variants', []) if v.get('content_type') == 'video/mp4']
            if not mp4 or not (MIN_SEC <= sec <= MAX_SEC):
                continue
            mp4.sort(key=lambda v: v.get('bit_rate', 0))
            out.append({'id': t['id'], 'account': name, 'text': t['text'], 'created_at': t['created_at'],
                        'sec': round(sec), 'mp4': mp4[0]['url']})
            break
    out.sort(key=lambda c: int(c['id']))
    return out


_model = None


def transcribe(path):
    global _model
    if _model is None:
        from faster_whisper import WhisperModel
        _model = WhisperModel(MODEL, device='cpu', compute_type='int8')
    with open(os.path.join(D, 'names.txt'), encoding='utf-8') as f:
        names = ', '.join(l.strip() for l in f if l.strip())
    prompt = 'WWE promo and backstage interview. ' + names[:700]
    segs, _ = _model.transcribe(path, language='en', initial_prompt=prompt, vad_filter=True, beam_size=5)
    return [{'t': round(sg.start), 'text': sg.text.strip()} for sg in segs if sg.text.strip()]


def main():
    hours = float(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1] else None
    if not AUTH:
        log('Xのキーが未設定のため何もしない')
        return
    s = load()
    now = datetime.datetime.now(datetime.timezone.utc)
    clips = []
    for name in ACCOUNTS:
        try:
            clips += [c for c in fetch(s, name, now, hours) if c['id'] not in s['done']]
        except Exception as e:
            log('%s の読み取り失敗 %s' % (name, e))
    save(s)
    n = 0
    tmp = tempfile.mkdtemp()
    for c in clips[:MAX_CLIPS]:
        try:
            mp4 = os.path.join(tmp, c['id'] + '.mp4')
            r = requests.get(c['mp4'], timeout=120)
            r.raise_for_status()
            with open(mp4, 'wb') as f:
                f.write(r.content)
            c['transcript'] = transcribe(mp4)
        except Exception as e:
            log('%s の文字起こし失敗 %s' % (c['id'], str(e)[:200]))
            continue
        day = datetime.datetime.fromisoformat(c['created_at'].replace('Z', '+00:00')).astimezone(ET)
        c['et'] = day.strftime('%Y-%m-%d %H:%M')
        c['url'] = 'https://x.com/%s/status/%s' % (c['account'], c['id'])
        del c['mp4']
        out = os.path.join(D, 'clips', day.strftime('%Y-%m-%d'))
        os.makedirs(out, exist_ok=True)
        with open(os.path.join(out, c['id'] + '.json'), 'w', encoding='utf-8') as f:
            json.dump(c, f, ensure_ascii=False, indent=1)
        s['done'].append(c['id'])
        save(s)
        n += 1
    log('動画ポスト %d 本中 %d 本を文字起こし' % (len(clips), n))


if __name__ == '__main__':
    main()
