// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ==== KULLANICI İŞLEMLERİ ====
export const getKullanicilar = () => api.get("/kullanicilar");
export const getKullaniciById = (id) => api.get(`/kullanicilar/${id}`);
export const createKullanici = (data) => api.post("/kullanicilar", data);
export const updateKullanici = (id, data) => api.patch(`/kullanicilar/${id}`, data);
export const deleteKullanici = (id) => api.delete(`/kullanicilar/${id}`);
export const getKullaniciHareketleri = (id) => api.get(`/hareketler/${id}`);

// ==== PERSONEL İŞLEMLERİ ====
export const getPersoneller = () => api.get("/personel");
export const getPersonelById = (id) => api.get(`/personel/${id}`);
export const createPersonel = (data) => api.post("/personel", data);
export const updatePersonel = (id, data) => api.put(`/personel/${id}`, data);
export const deletePersonel = (id) => api.delete(`/personel/${id}`);
export const getPasifPersoneller = () => api.get("/personel?durum=Pasif");

export const iseGeriAl = async (id) => {
  const res = await api.get(`/personel/${id}`);
  const personel = res.data;

  const guncellenenVeri = {
    ...personel,
    durum: "Aktif",
    ayrilma_tarihi: null,
    ayrilma_sebebi: ""
  };

  return api.put(`/personel/${id}`, guncellenenVeri);
};


// PersonelArsiv için işten ayrılanları getiren yeni fonksiyon
export const getArsivPersoneller = () =>
  api.get("/personel?durum=İşten Ayrıldı");

// ==== PERSONEL İZİN ====
export const getPersonelIzinleri = (id) => api.get(`/personel/${id}/izinler`);
export const createIzin = (data) => api.post("/personel/izin-ekle", data);
export const deleteIzin = (izinId) => api.delete(`/personel/izin-sil/${izinId}`);

// ==== PERSONEL MESAİ ====
export const getPersonelMesaileri = (id) => api.get(`/personel/mesai/${id}`);
export const createMesai = (data) => api.post("/personel/mesai-ekle", data);
export const deleteMesai = (id) => api.delete(`/personel/mesai/${id}`);

// ==== PERSONEL DEVAM ====
export const getDevamByTarih = (tarih) => api.get(`/personel/devam-tarihli/${tarih}`);
export const deleteDevam = (id) => api.delete(`/personel/devam/${id}`);
export const updateDevamDurum = (id, data) => api.put(`/personel/devam/${id}`, data);
export const saveDevamDurumu = (data) => api.post("/personel/devam-ekle", data);

// ==== PERSONEL TAKİP ÜST FORM ====
export const getTumIzinler = () => api.get("/personel/tum-izinler");
export const addIzin = (data) => api.post("/izinler", data);
export const addDevamsizlik = (data) => api.post("/devam", data);
export const addMesai = (data) => api.post("/mesai", data);

// ==== YETKİLER ====
export const getYetkiler = () => api.get("/yetkiler");
export const updateYetki = (id, data) => api.put(`/yetkiler/${id}`, data);

export default api;
