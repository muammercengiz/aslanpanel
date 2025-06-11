import React, { useEffect, useState } from "react";
import api from "../../api";

const RaporDevam = () => {
  const [veriler, setVeriler] = useState([]);
  const [tarih, setTarih] = useState(() => new Date().toISOString().substring(0, 10));

  useEffect(() => {
    const veriyiGetir = async () => {
      try {
       const res = await api.get(`/devam-tarihli/${tarih}`);
        setVeriler(res.data);
      } catch (err) {
        console.error("Veri alınamadı:", err);
      }
    };

    veriyiGetir();
  }, [tarih]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Personel Devam Raporu</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Tarih Seç:</label>
        <input
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">#</th>
            <th className="p-3 border">Ad Soyad</th>
            <th className="p-3 border">Durum</th>
          </tr>
        </thead>
        <tbody>
          {veriler.map((item, index) => (
            <tr key={item.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{item.ad_soyad}</td>
              <td className="p-2 border">{item.durum}</td>
            </tr>
          ))}
          {veriler.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RaporDevam;
