const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const app = express();
const db = admin.firestore();

app.get("/api/minutes/:equipment_code", async (req: any, res: any) => {
  try {
    const equipmentCode = req.params.equipment_code;
    const querySnapshot = await db.collection("minutes").where("equipment_code",
      "==", equipmentCode).get();
    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Document not found" });
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.app = functions.https.onRequest(app);
