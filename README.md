# Claudeに「仕事を任せる」はじめてガイド

Instagramリールの無料特典ページ（静的サイト）。「質問する」から「仕事を任せる」へ進むための実践ガイドです。

## 確認のしかた

```bash
cd claude-work-delegation-tokuten
python3 -m http.server 8765
# ブラウザで http://localhost:8765/ を開く
```

## 編集のしかた

| 変えたいこと | 場所 |
|---|---|
| 文章・プロンプト | `index.html`（文章の単一の源） |
| LINE登録URL | `script.js` 先頭の `LINE_URL` |
| 色 | `style.css` の `:root` |
| ラベル・一覧表・チェックリストの見た目 | `components.css` |
| 教科書の目次画像・バナー | `assets/images/`（同名で差し替え） |

プロンプト内の `〈…〉` は、読者が書き換える場所です（`script.js` が自動で強調表示します）。

## 公式情報の再確認

Claudeの機能・対象プラン・料金は変わります。公開前と更新時に `docs/requirements.md` §3 の出典を見直してください（2026年10月7日確認）。

## 公開

GitHub Pages（`main` ブランチ／ルート）。公開前にユーザーの承認が必要です。
