import "@babel/polyfill";
import './styles.scss';

const key = 'jim0YYKnAB9e1mumuHbONARbU73qNpiB';
const form = document.querySelector('form');
const now = document.querySelector('.current');
const current = document.querySelector('#current');
const wText = document.querySelector('.details__weather');
const icon = document.querySelector('.details__icon');
const temp = document.querySelector('.details__temp');
const details = document.querySelector('.details');
const wrap = document.querySelector('.day-wrapper');
const time = document.querySelector('.header__time');
const distanceToTop = current.getBoundingClientRect().top;
const left = document.querySelector('.cannotLeft');
const right = document.querySelector('.cannotRight');

const timer = () => {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (m < 10) {
    m = '0' + m;
  }
  time.textContent = `${h}:${m}`;
};

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
        <div class="item__info">
          <div class="info__day-name">${dayName}</div>
          <div class="info__date">${date}</div>
        </div>
        <div class="item__day">
          <figure><img src="icons/${item.Day.Icon}.svg" alt=""></figure>
        </div>
        <p class="item__phase">${item.Day.IconPhrase}</p>
        <div class="item__night">
          <figure><img src="icons/${item.Night.Icon}.svg" alt=""></figure>
        </div>
        <p class="item__phase">${item.Night.IconPhrase}</p>
      </div>
      <!-- End One day info  -->
      `;
    console.log(item);
  });
  wrap.innerHTML = html;
  wrap.classList.add('visible');
};

const displayUI = (obj) => {
  icon.innerHTML = `<img src="icons/${obj.WeatherIcon}.svg" class="icon__img" alt="${obj.WeatherText}">`;
  temp.textContent = `${obj.Temperature.Metric.Value}℃`;
  wText.textContent = `${obj.WeatherText}`;
};

const getForecast = async (code) => {
  const base = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  const query = `${code}?apikey=${key}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data.DailyForecasts;
};

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

const scrollDown = () => {
  window.scrollTo({
    top: distanceToTop,
    left: 0,
    behavior: 'smooth'
  });
};

const swipeLeft = (change) => {
  if (i >= 0) {
    // dayWrapper.style.transform = `translateX(0%)`;
    console.log('Cannot swipe left');
    left.classList.add('showLeft');
  } else {
    dayWrapper.style.transform = `translateX(${i+=20}%)`;
    left.classList.remove('showLeft');
    right.classList.remove('showRight');
  }
};

const swipeRight = (change) => {
  if (i <= -80) {
    dayWrapper.style.transform = `translateX(-80%)`;
    console.log('Cannot swipe right');
    right.classList.add('showRight');
  } else {
    dayWrapper.style.transform = `translateX(${i-=20}%)`;
    right.classList.remove('showRight');
    left.classList.remove('showLeft');
  }
};

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

// swipe

const forecast = document.querySelector('.forecast');
const dayWrapper = document.querySelector('.day-wrapper');
let startX;
let x = 0;
let i = 0;
let translateX = 0;
let moveX = 0;

const touchStart = (e) => {
  e.preventDefault();
  startX = e.touches[0].clientX;
};

const touchMove = (e) => {
  e.preventDefault();
  moveX = e.touches[0].clientX;
  let change = startX - moveX;
  let xPer = (Math.round((change / screen.width) * 100) / 5);
};

const touchEnd = (e) => {
  let change = Math.round((e.changedTouches[0].clientX - startX));
  let xPer = Math.round(((change / screen.width) * 100) / 5);
  let direction = startX - moveX;
  x += xPer;
  if (direction < 0) {
    //i+=20
    swipeLeft(change);
    console.log('Swiped left');
  } else {
    //i-=20
    swipeRight(change);
    console.log('Swiped right');
  }
  translateX = dayWrapper.style.cssText;
  if (translateX.length == 28) {
    i = parseInt(translateX.substring(22, 25), 10);
  } else if (translateX.length == 26) {
    i = parseInt(translateX.substring(22, 23), 10);
  }
  console.log('Index: ', i);
};

if (screen.width <= 800) {
  forecast.addEventListener('touchstart', touchStart);
  forecast.addEventListener('touchmove', touchMove);
  forecast.addEventListener('touchend', touchEnd);
}
