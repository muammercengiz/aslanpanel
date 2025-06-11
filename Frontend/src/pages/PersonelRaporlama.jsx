import React from "react";
import { useNavigate } from "react-router-dom";


const PersonelRaporlama = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📊 Personel Raporlamaları</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/rapor/devam")}
          className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600"
        >
          Personel Devam Raporu
        </button>

        <button
          onClick={() => navigate("/rapor/mesai")}
          className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600"
        >
          Personel Mesai Raporu
        </button>

        <button
          onClick={() => navigate("/rapor/izin")}
          className="bg-yellow-500 text-white py-3 px-6 rounded hover:bg-yellow-600"
        >
          Personel İzin Raporu
        </button>

        <button
          onClick={() => navigate("/rapor/maas")}
          className="bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-700"
        >
          Personel Maaş Listesi
        </button>
      </div>
    </div>
  );
};

export default PersonelRaporlama;
