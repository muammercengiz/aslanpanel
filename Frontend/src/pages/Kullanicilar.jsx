import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hareketKaydet } from "../utils/hareket";
import { getKullanicilar, deleteKullanici } from "../api";

function Kullanicilar() {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yenile, setYenile] = useState(false);

  useEffect(() => {
    getKullanicilar()
      .then((res) => setKullanicilar(res.data))
      .catch((err) => console.error(err));
  }, [yenile]);

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcı silinsin mi?")) {
      try {
        await deleteKullanici(id);
        await hareketKaydet("Kullanıcı Silme", `ID: ${id} kullanıcısı silindi`);
        setYenile(!yenile);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kullanıcılar</h2>
        <Link to="/kullanici-ekle" className="bg-green-600 text-white px-4 py-2 rounded">
          + Yeni Kullanıcı
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Kullanıcı Adı</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {kullanicilar.map((k, index) => (
              <tr key={k.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{k.ad} {k.soyad}</td>
                <td className="p-3">{k.kullanici_adi}</td>
                <td className="p-3">{k.email}</td>
                <td className="p-3">{k.rol}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                  <Link
                    to={`/kullanici/${k.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Detay
                  </Link>
                  <Link
                    to={`/kullanici-hareketleri/${k.id}`} 
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Hareketler
                  </Link>
                </td>
              </tr>
            ))}
            {kullanicilar.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Henüz kullanıcı eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Kullanicilar;
