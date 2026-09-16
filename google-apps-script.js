/**
 * GOOGLE APPS SCRIPT WEBHOOK FOR MARVIN BARRIOS PORTFOLIO
 * Attached to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1jBXnXNKh64a_uGo7fcbCbU72CJt-0Uj7GM6PV4bLyxM/edit
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Matches the voucher code in Column C ("Voucher Code") and fills in
 *    Column A ("Timestamp") and Column B ("Email") directly on that code's row!
 * 2. Also logs every claim into a clean, dedicated "Claims Log" tab so
 *    you can see all your emails right at the top without scrolling through 1,000 rows.
 * 3. Provides live voucher counts via doGet so your website counter updates dynamically!
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
    var deviceId = (data.deviceId || data.device || "N/A").trim();
    var ipAddress = (data.ip || data.ipAddress || "N/A").trim();
    var source = data.source || "Samsung Voucher Claim";

    var matchedRow = -1;

    // 1. Find matching code in Column C (Voucher Code) of the main sheet
    if (code && mainSheet.getLastRow() > 1) {
      var lastRow = mainSheet.getLastRow();
      // Read Column C values
      var codeValues = mainSheet.getRange(2, 3, Math.min(lastRow - 1, 1000), 1).getValues();
      for (var i = 0; i < codeValues.length; i++) {
        if (codeValues[i][0] && codeValues[i][0].toString().trim() === code) {
          matchedRow = i + 2; // offset for 1-based index and header
          break;
        }
      }
    }

    // 2. If code matched in Column C, update Columns A, B, D, E on that exact row!
    if (matchedRow > 0) {
      mainSheet.getRange(matchedRow, 1).setValue(timestamp); // Col A: Timestamp
      mainSheet.getRange(matchedRow, 2).setValue(email);     // Col B: Email
      mainSheet.getRange(matchedRow, 4).setValue(deviceId);  // Col D: Device ID
      mainSheet.getRange(matchedRow, 5).setValue(ipAddress); // Col E: IP Address
    } else {
      // Fallback: if code not pre-listed, append to bottom
      mainSheet.appendRow([timestamp, email, code, deviceId, ipAddress]);
    }

    // 3. Also log to a dedicated "Claims Log" tab for instant viewing at the top
    var logSheet = ss.getSheetByName("Claims Log");
    if (!logSheet) {
      logSheet = ss.insertSheet("Claims Log", 0); // Put it as the first tab!
      logSheet.appendRow(["Timestamp (Manila)", "Email Address", "Voucher Code Claimed", "Device ID", "IP Address"]);
      logSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#0D1117").setFontColor("#F59E0B");
      logSheet.setFrozenRows(1);
    }
    logSheet.appendRow([timestamp, email, code, deviceId, ipAddress]);

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
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var mainSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var lastRow = mainSheet.getLastRow();
    
    // Count legacy claims appended below row 1001
    var legacyClaims = Math.max(0, lastRow - 1001);
    
    // Count inline claims where Col B has an email
    var inlineClaims = 0;
    if (lastRow > 1) {
      var checkRows = Math.min(lastRow - 1, 1000);
      var emails = mainSheet.getRange(2, 2, checkRows, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (emails[i][0] && emails[i][0].toString().trim() !== '') {
          inlineClaims++;
        }
      }
    }

    var logSheet = ss.getSheetByName("Claims Log");
    var logClaims = logSheet ? Math.max(0, logSheet.getLastRow() - 1) : 0;

    var totalClaimed = Math.max(legacyClaims + inlineClaims, logClaims);
    var totalCodes = 1000;
    var remaining = Math.max(0, totalCodes - totalClaimed);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalClaimed: totalClaimed,
      remaining: remaining
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      remaining: 993,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
