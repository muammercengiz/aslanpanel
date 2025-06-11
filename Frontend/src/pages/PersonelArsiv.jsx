import React, { useEffect, useState } from "react";
import { getArsivPersoneller, iseGeriAl, updatePersonel } from "../api";


function PersonelArsiv() {
  const [arsivPersoneller, setArsivPersoneller] = useState([]);
const handleIseGeriAl = (personel) => {
  if (window.confirm("Bu personel tekrar aktif edilsin mi?")) {
    const yeniVeri = {
      ...personel,
      durum: "Aktif",
      ayrilma_tarihi: null,
      ayrilma_sebebi: ""
    };



    updatePersonel(personel.id, yeniVeri)
      .then(() => {
        alert("İşlem başarılı");
        setArsivPersoneller((prev) => prev.filter((p) => p.id !== personel.id));
      })
      .catch((err) => {
        console.error("İşe geri alma hatası:", err);
        alert("İşlem başarısız");
      });
  }
};


  useEffect(() => {
    getArsivPersoneller()
      .then((res) => {
        console.log("Arşiv verisi gelen:", res.data);
        setArsivPersoneller(res.data);
      })
      .catch((err) => console.error("Arşiv verisi alınamadı:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Arşivdeki Personeller</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">T.C. Kimlik No</th>
              <th className="p-3">Görev</th>
              <th className="p-3">İşe Başlama</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Ayrılma Tarihi</th>
              <th className="p-3">Ayrılma Sebebi</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {arsivPersoneller.map((p, index) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{p.ad} {p.soyad}</td>
                <td className="p-3">{p.tc}</td>
                <td className="p-3">{p.gorev}</td>
                <td className="p-3">{p.ise_baslama?.slice(0, 10)}</td>
                <td className="p-3">{p.durum}</td>
                <td className="p-3">{p.ayrilma_tarihi?.slice(0, 10) || "-"}</td>
                <td className="p-3">{p.ayrilma_sebebi || "-"}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleIseGeriAl(p)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    İşe Geri Al
                  </button>
                </td>
              </tr>
            ))}
            {arsivPersoneller.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Arşivde personel bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonelArsiv;
