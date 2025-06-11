import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getKullaniciHareketleri } from "../api";

function KullaniciHareketleri() {
  const { id } = useParams();
  const [hareketler, setHareketler] = useState([]);

  useEffect(() => {
    getKullaniciHareketleri(id)
      .then(res => setHareketler(res.data))  // ✔️ Doğru
  .catch(err => console.error("Hareket verisi alınamadı:", err));
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Kullanıcı Hareketleri</h2>
      <ul className="space-y-2">
        {hareketler.map((h) => (
          <li key={h.id} className="border p-2 rounded">
            <div><strong>{h.islem_tipi}</strong></div>
            <div>{h.aciklama}</div>
            <div className="text-sm text-gray-500">{new Date(h.tarih).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KullaniciHareketleri;
