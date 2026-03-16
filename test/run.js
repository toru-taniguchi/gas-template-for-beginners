/**
 * ローカル動作検証ランナー
 *
 * 使い方:
 *   node test/run.js <関数名>
 *
 * 例:
 *   node test/run.js aggregate
 *   node test/run.js sendReport
 *
 * 引数なしで実行すると、src/ 内の全関数を一覧表示する。
 */

const fs = require("fs");
const path = require("path");

// モックを読み込む（グローバルにGAS関数の偽物がセットされる）
const { getWriteLog, clearWriteLog } = require("./mock/gas-mock");

// src/ 内の全 .gs ファイルを読み込む
const srcDir = path.join(__dirname, "..", "src");
if (!fs.existsSync(srcDir)) {
  console.error("エラー: src/ フォルダが見つかりません");
  process.exit(1);
}

const gsFiles = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".gs"))
  .sort();

if (gsFiles.length === 0) {
  console.error("エラー: src/ に .gs ファイルがありません");
  process.exit(1);
}

// 全 .gs ファイルを結合して読み込む
let allCode = "";
for (const file of gsFiles) {
  const code = fs.readFileSync(path.join(srcDir, file), "utf-8");
  allCode += "\n// --- " + file + " ---\n" + code;
}

// GASの関数をグローバルスコープに定義する
// function宣言を抽出してglobalに登録する
const vm = require("vm");
vm.runInThisContext(allCode);

// 定義された関数を収集
const definedFunctions = [];
const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
let match;
while ((match = funcRegex.exec(allCode)) !== null) {
  definedFunctions.push(match[1]);
}

// コマンドライン引数から関数名を取得
const targetFunc = process.argv[2];

if (!targetFunc) {
  console.log("=== 定義されている関数 ===\n");
  for (const name of definedFunctions) {
    console.log("  " + name);
  }
  console.log("\n使い方: node test/run.js <関数名>");
  process.exit(0);
}

// 関数を実行
if (typeof global[targetFunc] !== "function") {
  console.error('エラー: 関数 "' + targetFunc + '" が見つかりません');
  console.log("\n定義されている関数:");
  for (const name of definedFunctions) {
    console.log("  " + name);
  }
  process.exit(1);
}

console.log("=== " + targetFunc + "() を実行 ===\n");

clearWriteLog();

try {
  const result = global[targetFunc]();
  console.log("\n=== 実行完了 ===");
  if (result !== undefined) {
    console.log("戻り値:", result);
  }

  const writes = getWriteLog();
  if (writes.length > 0) {
    console.log("\n=== 書き込み・操作の記録 ===");
    for (const w of writes) {
      console.log(" ", JSON.stringify(w, null, 2));
    }
  }
} catch (err) {
  console.error("\n=== エラー発生 ===");
  console.error("種類:", err.constructor.name);
  console.error("メッセージ:", err.message);
  console.error("\nスタックトレース:");
  console.error(err.stack);
  process.exit(1);
}
