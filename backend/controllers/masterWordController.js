"use strict";

import * as masterWordService from "../services/masterWordService.js";

export async function generate(req, res) {
  try {
    const masterWord = masterWordService.generateMasterWord();
    res.status(200).json({ masterWord });
  } catch (e) {
    console.error("Master word generate error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
