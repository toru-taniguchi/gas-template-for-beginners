# GAS開発テンプレート（非エンジニア向け）

## 概要
このリポジトリは、非エンジニアがClaude Codeを使ってGoogle Apps Script（GAS）を開発するためのひな型です。

## 開発の流れ
1. やりたいことをClaude Codeに日本語で伝える
2. Claude Codeがコードを書き、`clasp push` でGoogleに反映する
3. スプレッドシートやブラウザで動作確認する

## 環境
- ランタイム: Google Apps Script（V8）
- デプロイツール: clasp
- ファイル形式: `.gs`（JavaScript）

## プロジェクト構成
```
gas-template-for-beginners/
├── CLAUDE.md          # このファイル（Claude Codeへの説明書）
├── .clasp.json        # clasp設定（clasp create後に生成）
├── .claspignore       # Googleに送らないファイルの指定
├── appsscript.json    # GASの設定
└── src/               # コード置き場
    └── main.gs        # メインの処理
```

## GASの制限事項
- 1回の実行は最大6分
- メール送信は1日100通まで
- async/awaitは使えない（同期処理で書く）

## Claude Codeへの指示メモ
- コードを書いたら `clasp push` で反映すること
- ユーザーは非エンジニアなので、説明はわかりやすく日本語で行うこと
- エラーが出たら原因と対処法をわかりやすく説明すること

## スプレッドシート情報
<!-- ここにシートの列構成などを記載する -->
<!-- 例: シートA - A列:日付, B列:商品名, C列:金額 -->
