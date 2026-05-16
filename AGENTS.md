# AGENTS.md

Instructions for AI agents (Google Antigravity) working on this project.
Read this file before touching any code.

---

## Project Summary

This is a client-side weather and outfit suggestion app. No backend, no build tool, no framework. Pure HTML, CSS, and JavaScript. It calls two external APIs (both free, no key required) and renders everything in the browser.

---

## Stack & Constraints

- **No frameworks.** Vanilla JS only. Do not introduce React, Vue, or any npm packages.
- **No backend.** All logic runs in the browser. Do not create a server, proxy, or serverless function.
- **No API key.** Open-Meteo requires no authentication. Do not add any auth headers or `.env` files.
- **No build step.** The app must run by opening `index.html` directly in a browser.

---

## File Responsibilities

| File | Purpose |
|---|---|
| `index.html` | Structure only. No inline scripts or styles. |
| `style.css` | All visual styles and CSS animations. |
| `app.js` | Core logic: input handling, API calls, rendering forecast, triggering outfit logic. |
| `outfits.js` | Hardcoded outfit data only. No API calls here. Export a single `getOutfit(tempC, weatherCode, windKmh)` function. |
| `animations.js` | Canvas-based weather background animations only. Export a single `startAnimation(weatherCode)` function. |

Keep files focused. Do not mix concerns across files.

---

## API Usage

### Geocoding
```
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```
- Use `results[0]` for the best match
- Required fields: `name`, `country`, `latitude`, `longitude`
- If `results` is empty or missing, show an inline error — do not throw

### Forecast
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,weather_code,wind_speed_10m,precipitation
  &daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum
  &timezone=auto
```
- Always include `timezone=auto`
- Never hardcode coordinates
- Handle network errors gracefully with a user-facing message

---

## Outfit Logic

The `getOutfit()` function in `outfits.js` must follow this exact logic — do not change the thresholds without being asked:

**Base outfit from temperature:**
- `< 5°C` → Heavy coat, scarf, gloves, boots
- `5–12°C` → Jacket, jeans, closed shoes
- `12–18°C` → Light jacket or hoodie, jeans/chinos
- `18–24°C` → T-shirt, light trousers or jeans
- `> 24°C` → T-shirt, shorts, sunglasses, sunscreen

**Modifiers (add on top of base):**
- Weather code `51–67` or `80–82` (rain/drizzle/showers) → add umbrella + waterproof shoes
- Wind speed `> 40 km/h` → add windbreaker
- Weather code `0–1` (clear) and temp `> 24°C` → add hat/cap

Return an object with: `label` (e.g. "LAYER UP"), `items` (array of strings with emoji), and `illustration` (a keyword string like `"rain"`, `"hot"`, `"cold"` for the card to render the right illustration placeholder).

---

## Animations

The `startAnimation(weatherCode)` function in `animations.js` must:
- Target a `<canvas id="bg-canvas">` element that sits behind all UI (z-index: -1)
- Clear and restart when called again (e.g. user searches a new city)
- Map weather codes to animations:

| Weather codes | Animation |
|---|---|
| `0–1` (clear) | Slow radial teal glow pulse |
| `2–3` (cloudy) | Drifting semi-transparent cloud rectangles |
| `51–67`, `80–82` (rain) | Falling thin rain lines, randomised speed |
| `71–77` (snow) | Slow falling white dots |
| `95–99` (storm) | Rain lines + occasional white flash |

- Keep animation opacity at ~35% so cards remain readable
- Use `requestAnimationFrame` — no `setInterval`

---

## Design Rules

Do not deviate from these without being asked:

- **Colours:** background `#0A1628`, cards `#1A2E4A`, accent `#00C2C7`, text `#FFFFFF`, secondary text `#8BA3BE`
- **Font:** Inter (load from Google Fonts). ExtraBold (900) for display/temperature. Regular (400) for body.
- **Border radius:** `0px` everywhere — sharp geometric edges only
- **Cards:** `1px solid rgba(0, 194, 199, 0.2)` border. `backdrop-filter: blur(8px)`.
- **Layout:** single column on mobile (`< 768px`), two-column on desktop (weather left, forecast + outfit right), max-width `1200px` centred.

---

## Behaviour Rules

- The forecast must not load until the user explicitly confirms the geocoded location
- Show a loading state during API calls (disable input, show a spinner or pulsing text)
- All errors must be shown inline near the relevant UI element — no `alert()` or `console.error()` only
- The app must work with keyboard navigation (Enter to search, Enter to confirm)
- Temperature must display in Celsius by default

---

## What NOT to Do

- Do not add a framework or library without being asked
- Do not add a backend, proxy, or `.env` file
- Do not hardcode any city, coordinate, or test data into the production files
- Do not use `alert()`, `confirm()`, or `prompt()`
- Do not break the single-file constraint — `index.html` must remain the only entry point
- Do not add tracking, analytics, or third-party scripts
