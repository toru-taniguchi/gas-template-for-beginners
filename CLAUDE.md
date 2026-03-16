# Claude Code向け指示書

## ユーザーについて
- 開発経験のない非エンジニア
- 専門用語を避け、すべて日本語でわかりやすく説明すること
- 操作を求める場合は具体的な手順を示すこと（「ブラウザで○○を開いて、△△をクリックしてください」のように）

## 開発環境
- ランタイム: Google Apps Script（V8）
- デプロイツール: clasp
- ファイル形式: `.gs`（JavaScript）

## プロジェクト構成
```
gas-template-for-beginners/
├── CLAUDE.md          # このファイル（AI向け指示書）
├── README.md          # 利用者向けガイド
├── .clasp.json        # clasp設定（自動生成）
├── .claspignore       # Googleに送らないファイルの指定
├── appsscript.json    # GASの設定
└── src/               # コード置き場
    └── main.gs        # メインの処理
```

## 開発時のルール
- コードを書いたら必ず `clasp push` でGoogleに反映すること
- エラーが出たら原因と対処法をわかりやすく説明すること
- 変更を加えたら「スプレッドシート情報」セクションも更新すること
- gitコミットは機能単位でわかりやすいメッセージをつけること

## セットアップ手順（ユーザーに「セットアップして」と言われたら）
1. `npm install @google/clasp -g` を実行
2. `clasp login` を実行 → ブラウザが開くのでユーザーにログインしてもらう
3. ユーザーにスプレッドシートのURLまたは用途を確認する
4. `clasp create --title "プロジェクト名" --rootDir src` または `clasp clone` を実行
5. `src/` ディレクトリと `main.gs` を作成
6. `.claspignore` を作成
7. 動作確認として簡単な関数を作り `clasp push` で反映
8. ユーザーにApps Scriptエディタで実行してもらい、動作を確認

## GASの制限事項
- 1回の実行は最大6分（長い処理は分割する）
- メール送信は1日100通まで
- async/awaitは使えない（同期処理で書く）

## スプレッドシート情報
<!-- プロジェクト開始時に記載する -->
<!-- 例: -->
<!-- - スプレッドシートURL: https://docs.google.com/spreadsheets/d/xxxxx -->
<!-- - シートA: A列=日付, B列=商品名, C列=金額 -->
<!-- - シートB: 集計結果の出力先 -->
