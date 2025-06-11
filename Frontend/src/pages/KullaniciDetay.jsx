import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hareketKaydet } from "../utils/hareket";
import { getKullaniciById, updateKullanici } from "../api";

function KullaniciDetay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    kullanici_adi: "",
    sifre: "",
    rol: "",
  });

  // Kullanıcı bilgilerini getirme
 useEffect(() => {
  getKullaniciById(id)
    .then((res) => setForm({ ...res.data, sifre: "" }))  // ✔️ res.data ile al
    .catch((err) => console.error("Veri alınamadı:", err));
}, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  const guncellemeVerisi = { ...form };
  if (!guncellemeVerisi.sifre) {
    delete guncellemeVerisi.sifre;
  }

  try {
    await updateKullanici(id, guncellemeVerisi);

    const yapan = localStorage.getItem("isim");
    await hareketKaydet(
      "Kullanıcı Güncelleme",
      `${yapan}, ${guncellemeVerisi.ad} ${guncellemeVerisi.soyad} adlı kullanıcıyı güncelledi`
    );

    alert("Kullanıcı güncellendi");
    navigate("/kullanicilar");
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    alert("Güncelleme başarısız");
  }
};


  return (
    <div className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Kullanıcı Güncelle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="ad"
          value={form.ad}
          onChange={handleChange}
          placeholder="Ad"
          className="w-full p-2 border"
          required
        />
        <input
          name="soyad"
          value={form.soyad}
          onChange={handleChange}
          placeholder="Soyad"
          className="w-full p-2 border"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border"
          required
        />
        <input
          name="telefon"
          value={form.telefon}
          onChange={handleChange}
          placeholder="Telefon"
          className="w-full p-2 border"
          required
        />
        <input
          name="kullanici_adi"
          value={form.kullanici_adi}
          onChange={handleChange}
          placeholder="Kullanıcı Adı"
          className="w-full p-2 border"
          required
        />
        <input
          name="sifre"
          value={form.sifre}
          onChange={handleChange}
          placeholder="Yeni Şifre (boş bırakılırsa değişmez)"
          className="w-full p-2 border"
        />
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        >
          <option value="">Rol Seçin</option>
          <option value="admin">Admin</option>
          <option value="yönetici">Yönetici</option>
          <option value="operatör">Operatör</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}

export default KullaniciDetay;
