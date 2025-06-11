import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPersoneller,
  getTumIzinler,
  addIzin,
  addDevamsizlik,
  addMesai,
  saveDevamDurumu,
} from "../api";

const PersonelTakip = () => {
  const [personeller, setPersoneller] = useState([]);
  const [formData, setFormData] = useState({
    personel_id: "",
    tur: "",
    baslangic: "",
    bitis: "",
    tarih: "",
    sure: "",
    aciklama: "",
  });

  const [devamDurumu, setDevamDurumu] = useState([]);
  const [bugun, setBugun] = useState(new Date().toISOString().split("T")[0]);
  const [resmiTatil, setResmiTatil] = useState(false);
  const [izinler, setIzinler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPersoneller()
      .then((res) => {
        setPersoneller(res.data);
        return res.data;
      })
      .then((personelListesi) =>
        getTumIzinler().then((izinRes) => {
          setIzinler(izinRes.data);
          const bugunTarih = bugun;

          const baslangicDurum = personelListesi.map((p) => {
            const izinliMi = izinRes.data.some(
              (izin) =>
                izin.personel_id === p.id &&
                bugunTarih >= izin.baslangic.substring(0, 10) &&
                bugunTarih <= izin.bitis.substring(0, 10)
            );
            return {
              id: p.id,
              ad: `${p.ad} ${p.soyad}`,
              durum: izinliMi ? "izinli" : "geldi",
            };
          });

          setDevamDurumu(baslangicDurum);
        })
      )
      .catch((err) => console.log(err));
  }, [bugun]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let apiFunc;
    let payload = {};

    switch (formData.tur) {
      case "izin":
        apiFunc = addIzin;
        payload = {
          personel_id: formData.personel_id,
          baslangic: formData.baslangic,
          bitis: formData.bitis,
          aciklama: formData.aciklama,
        };
        break;
      case "devamsizlik":
        apiFunc = addDevamsizlik;
        payload = {
          personel_id: formData.personel_id,
          tarih: formData.tarih,
          aciklama: formData.aciklama,
        };
        break;
      case "mesai":
        apiFunc = addMesai;
        payload = {
          personel_id: formData.personel_id,
          tarih: formData.tarih,
          sure: formData.sure,
          aciklama: formData.aciklama,
        };
        break;
      default:
        return;
    }

    apiFunc(payload)
      .then(() => {
        alert("Kayıt başarıyla eklendi");
        setFormData({
          personel_id: "",
          tur: "",
          baslangic: "",
          bitis: "",
          tarih: "",
          sure: "",
          aciklama: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Kayıt eklenirken hata oluştu");
      });
  };

  const handleDevamChange = (id, yeniDurum) => {
    setDevamDurumu((prev) =>
      prev.map((p) => (p.id === id ? { ...p, durum: yeniDurum } : p))
    );
  };

  const handleDevamSubmit = () => {
    if (resmiTatil) {
      alert("Bugün resmi tatil olduğu için devam verisi gönderilmeyecek.");
      return;
    }

    const promises = devamDurumu.map((item) =>
      saveDevamDurumu({
        personel_id: item.id,
        tarih: bugun,
        durum: item.durum,
      })
    );

    Promise.all(promises)
      .then(() => alert("Devam durumları kaydedildi"))
      .catch(() => alert("Devam durumları kaydedilemedi"));
  };


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Personel Takip İşlemleri</h2>

      {/* Üstteki Form: İzin / Devamsızlık / Mesai */}
      {/* (Senin orijinal kodun burada olduğu gibi kalıyor) */}
      {/* ... [KISALTILDI] ... */}

      {/* --- GÜNLÜK DEVAM TAKİP BÖLÜMÜ --- */}
      <div className="mt-10 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">📅 Günlük Devam Durumu</h3>

        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Tarih:</label>
          <input type="date" value={bugun} onChange={e => setBugun(e.target.value)} className="border p-2 rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={resmiTatil} onChange={e => setResmiTatil(e.target.checked)} />
            Bugün Resmi Tatil
          </label>
        </div>

        <table className="w-full text-left border-collapse mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Ad Soyad</th>
              <th className="p-2 border">Durum</th>
            </tr>
          </thead>
          <tbody>
            {devamDurumu.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.ad}</td>
                <td className="p-2 border">
                  <select
                    value={item.durum}
                    onChange={e => handleDevamChange(item.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="geldi">Geldi</option>
                    <option value="izinli">İzinli</option>
                    <option value="raporlu">Raporlu</option>
                    <option value="gelmedi">Gelmedi</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleDevamSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Devam Durumlarını Kaydet
        </button>
        <button
          onClick={() => navigate("/personel-devam")}
          className="mt-2 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 ml-4"
        >
          Geçmiş Kayıtlar
        </button>
      </div>
    </div>
  );
};

export default PersonelTakip;
