const formCity = document.querySelector('.form-city');
const nameOfCity = document.querySelector('.name-city');
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
    const invalidCity = event.target.value;
    const regex = /[a-zA-Zà-úÀ-Ú]{3,}/;
    const isAValidCity = regex.test(invalidCity);

    if (!isAValidCity) {
        inputCity.style.color = 'red';
        return;
    };

    inputCity.style.color = 'white';
};

formCity.addEventListener('input', testCity);

const isNightInCity = (codeIcon) => {
    let body = document.querySelector('.main');

    const imgDay = "url(img/day.jpeg)";
    const imgNight = "url(img/night.jpeg)";

    codeIcon.includes('n') ? body.style.backgroundImage = imgNight : body.style.backgroundImage = imgDay;
};

const showInfo = cityData => {
    nameOfCity.innerHTML = `${cityData.nameOfCity}, ${cityData.country}`;
    temperatureOfCity.innerHTML = `${Math.round(cityData.temp)} ˚C`;
    domIcon.src = `http://openweathermap.org/img/wn/${cityData.icon}@2x.png`;
    airHumidity.innerHTML = `Umidade: ${cityData.humidity}%`;
    domClouds.innerHTML = `Nuvens: ${cityData.clouds}%`;
    domWind.innerHTML = `Vento: ${cityData.windSpeed} m/s`;
    descriptionOfClimate.innerHTML = capitalizedStr(cityData.description);
    thermalSensation.innerHTML = `Sensação Térmica: ${Math.round(cityData.thermalSensation)} ˚C`;
    temperatureMinimum.innerHTML = `Temp. Mínima: ${Math.round(cityData.maxTemp)} ˚C`;
    temperatureMaximum.innerHTML = `Tem. Máxima: ${Math.round(cityData.minTemp)} ˚C`;
};

const TOKEN_API = 'f9410f78bb373f2d1cf7c2a74a3d4b6f';

const API_URL = cityName =>
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&APPID=${TOKEN_API}`;

formCity.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        const inputValue = formCity.city.value;
        const response = await fetch(API_URL(inputValue));
        const cityData = await response.json();

        if (!response.ok) {
            invalidCityFeedback.style.display = 'block';
            return;
        }
        
        invalidCityFeedback.style.display = 'none';

        showInfo({
            nameOfCity: cityData.name,
            country: cityData.sys.country,
            temp: cityData.main.temp,
            description: cityData.weather[0].description,
            thermalSensation: cityData.main.feels_like,
            maxTemp: cityData.main.temp_max,
            minTemp: cityData.main.temp_min,
            humidity: cityData.main.humidity,
            clouds: cityData.clouds.all,
            windSpeed: cityData.wind.speed,
            icon: cityData.weather[0].icon,
        });
        
        isNightInCity(cityData.weather[0].icon);

        formCity.city.value = '';
    } catch (err) {
        console.log(err);
    };
});