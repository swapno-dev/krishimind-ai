export default async function handler(req, res) {
  const location = req.query.location || "Kolkata";

  const locations = {
    Kolkata: { lat: 22.5726, lon: 88.3639 },
    Delhi: { lat: 28.6139, lon: 77.2090 },
    Mumbai: { lat: 19.0760, lon: 72.8777 },
    Bengaluru: { lat: 12.9716, lon: 77.5946 },
    Chennai: { lat: 13.0827, lon: 80.2707 },
  };

  const coords = locations[location] || locations.Kolkata;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coords.lat}` +
      `&longitude=${coords.lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation` +
      `&daily=precipitation_probability_max,precipitation_sum` +
      `&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      location,
      temperature: data.current?.temperature_2m ?? null,
      humidity: data.current?.relative_humidity_2m ?? null,
      wind_speed: data.current?.wind_speed_10m ?? null,
      rainfall_mm: data.daily?.precipitation_sum?.[0] ?? 0,
      rain_probability:
        data.daily?.precipitation_probability_max?.[0] ?? 0,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch weather data",
    });
  }
}
