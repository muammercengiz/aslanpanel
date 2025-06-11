import React, { useState } from "react";
import { createKullanici } from "../api";
import { useNavigate } from "react-router-dom";
import { hareketKaydet } from "../utils/hareket";


function KullaniciEkle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    kullanici_adi: "",
    sifre: "",
    rol: "admin",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = (e) => {
  e.preventDefault();

  createKullanici(formData)
    .then(() => {
      // ✅ HAREKET KAYDI BURAYA
      hareketKaydet("Kullanıcı Ekleme", `${formData.ad} ${formData.soyad} adlı kullanıcı eklendi`);

      alert("Kullanıcı başarıyla eklendi");
      navigate("/kullanicilar");
    })
    .catch((err) => {
      console.error("Ekleme hatası:", err);
      alert("Kullanıcı eklenemedi");
    });
};


  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Yeni Kullanıcı Ekle</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            placeholder="İsim"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="soyad"
            value={formData.soyad}
            onChange={handleChange}
            placeholder="Soyisim"
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            placeholder="Telefon"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="kullanici_adi"
            value={formData.kullanici_adi}
            onChange={handleChange}
            placeholder="Kullanıcı Adı"
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="sifre"
            value={formData.sifre}
            onChange={handleChange}
            placeholder="Şifre"
            className="p-2 border rounded"
            required
          />
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="p-2 border rounded col-span-2"
          >
            <option value="admin">Admin</option>
            <option value="yönetici">Yönetici</option>
            <option value="operatör">Operatör</option>
          </select>
          <div className="col-span-2 flex justify-center mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KullaniciEkle;
