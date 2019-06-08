import "@babel/polyfill";
import './styles.scss';

const key = 'v7yfvnNLq6vW75O8fYXUg38xE2hYFvWG';
const form = document.querySelector('form');
const now = document.querySelector('.current');
const current = document.querySelector('#current');
const wText = document.querySelector('.weather');
const icon = document.querySelector('.icon');
const temp = document.querySelector('.temp');
const details = document.querySelector('.details');
const wrap = document.querySelector('.day-wrapper');
const time = document.querySelector('.time');

const distanceToTop = current.getBoundingClientRect().top;

const timer = () => {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (m < 10) {
    m = '0' + m;
  }
  time.textContent = `${h}:${m}`;
}

const displayArr = async (arr) => {
  let html = '';
  arr.forEach(item => {
    let itemDate = new Date(item.Date);
    let day = itemDate.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let mon = itemDate.getMonth() + 1;
    if (mon < 10) {
      mon = '0' + mon;
    }
    let year = itemDate.getFullYear();
    let date = `${day}/${mon}/${year}`;
    let dayName = itemDate.toString().split(' ')[0];
    html += `
      <!-- One day info  -->
      <div class="item">
        <div class="info">
          <div class="day-name">${dayName}</div>
          <div class="date">${date}</div>
        </div>
        <div class="day text-center">
          <div class="icon"><img src="icons/${item.Day.Icon}.svg" alt=""></div>
        </div>
        <p class="phase first">${item.Day.IconPhrase}</p>
        <div class="night">
          <div class="icon"><img src="icons/${item.Night.Icon}.svg" alt=""></div>
        </div>
        <p class="phase">${item.Night.IconPhrase}</p>
      </div>
      <!-- End One day info  -->
      `;
    console.log(item);
  });
  wrap.innerHTML = html;
  wrap.classList.add('visible');
};

const displayUI = (obj) => {
  icon.innerHTML = `<img src="icons/${obj.WeatherIcon}.svg" alt="${obj.WeatherText}">`;
  temp.textContent = `${obj.Temperature.Metric.Value}℃`;
  wText.textContent = `${obj.WeatherText}`;
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
      getForecast(city.Key).then(arr => {
        displayArr(arr);
      });
      return getWeather(city.Key);
    })
    .then(info => {
      displayUI(info);
    });
};

const hideKeyboard = () => {
  document.activeElement.blur();
  const inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].blur();
  }
};

const scrollDown = () =>{
  window.scrollTo({
    top: distanceToTop,
    left: 0,
    behavior: 'smooth'
  });
}

form.addEventListener('submit', (e) => {
  // do not refresh
  e.preventDefault();
  // get the value from input
  const city = form.city.value.trim();
  // get city info
  getCityInfo(city);
  scrollDown();
  hideKeyboard();
});

setInterval(timer, 1000);

console.log('Working');
