import React, { useState, useEffect } from "react";
import api from "../../api";




const RaporIzin = () => {
  const [veriler, setVeriler] = useState([]);
  const [tarih, setTarih] = useState(() => new Date().toISOString().substring(0, 10));

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const res = await api.get(`/izin-tarihli/${tarih}`);
        setVeriler(res.data);
      } catch (err) {
        console.error("İzin verileri alınamadı:", err);
      }
    };

    veriGetir();
  }, [tarih]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🟨 Personel İzin Raporu</h1>

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
            <th className="p-3 border">İzin Başlangıç</th>
            <th className="p-3 border">İzin Bitiş</th>
            <th className="p-3 border">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {veriler.map((item, index) => (
            <tr key={item.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{item.ad_soyad}</td>
              <td className="p-2 border">{item.baslangic}</td>
              <td className="p-2 border">{item.bitis}</td>
              <td className="p-2 border">{item.aciklama}</td>
            </tr>
          ))}
          {veriler.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RaporIzin;
