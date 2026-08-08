export default function handler(req, res) {
  const crop = req.query.crop || "Potato";
  const soil = req.query.soil || "Loamy";
  const stage = req.query.stage || "Flowering";
  const rainDays = Number(req.query.rainDays || 2);

  let irrigationDays;

  if (soil === "Sandy") {
    irrigationDays = 2;
  } else if (soil === "Clay") {
    irrigationDays = 6;
  } else {
    irrigationDays = 4;
  }

  if (stage === "Flowering" || stage === "Grain fill") {
    irrigationDays = Math.max(2, irrigationDays - 1);
  }

  const irrigation =
    rainDays >= irrigationDays
      ? `Irrigate now. It has been ${rainDays} days since the last rain.`
      : `Hold irrigation for now. Recheck the field in ${irrigationDays - rainDays} day(s).`;

  const fertilizer = {
    Sowing: "Basal DAP + Urea starter dose.",
    Vegetative: "Split Urea top-dressing for vegetative growth.",
    Flowering: "Potash-focused nutrition to support flowering.",
    "Grain fill": "Reduce nitrogen and use a light Potash top-up.",
    Maturity: "Avoid further fertilizer and prepare for harvest.",
  };

  const pests = {
    Rice: "Watch for stem borer and leaf folder.",
    Wheat: "Watch for aphids and yellow rust.",
    Potato: "Watch for late blight after rainy or humid periods.",
    Maize: "Watch for fall armyworm.",
    Mustard: "Watch for aphids on tender shoots.",
  };

  return res.status(200).json({
    crop,
    soil,
    stage,
    irrigation,
    fertilizer:
      fertilizer[stage] ||
      "Use crop-stage appropriate balanced nutrition.",
    pest:
      pests[crop] ||
      "Monitor the crop regularly for pests and disease.",
  });
}
