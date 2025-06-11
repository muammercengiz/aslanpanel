import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SistemAyarlari() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [permissions, setPermissions] = useState([
    {
      page: "Kullanıcılar",
      admin: true,
      yonetici: false,
      operator: false,
    },
    {
      page: "Ürünler",
      admin: true,
      yonetici: true,
      operator: true,
    },
    {
      page: "Siparişler",
      admin: true,
      yonetici: true,
      operator: true,
    },
    {
      page: "Onaylar",
      admin: true,
      yonetici: true,
      operator: false,
    },
    {
      page: "Sistem Ayarları",
      admin: true,
      yonetici: false,
      operator: false,
    },
    {
      page: "Personeller",
      admin: true,
      yonetici: true,
      operator: true,
    },
  ]);


  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const togglePermission = (pageIndex, roleKey) => {
    setPermissions((prev) =>
      prev.map((item, index) =>
        index === pageIndex
          ? { ...item, [roleKey]: !item[roleKey] }
          : item
      )
    );
  };

  const handleSave = () => {
    console.log("KAYDEDİLECEK VERİ:", permissions);
    alert("Yetkiler başarıyla kaydedildi (şu an sadece console'da)!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rol Yetki Yönetimi</h2>

      <table className="w-full table-auto border border-gray-700 text-sm text-left">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 border">Sayfa</th>
            <th className="p-2 border">Admin</th>
            <th className="p-2 border">Yönetici</th>
            <th className="p-2 border">Operatör</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((row, i) => (
            <tr key={i} className="hover:bg-gray-900">
              <td className="p-2 border">{row.page}</td>
              {["admin", "yonetici", "operator"].map((roleKey) => (
                <td
                  key={roleKey}
                  className="p-2 border text-center cursor-pointer select-none"
                  onClick={() => togglePermission(i, roleKey)}
                >
                  {row[roleKey] ? (
                    <span className="text-green-500 font-bold">Evet</span>
                  ) : (
                    <span className="text-red-500 font-bold">Hayır</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Değişiklikleri Kaydet
      </button>

      <p className="text-xs text-gray-400 mt-4">
        Veriler şu an yereldir. Kaydet butonu sadece konsola yazdırır.
      </p>
    </div>
  );
}

export default SistemAyarlari;
