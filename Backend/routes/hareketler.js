const express = require("express");
const router = express.Router();
const pool = require("../db");

// Hareket kaydetme
router.post("/", async (req, res) => {
  const { kullanici_id, islem_tipi, aciklama } = req.body;
  try {
    await pool.query(
      "INSERT INTO kullanici_hareketleri (kullanici_id, islem_tipi, aciklama) VALUES ($1, $2, $3)",
      [kullanici_id, islem_tipi, aciklama]
    );
    res.json({ mesaj: "Hareket kaydedildi" });
  } catch (err) {
    console.error("Hareket kaydetme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Belirli kullanıcıya ait hareketleri getir
router.get("/:kullanici_id", async (req, res) => {
  const { kullanici_id } = req.params;
  try {
    const sonuc = await pool.query(
      "SELECT * FROM kullanici_hareketleri WHERE kullanici_id = $1 ORDER BY tarih DESC",
      [kullanici_id]
    );
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Hareket listeleme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

module.exports = router;
