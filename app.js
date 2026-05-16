const els = {
    input: document.getElementById('city-input'),
    error: document.getElementById('search-error'),
    loading: document.getElementById('loading-indicator'),
    dialog: document.getElementById('confirmation-dialog'),
    confirmText: document.getElementById('confirmed-location-name'),
    btnConfirm: document.getElementById('btn-confirm'),
    btnCancel: document.getElementById('btn-cancel'),
    mainContent: document.getElementById('main-content'),
    currentCity: document.getElementById('current-city'),
    currentTemp: document.getElementById('current-temp'),
    currentDesc: document.getElementById('current-desc'),
    currentWind: document.getElementById('current-wind'),
    currentPrecip: document.getElementById('current-precip'),
    forecastList: document.getElementById('forecast-list'),
    outfitIllustration: document.getElementById('outfit-illustration'),
    outfitLabel: document.getElementById('outfit-label'),
    outfitItems: document.getElementById('outfit-items'),
    styleSelect: document.getElementById('style-select'),
    occasionPills: document.getElementById('occasion-pills')
};

let currentCoordinates = null;
let currentWeatherData = null;
let currentStyle = localStorage.getItem('wearther_style') || 'minimalist';
let currentOccasion = localStorage.getItem('wearther_occasion') || 'everyday';

// Initialize UI state
els.styleSelect.value = currentStyle;
const initActivePill = els.occasionPills.querySelector(`[data-occasion="${currentOccasion}"]`);
if (initActivePill) {
    els.occasionPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    initActivePill.classList.add('active');
}

// Helper to map weather codes to text
function getWeatherDescription(code) {
    const map = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        66: 'Light freezing rain', 67: 'Heavy freezing rain',
        71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        85: 'Slight snow showers', 86: 'Heavy snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return map[code] || 'Unknown';
}

function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Event Listeners
els.styleSelect.addEventListener('change', (e) => {
    currentStyle = e.target.value;
    localStorage.setItem('wearther_style', currentStyle);
    if (currentWeatherData) renderOutfitOnly();
});

els.occasionPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
        els.occasionPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        currentOccasion = e.target.getAttribute('data-occasion');
        localStorage.setItem('wearther_occasion', currentOccasion);
        if (currentWeatherData) renderOutfitOnly();
    }
});

els.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = els.input.value.trim();
        if (city) searchCity(city);
    }
});

els.btnConfirm.addEventListener('click', () => {
    if (currentCoordinates) {
        els.dialog.classList.add('hidden');
        els.input.disabled = true;
        fetchForecast(currentCoordinates);
    }
});

els.btnCancel.addEventListener('click', () => {
    els.dialog.classList.add('hidden');
    els.input.value = '';
    els.input.disabled = false;
    els.input.focus();
    currentCoordinates = null;
});

// Geocoding API Call
async function searchCity(city) {
    hideError();
    hideDialog();
    els.mainContent.classList.add('hidden');
    
    // Default background if re-searching
    if (window.startAnimation) window.startAnimation(-1); 

    els.loading.classList.remove('hidden');
    els.input.disabled = true;

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        if (!res.ok) throw new Error('Network error fetching location');
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            showError(`No results found for "${city}".`);
            els.input.disabled = false;
            els.input.focus();
        } else {
            const bestMatch = data.results[0];
            currentCoordinates = {
                lat: bestMatch.latitude,
                lon: bestMatch.longitude,
                name: bestMatch.name,
                country: bestMatch.country || ''
            };
            
            const locationString = currentCoordinates.country 
                ? `${currentCoordinates.name}, ${currentCoordinates.country}`
                : currentCoordinates.name;
                
            els.confirmText.textContent = locationString;
            els.dialog.classList.remove('hidden');
            els.btnConfirm.focus(); // for keyboard nav
        }
    } catch (err) {
        showError('Failed to search city. Please check your connection.');
        els.input.disabled = false;
    } finally {
        els.loading.classList.add('hidden');
    }
}

// Forecast API Call
async function fetchForecast(coords) {
    els.loading.classList.remove('hidden');
    els.input.disabled = true;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network error fetching forecast');
        const data = await res.json();
        renderWeather(data, coords);
        els.input.value = ''; // clear input after successful render
    } catch (err) {
        showError('Failed to fetch forecast. Please try again.');
    } finally {
        els.loading.classList.add('hidden');
        els.input.disabled = false;
    }
}

// Render Data
function renderWeather(data, coords) {
    currentWeatherData = data;
    const cur = data.current;
    const daily = data.daily;
    
    // Update Animations
    if (window.startAnimation) window.startAnimation(cur.weather_code);

    // Render Current Weather
    const locationString = coords.country ? `${coords.name}, ${coords.country}` : coords.name;
    els.currentCity.textContent = locationString;
    els.currentTemp.textContent = `${Math.round(cur.temperature_2m)}°C`;
    els.currentDesc.textContent = getWeatherDescription(cur.weather_code);
    els.currentWind.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
    els.currentPrecip.textContent = `${cur.precipitation} mm`;

    // Render Forecast
    els.forecastList.innerHTML = '';
    // Show next 7 days, starting from today
    for (let i = 0; i < 7; i++) {
        if (!daily.time[i]) break;
        
        const isToday = i === 0;
        const dayName = isToday ? 'Today' : getDayName(daily.time[i]);
        
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="forecast-desc">${getWeatherDescription(daily.weather_code[i])}</div>
            <div class="forecast-temps">
                <span class="max">${Math.round(daily.temperature_2m_max[i])}°</span>
                <span class="min">${Math.round(daily.temperature_2m_min[i])}°</span>
            </div>
        `;
        els.forecastList.appendChild(item);
    }

    // Render Outfit
    renderOutfitOnly();

    els.mainContent.classList.remove('hidden');
}

function renderOutfitOnly() {
    if (!currentWeatherData) return;
    const cur = currentWeatherData.current;

    if (window.getOutfit) {
        const outfit = window.getOutfit(cur.temperature_2m, cur.weather_code, cur.wind_speed_10m, currentStyle, currentOccasion);
        els.outfitIllustration.textContent = outfit.illustration;
        els.outfitLabel.textContent = outfit.label;
        
        els.outfitItems.innerHTML = '';
        outfit.items.forEach(itemText => {
            // Split the emoji from the text
            const parts = itemText.split(' ');
            const emoji = parts[0];
            const text = parts.slice(1).join(' ');
            
            const li = document.createElement('li');
            li.innerHTML = `<span class="item-emoji">${emoji}</span><span class="item-text">${text}</span>`;
            els.outfitItems.appendChild(li);
        });
    }
}

// UI Helpers
function showError(msg) {
    els.error.textContent = msg;
    els.error.classList.remove('hidden');
}

function hideError() {
    els.error.textContent = '';
    els.error.classList.add('hidden');
}

function hideDialog() {
    els.dialog.classList.add('hidden');
}

// Initial state
if (window.startAnimation) window.startAnimation(-1); // start clear default background
els.input.focus();
