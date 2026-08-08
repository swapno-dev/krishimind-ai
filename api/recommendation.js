export default function handler(req, res) {
  const crop = req.query.crop || "Potato";
  const soil = req.query.soil || "Loamy";
  const stage = req.query.stage || "Flowering";
  const rainDays = Number(req.query.rainDays || 2);

  // -------------------------
  // IRRIGATION
  // -------------------------

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
      : `Hold irrigation for now. Recheck the field in ${
          irrigationDays - rainDays
        } day(s).`;

  // -------------------------
  // FERTILIZER
  // -------------------------

  const fertilizer = {
    Rice: {
      Sowing: "Basal DAP + Urea starter dose.",
      Vegetative: "Split Urea application to support tillering.",
      Flowering: "Balanced NPK with Potash support for grain formation.",
      "Grain fill": "Reduce nitrogen and maintain adequate Potash.",
      Maturity: "Avoid further fertilizer and prepare for harvest.",
    },

    Wheat: {
      Sowing: "Basal DAP with a starter dose of nitrogen.",
      Vegetative: "Nitrogen top-dressing to support tiller development.",
      Flowering: "Balanced nutrition with additional Potash support.",
      "Grain fill": "Light Potash application; avoid excess nitrogen.",
      Maturity: "Avoid further fertilizer before harvest.",
    },

    Potato: {
      Sowing: "Basal NPK application with adequate Potash.",
      Vegetative: "Nitrogen and Potash nutrition for tuber development.",
      Flowering: "Potash-focused nutrition to support tuber development.",
      "Grain fill": "Maintain Potash and avoid excessive nitrogen.",
      Maturity: "Avoid further fertilizer and prepare for harvest.",
    },

    Maize: {
      Sowing: "Basal DAP with starter nitrogen.",
      Vegetative: "Split Urea application for strong vegetative growth.",
      Flowering: "Balanced NPK with Potash for cob development.",
      "Grain fill": "Maintain Potash and avoid excessive nitrogen.",
      Maturity: "Avoid further fertilizer before harvest.",
    },

    Mustard: {
      Sowing: "Basal NPK with Sulphur support.",
      Vegetative: "Nitrogen top-dressing for healthy branching.",
      Flowering: "Balanced nutrition with Sulphur and Potash support.",
      "Grain fill": "Light Potash support for seed development.",
      Maturity: "Avoid further fertilizer before harvest.",
    },

    Tomato: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen-supported nutrition for healthy leaf growth.",
      Flowering: "Increase Potash and maintain adequate Phosphorus.",
      "Grain fill": "Potash-focused feeding to support fruit development.",
      Maturity: "Reduce fertilizer and prepare for harvesting.",
    },

    Brinjal: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen-supported nutrition for plant growth.",
      Flowering: "Increase Potash to support flowering and fruit set.",
      "Grain fill": "Potash-focused nutrition for fruit development.",
      Maturity: "Reduce fertilizer before harvesting.",
    },

    Carrot: {
      Sowing: "Well-decomposed compost with balanced Phosphorus.",
      Vegetative: "Moderate nitrogen with adequate Potash for root growth.",
      Flowering: "Maintain Potash and avoid excessive nitrogen.",
      "Grain fill": "Maintain balanced nutrition for root development.",
      Maturity: "Avoid further fertilizer before harvest.",
    },

    Cabbage: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen-rich nutrition for leaf development.",
      Flowering: "Maintain balanced NPK with additional Potash.",
      "Grain fill": "Potash support for compact head development.",
      Maturity: "Avoid excessive nitrogen before harvest.",
    },

    Cauliflower: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen-supported nutrition for leaf growth.",
      Flowering: "Balanced NPK with Potash for curd development.",
      "Grain fill": "Maintain Potash during curd formation.",
      Maturity: "Reduce fertilizer before harvest.",
    },

    Onion: {
      Sowing: "Basal compost with Phosphorus and Potash.",
      Vegetative: "Moderate nitrogen for healthy leaf development.",
      Flowering: "Increase Potash to support bulb formation.",
      "Grain fill": "Potash-focused nutrition for bulb development.",
      Maturity: "Avoid further nitrogen before harvest.",
    },

    Garlic: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Moderate nitrogen with Potash support.",
      Flowering: "Increase Potash for bulb development.",
      "Grain fill": "Maintain Potash and reduce nitrogen.",
      Maturity: "Avoid further fertilizer before harvest.",
    },

    Chilli: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Moderate nitrogen for healthy plant growth.",
      Flowering: "Increase Potash and Phosphorus for flowering.",
      "Grain fill": "Potash-focused nutrition for fruit development.",
      Maturity: "Reduce fertilizer during final harvest period.",
    },

    Cucumber: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen-supported nutrition for vine development.",
      Flowering: "Increase Potash to support flowering and fruit set.",
      "Grain fill": "Potash-focused nutrition for fruit development.",
      Maturity: "Reduce fertilizer during final harvest.",
    },

    Pumpkin: {
      Sowing: "Basal compost with balanced NPK.",
      Vegetative: "Nitrogen and Potash nutrition for vine development.",
      Flowering: "Increase Potash to support flowering and fruit set.",
      "Grain fill": "Potash-focused nutrition for fruit development.",
      Maturity: "Reduce fertilizer before final harvest.",
    },
  };

  // -------------------------
  // PEST / DISEASE WATCH
  // -------------------------

  const pests = {
    Rice: "Watch for stem borer and leaf folder.",
    Wheat: "Watch for aphids and yellow rust.",
    Potato: "Watch for late blight after rainy or humid periods.",
    Maize: "Watch for fall armyworm.",
    Mustard: "Watch for aphids on tender shoots.",

    Tomato:
      "Watch for early blight, late blight and fruit borer.",

    Brinjal:
      "Watch for shoot and fruit borer and aphids.",

    Carrot:
      "Watch for leaf spot and root damage.",

    Cabbage:
      "Watch for diamondback moth and cabbage aphids.",

    Cauliflower:
      "Watch for diamondback moth and aphids.",

    Onion:
      "Watch for thrips and purple blotch.",

    Garlic:
      "Watch for thrips and purple blotch.",

    Chilli:
      "Watch for thrips, mites and fruit rot.",

    Cucumber:
      "Watch for downy mildew and aphids.",

    Pumpkin:
      "Watch for fruit fly and powdery mildew.",
  };

  // -------------------------
  // FINAL RESPONSE
  // -------------------------

  return res.status(200).json({
    crop,
    soil,
    stage,
    irrigation,

    fertilizer:
      fertilizer[crop]?.[stage] ||
      "Use crop-stage appropriate balanced nutrition.",

    pest:
      pests[crop] ||
      "Monitor the crop regularly for pests and disease.",
  });
}
