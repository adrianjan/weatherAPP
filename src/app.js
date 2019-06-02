import "@babel/polyfill";

const key = 'ndKZ5fzpUFg4VLFsL6BEALORGCUKaAdq';
const form = document.querySelector('form');
const now = document.querySelector('.now');
const icon = document.querySelector('.icon');
const temp = document.querySelector('.temp');
const forecast = document.querySelector('.forecast');
const wrap = document.querySelector('.wrap');

const displayArr = async (arr) =>{
  let html = '';
    arr.forEach( item =>{
      let itemDate = new Date(item.Date);
      let day = itemDate.getDate();
      if(day < 10){
        day = '0' + day;
      }
      let mon = itemDate.getMonth()+1;
      if(mon < 10){
        mon = '0' + mon;
      }
      let year = itemDate.getFullYear();
      let date = `${day}/${mon}/${year}`;
      let dayName = itemDate.toString().split(' ')[0];
      html += `
      <!-- One day info  -->
      <div class="item">
        <div class="info text-center">
          <div class="date">${date}</div>
          <div class="days-name">${dayName}</div>
        </div>
        <div class="day text-center">
          <div class="icon"><img src="icons/${item.Day.Icon}.svg" alt=""></div>
        </div>
        <div class="night text-center">
          <div class="icon"><img src="icons/${item.Night.Icon}.svg" alt=""></div>
        </div>
      </div>
      <!-- End One day info  -->
      `;
    });
    wrap.innerHTML = html;
};

const displayUI = (obj) => {
  icon.innerHTML = `<img src="icons/${obj.WeatherIcon}.svg" alt="${obj.WeatherText}">`;
  temp.textContent = `${obj.Temperature.Metric.Value}℃`;
}

const getForecast = async (code) => {
  const base = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  const query = `${code}?apikey=${key}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data.DailyForecasts;
}

//use location code to fetch conditions
const getWeather = async (code) => {
  const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${code}?apikey=${key}`;

  const response = await fetch(base + query);
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
    .then(city => {
      getForecast(city.Key).then( arr => {
        displayArr(arr);
      });
      return getWeather(city.Key);
    })
    .then(info => {
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
  forecast.style.display = 'block';
});
