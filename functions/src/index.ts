import * as functions from "firebase-functions";
import {google, sheets_v4 as SheetsV4} from "googleapis";
import * as admin from "firebase-admin";
import { useFormStore } from "../../src/state_management/formStore";

const formStore = useFormStore();
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
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const range = "Sheet1!A1:Z";
    const dbKeys = Object.keys(data);
    const values = new Array();
    for (var mapKey of formStore.submissionData.keys()){
      for (var dbKey of dbKeys){
        if (mapKey == dbKey){
          values.push(formStore.submissionData.get(mapKey));
        }
      }
    }



    try {
      const request: SheetsV4.Params$Resource$Spreadsheets$Values$Append = {
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
