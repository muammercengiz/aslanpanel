const express = require("express");
const router = express.Router();
const pool = require("../db");


// Kullanıcıları listele
router.get("/", async (req, res) => {
  try {
    const sonuc = await pool.query("SELECT * FROM kullanicilar ORDER BY id ASC");
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Listeleme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Yeni kullanıcı ekle
router.post("/", async (req, res) => {
  const { ad, soyad, email, telefon, kullanici_adi, sifre, rol } = req.body;

  try {
    await pool.query(
      "INSERT INTO kullanicilar (ad, soyad, email, telefon, kullanici_adi, sifre, rol) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [ad, soyad, email, telefon, kullanici_adi, sifre, rol]
    );
    console.log("Yeni kullanıcı eklendi:", req.body);
    res.status(201).json({ mesaj: "Kullanıcı eklendi" });
  } catch (err) {
    console.error("Kullanıcı ekleme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Kullanıcıyı sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM kullanicilar WHERE id = $1", [id]);
    res.json({ mesaj: "Kullanıcı silindi" });
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Kullanıcıyı güncelle
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { ad, soyad, email, telefon, kullanici_adi, sifre, rol } = req.body;

  try {
    let query = "";
    let values = [];

    if (sifre && sifre.trim() !== "") {
      // Şifre güncellenecekse
      query = `
        UPDATE kullanicilar
        SET ad = $1, soyad = $2, email = $3, telefon = $4, kullanici_adi = $5, sifre = $6, rol = $7
        WHERE id = $8
      `;
      values = [ad, soyad, email, telefon, kullanici_adi, sifre, rol, id];
    } else {
      // Şifre güncellenmeyecekse
      query = `
        UPDATE kullanicilar
        SET ad = $1, soyad = $2, email = $3, telefon = $4, kullanici_adi = $5, rol = $6
        WHERE id = $7
      `;
      values = [ad, soyad, email, telefon, kullanici_adi, rol, id];
    }

    await pool.query(query, values);
    res.json({ mesaj: "Kullanıcı güncellendi" });
  } catch (err) {
    console.error("Kullanıcı güncelleme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Belirli ID'ye sahip kullanıcıyı getir
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sonuc = await pool.query("SELECT * FROM kullanicilar WHERE id = $1", [id]);
    if (sonuc.rows.length === 0) {
      return res.status(404).json({ hata: "Kullanıcı bulunamadı" });
    }
    res.json(sonuc.rows[0]);
  } catch (err) {
    console.error("Kullanıcı getirme hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});

// Giriş kontrolü
router.post("/giris", async (req, res) => {
  const { kullanici_adi, sifre } = req.body;

  try {
    const sonuc = await pool.query(
      "SELECT * FROM kullanicilar WHERE LOWER(kullanici_adi) = LOWER($1) AND sifre = $2",
      [kullanici_adi, sifre]
    );

    if (sonuc.rows.length === 0) {
      return res.status(401).json({ hata: "Kullanıcı adı veya şifre hatalı" });
    }

    const kullanici = sonuc.rows[0];
    res.json({
      token: "girişbaşarılı",
      role: kullanici.rol,
      isim: kullanici.ad + " " + kullanici.soyad,
      id: kullanici.id
    });
  } catch (err) {
    console.error("Giriş hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  }
});



module.exports = router;
