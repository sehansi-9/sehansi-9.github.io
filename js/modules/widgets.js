async function loadWeather() {
    const latitude = 6.9271;
    const longitude = 79.8612;

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
        `&temperature_unit=celsius` +
        `&wind_speed_unit=kmh` +
        `&timezone=Asia%2FColombo`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();
        const weather = data.current;

        const temperature = Math.round(weather.temperature_2m);
        const humidity = Math.round(weather.relative_humidity_2m);
        const wind = Math.round(weather.wind_speed_10m);
        const weatherCode = weather.weather_code;
        const isDay = weather.is_day === 1;

        const weatherInfo = getWeatherInfo(weatherCode, isDay);

        const mainEl = document.getElementById("weatherMain");
        const detailsEl = document.getElementById("weatherDetails");
        const atmosEl = document.getElementById("weatherAtmosphere");

        if (mainEl) mainEl.textContent = `${temperature}°C · ${weatherInfo.description}`;
        if (detailsEl) {
            detailsEl.innerHTML = `<span class="w-stat">💧 Humidity: ${humidity}%</span><span class="w-stat">💨 Wind: ${wind} km/h</span>`;
        }
        if (atmosEl) atmosEl.textContent = `${weatherInfo.atmosphere}`;

        const weatherImage = document.getElementById("weatherImage");
        const weatherEmoji = document.getElementById("weatherEmoji");

        if (weatherImage && weatherEmoji) {
            if (weatherInfo.image) {
                weatherImage.onload = function () {
                    weatherImage.style.display = "block";
                    weatherEmoji.style.display = "none";
                };

                weatherImage.onerror = function () {
                    weatherImage.style.display = "none";
                    weatherEmoji.style.display = "flex";
                    weatherEmoji.textContent = weatherInfo.emoji;
                };

                weatherImage.src = weatherInfo.image;
                weatherImage.alt = weatherInfo.description;
            } else {
                weatherImage.style.display = "none";
                weatherEmoji.style.display = "flex";
                weatherEmoji.textContent = weatherInfo.emoji;
            }
        }

    } catch (error) {
        console.error("Weather error:", error);
        const mainEl = document.getElementById("weatherMain");
        const detailsEl = document.getElementById("weatherDetails");
        const atmosEl = document.getElementById("weatherAtmosphere");

        if (mainEl) mainEl.textContent = "Weather unavailable";
        if (detailsEl) detailsEl.innerHTML = '<span class="w-stat">Offline</span>';
        if (atmosEl) atmosEl.textContent = "Atmosphere: Offline";

        const weatherImage = document.getElementById("weatherImage");
        if (weatherImage) weatherImage.style.display = "none";

        const weatherEmoji = document.getElementById("weatherEmoji");
        if (weatherEmoji) {
            weatherEmoji.style.display = "flex";
            weatherEmoji.textContent = "⛅";
        }
    }
}

function getWeatherInfo(code, isDay) {
    if (code === 0) {
        return {
            description: isDay ? "Clear Sky ☀️" : "Clear Night 🌙",
            atmosphere: "Pure Bliss",
            emoji: isDay ? "☀️" : "🌙",
            image: isDay
                ? "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=500&q=80"
                : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly Cloudy ⛅",
            atmosphere: "Soft & Breezy",
            emoji: "⛅",
            image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast ☁️",
            atmosphere: "Calm & Dreamy",
            emoji: "☁️",
            image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            description: "Misty 🌫️",
            atmosphere: "Soft & Quiet",
            emoji: "🌫️",
            image: "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            description: "Light Drizzle 🌦️",
            atmosphere: "Fresh & Refreshing",
            emoji: "🌦️",
            image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            description: "Rainy 🌧️",
            atmosphere: "Fresh & Tropical",
            emoji: "🌧️",
            image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            description: "Rain Showers 🌦️",
            atmosphere: "Tropical & Fresh",
            emoji: "🌦️",
            image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 95) {
        return {
            description: "Thunderstorm ⛈️",
            atmosphere: "Electric Skies",
            emoji: "⛈️",
            image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0a907?auto=format&fit=crop&w=500&q=80"
        };
    }

    return {
        description: "Tropical Weather 🌤️",
        atmosphere: "Pure Bliss",
        emoji: "🌤️",
        image: null
    };
}

function setupClockFace() {
    const clockFace = document.getElementById('clockFace');
    if (!clockFace || clockFace.children.length > 4) return;

    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = 'clock-tick' + (i % 5 === 0 ? ' major' : '');
        tick.style.transform = `translate(-50%, 0) rotate(${i * 6}deg)`;
        clockFace.appendChild(tick);
    }

    for (let n = 1; n <= 12; n++) {
        const num = document.createElement('div');
        num.className = 'clock-number';
        num.textContent = n;
        const angle = (n * 30 - 90) * (Math.PI / 180);
        const r = 38;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        num.style.left = x + '%';
        num.style.top = y + '%';
        num.style.transform = 'translate(-50%, -50%)';
        clockFace.appendChild(num);
    }
}

function updateClock() {
    setupClockFace();

    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    const digitalTime = document.getElementById('digitalTime');

    if (!hourHand || !minuteHand || !secondHand || !digitalTime) return;

    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    const hourDeg = (h + m / 60) * 30;
    const minDeg = (m + s / 60) * 6;
    const secDeg = s * 6;

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;
    secondHand.style.transform = `rotate(${secDeg}deg)`;

    digitalTime.textContent = now.toLocaleTimeString([], { hour12: false });
}

const LASTFM_API_KEY = 'e0881582f1e9b8a2a7022d18d03434f4';
const LASTFM_USERNAME = 'seh9x';
const REFRESH_INTERVAL = 30000;

function setArtwork(url) {
    const art = document.getElementById('lastfmArt');
    const placeholder = document.getElementById('lastfmPlaceholder');
    if (!art || !placeholder) return;

    if (!url) {
        art.style.display = 'none';
        placeholder.style.display = 'flex';
        return;
    }

    const cleanUrl = url.replace(/\/u\/\d+x\d+\//, '/u/300x300/');

    art.onload = function () {
        art.style.display = 'block';
        placeholder.style.display = 'none';
    };

    art.onerror = function () {
        art.style.display = 'none';
        placeholder.style.display = 'flex';
    };

    art.src = cleanUrl;
}

function setPlaying(isPlaying) {
    const widget = document.getElementById('lastfmWidget');
    const dot = document.getElementById('lastfmDot');
    const statusText = document.getElementById('lastfmStatusText');
    const cdDisc = document.getElementById('aeroCdDisc');
    if (!widget || !dot || !statusText) return;

    if (isPlaying) {
        widget.classList.add('is-playing');
        dot.classList.add('playing');
        if (cdDisc) cdDisc.classList.add('playing');
        statusText.textContent = 'NOW PLAYING';
    } else {
        widget.classList.remove('is-playing');
        dot.classList.remove('playing');
        if (cdDisc) cdDisc.classList.remove('playing');
        statusText.textContent = 'LAST PLAYED';
    }
}

function setTime() {
    const refreshText = document.getElementById('lastfmRefresh');
    if (!refreshText) return;
    const now = new Date();
    refreshText.textContent = 'last.fm · seh9x · updated ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadLastFM() {
    const track = document.getElementById('lastfmTrack');
    const artist = document.getElementById('lastfmArtist');
    const album = document.getElementById('lastfmAlbum');
    const widget = document.getElementById('lastfmWidget');
    const refreshText = document.getElementById('lastfmRefresh');

    if (!track || !artist || !album || !widget) return;

    try {
        const url =
            'https://ws.audioscrobbler.com/2.0/' +
            '?method=user.getrecenttracks' +
            '&user=' + encodeURIComponent(LASTFM_USERNAME) +
            '&api_key=' + encodeURIComponent(LASTFM_API_KEY) +
            '&format=json' +
            '&limit=1';

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error('Last.fm request failed');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.message || 'Last.fm API error');
        }

        const tracks = data?.recenttracks?.track;

        if (!tracks || !tracks.length) {
            track.textContent = 'No recent track';
            artist.textContent = 'Nothing scrobbled yet';
            album.textContent = '';
            setArtwork(null);
            setPlaying(false);
            setTime();
            return;
        }

        const song = tracks[0];
        const songName = song.name || 'Unknown track';
        const artistName = typeof song.artist === 'object' ? song.artist['#text'] : song.artist;
        const albumName = typeof song.album === 'object' ? song.album['#text'] : song.album;
        const images = song.image || [];

        let artwork = '';
        for (let i = images.length - 1; i >= 0; i--) {
            if (images[i] && images[i]['#text']) {
                artwork = images[i]['#text'];
                break;
            }
        }

        const isPlaying = song['@attr'] && song['@attr'].nowplaying === 'true';

        track.textContent = songName;
        artist.textContent = artistName || 'Unknown artist';

        if (albumName) {
            album.textContent = albumName;
            album.style.display = 'block';
        } else {
            album.textContent = '';
            album.style.display = 'none';
        }

        setArtwork(artwork);
        setPlaying(isPlaying);
        setTime();

    } catch (error) {
        console.warn('Last.fm widget error:', error);
        track.textContent = 'Music unavailable';
        artist.textContent = 'Last.fm could not be reached';
        album.textContent = '';
        setArtwork(null);
        setPlaying(false);
        if (refreshText) refreshText.textContent = 'retrying...';
    }
}

function initAeroBubbles() {
    const container = document.getElementById('aeroBubblesContainer');
    if (!container) return;

    const count = window.innerWidth <= 768 ? 6 : 12;

    function createBubble(i, isInitial = true) {
        const b = document.createElement('div');
        b.className = 'aero-bubble';
        const size = 18 + Math.random() * 36;
        const left = Math.random() * 96;
        const duration = 12 + Math.random() * 10;
        const delay = isInitial ? -(Math.random() * duration) : Math.random() * 2;

        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = left + '%';
        b.style.animation = `floatBubble ${duration}s infinite ease-in-out`;
        b.style.animationDelay = delay + 's';

        b.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof playAeroChime === 'function') playAeroChime('pop');
            b.style.transform = 'scale(1.8)';
            b.style.opacity = '0';
            setTimeout(() => {
                b.remove();
                createBubble(i, false);
            }, 200);
        });

        container.appendChild(b);
    }

    for (let i = 0; i < count; i++) {
        createBubble(i, true);
    }
}

function spawnBubbleBurst() {
    if (typeof playAeroChime === 'function') playAeroChime('chime');
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const container = document.getElementById('aero-desktop');
            if (!container) return;
            const b = document.createElement('div');
            b.className = 'aero-bubble';
            const size = 20 + Math.random() * 30;
            b.style.width = size + 'px';
            b.style.height = size + 'px';
            b.style.left = (15 + Math.random() * 70) + '%';
            b.style.animation = `floatBubble ${8 + Math.random() * 6}s ease-in-out`;
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof playAeroChime === 'function') playAeroChime('pop');
                b.style.transform = 'scale(1.8)';
                b.style.opacity = '0';
                setTimeout(() => {
                    b.remove();
                }, 200);
            });
            container.appendChild(b);
            setTimeout(() => b.remove(), 14000);
        }, i * 80);
    }
}

(function initBentoCalendar() {
    const monthEl = document.getElementById("calendarMonth");
    const daysEl = document.getElementById("calendarDays");
    const prevBtn = document.getElementById("calendarPrev");
    const nextBtn = document.getElementById("calendarNext");

    if (!monthEl || !daysEl || !prevBtn || !nextBtn) return;

    const today = new Date();

    let displayedYear = today.getFullYear();
    let displayedMonth = today.getMonth();

    const monthFormatter = new Intl.DateTimeFormat("en-US", {
        month: window.innerWidth <= 600 ? "short" : "long",
        year: "numeric"
    });

    function renderCalendar() {
        const displayedDate = new Date(
            displayedYear,
            displayedMonth,
            1
        );

        monthEl.textContent = monthFormatter.format(displayedDate);

        const firstDay = new Date(
            displayedYear,
            displayedMonth,
            1
        ).getDay();

        const daysInMonth = new Date(
            displayedYear,
            displayedMonth + 1,
            0
        ).getDate();

        daysEl.innerHTML = "";
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-day empty";
            daysEl.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement("div");

            dayEl.className = "calendar-day";
            dayEl.textContent = day;

            if (
                day === today.getDate() &&
                displayedMonth === today.getMonth() &&
                displayedYear === today.getFullYear()
            ) {
                dayEl.classList.add("today");
                dayEl.setAttribute("aria-label", "Today");
            }

            daysEl.appendChild(dayEl);
        }
    }

    prevBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        displayedMonth--;

        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }

        renderCalendar();
    });

    nextBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        displayedMonth++;

        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }

        renderCalendar();
    });

    renderCalendar();
})();
