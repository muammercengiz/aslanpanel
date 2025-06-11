import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersoneller, deletePersonel } from "../api"; // api.js'den

function Personel() {
  const [personeller, setPersoneller] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

useEffect(() => {
  getPersoneller()
    .then((res) => {
      const aktifPersoneller = res.data.filter(
        (p) => p.durum !== "İşten Ayrıldı"
      );
      setPersoneller(aktifPersoneller);
    })
    .catch((err) => console.error("Personel verisi alınamadı:", err));
}, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu personel kaydı silinsin mi?")) {
      try {
        await deletePersonel(id);
        setPersoneller((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Silme hatası:", err);
        alert("Silme işlemi başarısız");
      }
    }
  };


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Aktif Personel Listesi</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/personel-arsiv")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Arşiv
          </button>
          <button
            onClick={() => navigate("/personel-takip")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Personel Takip
          </button>
          <button
            onClick={() => navigate("/personel-ekle")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Yeni Personel Ekle
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Görev</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Telefon</th>
              <th className="px-4 py-2">İzin Hakkı</th>
              {(role === "admin") && <th className="p-3">Maaş</th>}
              <th className="p-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {personeller.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.ad} {item.soyad}</td>
                <td className="p-3">{item.gorev}</td>
                <td className="p-3">{item.durum}</td>
                <td className="p-3">{item.telefon}</td>
                <td className="p-3">{item.izin_hakki} gün</td>
                {(role === "admin") && (
                  <td className="p-3">
                  {item.maas ? `${item.maas} ₺` : "-"}
                </td>
                )}
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/personel-izin/${item.id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    İzin
                  </button>
                  <button
                    onClick={() => navigate(`/personel-mesai/${item.id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Mesai
                  </button>
                  <button
                    onClick={() => navigate(`/personel-guncelle/${item.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {personeller.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Personel;
