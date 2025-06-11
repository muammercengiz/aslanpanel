import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonelIzinleri, createIzin, deleteIzin } from "../api";

const PersonelIzinleri = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    baslangic: "",
    bitis: "",
    aciklama: "",
  });
  const [izinler, setIzinler] = useState([]);

  const izinleriGetir = () => {
    getPersonelIzinleri(id)
      .then((res) => setIzinler(res.data))
      .catch((err) => console.error("İzin verileri alınamadı:", err));
  };

  useEffect(() => {
    izinleriGetir();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createIzin({ ...formData, personel_id: id })
      .then(() => {
        setFormData({ baslangic: "", bitis: "", aciklama: "" });
        izinleriGetir();
      })
      .catch((err) => console.error("İzin ekleme hatası:", err));
  };

  const handleSil = (izinId) => {
    deleteIzin(izinId)
      .then(() => izinleriGetir())
      .catch((err) => console.error("Silme hatası:", err));
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Personel İzin Ekle</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="date"
            name="baslangic"
            value={formData.baslangic}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="bitis"
            value={formData.bitis}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="aciklama"
            value={formData.aciklama}
            onChange={handleChange}
            placeholder="Açıklama"
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          İzin Kaydet
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">İzin Geçmişi</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Başlangıç</th>
              <th className="p-2">Bitiş</th>
              <th className="p-2">Açıklama</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {izinler.map((izin) => (
              <tr key={izin.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{izin.baslangic?.substring(0, 10)}</td>
                <td className="p-2">{izin.bitis?.substring(0, 10)}</td>
                <td className="p-2">{izin.aciklama}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleSil(izin.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {izinler.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-3 text-gray-500">
                  Kayıtlı izin bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonelIzinleri;
