const MARKET_LOCATIONS = [
  { market: "Barasat Mandi", km: 3, multiplier: 1.00 },
  { market: "Madhyamgram", km: 7, multiplier: 0.98 },
  { market: "Basirhat", km: 18, multiplier: 1.04 },
  { market: "Kolkata Wholesale", km: 26, multiplier: 1.07 },
  { market: "Howrah Mandi", km: 31, multiplier: 1.05 },
  { market: "Behala Market", km: 24, multiplier: 1.02 },
  { market: "Purulia Mandi", km: 290, multiplier: 0.97 },
  { market: "Malda Mandi", km: 350, multiplier: 1.03 },
  { market: "Darjeeling Market", km: 620, multiplier: 1.01 },
  { market: "Haldia Market", km: 125, multiplier: 1.06 },
  { market: "Siliguri Mandi", km: 560, multiplier: 1.04 },
  { market: "Durgapur Mandi", km: 185, multiplier: 1.00 },
  { market: "Kharagpur Mandi", km: 120, multiplier: 1.02 },
  { market: "Burdwan Mandi", km: 105, multiplier: 1.03 },
  { market: "Krishnanagar Mandi", km: 110, multiplier: 1.01 }
];

const BASE_PRICES = {
  Rice: 2200,
  Wheat: 2420,
  Potato: 1150,
  Maize: 1900,
  Mustard: 5350,

  Tomato: 2800,
  Brinjal: 2400,
  Carrot: 2600,
  Cabbage: 1800,
  Cauliflower: 2200,
  Onion: 3000,
  Garlic: 8500,
  Chilli: 6200,
  Cucumber: 2100,
  Pumpkin: 1700
};

export default function handler(req, res) {
  const crop = req.query.crop || "Potato";

  const basePrice = BASE_PRICES[crop] || BASE_PRICES.Potato;

  const markets = MARKET_LOCATIONS.map((location) => ({
    market: location.market,
    km: location.km,
    price: Math.round(basePrice * location.multiplier)
  }));

  const recommended = [...markets].sort(
    (a, b) => b.price - a.price
  )[0];

  return res.status(200).json({
    crop,
    recommended: recommended.market,
    markets
  });
}
