import * as functions from "firebase-functions";
import {google} from "googleapis";
import * as admin from "firebase-admin";
import fieldOrder from "./fieldOrder.json";

admin.initializeApp();

const SPREADSHEET_ID = "160mBoUWvv-_jrL8Pfu_rfi454j631QZtSsbcoC-Bcew";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

import serviceAccount from "./service-account.json";

const sheets = google.sheets({
  version: "v4",
  auth: new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    SCOPES
  ),
});

exports.addMatchToSheet = functions.firestore
  .document("matches/{matchId}/teams/{teamId}")
  .onCreate(async (snap) => {
    const data = snap.data();

    const range = "Sheet1!A1:Z";
    const values = [];

    const desiredOrder = fieldOrder.keys;

    for (const key of desiredOrder) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        values.push(data[key]);
      } else {
        values.push(null);
      }
    }

    try {
      const request = {
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [values],
        },
      };

      await sheets.spreadsheets.values.append(request);

      console.log("Data successfully appended to Google Sheets");
    } catch (error) {
      console.error("Error appending data to Google Sheets:", error);
    }
  });
