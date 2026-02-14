/**
 * MBTI Quiz Backend - Google Apps Script
 * Handles saving quiz results to a Google Sheet.
 */

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Set headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                "時間戳記",
                "班級",
                "座號",
                "姓名",
                "身分備註",
                "MBTI 代碼",
                "性格名稱",
                "能量(EI) %",
                "感知(SN) %",
                "判斷(TF) %",
                "生活(JP) %",
                "E", "I", "S", "N", "T", "F", "J", "P"
            ]);

            // Format header row
            sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#f3f3f3");
        }

        // Append data
        sheet.appendRow([
            new Date(),
            data.userClass || "",
            data.userSeat || "",
            data.userName || "",
            data.userOtherChild ? "子女非新科國中學生" : "",
            data.mbtiCode || "",
            data.mbtiName || "",
            data.stats.EI || "",
            data.stats.SN || "",
            data.stats.TF || "",
            data.stats.JP || "",
            data.scores.E || 0,
            data.scores.I || 0,
            data.scores.S || 0,
            data.scores.N || 0,
            data.scores.T || 0,
            data.scores.F || 0,
            data.scores.J || 0,
            data.scores.P || 0
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Result saved successfully" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Handle OPTIONS requests for CORS (if needed)
 */
function doOptions(e) {
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
}
