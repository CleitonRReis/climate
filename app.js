const formCity = document.querySelector('.form-city');
const nameOfCity = document.querySelector('.name-city');
const flagIcon = document.querySelector('.flag-icon');
const descriptionOfClimate = document.querySelector('.description-name');
const temperatureOfCity = document.querySelector('.temperature h1');
const thermalSensation = document.querySelector('.thermal-sensation');
const temperatureMinimum = document.querySelector('.minimum');
const temperatureMaximum = document.querySelector('.maximum');
const airHumidity = document.querySelector('.humidity');
const domWind = document.querySelector('.wind');
const domClouds = document.querySelector('.clouds');
const domIcon = document.querySelector('.icon-png');
const inputCity = document.querySelector('.input-city');
const invalidCityFeedback = document.querySelector('.invalid-city');

const capitalizedStr = str => str.charAt(0).toUpperCase() + str.substr(1);

const testCity = event => {
    const city = event.target.value;
    const regex = /[a-zA-Zà-úÀ-Ú]{3,}/;
    const isAValidCity = regex.test(city);

    if (!isAValidCity) {
        inputCity.style.color = 'red';
        return;
    };

    inputCity.style.color = 'white';
};

const isNightInCity = codeIcon => {
    const main = document.querySelector('.main');
    const imgDay = "url(img/day.jpeg)";
    const imgNight = "url(img/night.jpeg)";

    main.style.backgroundImage = codeIcon.includes('n') ? imgNight : imgDay;
};

const showWeatherInfo = city => {
    nameOfCity.innerHTML = `${city.name}, ${city.country}`;
    temperatureOfCity.innerHTML = `${Math.round(city.temp)} ˚C`;
    domIcon.src = `https://openweathermap.org/img/wn/${city.icon}@2x.png`;
    airHumidity.innerHTML = `Umidade: ${city.humidity}%`;
    domClouds.innerHTML = `Nuvens: ${city.clouds}%`;
    domWind.innerHTML = `Vento: ${city.windSpeed} m/s`;
    descriptionOfClimate.innerHTML = capitalizedStr(city.description);
    thermalSensation.innerHTML = `Sensação Térmica: ${Math.round(city.thermalSensation)} ˚C`;
    temperatureMinimum.innerHTML = `Temp. Mínima: ${Math.round(city.maxTemp)} ˚C`;
    temperatureMaximum.innerHTML = `Temp. Máxima: ${Math.round(city.minTemp)} ˚C`;
    
    flagIcon.setAttribute('class', `flag-icon flag-icon-${city.country.toLowerCase()}`);
};

const TOKEN_API = 'f9410f78bb373f2d1cf7c2a74a3d4b6f';

const API_URL = cityName =>
`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&APPID=${TOKEN_API}`;

formCity.addEventListener('submit', async event => {
    event.preventDefault();
    
    try {
        const inputValue = formCity.city.value;
        const response = await fetch(API_URL(inputValue));
        const city = await response.json();
        
        if (!response.ok) {
            invalidCityFeedback.style.display = 'flex';
            return; 
        };
        
        invalidCityFeedback.style.display = 'none';
        
        const infoDataCity = {
            name: city.name,
            country: city.sys.country,
            temp: city.main.temp,
            description: city.weather[0].description,
            thermalSensation: city.main.feels_like,
            maxTemp: city.main.temp_max,
            minTemp: city.main.temp_min,
            humidity: city.main.humidity,
            clouds: city.clouds.all,
            windSpeed: city.wind.speed,
            icon: city.weather[0].icon,
        };

        localStorage.setItem('infoDataCityInLocalStorage', JSON.stringify(infoDataCity));

        showWeatherInfo(infoDataCity);
        isNightInCity(city.weather[0].icon);

    formCity.city.value = '';
    } catch (err) {
        console.log(err);
    };
});

const getDataInLocalStorage = () => {
    const infoDataCity = JSON.parse(localStorage.getItem('infoDataCityInLocalStorage'));
    
    if (infoDataCity) {
        showWeatherInfo(infoDataCity);
        isNightInCity(infoDataCity.icon);
    };
};

getDataInLocalStorage();
formCity.addEventListener('input', testCity);