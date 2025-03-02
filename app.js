// app.js

document.getElementById("weatherForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = document.getElementById("city").value;
  const weatherResult = document.getElementById("weatherResult");
  const temperatureElement = document.getElementById("temperature");
  const feelsLikeElement = document.getElementById("feelsLike");
  const recommendationElement = document.getElementById("recommendation");
  const emojiElement = document.getElementById("emoji");
  const cityNameElement = document.getElementById("cityName");
  const loadingElement = document.getElementById("loading");

  // Show the loader
  loadingElement.style.display = "flex";
  weatherResult.style.display = "none";

  try {
    // Fetch weather data
    const response = await fetch("https://backendclimaai.onrender.com/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch weather information: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Weather data:", data); // Debugging

    // Store the original data
    const temperature = data.data.temperature;
    const feelsLike = data.data.feelsLike;
    const recommendation = data.data.recommendation;
    const emoji = data.data.emoji;

    // Update the UI with the data
    cityNameElement.textContent = city;
    temperatureElement.textContent = `${temperature}°C`;
    feelsLikeElement.textContent = `Feels Like: ${feelsLike}°C`;
    recommendationElement.textContent = recommendation;
    emojiElement.textContent = emoji;

    // Hide the loader and show the results
    loadingElement.style.display = "none";
    weatherResult.style.display = "block";
  } catch (error) {
    console.error("Error fetching weather information:", error);
    alert(`Error fetching weather information: ${error.message}`);
    loadingElement.style.display = "none";
  }
});

// Función para calcular la sensación térmica (índice de calor)
function calculateHeatIndex(temperature, humidity) {
  const tempF = (temperature * 9) / 5 + 32;
  let heatIndex = 0.5 * (tempF + 61.0 + (tempF - 68.0) * 1.2 + humidity * 0.094);

  if (tempF >= 80) {
    heatIndex =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * humidity -
      0.22475541 * tempF * humidity -
      6.83783 * 10 ** -3 * tempF ** 2 -
      5.481717 * 10 ** -2 * humidity ** 2 +
      1.22874 * 10 ** -3 * tempF ** 2 * humidity +
      8.5282 * 10 ** -4 * tempF * humidity ** 2 -
      1.99 * 10 ** -6 * tempF ** 2 * humidity ** 2;
  }

  return Math.round(((heatIndex - 32) * 5) / 9);
}

// Función para traducir texto
async function translateText(text, fromLang, toLang) {
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.append("q", text);
    url.searchParams.append("langpair", `${fromLang}|${toLang}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to translate text");
    }

    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // En caso de error, devolver el texto original
  }
}
