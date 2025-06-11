import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Kullanicilar from "./pages/Kullanicilar";
import KullaniciEkle from "./pages/KullaniciEkle";
import KullaniciDetay from "./pages/KullaniciDetay";
import KullaniciHareketleri from "./pages/KullaniciHareketleri";

import SistemAyarlari from "./pages/SistemAyarlari";

import Personel from "./pages/Personel";
import PersonelEkle from "./pages/PersonelEkle";
import PersonelArsiv from "./pages/PersonelArsiv";
import PersonelGuncelle from "./pages/PersonelGuncelle";
import PersonelIzinleri from "./pages/PersonelIzinleri";
import PersonelDevam from "./pages/PersonelDevam";
import PersonelMesai from "./pages/PersonelMesai";
import PersonelTakip from "./pages/PersonelTakip";
import PersonelRaporlama from "./pages/PersonelRaporlama";
import PersonelMaasRaporu from "./pages/raporlar/PersonelMaasRaporu";
import RaporDevam from "./pages/raporlar/RaporDevam"; // üstte import
import RaporMesai from "./pages/raporlar/RaporMesai";
import RaporIzin from "./pages/raporlar/RaporIzin";






import { hareketKaydet } from "./utils/hareket";
import { STORAGE_KEYS } from "./utils/constants";
import ScrollToTop from "./components/ScrollToTop";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );

  useEffect(() => {
    let timeout;

    const handleIdleLogout = async () => {
      const isim = localStorage.getItem(STORAGE_KEYS.NAME);
      const kullanici_id = localStorage.getItem(STORAGE_KEYS.USER_ID);

      if (kullanici_id) {
        await hareketKaydet(
          "Otomatik Çıkış",
          `${isim} 1 saat işlem yapılmadığı için sistemden atıldı`
        );
      }

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem(STORAGE_KEYS.NAME);
      localStorage.removeItem(STORAGE_KEYS.ROLE);

      setIsAuthenticated(null); // token'ı sıfırla
      window.location.href = "/";
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleIdleLogout, 3600000); // 1 saat
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 bg-gray-100 p-6">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="kullanicilar" element={<Kullanicilar />} />
                    <Route path="kullanici-ekle" element={<KullaniciEkle />} />
                    <Route path="kullanici/:id" element={<KullaniciDetay />} />
                    <Route path="kullanici-hareketleri/:id" element={<KullaniciHareketleri />} />
                    <Route path="personeller" element={<Personel />} />
                    <Route path="personel-ekle" element={<PersonelEkle />} />
                    <Route path="personel-guncelle/:id" element={<PersonelGuncelle />} />
                    <Route path="personel-arsiv" element={<PersonelArsiv />} />
                    <Route path="personel-izin/:id" element={<PersonelIzinleri />} />
                    <Route path="personel-devam" element={<PersonelDevam />} />
                    <Route path="personel-mesai/:id" element={<PersonelMesai />} />
                    <Route path="/personel-guncelle/:id" element={<PersonelGuncelle />} />
                    <Route path="/personel-takip" element={<PersonelTakip />} />
                    <Route path="personel-raporlama" element={<PersonelRaporlama />} />
                    {/* Sadece admin görebilsin */}
                    {localStorage.getItem(STORAGE_KEYS.ROLE) === "Admin" && (
                    <Route path="rapor/maas" element={<PersonelMaasRaporu />} />
                    )} 
                    <Route path="rapor/devam" element={<RaporDevam />} />
                    <Route path="rapor/mesai" element={<RaporMesai />} />
                    <Route path="rapor/izin" element={<RaporIzin />} />
                    <Route path="sistem-ayarlari" element={<SistemAyarlari />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
