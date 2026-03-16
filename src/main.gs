/**
 * サンプル: 売上データを集計する
 *
 * "売上"シートのC列（金額）を合計し、"集計"シートのA1に書き出す。
 */
function aggregate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("売上");
  var data = sheet.getDataRange().getValues();

  var total = 0;
  for (var i = 1; i < data.length; i++) {
    total += data[i][2]; // C列（金額）
  }

  var outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("集計");
  outputSheet.getRange("A1").setValue(total);

  Logger.log("集計完了: 合計 = " + total);
  return total;
}
