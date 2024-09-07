// Assigned api key to apiKey object generated from OpenWeatherMap
const apiKey = '0857bdfbf9822bcb5f4d0f481d5e160a';

// Event listener when search button is clicked
document.getElementById('searchBtn').addEventListener('click', () => {
    const location = document.getElementById('location').value.trim();  // Trim the input
    if (location !== '') {
        fetchWeather(location);
        fetchForecast(location);
    }
});

// Event listener when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Pune'; 
    fetchWeather(defaultLocation);
    fetchForecast(defaultLocation);
});

// Function to fetch weather data based on user location
async function fetchWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const weatherData = await response.json();
        if (weatherData.cod !== 200) {
            displayError('City not found');
        } else {
            displayWeather(weatherData);
        }
    } catch (error) {
        displayError('Error fetching weather');
    }
}

// Function to fetch forecast data based on user location
async function fetchForecast(location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const forecastData = await response.json();
        if (forecastData.cod !== "200") {
            displayError('City not found');
        } else {
            displayForecast(forecastData);
        }
    } catch (error) {
        displayError('Error fetching forecast');
    }
}

// Function to display current weather data
function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${new Date().toLocaleDateString()}</p>
        <div>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
            <span>${data.weather[0].main}</span>
        </div>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Function to display forecast data for next 5 days
function displayForecast(data) {
    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = ''; // Clear existing forecast data
    
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { // Only take data for every 24 hours (8 entries per day)
            const date = new Date(item.dt_txt).toLocaleDateString();
            forecastInfo.innerHTML += `
                <div class="forecast-day">
                    <div class="forecast-date-icon">
                        <p>${date}</p>
                        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                        <span>${item.weather[0].main}</span>
                    </div>
                    <div class="forecast-details">
                        <p>Temperature: ${item.main.temp} °C</p>
                        <p>Humidity: ${item.main.humidity} %</p>
                        <p>Wind Speed: ${item.wind.speed} m/s</p>
                    </div>
                </div>
                <hr>
            `;
        }
    });
}

// Function to display error messages
function displayError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    const forecastInfo = document.getElementById('forecastInfo');
    
    weatherInfo.innerHTML = `<p>${message}</p>`;
    forecastInfo.innerHTML = ''; // Clear forecast section
}
