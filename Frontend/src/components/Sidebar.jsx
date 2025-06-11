import React from "react";
import { hareketKaydet } from "../utils/hareket";
import { STORAGE_KEYS } from "../utils/constants";
import { Link } from "react-router-dom";
import {
  Settings,
  ShieldCheck,
  Boxes,
  Package,
  Truck,
  Users,
  ClipboardList,
  ShoppingCart,
  BarChart2
} from "lucide-react";

function Sidebar() {
  const role = localStorage.getItem("role");
  const isim = localStorage.getItem("isim");
const handleLogout = async () => {
  const isim = localStorage.getItem(STORAGE_KEYS.NAME);
  const kullanici_id = localStorage.getItem(STORAGE_KEYS.USER_ID);

  if (kullanici_id) {
    await hareketKaydet("Çıkış", `${isim} sistemden çıkış yaptı`);
  }

  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.NAME);
  localStorage.removeItem(STORAGE_KEYS.ROLE);

  window.location.href = "/"; // login sayfasına yönlendir
};




  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5 space-y-6">
      {/* Hoşgeldiniz ve Çıkış */}
<div className="text-sm text-white text-center mb-4">
  Hoşgeldiniz, <span className="font-semibold">{isim}</span>
 <button onClick={handleLogout} className="block mt-2 text-red-400 hover:underline">
  Çıkış Yap
</button>

</div>

      {/* Logo ve Başlık */}
      <img src="/AslanLogo.jpg" alt="logo" className="w-30 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-center mb-6">Aslan Panel</h1>

      {/* Yetkili İşlemleri */}
      <div>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <ShieldCheck size={16} /> YETKİLİ İŞLEMLERİ
        </p>
        <ul className="space-y-1">
          <li><Link to="/onaylar" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><ClipboardList size={16} /> Onaylar</Link></li>
          <li><Link to="/kullanicilar" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Users size={16} /> Kullanıcılar</Link></li>
        </ul>
      </div>

      <hr className="border-gray-700" />

      {/* Hammadde / Üretim */}
      <div>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <Boxes size={16} /> HAMMADDE / ÜRETİM
        </p>
        <ul className="space-y-1">
          <li><Link to="/hammadde" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Package size={16} /> Hammadde</Link></li>
          <li><Link to="/uretim" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Package size={16} /> Üretim</Link></li>
          <li><Link to="/urunler" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Package size={16} /> Ürünler</Link></li>
          <li><Link to="/tanklar" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Package size={16} /> Tanklar</Link></li>
          <li><Link to="/ambalajlar" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Package size={16} /> Ambalajlar</Link></li>
        </ul>
      </div>

      <hr className="border-gray-700" />

      {/* Sipariş / Dağıtım */}
      <div>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <Truck size={16} /> SİPARİŞ / DAĞITIM
        </p>
        <ul className="space-y-1">
          <li><Link to="/siparisler" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><ShoppingCart size={16} /> Siparişler</Link></li>
          <li><Link to="/iadeler" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><ShoppingCart size={16} /> İadeler</Link></li>
          <li><Link to="/musteriler" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Users size={16} /> Müşteriler</Link></li>
          <li><Link to="/araclar" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Truck size={16} /> Araçlar</Link></li>
          <li><Link to="/dagitim-listesi" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><ClipboardList size={16} /> Dağıtım Listesi</Link></li>
        </ul>
      </div>

      <hr className="border-gray-700" />

      {/* Satın Alma */}
      <div>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <Package size={16} /> SATIN ALMA
        </p>
        <ul className="space-y-1">
          <li><Link to="/tedarikciler" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Users size={16} /> Tedarikçiler</Link></li>
        </ul>
      </div>

      <hr className="border-gray-700" />

      {/* Personel */}
      <div>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <Users size={16} /> PERSONEL
        </p>
        <ul className="space-y-1">
          <li><Link to="/personeller" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800"><Users size={16} /> Personeller</Link></li>
        </ul>
      </div>

      <hr className="border-gray-700" />

 {/* Raporlama */}
<div>
  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
    <BarChart2 size={16} /> RAPORLAMA
  </p>
  <ul className="space-y-1">
    <li>
      <Link to="/personel-raporlama" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800">
        <ClipboardList size={16} /> Personel Raporlamaları
      </Link>
    </li>
  </ul>
</div>


      {/* Admin'e özel Sistem Ayarları */}
      {role === "admin" && (
        <>
          <hr className="border-gray-700" />
          <div>
            <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Settings size={16} /> SİSTEM
            </p>
            <ul className="space-y-1">
              <li>
                <Link to="/sistem-ayarlari" className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800">
                  <Settings size={16} /> Sistem Ayarları
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
