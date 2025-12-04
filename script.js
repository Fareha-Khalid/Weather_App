const API_KEY = "api_key";
const units = "metric";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const resultCard = document.getElementById("resultCard");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const metaEl = document.getElementById("meta");
const iconEl = document.getElementById("weatherIcon");
const errorBox = document.getElementById("errorBox");
const body = document.body;

// Error handling
function showError(msg){
  errorBox.style.display="block";
  errorBox.textContent=msg;
  resultCard.style.display="none";
  cityInput.classList.add("shake");
  setTimeout(()=> cityInput.classList.remove("shake"),500);
}

function clearError(){
  errorBox.style.display="none";
}

// Background images
function setBackground(condition){
  const map={
    Clear:"https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg",
    Clouds:"https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg",
    Rain:"https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg",
    Drizzle:"https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg",
    Thunderstorm:"https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg",
    Snow:"https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg",
    Mist:"https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg",
    Haze:"https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    Smoke:"https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    Dust:"https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    Fog:"https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg"
  };
  body.style.backgroundImage = `url('${map[condition] || map["Clear"]}')`;
}

// Emoji mapping
function mapWeatherToEmoji(main){
  const m={
    Clear:"☀️", Clouds:"☁️", Rain:"🌧️", Drizzle:"🌦️",
    Thunderstorm:"⛈️", Snow:"❄️", Mist:"🌫️", Haze:"🌫️",
    Smoke:"🌫️", Fog:"🌫️"
  };
  const emoji = m[main] || "🌤️";
  iconEl.textContent = emoji;
  iconEl.style.animation="bounce 1s";
}

// Fetch by city
async function fetchWeatherByCity(city){
  try{
    clearError();
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;
    const res = await fetch(url);
    if(!res.ok){
      if(res.status===404) throw new Error("City not found!");
      throw new Error("Failed to fetch weather!");
    }
    const data = await res.json();
    showWeather(data);
  }catch(err){
    showError(err.message);
  }
}

// Fetch by geolocation
async function fetchWeatherByCoords(lat, lon){
  try{
    clearError();
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
    const res = await fetch(url);
    const data = await res.json();
    showWeather(data);
  }catch(err){
    showError("Could not fetch weather from location.");
  }
}

// Display
function showWeather(data){
  const main = data.weather[0].main;
  const desc = data.weather[0].description;
  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  tempEl.textContent = `${temp} °C — ${data.name}, ${data.sys.country}`;
  descEl.textContent = desc[0].toUpperCase() + desc.slice(1);
  metaEl.textContent = `Humidity: ${humidity}% | Wind: ${wind} m/s`;

  mapWeatherToEmoji(main);
  setBackground(main);
  resultCard.style.display="flex";
}

// Events
searchBtn.addEventListener("click", ()=> {
  const city=cityInput.value.trim();
  if(!city) return showError("Please enter a city name!");
  fetchWeatherByCity(city);
});

cityInput.addEventListener("keydown",(e)=>{
  if(e.key==="Enter") searchBtn.click();
});

geoBtn.addEventListener("click",()=>{
  cityInput.value = ""; // 🔥 Clear input box when using location

  if(!navigator.geolocation) return showError("Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(
    pos=> fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    ()=> showError("Location permission denied.")
  );
});


