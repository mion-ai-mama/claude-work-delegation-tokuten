# Claudeに「仕事を任せる」はじめてガイド（Instagramリール特典ページ）

> 設計の共通原則（基本原則・資産価値の原則・自律解決の原則）は `~/.claude/CLAUDE.md` に従う。

## プロジェクト設定

技術スタック:
  frontend: HTML5 / CSS3 / Vanilla JavaScript（ビルド工程なし・フレームワーク不使用）
  backend: なし
  database: なし
  hosting: GitHub Pages（静的ファイル配信のみ）

ビルド・サーバーが不要な完全な静的サイト。`index.html` を直接開く、または
`python3 -m http.server <port>` を1つだけ起動して確認する。ポートのランダム生成・バックエンドポートは不要。

## 環境変数

使用しない（APIキー・DB接続情報が一切不要）。`.env` 系ファイルは作成しない。

## ファイル構成の原則

兄弟リポジトリ（`japanese-poster-etsy-tokuten` 等）と同じフラット構成を維持する。

```text
index.html / style.css / components.css / script.js / README.md / assets/ / docs/
```

- **文章の単一の源は `index.html`**（13本のプロンプト本文もここ）。`content.js` / `config.js` は作らない
- **設定値の単一の源は `script.js` 先頭の定数**: `LINE_URL`（空ならCTAボタン非表示）
- `style.css` = 共通部品、`components.css` = このページ専用部品（700行基準のために分割）
- コピーボタンは画面表示と同じ文字（`textContent`）をコピーする。〈…〉は `script.js` が強調表示する（HTML側に書かない）
- チェックの保存は localStorage（キー `claudework:progress`）。使えない環境でも動くよう try/catch

## 命名規則

- ファイル: kebab-case / JS変数・関数: camelCase / 定数: UPPER_SNAKE_CASE / CSSクラス: BEM風

## 配色（変更しないこと。変える場合はユーザー確認）

大人ピンク×アイボリー系（兄弟ページと同じ）。`style.css` の `:root` が単一の源。青・紫・ネオン不可。

## 内容の方針（必ず守る）

- 要件は `docs/requirements.md` が単一の源。内容を勝手に増やさない
- **次の3点は必ず明記し続ける（ユーザー指示）**: ①新しいClaude（旧Cowork統合UI）は順次展開中で「Chat / Cowork」の切り替えが残る人もいる ②仕事を任せる実行型タスク（旧Cowork）は有料プラン（Pro/Max/Team/Enterprise）対象 ③PC内フォルダを直接扱うのはデスクトップアプリが前提
- 表示は小さなラベル（`.tag--paid` 有料プラン／`.tag--desktop` デスクトップ版／`.tag--rollout` 順次展開中／`.tag--free` 無料でもOK）で見せ、注意書きばかりにしない
- 「Coworkに切り替える」と案内しない。Coworkは「以前は別モードだったが通常のClaudeに統合された」という説明としてのみ使う（切り替えが出ている人向けの1行注記を除く）
- 公式で確認できないUI表示名・数値（Projectsの作成数上限、日本語メニュー名、無料版への新UI展開時期）は断定しない。料金は「月20ドル＋消費税」とし、円額は書かない
- 競合PDF（ClaudeCode徹底解説ガイド）の文章・見出し・構成・誘導先を使わない
- CTAは「AIマネタイズの教科書」＋「AI収益化サポート会／個別相談」を常時表示（CTA①＝STEP 5の後・軽量版、CTA②＝最下部・完全版＋画面下の常時表示ボタン）。教科書の目次は添付画像 `assets/images/cta-textbook-contents.png`
- 「必ず」「誰でも」「全部任せられる」は使わない。OGP画像は設定しない（`twitter:card=summary`）
- 公式情報は変わるため、公開前と更新時に `docs/requirements.md` §3 を再確認する

## 画像の扱い

スクリーンショットは、設定ウィンドウなど**個人情報が写らない範囲だけを切り抜く**（名前・メール・チャット履歴・左サイドバーの下部は写さない）。撮影元の画像は、使い終わったら削除する。画面は更新で変わるので、公開前に撮り直す。スクリーンショットは**ブラウザ版**のもの。キャプションにその旨を書き、デスクトップアプリで確認できたら更新する。

`<img>` に `width` / `height` 属性を付けない。CSSで `aspect-ratio` + `object-fit: contain` + `height: auto`。

## コード品質

- 関数: 100行以下 / ファイル: 700行以下 / 複雑度: 10以下 / 行長: 120文字
- 700行基準は `style.css` / `components.css` / `script.js` に適用。`index.html` は文章保持のため対象外

## 表示確認（納品前に必須）

Playwrightで実ビューポートを再現する（`browser_resize`）。確認項目は `docs/requirements.md` §11 の10項目。

## 開発ルール

- デプロイはユーザーの明示的な承認を得てから実行する
- 許可されたドキュメントのみ作成可能: `README.md` / `docs/requirements.md` / `docs/SCOPE_PROGRESS.md`。それ以外はユーザー許諾が必要
- 実装済みの記載は積極的に削除する
- Gitのコミット著者は mion-ai-mama の noreply（本名・個人メールでコミットしない）

## Playwright

スクリーンショット保存先: プロジェクト配下の `.playwright-mcp/`（許可ルート内。コミットしない）
