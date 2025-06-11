import React, { useEffect, useState } from "react";
import api from "../../api";

const PersonelMaasRaporu = () => {
  const [maaslar, setMaaslar] = useState([]);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        
const res = await api.get(`/maas-listesi`); // bu endpoint backendde varsa
        setMaaslar(res.data);
      } catch (err) {
        console.error("Maaş verileri alınamadı:", err);
      }
    };

    veriGetir();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💰 Personel Maaş Listesi</h1>

      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">#</th>
            <th className="p-3 border">Ad Soyad</th>
            <th className="p-3 border">Görev</th>
            <th className="p-3 border">Maaş (₺)</th>
          </tr>
        </thead>
        <tbody>
          {maaslar.map((item, index) => (
            <tr key={item.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{item.ad_soyad}</td>
              <td className="p-2 border">{item.gorev}</td>
              <td className="p-2 border">{item.maas?.toLocaleString("tr-TR")}</td>
            </tr>
          ))}
          {maaslar.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonelMaasRaporu;
