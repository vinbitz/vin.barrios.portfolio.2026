/**
 * GOOGLE APPS SCRIPT WEBHOOK FOR MARVIN BARRIOS PORTFOLIO
 * Attached to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1jBXnXNKh64a_uGo7fcbCbU72CJt-0Uj7GM6PV4bLyxM/edit
 *
 * HOW TO ACTIVATE IN 60 SECONDS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1jBXnXNKh64a_uGo7fcbCbU72CJt-0Uj7GM6PV4bLyxM/edit
 * 2. Click on the top menu: Extensions -> Apps Script
 * 3. Delete any code in the editor, copy and paste this entire file, and click Save (Floppy disk icon).
 * 4. Click the blue "Deploy" button at top-right -> select "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set Description: "Portfolio Voucher Logger"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone"  <--- (IMPORTANT: this allows your website to submit emails)
 * 9. Click "Deploy" and click "Authorize access" (choose your Google account and click Advanced -> Go to Untitled project).
 * 10. Copy your "Web app URL" (looks like https://script.google.com/macros/s/AKfycb.../exec).
 * 11. Open `main.js` (or set `window.MARVIN_SHEET_WEBHOOK_URL`) and paste your URL!
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Automatically initialize header columns on empty sheets
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Email", "Voucher Code", "Source"]);
      sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#EA3829").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

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

    var timestamp = data.timestamp || new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    var email = data.email || "No email";
    var code = data.code || "N/A";
    var source = data.source || "Samsung Voucher Claim";

    // Append new row to Google Sheet
    sheet.appendRow([timestamp, email, code, source]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", email: email, code: code }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Voucher Lead Webhook is running active and healthy.");
}
