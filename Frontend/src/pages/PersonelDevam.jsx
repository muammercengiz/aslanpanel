import React, { useEffect, useState } from "react";
import {
  getDevamByTarih,
  deleteDevam,
  updateDevamDurum,
} from "../api";

const PersonelDevam = () => {
  const [kayitlar, setKayitlar] = useState([]);
  const [tarih, setTarih] = useState(() => {
    const bugun = new Date();
    return bugun.toISOString().split("T")[0];
  });

  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlenenDurum, setDuzenlenenDurum] = useState("");

  useEffect(() => {
    veriGetir();
  }, [tarih]);

  const veriGetir = async () => {
    try {
      const res = await getDevamByTarih(tarih);
      setKayitlar(res.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDevam(id);
      setKayitlar((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silinemedi.");
    }
  };

  const handleSaveDurum = async (id) => {
    try {
      await updateDevamDurum(id, { durum: duzenlenenDurum });
      setKayitlar((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, durum: duzenlenenDurum } : item
        )
      );
      setDuzenlenenId(null);
    } catch (err) {
      console.error("Durum güncelleme hatası:", err);
      alert("Durum güncellenemedi.");
    }
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Personel Devam Kayıtları</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Tarih:</label>
        <input
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <table className="w-full border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">#</th>
            <th className="p-3">Ad Soyad</th>
            <th className="p-3">Tarih</th>
            <th className="p-3">Durum</th>
            <th className="p-3">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {kayitlar.map((item, index) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{item.ad_soyad}</td>
              <td className="p-3">{item.tarih}</td>
              <td className="p-3 capitalize">
                {duzenlenenId === item.id ? (
                  <select
                    value={duzenlenenDurum}
                    onChange={(e) => setDuzenlenenDurum(e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="geldi">Geldi</option>
                    <option value="gelmedi">Gelmedi</option>
                    <option value="izinli">İzinli</option>
                  </select>
                ) : (
                  item.durum
                )}
              </td>
              <td className="p-3 space-x-2">
                {duzenlenenId === item.id ? (
                  <>
                    <button
                      onClick={() => handleSaveDurum(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setDuzenlenenId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Vazgeç
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setDuzenlenenId(item.id);
                        setDuzenlenenDurum(item.durum);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Güncelle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {kayitlar.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonelDevam;
