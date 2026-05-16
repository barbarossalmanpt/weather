# 🌤️ Weather & Outfit App

A bold, modern weather app that tells you what to wear. Enter any city, get a live forecast, and receive a hardcoded outfit suggestion — all wrapped in a dynamic animated UI that reacts to the weather.

---

## Features

- **Location search & validation** — searches via Open-Meteo geocoding API and confirms the matched place before fetching data
- **Live forecast** — current conditions plus a 7-day daily forecast (temperature, wind, precipitation, weather code)
- **Outfit suggestions** — hardcoded outfit cards based on temperature range and weather conditions (rain, wind, sun)
- **Animated background** — reacts to weather: rain particles, drifting clouds, sunny glow, snow, storm flash
- **Responsive layout** — single column on mobile, two-column on desktop

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework, no backend)
- **Weather API:** [Open-Meteo](https://open-meteo.com/) — free, no API key required
- **Geocoding API:** Open-Meteo Geocoding — `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API:** `https://api.open-meteo.com/v1/forecast`

---

## How It Works

### Step 1 — Location Input
The user types a city or place name. The app calls the geocoding API and returns the best match. The user confirms ("Did you mean Lisbon, Portugal?") before any forecast is fetched.

### Step 2 — Forecast
On confirmation, the app fetches:
- `current`: temperature, weather code, wind speed, precipitation
- `daily`: max/min temperature, weather code, precipitation sum (7 days)
- `timezone=auto` so times are local to the searched location

### Step 3 — Outfit Suggestion
The outfit is chosen from a hardcoded map based on two axes:

**Temperature (base outfit):**
| Range | Outfit |
|---|---|
| Below 5°C | Heavy coat, scarf, gloves, boots |
| 5–12°C | Jacket, jeans, closed shoes |
| 12–18°C | Light jacket or hoodie, jeans/chinos |
| 18–24°C | T-shirt, light trousers or jeans |
| Above 24°C | T-shirt, shorts, sunglasses, sunscreen |

**Weather code modifiers:**
| Condition | Modifier |
|---|---|
| Rain / drizzle | + Umbrella, waterproof shoes |
| Wind > 40 km/h | + Windbreaker |
| Sunny + above 24°C | + Hat/cap |

---

## Design System

| Token | Value |
|---|---|
| Background | `#0A1628` |
| Card surface | `#1A2E4A` |
| Accent (teal) | `#00C2C7` |
| Accent (sky) | `#4A9FD4` |
| Text primary | `#FFFFFF` |
| Text secondary | `#8BA3BE` |
| Border radius | `0px` (sharp geometric) |
| Font | Inter — ExtraBold for display, Regular for body |

---

## Getting Started

1. Clone or download the project
2. Open `index.html` in your browser — no build step, no dependencies
3. Type a city and hit enter

---

## Project Structure

```
/
├── index.html          # App entry point
├── style.css           # All styles and animations
├── app.js              # App logic: geocoding, forecast, outfit mapping
├── outfits.js          # Hardcoded outfit data
├── animations.js       # Weather background animations (canvas)
├── README.md
└── AGENTS.md
```

---

## API Reference

**Geocoding**
```
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

**Forecast**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,weather_code,wind_speed_10m,precipitation
  &daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum
  &timezone=auto
```

---

## License

MIT
