import "@babel/polyfill";

const key = 'GibGlOhUwzzfJAN3vakF3T0SSu1tlnkt';
const form = document.querySelector('form');
const now = document.querySelector('.now');
const icon = document.querySelector('.icon');
const temp = document.querySelector('.temp');

const displayUI = (obj) => {
  icon.innerHTML = `<img src="icons/${obj.WeatherIcon}.svg" alt="${obj.WeatherText}">`;
  temp.textContent = `${obj.Temperature.Metric.Value}℃`;
}

const getForecast = async (code) =>{
  const base = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  const query = `${code}?apikey=${key}`;

  const response = await fetch(base+query);
  const data = await response.json();

  console.log(data.DailyForecasts);
  return data.DailyForecasts;
}

//use location code to fetch conditions
const getWeather = async (code) => {
  const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${code}?apikey=${key}`;

  const response = await fetch(base+query);
  const data = await response.json();

  return data[0];
};

const getCity = async (city) => {
  const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  const query = `?apikey=${key}&q=${city}`;

  const response = await fetch(base + query);
  const data = await response.json();

  // return city code;
  return data[0];

};

const getCityInfo = async (city) => {
  getCity(city)
  .then( city =>{
    return getWeather(city.Key);
  })
  .then( info => {
    console.log(info);
    displayUI(info);
  });
};

form.addEventListener('submit', (e) => {
  // do not refresh
  e.preventDefault();
  // get the value from input
  const city = form.city.value.trim();
  // get city info
  getCityInfo(city);
});
