let audioCtx = null;
let isSoundEnabled = localStorage.getItem('aero_sound') !== 'false';
let musicGestureListenerAdded = false;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
    }
}

function startBackgroundMusic() {
    if (!isSoundEnabled) return;

    const music = document.getElementById('aeroBackgroundMusic');
    if (!music) return;

    music.volume = 0.60;

    music.play().then(() => {
        removeMusicGestureListener();
    }).catch(() => {
        addMusicGestureListener();
    });
}

function musicGestureHandler() {
    if (!isSoundEnabled) return;

    const music = document.getElementById('aeroBackgroundMusic');
    if (!music) return;

    initAudio();

    music.play().then(() => {
        removeMusicGestureListener();
    }).catch(() => { });
}

function addMusicGestureListener() {
    if (musicGestureListenerAdded) return;

    musicGestureListenerAdded = true;

    document.addEventListener('pointerdown', musicGestureHandler, {
        once: true,
        passive: true
    });
}

function removeMusicGestureListener() {
    musicGestureListenerAdded = false;
    document.removeEventListener('pointerdown', musicGestureHandler);
}

function setSoundIcons(on) {
    const pairs = [
        ['soundIconOn', 'soundIconOff'],
        ['soundIconOnMob', 'soundIconOffMob']
    ];
    pairs.forEach(([onId, offId]) => {
        const onEl = document.getElementById(onId);
        const offEl = document.getElementById(offId);
        if (onEl) onEl.style.display = on ? 'block' : 'none';
        if (offEl) offEl.style.display = on ? 'none' : 'block';
    });
}

function playAeroChime(type = 'chime') {
    try {
        if (type === 'music') {
            startBackgroundMusic();
            return;
        }

        if (type === 'musicStop') {
            const music = document.getElementById('aeroBackgroundMusic');

            if (music) {
                music.pause();
                music.currentTime = 0;
            }

            return;
        }

        initAudio();

        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
            osc.frequency.exponentialRampToValueAtTime(
                1400 + Math.random() * 400,
                now + 0.08
            );
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.13);

        } else if (type === 'click') {
            const clickSound = new Audio(
                'https://sfxmint.com/dl/office-mouse-click-01.wav'
            );

            clickSound.volume = 0.35;
            clickSound.play().catch(() => { });

            return;

        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.04);
            osc.frequency.setValueAtTime(783.99, now + 0.08);
            osc.frequency.setValueAtTime(1046.50, now + 0.12);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.start(now);
            osc.stop(now + 0.48);
        }

    } catch (err) {
        console.warn("Aero sound error:", err);
    }
}

function toggleAeroAudio() {
    isSoundEnabled = !isSoundEnabled;

    localStorage.setItem('aero_sound', isSoundEnabled ? 'true' : 'false');

    setSoundIcons(isSoundEnabled);

    const music = document.getElementById('aeroBackgroundMusic');

    if (isSoundEnabled) {
        startBackgroundMusic();
    } else {
        removeMusicGestureListener();

        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }
}
