/**
 * GOOGLE APPS SCRIPT WEBHOOK FOR MARVIN BARRIOS PORTFOLIO
 * Attached to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1jBXnXNKh64a_uGo7fcbCbU72CJt-0Uj7GM6PV4bLyxM/edit
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Matches the voucher code in Column C ("Voucher Code") and fills in
 *    Column A ("Timestamp") and Column B ("Email") directly on that code's row!
 * 2. Also logs every claim into a clean, dedicated "Claimed Leads" tab so
 *    you can see all your emails right at the top without scrolling through 1,000 rows.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var mainSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    // Parse incoming webhook payload
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    var email = (data.email || "").trim();
    var code = (data.code || "").trim();
    var source = data.source || "Samsung Voucher Claim";

    var matchedRow = -1;

    // 1. Find matching code in Column C (Voucher Code) of the main sheet
    if (code && mainSheet.getLastRow() > 1) {
      var lastRow = mainSheet.getLastRow();
      // Read Column C values
      var codeValues = mainSheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < codeValues.length; i++) {
        if (codeValues[i][0] && codeValues[i][0].toString().trim() === code) {
          matchedRow = i + 2; // offset for 1-based index and header
          break;
        }
      }
    }

    // 2. If code matched in Column C, update Columns A & B on that exact row!
    if (matchedRow > 0) {
      mainSheet.getRange(matchedRow, 1).setValue(timestamp); // Col A: Timestamp
      mainSheet.getRange(matchedRow, 2).setValue(email);     // Col B: Email
      if (source) {
        mainSheet.getRange(matchedRow, 4).setValue(source);  // Col D: Source/Device
      }
    } else {
      // Fallback: if code not pre-listed, append to bottom
      mainSheet.appendRow([timestamp, email, code, source]);
    }

    // 3. Also log to a dedicated "Claims Log" tab for instant viewing at the top
    var logSheet = ss.getSheetByName("Claims Log");
    if (!logSheet) {
      logSheet = ss.insertSheet("Claims Log", 0); // Put it as the first tab!
      logSheet.appendRow(["Timestamp (Manila)", "Email Address", "Voucher Code Claimed", "Source"]);
      logSheet.getRange("A1:D1").setFontWeight("bold").setBackground("#0D1117").setFontColor("#F59E0B");
      logSheet.setFrozenRows(1);
    }
    logSheet.appendRow([timestamp, email, code, source]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      matchedRow: matchedRow,
      email: email,
      code: code
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Voucher Lead Webhook is running active and healthy.");
}
