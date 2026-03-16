/**
 * GASモック - ローカル動作検証用
 *
 * SpreadsheetApp などGAS固有のオブジェクトの偽物を提供する。
 * test/data/ 内のCSVファイルをシートのデータとして読み込み、
 * 書き込み操作は記録だけして実際のスプレッドシートには影響しない。
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

// ---------------------------------------------------------------------------
// CSV読み込み
// ---------------------------------------------------------------------------
function loadCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const text = fs.readFileSync(filePath, "utf-8");
  return text
    .trim()
    .split("\n")
    .map((line) =>
      line.split(",").map((cell) => {
        const trimmed = cell.trim();
        return isNaN(trimmed) || trimmed === "" ? trimmed : Number(trimmed);
      })
    );
}

// ---------------------------------------------------------------------------
// 書き込み記録
// ---------------------------------------------------------------------------
const writeLog = [];

function getWriteLog() {
  return writeLog;
}

function clearWriteLog() {
  writeLog.length = 0;
}

// ---------------------------------------------------------------------------
// シートのモック
// ---------------------------------------------------------------------------
function createSheetMock(sheetName) {
  const csvPath = path.join(DATA_DIR, sheetName + ".csv");
  const data = loadCSV(csvPath);

  return {
    getName: () => sheetName,
    getDataRange: () => ({
      getValues: () => data,
    }),
    getRange: (row, col, numRows, numCols) => {
      // getRange("A1") のような文字列指定にも対応
      if (typeof row === "string") {
        const cell = row;
        return {
          getValue: () => {
            // データがあれば返す（簡易的な実装）
            return null;
          },
          setValue: (value) => {
            const entry = { sheet: sheetName, cell: cell, value: value };
            writeLog.push(entry);
            console.log(
              "[モック] " + sheetName + "!" + cell + " に " + value + " を書き込み"
            );
            return this;
          },
          setValues: (values) => {
            const entry = { sheet: sheetName, cell: cell, values: values };
            writeLog.push(entry);
            console.log(
              "[モック] " +
                sheetName +
                "!" +
                cell +
                " に " +
                values.length +
                "行を書き込み"
            );
            return this;
          },
        };
      }
      // getRange(row, col, numRows, numCols) の数値指定
      return {
        getValue: () => (data[row - 1] ? data[row - 1][col - 1] : null),
        setValue: (value) => {
          const entry = {
            sheet: sheetName,
            row: row,
            col: col,
            value: value,
          };
          writeLog.push(entry);
          console.log(
            "[モック] " +
              sheetName +
              " (" +
              row +
              "," +
              col +
              ") に " +
              value +
              " を書き込み"
          );
        },
        getValues: () => {
          const result = [];
          for (var r = row - 1; r < row - 1 + (numRows || 1); r++) {
            const rowData = [];
            for (var c = col - 1; c < col - 1 + (numCols || 1); c++) {
              rowData.push(data[r] ? data[r][c] : null);
            }
            result.push(rowData);
          }
          return result;
        },
        setValues: (values) => {
          const entry = {
            sheet: sheetName,
            row: row,
            col: col,
            values: values,
          };
          writeLog.push(entry);
          console.log(
            "[モック] " +
              sheetName +
              " (" +
              row +
              "," +
              col +
              ") に " +
              values.length +
              "行を書き込み"
          );
        },
      };
    },
    getLastRow: () => data.length,
    getLastColumn: () => (data[0] ? data[0].length : 0),
    appendRow: (row) => {
      data.push(row);
      writeLog.push({ sheet: sheetName, action: "appendRow", value: row });
      console.log("[モック] " + sheetName + " に行を追加: " + row.join(", "));
    },
    clear: () => {
      writeLog.push({ sheet: sheetName, action: "clear" });
      console.log("[モック] " + sheetName + " をクリア");
    },
  };
}

// ---------------------------------------------------------------------------
// SpreadsheetApp のモック
// ---------------------------------------------------------------------------
global.SpreadsheetApp = {
  getActiveSpreadsheet: () => ({
    getSheetByName: (name) => createSheetMock(name),
    getActiveSheet: () => createSheetMock("Sheet1"),
    insertSheet: (name) => {
      console.log("[モック] シート「" + name + "」を作成");
      return createSheetMock(name);
    },
  }),
  openById: (id) => ({
    getSheetByName: (name) => createSheetMock(name),
  }),
};

// ---------------------------------------------------------------------------
// Logger のモック
// ---------------------------------------------------------------------------
const logMessages = [];

global.Logger = {
  log: (message) => {
    logMessages.push(message);
    console.log("[Logger] " + message);
  },
  getLog: () => logMessages.join("\n"),
};

// ---------------------------------------------------------------------------
// Utilities のモック
// ---------------------------------------------------------------------------
global.Utilities = {
  formatDate: (date, timeZone, format) => {
    return date.toISOString().split("T")[0];
  },
  sleep: (ms) => {},
};

// ---------------------------------------------------------------------------
// GmailApp のモック
// ---------------------------------------------------------------------------
global.GmailApp = {
  sendEmail: (to, subject, body, options) => {
    const entry = { to, subject, body, options };
    writeLog.push({ action: "sendEmail", ...entry });
    console.log("[モック] メール送信: 宛先=" + to + ", 件名=" + subject);
  },
};

// ---------------------------------------------------------------------------
// DriveApp のモック
// ---------------------------------------------------------------------------
global.DriveApp = {
  getFileById: (id) => ({
    getName: () => "mock_file",
    getBlob: () => ({ getDataAsString: () => "mock data" }),
  }),
};

// ---------------------------------------------------------------------------
// エクスポート
// ---------------------------------------------------------------------------
module.exports = { getWriteLog, clearWriteLog, loadCSV };
