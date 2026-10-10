
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

    const mainEl = document.getElementById("weatherMain");
    const detailsEl = document.getElementById("weatherDetails");
    const atmosEl = document.getElementById("weatherAtmosphere");
    const weatherImage = document.getElementById("weatherImage");
    const weatherEmoji = document.getElementById("weatherEmoji");

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
        const weatherInfo = getWeatherInfo(weather.weather_code, weather.is_day === 1);

        if (mainEl) mainEl.textContent = `${temperature}°C · ${weatherInfo.description}`;
        if (detailsEl) detailsEl.innerHTML = `<span class="w-stat">💧 Humidity: ${humidity}%</span><span class="w-stat">💨 Wind: ${wind} km/h</span>`;
        if (atmosEl) atmosEl.textContent = `${weatherInfo.atmosphere}`;

        if (weatherImage && weatherEmoji) {
            if (weatherInfo.image) {
                weatherImage.onload = () => { weatherImage.style.display = "block"; weatherEmoji.style.display = "none"; };
                weatherImage.onerror = () => { weatherImage.style.display = "none"; weatherEmoji.style.display = "flex"; weatherEmoji.textContent = weatherInfo.emoji; };
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
        if (mainEl) mainEl.textContent = "Weather unavailable";
        if (detailsEl) detailsEl.innerHTML = '<span class="w-stat">Offline</span>';
        if (atmosEl) atmosEl.textContent = "Atmosphere: Offline";
        if (weatherImage) weatherImage.style.display = "none";
        if (weatherEmoji) { weatherEmoji.style.display = "flex"; weatherEmoji.textContent = "⛅"; }
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

function _createOneShotBubble(container, opts = {}) {
    const b = document.createElement('div');
    b.className = 'aero-bubble';
    const size = (opts.minSize || 20) + Math.random() * (opts.sizeRange || 30);
    const left = (opts.minLeft || 15) + Math.random() * (opts.leftRange || 70);
    const dur = (opts.minDur || 8) + Math.random() * (opts.durRange || 6);
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = left + '%';
    b.style.animation = `floatBubble ${dur}s ease-in-out`;
    b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof playAeroChime === 'function') playAeroChime('pop');
        b.style.transform = 'scale(1.8)';
        b.style.opacity = '0';
        setTimeout(() => b.remove(), 200);
    });
    container.appendChild(b);
    if (opts.ttl) setTimeout(() => b.remove(), opts.ttl);
    return b;
}

function spawnBubbleBurst() {
    if (typeof playAeroChime === 'function') playAeroChime('chime');
    const container = document.getElementById('aero-desktop');
    if (!container) return;
    for (let i = 0; i < 8; i++) {
        setTimeout(() => _createOneShotBubble(container, { ttl: 14000 }), i * 80);
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

/* =========================================
   Aero Minesweeper Game Logic
   ========================================= */
let msRows = 9;
let msCols = 9;
let msTotalMines = 10;
let msGridData = [];
let msGameStatus = 'idle'; // 'idle', 'playing', 'won', 'lost'
let msCurrentMode = 'dig'; // 'dig' or 'flag'
let msTimer = 0;
let msTimerInterval = null;
let msFirstClick = true;
let msFlagsCount = 0;

function initMinesweeper() {
    const boardEl = document.getElementById('msGrid');
    if (!boardEl) return;
    resetMinesweeper();
}

function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
}

function updateMsStatusText() {
    const statusHint = document.getElementById('msStatusText');
    if (!statusHint) return;
    if (isTouchDevice()) {
        statusHint.textContent = msCurrentMode === 'flag'
            ? '🚩 Flag Mode · Tap to mark mines'
            : '⛏️ Dig Mode · Tap to reveal tiles';
    } else {
        statusHint.textContent = 'Left-click: Reveal · Right-click: Flag';
    }
}

function setMinesweeperMode(mode) {
    msCurrentMode = mode;
    const digBtn = document.getElementById('msModeDig');
    const flagBtn = document.getElementById('msModeFlag');

    if (digBtn) digBtn.classList.toggle('active', mode === 'dig');
    if (flagBtn) flagBtn.classList.toggle('active', mode === 'flag');

    if (msGameStatus === 'idle' || msGameStatus === 'playing') {
        updateMsStatusText();
    }

    if (typeof playAeroChime === 'function') playAeroChime('click');
}

function resetMinesweeper() {
    if (msTimerInterval) {
        clearInterval(msTimerInterval);
        msTimerInterval = null;
    }

    msGameStatus = 'idle';
    msFirstClick = true;
    msTimer = 0;
    msFlagsCount = 0;

    updateMsTimerDisplay();
    updateMsMinesDisplay();
    setMsFace('🙂');

    updateMsStatusText();

    msGridData = [];
    for (let r = 0; r < msRows; r++) {
        const row = [];
        for (let c = 0; c < msCols; c++) {
            row.push({
                r,
                c,
                mine: false,
                revealed: false,
                flagged: false,
                neighborMines: 0,
                el: null
            });
        }
        msGridData.push(row);
    }

    renderMsBoard();
}

function renderMsBoard() {
    const boardEl = document.getElementById('msGrid');
    if (!boardEl) return;

    boardEl.innerHTML = '';

    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            const cellData = msGridData[r][c];
            const cellEl = document.createElement('div');
            cellEl.className = 'ms-cell';
            cellEl.setAttribute('role', 'button');
            cellEl.setAttribute('tabindex', '0');
            cellEl.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

            cellData.el = cellEl;

            let isPointerDown = false;

            cellEl.addEventListener('pointerdown', (e) => {
                if (msGameStatus === 'lost' || msGameStatus === 'won') return;
                if (!cellData.revealed && !cellData.flagged) {
                    isPointerDown = true;
                    setMsFace('😮');
                }
            });

            const resetFaceOnRelease = () => {
                if (isPointerDown) {
                    isPointerDown = false;
                    if (msGameStatus === 'playing' || msGameStatus === 'idle') {
                        setMsFace('🙂');
                    }
                }
            };

            cellEl.addEventListener('pointerup', resetFaceOnRelease);
            cellEl.addEventListener('pointercancel', resetFaceOnRelease);
            cellEl.addEventListener('pointerleave', resetFaceOnRelease);

            // Click action
            cellEl.addEventListener('click', (e) => {
                e.preventDefault();
                if (msCurrentMode === 'flag') {
                    handleMsCellFlag(r, c);
                } else {
                    handleMsCellClick(r, c);
                }
            });

            // Right-click always flags
            cellEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleMsCellFlag(r, c);
            });

            boardEl.appendChild(cellEl);
        }
    }
}

function generateMsMines(safeR, safeC) {
    let placed = 0;
    while (placed < msTotalMines) {
        const r = Math.floor(Math.random() * msRows);
        const c = Math.floor(Math.random() * msCols);

        // Keep 3x3 pocket around first click safe
        const isNearFirstClick = Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;
        if (isNearFirstClick || msGridData[r][c].mine) {
            continue;
        }

        msGridData[r][c].mine = true;
        placed++;
    }

    // Calculate surrounding mine counts for all cells
    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            if (msGridData[r][c].mine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < msRows && nc >= 0 && nc < msCols) {
                        if (msGridData[nr][nc].mine) count++;
                    }
                }
            }
            msGridData[r][c].neighborMines = count;
        }
    }
}

function handleMsCellClick(r, c) {
    if (msGameStatus === 'lost' || msGameStatus === 'won') return;

    const cell = msGridData[r][c];
    if (cell.revealed || cell.flagged) return;

    if (msFirstClick) {
        msFirstClick = false;
        msGameStatus = 'playing';
        generateMsMines(r, c);
        startMsTimer();
    }

    if (cell.mine) {
        triggerMsLoss(cell);
        return;
    }

    revealMsCell(r, c);
    if (typeof playAeroChime === 'function') playAeroChime('click');
    checkMsWin();
}

function revealMsCell(r, c) {
    const cell = msGridData[r][c];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    cell.el.classList.add('revealed');

    if (cell.neighborMines > 0) {
        cell.el.textContent = cell.neighborMines;
        cell.el.classList.add(`cell-${cell.neighborMines}`);
    } else {
        // Empty cell (0 neighbor mines) - expand contiguous empty cells and boundary numbers
        cell.el.textContent = '';
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < msRows && nc >= 0 && nc < msCols) {
                    if (!msGridData[nr][nc].revealed && !msGridData[nr][nc].mine) {
                        revealMsCell(nr, nc);
                    }
                }
            }
        }
    }
}

function handleMsCellFlag(r, c) {
    if (msGameStatus === 'lost' || msGameStatus === 'won') return;

    const cell = msGridData[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    if (cell.flagged) {
        cell.el.classList.add('flagged');
        cell.el.textContent = '🚩';
        msFlagsCount++;
    } else {
        cell.el.classList.remove('flagged');
        cell.el.textContent = '';
        msFlagsCount--;
    }

    if (typeof playAeroChime === 'function') playAeroChime('click');
    updateMsMinesDisplay();
}

function triggerMsLoss(hitCell) {
    msGameStatus = 'lost';
    stopMsTimer();
    setMsFace('😵');

    if (hitCell) {
        hitCell.el.classList.add('mine-hit');
        hitCell.el.textContent = '💥';
    }

    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            const cell = msGridData[r][c];
            if (cell.mine && cell !== hitCell) {
                cell.el.classList.add('revealed');
                cell.el.textContent = '💣';
            } else if (!cell.mine && cell.flagged) {
                cell.el.textContent = '❌';
            }
        }
    }

    const hint = document.getElementById('msStatusText');
    if (hint) hint.textContent = '💥 Hit a Mine! Tap 🙂 to retry';

    if (typeof playAeroChime === 'function') playAeroChime('explosion');
}

function checkMsWin() {
    let unrevealedSafe = 0;
    for (let r = 0; r < msRows; r++) {
        for (let c = 0; c < msCols; c++) {
            const cell = msGridData[r][c];
            if (!cell.mine && !cell.revealed) {
                unrevealedSafe++;
            }
        }
    }

    if (unrevealedSafe === 0) {
        msGameStatus = 'won';
        stopMsTimer();
        setMsFace('😎');

        for (let r = 0; r < msRows; r++) {
            for (let c = 0; c < msCols; c++) {
                const cell = msGridData[r][c];
                if (cell.mine && !cell.flagged) {
                    cell.flagged = true;
                    cell.el.classList.add('flagged');
                    cell.el.textContent = '🚩';
                }
            }
        }

        msFlagsCount = msTotalMines;
        updateMsMinesDisplay();

        const hint = document.getElementById('msStatusText');
        if (hint) hint.textContent = '🎉 You won! Pure brilliance ✨';

        if (typeof playAeroChime === 'function') playAeroChime('chime');
        if (typeof spawnBubbleBurst === 'function') spawnBubbleBurst();
    }
}

function startMsTimer() {
    stopMsTimer();
    msTimer = 0;
    updateMsTimerDisplay();
    msTimerInterval = setInterval(() => {
        msTimer++;
        if (msTimer > 999) msTimer = 999;
        updateMsTimerDisplay();
    }, 1000);
}

function stopMsTimer() {
    if (msTimerInterval) {
        clearInterval(msTimerInterval);
        msTimerInterval = null;
    }
}

function updateMsTimerDisplay() {
    const el = document.getElementById('msTimerDisplay');
    if (el) {
        el.textContent = String(msTimer).padStart(3, '0');
    }
}

function updateMsMinesDisplay() {
    const el = document.getElementById('msMinesDisplay');
    if (el) {
        const remaining = Math.max(0, msTotalMines - msFlagsCount);
        el.textContent = String(remaining).padStart(3, '0');
    }
}

function setMsFace(emoji) {
    const face = document.getElementById('msFaceIcon');
    if (face) face.textContent = emoji;
}

/* =========================================
   Aquazone Desktop Garden / Fish Pond Logic
   ========================================= */
let pondCanvas = null;
let pondCtx = null;
let pondAnimId = null;
let pondW = 0;
let pondH = 0;

let pondFish = [];
let pondFood = [];
let pondRipples = [];
let pondBubbles = [];
let pondPlants = [];
let pondTime = 0;

const FISH_SPECIES = [
    { name: 'Goldfish', bodyColor: '#f97316', bellyColor: '#fff7ed', tailColor: '#ea580c', finColor: '#fdba74', size: 22 },
    { name: 'Neon Tetra', bodyColor: '#0284c7', bellyColor: '#ef4444', tailColor: '#38bdf8', finColor: '#7dd3fc', size: 16 },
    { name: 'Angelfish', bodyColor: '#eab308', bellyColor: '#fef08a', tailColor: '#ca8a04', finColor: '#fde047', size: 24 },
    { name: 'Pink Koi', bodyColor: '#ec4899', bellyColor: '#fbcfe8', tailColor: '#db2777', finColor: '#f472b6', size: 22 },
    { name: 'Emerald Barb', bodyColor: '#10b981', bellyColor: '#ecfdf5', tailColor: '#059669', finColor: '#6ee7b7', size: 18 }
];

function initPondWidget() {
    const wrap = document.querySelector('.pond-canvas-wrap');
    pondCanvas = document.getElementById('pondCanvas');
    if (!pondCanvas || !wrap) return;

    pondCtx = pondCanvas.getContext('2d');

    resizePondCanvas();
    window.addEventListener('resize', resizePondCanvas);

    // Initial 4 fish
    pondFish = [];
    for (let i = 0; i < 4; i++) {
        spawnSinglePondFish(i % FISH_SPECIES.length);
    }

    // Generate plant roots at bottom
    generatePondPlants();

    // Initial bubbles
    pondBubbles = [];
    for (let i = 0; i < 12; i++) {
        pondBubbles.push(createPondBubble(true));
    }

    // Pointer click / tap on water surface
    wrap.addEventListener('pointerdown', (e) => {
        const rect = pondCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createPondRipple(x, y);
        dropPondFood(x, y);

        if (typeof playAeroChime === 'function') playAeroChime('pop');
    });

    updatePondUI();

    if (pondAnimId) cancelAnimationFrame(pondAnimId);
    renderPondLoop();
}

function resizePondCanvas() {
    if (!pondCanvas) return;
    const wrap = pondCanvas.parentElement;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    pondW = rect.width || 300;
    pondH = rect.height || 180;

    pondCanvas.width = pondW * dpr;
    pondCanvas.height = pondH * dpr;

    if (pondCtx) {
        pondCtx.scale(dpr, dpr);
    }

    generatePondPlants();
}

function generatePondPlants() {
    pondPlants = [];
    const count = Math.max(3, Math.floor(pondW / 70));
    for (let i = 0; i < count; i++) {
        const x = (pondW / (count + 1)) * (i + 1) + (Math.random() * 20 - 10);
        const height = 40 + Math.random() * 50;
        pondPlants.push({
            x,
            height,
            stems: 3 + Math.floor(Math.random() * 3),
            phase: Math.random() * Math.PI * 2
        });
    }
}

function createPondBubble(randomY = false) {
    return {
        x: Math.random() * (pondW || 300),
        y: randomY ? Math.random() * (pondH || 180) : (pondH || 180) + 10,
        r: 2 + Math.random() * 3.5,
        vy: 0.4 + Math.random() * 0.7,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayAmp: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
    };
}

function spawnSinglePondFish(speciesIdx) {
    const species = FISH_SPECIES[speciesIdx % FISH_SPECIES.length];
    const w = pondW > 0 ? pondW : 300;
    const h = pondH > 0 ? pondH : 180;

    pondFish.push({
        species,
        x: Math.random() * (w - 60) + 30,
        y: Math.random() * (h - 60) + 30,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 0.6,
        targetX: Math.random() * w,
        targetY: Math.random() * h,
        speed: 0.7 + Math.random() * 0.4,
        tailPhase: Math.random() * Math.PI * 2,
        tailSpeed: 0.12 + Math.random() * 0.08,
        facingRight: Math.random() > 0.5,
        targetTimer: 0
    });
}

function feedPondFish() {
    const w = pondW > 0 ? pondW : 300;
    for (let i = 0; i < 4; i++) {
        dropPondFood(Math.random() * (w - 40) + 20, 15 + Math.random() * 20);
    }
    createPondRipple(w / 2, 20);
    if (typeof playAeroChime === 'function') playAeroChime('pop');
}

function addPondFish() {
    if (pondFish.length >= 12) return;
    spawnSinglePondFish(pondFish.length);
    updatePondUI();
    if (typeof playAeroChime === 'function') playAeroChime('pop');
}

function dropPondFood(x, y) {
    pondFood.push({
        x,
        y,
        vy: 0.35 + Math.random() * 0.25,
        wobblePhase: Math.random() * Math.PI * 2,
        radius: 3,
        life: 0
    });
    updatePondUI();
}

function createPondRipple(x, y) {
    pondRipples.push({
        x,
        y,
        radius: 3,
        maxRadius: 28 + Math.random() * 12,
        alpha: 0.8
    });
}

function updatePondUI() {
    const countEl = document.getElementById('pondFishStatus');
    const cleanEl = document.getElementById('pondCleanStatus');

    if (countEl) {
        countEl.textContent = `🐟 ${pondFish.length} Fish`;
    }

    if (cleanEl) {
        if (pondFood.length > 0) {
            cleanEl.textContent = `🍞 Feeding (${pondFood.length})`;
        } else {
            cleanEl.textContent = `🌿 Clean Pond`;
        }
    }
}

function renderPondLoop() {
    pondTime++;
    drawPond();
    pondAnimId = requestAnimationFrame(renderPondLoop);
}

function drawPond() {
    if (!pondCtx || !pondW || !pondH) return;

    pondCtx.clearRect(0, 0, pondW, pondH);

    // 1. Water Background Gradient (Frutiger Aero Blue)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const bgGrad = pondCtx.createLinearGradient(0, 0, 0, pondH);
    if (isDark) {
        bgGrad.addColorStop(0, '#0369a1');
        bgGrad.addColorStop(0.5, '#0c4a6e');
        bgGrad.addColorStop(1, '#020617');
    } else {
        bgGrad.addColorStop(0, '#38bdf8');
        bgGrad.addColorStop(0.4, '#0284c7');
        bgGrad.addColorStop(1, '#075985');
    }
    pondCtx.fillStyle = bgGrad;
    pondCtx.fillRect(0, 0, pondW, pondH);

    // 2. Light Rays from surface
    pondCtx.save();
    pondCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 3; i++) {
        const xOffset = (i * pondW * 0.35) + Math.sin(pondTime * 0.01 + i) * 15;
        pondCtx.beginPath();
        pondCtx.moveTo(xOffset, 0);
        pondCtx.lineTo(xOffset + 40, 0);
        pondCtx.lineTo(xOffset + 90, pondH);
        pondCtx.lineTo(xOffset + 20, pondH);
        pondCtx.closePath();
        pondCtx.fill();
    }
    pondCtx.restore();

    // 3. Sand bed at bottom
    const sandGrad = pondCtx.createLinearGradient(0, pondH - 18, 0, pondH);
    sandGrad.addColorStop(0, isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(254, 243, 199, 0.35)');
    sandGrad.addColorStop(1, isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(217, 119, 6, 0.45)');
    pondCtx.fillStyle = sandGrad;
    pondCtx.beginPath();
    pondCtx.moveTo(0, pondH);
    pondCtx.lineTo(0, pondH - 12);
    for (let x = 0; x <= pondW; x += 20) {
        const y = pondH - 12 + Math.sin(x * 0.05) * 3;
        pondCtx.lineTo(x, y);
    }
    pondCtx.lineTo(pondW, pondH);
    pondCtx.closePath();
    pondCtx.fill();

    // 4. Seaweed Plants
    pondCtx.save();
    pondPlants.forEach(plant => {
        const sway = Math.sin(pondTime * 0.02 + plant.phase) * 12;
        pondCtx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.65)' : 'rgba(34, 197, 94, 0.75)';
        pondCtx.lineWidth = 4;
        pondCtx.lineCap = 'round';

        for (let s = -1; s <= 1; s++) {
            const bx = plant.x + s * 8;
            pondCtx.beginPath();
            pondCtx.moveTo(bx, pondH);
            pondCtx.quadraticCurveTo(
                bx + sway * 0.5,
                pondH - plant.height * 0.5,
                bx + sway * (1 + s * 0.2),
                pondH - plant.height
            );
            pondCtx.stroke();
        }
    });
    pondCtx.restore();

    // 5. Food Flakes
    for (let i = pondFood.length - 1; i >= 0; i--) {
        const food = pondFood[i];
        food.y += food.vy;
        food.x += Math.sin(pondTime * 0.05 + food.wobblePhase) * 0.35;
        food.life++;

        // Draw food flake
        pondCtx.fillStyle = '#f59e0b';
        pondCtx.beginPath();
        pondCtx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
        pondCtx.fill();

        // If hits bottom or aged out
        if (food.y >= pondH - 8 || food.life > 600) {
            pondFood.splice(i, 1);
            updatePondUI();
        }
    }

    // 6. Fish Simulation & Render
    pondFish.forEach(fish => {
        // Target selection (food or random swim)
        fish.targetTimer++;

        let targetX = fish.targetX;
        let targetY = fish.targetY;

        if (pondFood.length > 0) {
            // Find closest food
            let closestDist = Infinity;
            let closestFoodIdx = -1;

            pondFood.forEach((f, idx) => {
                const dist = Math.hypot(f.x - fish.x, f.y - fish.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestFoodIdx = idx;
                }
            });

            if (closestFoodIdx !== -1) {
                const targetFood = pondFood[closestFoodIdx];
                targetX = targetFood.x;
                targetY = targetFood.y;

                // Eat food if close
                if (closestDist < 14) {
                    pondFood.splice(closestFoodIdx, 1);
                    createPondRipple(fish.x, fish.y);
                    fish.tailSpeed = 0.3; // Happy wiggle!
                    updatePondUI();
                }
            }
        } else if (fish.targetTimer > 180 || Math.hypot(targetX - fish.x, targetY - fish.y) < 20) {
            fish.targetX = Math.random() * (pondW - 80) + 40;
            fish.targetY = Math.random() * (pondH - 60) + 30;
            fish.targetTimer = 0;
        }

        // Steer toward target
        const dx = targetX - fish.x;
        const dy = targetY - fish.y;
        const angle = Math.atan2(dy, dx);

        const currentSpeed = (pondFood.length > 0 ? 1.4 : 1.0) * fish.speed;
        fish.vx += Math.cos(angle) * 0.05 * currentSpeed;
        fish.vy += Math.sin(angle) * 0.05 * currentSpeed;

        // Friction
        fish.vx *= 0.94;
        fish.vy *= 0.94;

        // Position update
        fish.x += fish.vx;
        fish.y += fish.vy;

        // Boundary safety
        const margin = 20;
        if (fish.x < margin) { fish.x = margin; fish.vx *= -1; }
        if (fish.x > pondW - margin) { fish.x = pondW - margin; fish.vx *= -1; }
        if (fish.y < margin) { fish.y = margin; fish.vy *= -1; }
        if (fish.y > pondH - margin) { fish.y = pondH - margin; fish.vy *= -1; }

        // Update facing direction
        if (Math.abs(fish.vx) > 0.05) {
            fish.facingRight = fish.vx > 0;
        }

        // Animate tail
        fish.tailPhase += fish.tailSpeed * (1 + Math.hypot(fish.vx, fish.vy) * 0.5);
        if (fish.tailSpeed > 0.15) fish.tailSpeed *= 0.98;

        // Draw Fish Body
        drawSingleFish(fish);
    });

    // 7. Bubbles
    for (let i = pondBubbles.length - 1; i >= 0; i--) {
        const b = pondBubbles[i];
        b.y -= b.vy;
        b.x += Math.sin(pondTime * b.swaySpeed + b.phase) * b.swayAmp;

        pondCtx.beginPath();
        pondCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        pondCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        pondCtx.lineWidth = 1;
        pondCtx.stroke();

        // Shiny dot
        pondCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        pondCtx.beginPath();
        pondCtx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
        pondCtx.fill();

        if (b.y < -10) {
            pondBubbles[i] = createPondBubble();
        }
    }

    // 8. Water Ripples
    for (let i = pondRipples.length - 1; i >= 0; i--) {
        const r = pondRipples[i];
        r.radius += 0.8;
        r.alpha -= 0.02;

        if (r.alpha <= 0 || r.radius > r.maxRadius) {
            pondRipples.splice(i, 1);
            continue;
        }

        pondCtx.beginPath();
        pondCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        pondCtx.strokeStyle = `rgba(224, 242, 254, ${r.alpha})`;
        pondCtx.lineWidth = 1.5;
        pondCtx.stroke();
    }
}

function drawSingleFish(fish) {
    const s = fish.species;
    const len = s.size;
    const height = len * 0.55;

    pondCtx.save();
    pondCtx.translate(fish.x, fish.y);

    if (!fish.facingRight) {
        pondCtx.scale(-1, 1);
    }

    const tailWiggle = Math.sin(fish.tailPhase) * (len * 0.3);

    // Tail Fin
    pondCtx.fillStyle = s.tailColor;
    pondCtx.beginPath();
    pondCtx.moveTo(-len * 0.4, 0);
    pondCtx.quadraticCurveTo(-len * 0.8, tailWiggle - height * 0.6, -len * 1.1, tailWiggle - height * 0.7);
    pondCtx.quadraticCurveTo(-len * 0.8, tailWiggle, -len * 1.1, tailWiggle + height * 0.7);
    pondCtx.quadraticCurveTo(-len * 0.8, tailWiggle + height * 0.6, -len * 0.4, 0);
    pondCtx.closePath();
    pondCtx.fill();

    // Body Gradient
    const bodyGrad = pondCtx.createLinearGradient(0, -height, 0, height);
    bodyGrad.addColorStop(0, s.bodyColor);
    bodyGrad.addColorStop(0.65, s.bodyColor);
    bodyGrad.addColorStop(1, s.bellyColor);

    // Main Body Ellipse / Path
    pondCtx.fillStyle = bodyGrad;
    pondCtx.beginPath();
    pondCtx.moveTo(len * 0.5, 0);
    pondCtx.quadraticCurveTo(0, -height, -len * 0.5, 0);
    pondCtx.quadraticCurveTo(0, height, len * 0.5, 0);
    pondCtx.closePath();
    pondCtx.fill();

    // Dorsal Fin
    pondCtx.fillStyle = s.finColor;
    pondCtx.beginPath();
    pondCtx.moveTo(0, -height * 0.7);
    pondCtx.quadraticCurveTo(len * 0.1, -height * 1.4, -len * 0.3, -height * 0.6);
    pondCtx.closePath();
    pondCtx.fill();

    // Side Pectoral Fin
    pondCtx.fillStyle = s.finColor;
    pondCtx.beginPath();
    pondCtx.moveTo(len * 0.1, height * 0.2);
    pondCtx.quadraticCurveTo(-len * 0.1, height * 0.9, -len * 0.2, height * 0.4);
    pondCtx.closePath();
    pondCtx.fill();

    // Eye
    pondCtx.fillStyle = '#ffffff';
    pondCtx.beginPath();
    pondCtx.arc(len * 0.28, -height * 0.2, len * 0.12, 0, Math.PI * 2);
    pondCtx.fill();

    pondCtx.fillStyle = '#0f172a';
    pondCtx.beginPath();
    pondCtx.arc(len * 0.3, -height * 0.2, len * 0.06, 0, Math.PI * 2);
    pondCtx.fill();

    // Specular Highlight on Eye
    pondCtx.fillStyle = '#ffffff';
    pondCtx.beginPath();
    pondCtx.arc(len * 0.32, -height * 0.24, len * 0.025, 0, Math.PI * 2);
    pondCtx.fill();

    pondCtx.restore();
}
