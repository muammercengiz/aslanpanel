// PersonelGuncelle.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonelById, updatePersonel } from "../api";

function PersonelGuncelle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    tc: "",
    telefon: "",
    adres: "",
    gorev: "",
    ise_baslama: "",
    izin_hakki: "",
    durum: "Aktif",
    maas: "",
    ayrilma_tarihi: "",
    ayrilma_sebebi: ""
  });

  useEffect(() => {
    getPersonelById(id)
      .then((res) => setFormData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePersonel(id, formData)
      .then(() => navigate("/personeller"))
      .catch((err) => {
        console.error("Güncelleme hatası:", err);
        alert("Güncelleme başarısız");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Personel Güncelle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Ad</label>
              <input type="text" name="ad" value={formData.ad || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Soyad</label>
              <input type="text" name="soyad" value={formData.soyad || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">T.C. Kimlik No</label>
              <input type="text" name="tc" value={formData.tc || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Telefon</label>
              <input type="text" name="telefon" value={formData.telefon || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Adres</label>
              <input type="text" name="adres" value={formData.adres || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Görev</label>
              <input type="text" name="gorev" value={formData.gorev || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">İşe Başlama Tarihi</label>
              <input type="date" name="ise_baslama" value={formData.ise_baslama?.slice(0, 10) || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">İzin Hakkı (Gün)</label>
              <input type="number" name="izin_hakki" value={formData.izin_hakki || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            {role === "admin" && (
              <div>
                <label className="block font-medium mb-1">Maaş</label>
                <input type="number" name="maas" value={formData.maas || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
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

            {/* İşten Ayrıldı durumunda ek alanlar */}
            {formData.durum === "İşten Ayrıldı" && (
              <>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">İşten Ayrılma Tarihi</label>
                  <input
                    type="date"
                    name="ayrilma_tarihi"
                    value={formData.ayrilma_tarihi || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Ayrılma Sebebi</label>
                  <textarea
                    name="ayrilma_sebebi"
                    value={formData.ayrilma_sebebi || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonelGuncelle;
