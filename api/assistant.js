export default function handler(req, res) {
  const question =
    req.query.question || "How should I manage my crop?";

  const q = question.toLowerCase();

  let answer;

  if (q.includes("irrigat") || q.includes("water")) {
    answer =
      "Check soil moisture before irrigation. Avoid watering immediately before heavy rainfall and give extra attention during flowering and grain-filling stages.";
  } else if (q.includes("fertilizer") || q.includes("fertiliser")) {
    answer =
      "Fertilizer needs depend on crop and growth stage. Nitrogen is generally more important during vegetative growth, while potassium becomes particularly useful around flowering and fruit or tuber development.";
  } else if (q.includes("potato")) {
    answer =
      "For potato, monitor soil moisture carefully and watch for late blight during cool, humid or rainy conditions.";
  } else if (q.includes("rice")) {
    answer =
      "For rice, maintain appropriate field moisture and monitor for stem borer and leaf-folder activity.";
  } else {
    answer =
      "I can help with irrigation, crop nutrition, pests, weather and mandi decisions. Tell me your crop and current field condition.";
  }

  return res.status(200).json({
    question,
    answer,
  });
}
