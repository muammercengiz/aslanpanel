const express = require("express");
const router = express.Router();

let yetkiler = []; // Geçici hafıza, ileride DB kullanılacak

router.post("/", (req, res) => {
  console.log("Gelen yetkiler:", req.body);
  yetkiler = req.body;
  res.json({ message: "Yetkiler kaydedildi." });
});

router.get("/", (req, res) => {
  res.json(yetkiler);
});

module.exports = router;
