export async function hareketKaydet(islem_tipi, aciklama) {
  const kullanici_id = localStorage.getItem("kullanici_id");
  if (!kullanici_id) return;

  await fetch("http://localhost:5000/api/hareketler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kullanici_id,
      islem_tipi,
      aciklama
    }),
  });
}
