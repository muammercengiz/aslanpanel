import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPersonel } from "../api"; // 📌 api.js içinden alınıyor

function PersonelEkle() {
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    tc: "",
    telefon: "",
    adres: "",
    gorev: "",
    ise_baslama: "",
    izin_hakki: "14",
    durum: "Aktif",
    maas: ""
  });

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const veri = { ...formData };
    if (role !== "admin") {
      delete veri.maas;
    }

    try {
      await createPersonel(veri);
      alert("Personel başarıyla eklendi");
      navigate("/personeller");
    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Kayıt eklenemedi");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Yeni Personel Ekle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Ad</label>
              <input name="ad" value={formData.ad} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Soyad</label>
              <input name="soyad" value={formData.soyad} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">T.C. Kimlik No</label>
              <input name="tc" value={formData.tc} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Telefon</label>
              <input name="telefon" value={formData.telefon} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Adres</label>
              <input name="adres" value={formData.adres} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Görev</label>
              <input name="gorev" value={formData.gorev} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">İşe Başlama Tarihi</label>
              <input type="date" name="ise_baslama" value={formData.ise_baslama} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">İzin Hakkı (Gün)</label>
              <input type="number" name="izin_hakki" value={formData.izin_hakki} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            {role === "admin" && (
            <div>
              <label className="block font-medium mb-1">Maaş</label>
              <input
                type="number"
                name="maas"
                value={formData.maas}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Durum</label>
              <select name="durum" value={formData.durum} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option>Aktif</option>
                <option>İzinli</option>
                <option>Raporlu</option>
                <option>İşten Ayrıldı</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonelEkle;