const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: "https://aslanpanel-frontend.onrender.com", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Basit test endpoint
app.get("/", (req, res) => {
  res.send("Backend çalışıyor!");
});

// Route tanımları
const yetkilerRoute = require("./routes/yetkiler");
app.use("/api/yetkiler", yetkilerRoute);

const kullaniciRoutes = require("./routes/kullanicilar");
app.use("/api/kullanicilar", kullaniciRoutes);

const hareketRoutes = require("./routes/hareketler");
app.use("/api/hareketler", hareketRoutes);

const personelRoute = require("./routes/personel");
app.use("/api/personel", personelRoute);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});
