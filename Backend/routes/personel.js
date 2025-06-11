// routes/personel.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Personel Ekle
router.post("/", async (req, res) => {
  const { ad, soyad, tc, telefon, adres, gorev, ise_baslama, izin_hakki, durum, maas } = req.body;
  const maasNumber = maas ? parseFloat(maas) : null;

  try {
    const yeniPersonel = await pool.query(
      `INSERT INTO personel 
       (ad, soyad, tc, telefon, adres, gorev, ise_baslama, izin_hakki, durum, maas) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [ad, soyad, tc, telefon, adres, gorev, ise_baslama, izin_hakki, durum, maasNumber]
    );

    res.json(yeniPersonel.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ hata: "Kayıt eklenemedi" });
  }
});


// Personel listeleme
router.get("/", async (req, res) => {
  const { durum } = req.query;

  let query = "SELECT * FROM personel";
  let values = [];

  if (durum) {
    query += " WHERE durum = $1";
    values.push(durum);
  }

  try {
    const sonuc = await pool.query(query, values);
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Personel listeleme hatası:", err.message);
    res.status(500).json({ hata: "Veri alınamadı" });
  }
});


// Tüm personel izinlerini getir
router.get("/tum-izinler", async (req, res) => {
  try {
    const sonuc = await pool.query("SELECT * FROM personel_izinleri");
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Tüm izinler alınamadı:", err.message); // ← hatayı göster
    res.status(500).json({ hata: "Veri alınamadı", detay: err.message });
  }
});


// Belirli personelin izinlerini getir
router.get('/:id/izinler', async (req, res) => {
  const { id } = req.params;

  try {
    const sonuc = await pool.query(
      'SELECT * FROM personel_izinleri WHERE personel_id = $1 ORDER BY baslangic DESC',
      [id]
    );

    res.json(sonuc.rows);
  } catch (err) {
    console.error("İzin verileri alınamadı:", err.message);
    res.status(500).json({ hata: "İzin verileri getirilemedi" });
  }
});

// Personel Devam Listeleme (PersonelDevam.jsx için)
router.get("/devam", async (req, res) => {
  try {
    const sonuc = await pool.query(`
      SELECT pd.id, pd.tarih, pd.durum, p.ad, p.soyad
      FROM personel_devam pd
      JOIN personel p ON p.id = pd.personel_id
      ORDER BY pd.tarih DESC
    `);
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Devam listeleme hatası:", err.message);
    res.status(500).json({ hata: "Devam listesi getirilemedi" });
  }
});

// Belirli personel verisi
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sonuc = await pool.query('SELECT * FROM personel WHERE id = $1', [id]);
    res.json(sonuc.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: 'Veri alınamadı' });
  }
});



// Personel Devam Kaydı Sil
router.delete("/devam/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM personel_devam WHERE id = $1", [id]);
    res.json({ mesaj: "Devam kaydı silindi" });
  } catch (err) {
    console.error("Devam silme hatası:", err.message);
    res.status(500).json({ hata: "Devam silinemedi" });
  }
});



// Personel Güncelle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ad, soyad, tc, telefon, adres, gorev, ise_baslama,
    izin_hakki, durum, maas, ayrilma_tarihi, ayrilma_sebebi
  } = req.body;

  try {
    await pool.query(
      `UPDATE personel 
       SET ad = $1, soyad = $2, tc = $3, telefon = $4, adres = $5, 
           gorev = $6, ise_baslama = $7, izin_hakki = $8, durum = $9, 
           maas = $10, ayrilma_tarihi = $11, ayrilma_sebebi = $12
       WHERE id = $13`,
      [
        ad, soyad, tc, telefon, adres, gorev, ise_baslama,
        izin_hakki, durum, maas, ayrilma_tarihi, ayrilma_sebebi, id
      ]
    );
    res.json({ mesaj: "Personel güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "Güncelleme başarısız" });
  }
});

// Personel Sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM personel WHERE id = $1", [id]);
    res.json({ mesaj: "Personel silindi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ hata: "Silme başarısız" });
  }
});



// Personel İzin Sil
router.delete("/izin-sil/:izinId", async (req, res) => {
  const { izinId } = req.params;

  try {
    await pool.query("DELETE FROM personel_izinleri WHERE id = $1", [izinId]);
    res.json({ mesaj: "İzin silindi" });
  } catch (err) {
    console.error("İzin silme hatası:", err.message);
    res.status(500).json({ hata: "İzin silme başarısız" });
  }
});

// Personel İzin Ekle
router.post("/izin-ekle", async (req, res) => {
  const { personel_id, baslangic, bitis, aciklama } = req.body;

  try {
    // 1. İzin süresini hesapla
    const baslangicTarih = new Date(baslangic);
    const bitisTarih = new Date(bitis);
    const gunSayisi = Math.floor((bitisTarih - baslangicTarih) / (1000 * 60 * 60 * 24)) + 1;

    // 2. İzni ekle
    const yeniIzin = await pool.query(
      `INSERT INTO personel_izinleri (personel_id, baslangic, bitis, aciklama)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [personel_id, baslangic, bitis, aciklama]
    );

    // 3. Personelin izin hakkından düş
    await pool.query(
      `UPDATE personel SET izin_hakki = izin_hakki - $1 WHERE id = $2`,
      [gunSayisi, personel_id]
    );

    res.json(yeniIzin.rows[0]);
  } catch (err) {
    console.error("İzin ekleme hatası:", err.message);
    res.status(500).json({ hata: "İzin ekleme başarısız" });
  }
});


// Personel günlük devam kaydı ekle
router.post("/devam-ekle", async (req, res) => {
  const { personel_id, tarih, durum } = req.body;

  try {
    // 1. Devam kaydını ekle
    await pool.query(
      "INSERT INTO personel_devam (personel_id, tarih, durum) VALUES ($1, $2, $3)",
      [personel_id, tarih, durum]
    );

    // 2. Log ile kontrol
    console.log("Gelen durum:", durum);

    // 3. Eğer durum izinli ise, izin hakkını düş
    if (durum.toLowerCase() === "izinli") {
      console.log("İzin hakkı düşürülüyor...");
      await pool.query(
        "UPDATE personel SET izin_hakki = izin_hakki - 1 WHERE id = $1",
        [personel_id]
      );
    }

    res.status(201).json({ mesaj: "Devam kaydı başarılı" });
  } catch (err) {
    console.error("Devam kaydı hatası:", err);
    res.status(500).json({ hata: "Devam kaydı yapılamadı", detay: err.message });
  }
});




// Personel Devam Durumu Güncelle
router.put("/devam/:id", async (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;

  try {
    await pool.query(
      "UPDATE personel_devam SET durum = $1 WHERE id = $2",
      [durum, id]
    );
    res.json({ mesaj: "Durum güncellendi" });
  } catch (err) {
    console.error("Durum güncelleme hatası:", err.message);
    res.status(500).json({ hata: "Durum güncellenemedi" });
  }
});

// Belirli tarihe ait personel devam kayıtlarını getir
router.get("/devam-tarihli/:tarih", async (req, res) => {
  const { tarih } = req.params;

  try {
    const sonuc = await pool.query(
      `SELECT pd.id, pd.tarih, pd.durum, p.ad || ' ' || p.soyad AS ad_soyad
       FROM personel_devam pd
       JOIN personel p ON p.id = pd.personel_id
       WHERE pd.tarih = $1
       ORDER BY p.ad`,
      [tarih]
    );

    res.json(sonuc.rows);
  } catch (err) {
    console.error("Tarihli devam verisi alınamadı:", err.message);
    res.status(500).json({ hata: "Veri alınamadı" });
  }
});

// Personel Mesai Ekle
router.post("/mesai-ekle", async (req, res) => {
  const { personel_id, tarih, sure, aciklama } = req.body;

  try {
    const yeniMesai = await pool.query(
      `INSERT INTO personel_mesai (personel_id, tarih, sure, aciklama)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [personel_id, tarih, sure, aciklama]
    );
    res.json(yeniMesai.rows[0]);
  } catch (err) {
    console.error("Mesai ekleme hatası:", err.message);
    res.status(500).json({ hata: "Mesai eklenemedi" });
  }
});

// Personelin Mesailerini Getir
router.get("/mesai/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sonuc = await pool.query(`
      SELECT m.*, p.ad AS personel_ad, p.soyad AS personel_soyad
      FROM personel_mesai m
      JOIN personel p ON p.id = m.personel_id
      WHERE personel_id = $1
      ORDER BY tarih DESC
    `, [id]);

    res.json(sonuc.rows);
  } catch (err) {
    console.error("Mesai verisi alınamadı:", err.message);
    res.status(500).json({ hata: "Veri alınamadı" });
  }
});

// Mesai Sil
router.delete("/mesai/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM personel_mesai WHERE id = $1", [id]);
    res.json({ mesaj: "Mesai silindi" });
  } catch (err) {
    console.error("Mesai silme hatası:", err.message);
    res.status(500).json({ hata: "Silme başarısız" });
  }
});


router.get("/devam-tarihli/:tarih", async (req, res) => {
  const { tarih } = req.params;

  try {
    const query = `
      SELECT pd.id, pd.tarih, pd.durum, p.ad_soyad
      FROM personel_devam pd
      JOIN personel p ON pd.personel_id = p.id
      WHERE DATE(pd.tarih) = $1
    `;
    const result = await pool.query(query, [tarih]);
    res.json(result.rows);
  } catch (err) {
    console.error("Devam raporu hatası:", err);
    res.status(500).json({ hata: "Devam verisi alınamadı" });
  }
});


router.get("/mesai-tarihli/:tarih", async (req, res) => {
  const { tarih } = req.params;

  try {
    const query = `
      SELECT pm.id, p.ad_soyad, pm.tarih, pm.baslangic, pm.bitis, pm.toplam_saat
      FROM personel_mesai pm
      JOIN personel p ON pm.personel_id = p.id
      WHERE DATE(pm.tarih) = $1
    `;
    const result = await pool.query(query, [tarih]);
    res.json(result.rows);
  } catch (err) {
    console.error("Mesai raporu hatası:", err);
    res.status(500).json({ hata: "Mesai verisi alınamadı" });
  }
});


router.get("/izin-tarihli/:tarih", async (req, res) => {
  const { tarih } = req.params;

  try {
    const query = `
      SELECT pi.id, p.ad_soyad, pi.baslangic, pi.bitis, pi.aciklama
      FROM personel_izinleri pi
      JOIN personel p ON pi.personel_id = p.id
      WHERE $1 BETWEEN pi.baslangic AND pi.bitis
    `;
    const result = await pool.query(query, [tarih]);
    res.json(result.rows);
  } catch (err) {
    console.error("İzin raporu hatası:", err);
    res.status(500).json({ hata: "İzin verisi alınamadı" });
  }
});

router.get("/maas-listesi", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, ad_soyad, gorev, maas FROM personel
      WHERE durum = 'Aktif'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Maaş listesi hatası:", err);
    res.status(500).json({ hata: "Maaş verisi alınamadı" });
  }
});



module.exports = router;
