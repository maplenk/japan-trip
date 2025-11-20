
// Service to fetch weather data from Open-Meteo
// Docs: https://open-meteo.com/

export const fetchWeather = async (lat, lon, dateStr) => {
    try {
        const targetDate = new Date(dateStr);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If date is within next 14 days, fetch forecast
        if (diffDays >= 0 && diffDays <= 14) {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.daily && data.daily.time.length > 0) {
                const max = Math.round(data.daily.temperature_2m_max[0]);
                const min = Math.round(data.daily.temperature_2m_min[0]);
                const code = data.daily.weather_code[0];
                const icon = getWeatherIcon(code);
                return `${icon} ${max}°C / ${min}°C`;
            }
        }
        // If date is far in future or past, fetch historical data from previous year as estimate
        else {
            // Use previous year for estimation if in future
            let queryDate = new Date(targetDate);
            if (diffDays > 14) {
                queryDate.setFullYear(queryDate.getFullYear() - 1);
            }
            const qDateStr = queryDate.toISOString().split('T')[0];

            const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${qDateStr}&end_date=${qDateStr}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.daily && data.daily.time.length > 0) {
                const max = Math.round(data.daily.temperature_2m_max[0]);
                const min = Math.round(data.daily.temperature_2m_min[0]);
                const code = data.daily.weather_code[0];
                const icon = getWeatherIcon(code);
                return `${icon} Typical: ${max}°C / ${min}°C`;
            }
        }

        return 'N/A';
    } catch (error) {
        console.error("Weather fetch error:", error);
        return 'Error';
    }
};

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'; // Clear sky
    if (code === 1 || code === 2 || code === 3) return '⛅'; // Mainly clear, partly cloudy, and overcast
    if (code === 45 || code === 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 55) return '🌧️'; // Drizzle
    if (code >= 61 && code <= 65) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
    if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
    if (code >= 95) return '⛈️'; // Thunderstorm
    return '🌡️';
};
