const MARKET_DATA = {
  Rice: [
    { market: "Barasat Mandi", km: 3, price: 2180 },
    { market: "Madhyamgram", km: 7, price: 2140 },
    { market: "Basirhat", km: 18, price: 2260 },
    { market: "Kolkata Wholesale", km: 26, price: 2310 },
  ],

  Wheat: [
    { market: "Barasat Mandi", km: 3, price: 2410 },
    { market: "Madhyamgram", km: 7, price: 2390 },
    { market: "Basirhat", km: 18, price: 2455 },
    { market: "Kolkata Wholesale", km: 26, price: 2480 },
  ],

  Potato: [
    { market: "Barasat Mandi", km: 3, price: 1120 },
    { market: "Madhyamgram", km: 7, price: 1085 },
    { market: "Basirhat", km: 18, price: 1210 },
    { market: "Kolkata Wholesale", km: 26, price: 1260 },
  ],

  Maize: [
    { market: "Barasat Mandi", km: 3, price: 1890 },
    { market: "Madhyamgram", km: 7, price: 1860 },
    { market: "Basirhat", km: 18, price: 1930 },
    { market: "Kolkata Wholesale", km: 26, price: 1975 },
  ],

  Mustard: [
    { market: "Barasat Mandi", km: 3, price: 5320 },
    { market: "Madhyamgram", km: 7, price: 5260 },
    { market: "Basirhat", km: 18, price: 5410 },
    { market: "Kolkata Wholesale", km: 26, price: 5480 },
  ],
};

export default function handler(req, res) {
  const crop = req.query.crop || "Rice";

  const markets = MARKET_DATA[crop] || MARKET_DATA.Rice;

  const recommended = [...markets].sort(
    (a, b) => b.price - a.price
  )[0];

  return res.status(200).json({
    crop,
    recommended: recommended.market,
    markets,
  });
}
