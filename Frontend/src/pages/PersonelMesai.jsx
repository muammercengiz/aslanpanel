import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonelMesaileri, createMesai, deleteMesai } from "../api";

function PersonelMesai() {
  const { id } = useParams();
  const [mesailer, setMesailer] = useState([]);
  const [tarih, setTarih] = useState("");
  const [sure, setSure] = useState("");
  const [aciklama, setAciklama] = useState("");

  useEffect(() => {
    getPersonelMesaileri(id)
      .then((res) => setMesailer(res.data))
      .catch((err) => console.error("Mesai verisi alınamadı:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const yeniMesai = { personel_id: id, tarih, sure, aciklama };

    try {
      const res = await createMesai(yeniMesai);
      setMesailer([res.data, ...mesailer]);
      setTarih("");
      setSure("");
      setAciklama("");
    } catch (err) {
      console.error("Mesai ekleme hatası:", err);
    }
  };

  const handleDelete = async (mesaiId) => {
    if (window.confirm("Bu mesai kaydı silinsin mi?")) {
      try {
        await deleteMesai(mesaiId);
        setMesailer((prev) => prev.filter((m) => m.id !== mesaiId));
      } catch (err) {
        console.error("Mesai silme hatası:", err);
      }
    }
  };


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Mesai Ekle</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div>
          <label className="block font-medium mb-1">Tarih</label>
          <input
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Süre (saat)</label>
          <input
            type="number"
            value={sure}
            onChange={(e) => setSure(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Açıklama</label>
          <input
            type="text"
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="md:col-span-4 text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Kaydet
          </button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Tarih</th>
              <th className="p-3">Süre</th>
              <th className="p-3">Açıklama</th>
              <th className="p-3">Sil</th>
            </tr>
          </thead>
          <tbody>
            {mesailer.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                {new Date(item.tarih).toLocaleDateString("tr-TR")}
                </td>
                <td className="p-3">{item.sure}</td>
                <td className="p-3">{item.aciklama}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {mesailer.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
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

export default PersonelMesai;
