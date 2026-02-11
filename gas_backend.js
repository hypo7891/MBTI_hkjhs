/**
 * Google Apps Script Backend for MBTI Quiz Results
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into the script editor.
 * 4. Deploy > New Deployment > Web App.
 * 5. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 6. Copy the Web App URL and paste it into your script.js.
 */

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Header setup if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                "時間戳記",
                "姓名",
                "MBTI 結果",
                "性格類型",
                "E/I %",
                "S/N %",
                "T/F %",
                "J/P %",
                "原始分數內容"
            ]);
        }

        // Append the result
        sheet.appendRow([
            new Date(),
            data.userName,
            data.mbtiCode,
            data.mbtiName,
            data.stats.EI,
            data.stats.SN,
            data.stats.TF,
            data.stats.JP,
            JSON.stringify(data.scores)
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            "status": "success",
            "message": "結果已成功存入雲端"
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            "status": "error",
            "message": error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Enable CORS for preflight requests
function doOptions(e) {
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
}
