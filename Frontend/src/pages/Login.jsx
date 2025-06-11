// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hareketKaydet } from "../utils/hareket";
import { STORAGE_KEYS } from "../utils/constants";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/kullanicilar/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kullanici_adi: username, sifre: password }),
      });

      const data = await res.json();
      console.log("Gelen veri:", data);

      if (!res.ok || !data.id) {
        setError(true);
        return;
      }

      // Oturum bilgilerini kaydet
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.id);
      localStorage.setItem(STORAGE_KEYS.NAME, data.isim);
      localStorage.setItem(STORAGE_KEYS.ROLE, data.role);
      localStorage.setItem(STORAGE_KEYS.TOKEN, "active");

      // Giriş hareketini kaydet
      await hareketKaydet("Giriş", `${data.isim} sisteme giriş yaptı`);

      // Oturum state'ini App.jsx'e bildir
      onLogin();

      // Anasayfaya yönlendir
      navigate("/dashboard");
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center mb-6">
          <img src="/AslanLogo.jpg" alt="logo" className="w-60 object-contain" />
        </div>

        <label className="block text-gray-700 mb-1">Kullanıcı Adı</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block text-gray-700 mb-1">Şifre</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">
            Kullanıcı adı veya şifre hatalı.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded"
        >
          Giriş
        </button>
      </form>
    </div>
  );
}

export default Login;
