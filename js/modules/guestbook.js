
(() => {
    "use strict";

    const FRONTEND_SUBMISSIONS_ENABLED = true;

    const CONFIG = {
        entriesUrl: "/data/guestbook.json",
        workerUrl: "https://sehansi-guestbook.sehansiperera567.workers.dev/submit",


        turnstileSiteKey: "0x4AAAAAAFTDZ_jD9YDlYk_u"
    };

    const STICKERS = {
        none: "",
        flower: "✿",
        star: "✦",
        heart: "♡",
        cat: "ฅ",
        cloud: "☁"
    };

    const THEMES = ["aero", "pastel", "dark", "classic"];
    const LAYOUTS = ["cards", "sticky-notes", "guestbook"];
    const $ = (id) => document.getElementById(id);

    function initGuestbook() {
        const root = $("guestbookWidget");
        if (!root || root.dataset.initialized) return;
        root.dataset.initialized = "true";

        const entriesEl = $("guestbookEntries");
        const listStatus = $("guestbookListStatus");
        const form = $("guestbookForm");
        const submitButton = $("guestbookSubmit");
        const formStatus = $("guestbookFormStatus");

        let approvedEntries = [];
        let turnstileToken = "";
        let turnstileWidgetId = null;

        function validColor(color) {
            return typeof color === "string" &&
                /^#[0-9a-f]{6}$/i.test(color);
        }

        // Keep only the expected eight public fields.
        // Never trust data read from a public JSON file blindly.
        function cleanEntry(raw) {
            if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
                return null;
            }

            const name = typeof raw.name === "string"
                ? raw.name.trim().slice(0, 32) : "";
            const message = typeof raw.message === "string"
                ? raw.message.trim().slice(0, 500) : "";

            if (!name || !message) return null;

            return {
                id: typeof raw.id === "string" ? raw.id : "",
                name,
                message,
                createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
                theme: THEMES.includes(raw.theme) ? raw.theme : "aero",
                color: validColor(raw.color) ? raw.color : "#8dd9c5",
                sticker: Object.hasOwn(STICKERS, raw.sticker) ? raw.sticker : "none",
                layout: LAYOUTS.includes(raw.layout) ? raw.layout : "cards"
            };
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return "Guestbook note";

            return date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        }

        function renderEntries() {
            const selectedLayout = $("guestbookLayoutFilter").value;

            const visibleEntries = selectedLayout === "all"
                ? approvedEntries
                : approvedEntries.filter((entry) => entry.layout === selectedLayout);

            $("guestbookCount").textContent = String(approvedEntries.length);

            entriesEl.className = "guestbook-entries guestbook-layout-" +
                (selectedLayout === "all" ? "cards" : selectedLayout);

            entriesEl.replaceChildren();

            if (visibleEntries.length === 0) {
                const empty = document.createElement("div");
                empty.className = "guestbook-empty";

                const heading = document.createElement("strong");
                const detail = document.createElement("span");

                heading.textContent = approvedEntries.length
                    ? "No notes in this style yet"
                    : "It's quiet in here… for now";

                detail.textContent = approvedEntries.length
                    ? "Choose another layout to see more notes."
                    : "Approved messages will appear here after review.";

                empty.append(heading, detail);
                entriesEl.append(empty);
                return;
            }

            const fragment = document.createDocumentFragment();

            for (const entry of visibleEntries) {
                const article = document.createElement("article");
                article.className = `guestbook-entry guestbook-theme-${entry.theme}`;
                article.style.setProperty("--entry-accent", entry.color);

                const top = document.createElement("div");
                top.className = "guestbook-entry-top";

                const sticker = document.createElement("span");
                sticker.textContent = STICKERS[entry.sticker];
                sticker.setAttribute("aria-hidden", "true");

                const date = document.createElement("small");
                date.textContent = formatDate(entry.createdAt);

                if (entry.createdAt && !Number.isNaN(new Date(entry.createdAt).getTime())) {
                    date.dateTime = new Date(entry.createdAt).toISOString();
                }

                top.append(sticker, date);

                const name = document.createElement("h3");
                name.textContent = entry.name;

                const message = document.createElement("p");
                message.textContent = entry.message;

                const accent = document.createElement("span");
                accent.className = "guestbook-accent";
                accent.setAttribute("aria-hidden", "true");

                article.append(top, name, message, accent);
                fragment.append(article);
            }

            entriesEl.append(fragment);
        }

        async function loadEntries() {
            const refresh = $("guestbookRefresh");
            refresh.disabled = true;
            listStatus.textContent = "Loading approved notes…";

            try {
                const response = await fetch(CONFIG.entriesUrl, {
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Guestbook JSON must contain an array.");
                }

                approvedEntries = data.map(cleanEntry).filter(Boolean);
                renderEntries();

                listStatus.textContent = approvedEntries.length
                    ? `Showing ${approvedEntries.length} approved note${approvedEntries.length === 1 ? "" : "s"}.`
                    : "No approved notes yet. Be the first to leave one!";

            } catch (error) {
                console.error("[Guestbook] Could not load entries:", error);
                approvedEntries = [];
                renderEntries();
                listStatus.textContent =
                    "Couldn't load the guestbook. Check that data/guestbook.json is published.";
            } finally {
                refresh.disabled = false;
            }
        }

        function updatePreview() {
            const name = $("guestbookName").value.trim();
            const message = $("guestbookMessage").value.trim();
            const theme = THEMES.includes($("guestbookTheme").value)
                ? $("guestbookTheme").value : "aero";
            const sticker = $("guestbookSticker").value;
            const color = validColor($("guestbookColor").value)
                ? $("guestbookColor").value : "#8dd9c5";

            const preview = $("guestbookPreview");
            preview.className = `guestbook-entry guestbook-theme-${theme}`;
            preview.style.setProperty("--entry-accent", color);

            $("guestbookPreviewName").textContent = name || "Your name";
            $("guestbookPreviewMessage").textContent =
                message || "Your message will look like this…";
            $("guestbookPreviewSticker").textContent = STICKERS[sticker] || "✧";
            $("guestbookMessageCount").textContent =
                String($("guestbookMessage").value.length);
        }

        function updateSubmitState() {
            const name = $("guestbookName").value.trim();
            const message = $("guestbookMessage").value.trim();

            const fieldsValid =
                name.length > 0 && name.length <= 32 &&
                message.length > 0 && message.length <= 500;

            // Both switches must be enabled before the button can be enabled.
            submitButton.disabled =
                !FRONTEND_SUBMISSIONS_ENABLED ||
                !fieldsValid ||
                !turnstileToken;

            $("guestbookSubmitNote").textContent =
                FRONTEND_SUBMISSIONS_ENABLED
                    ? "Your note will be sent for review before appearing publicly."
                    : "Submissions are paused while the widget is being tested.";
        }

        function setFormStatus(message) {
            formStatus.textContent = message;
        }

        function renderTurnstile() {
            if (!window.turnstile || turnstileWidgetId !== null) return;

            try {
                turnstileWidgetId = window.turnstile.render("#guestbookTurnstile", {
                    sitekey: CONFIG.turnstileSiteKey,
                    theme: document.documentElement.dataset.theme === "dark"
                        ? "dark" : "light",

                    callback(token) {
                        turnstileToken = token;
                        $("guestbookCaptchaHint").textContent =
                            "Human verification completed.";
                        updateSubmitState();
                    },

                    "expired-callback"() {
                        turnstileToken = "";
                        $("guestbookCaptchaHint").textContent =
                            "Verification expired. Please complete it again.";
                        updateSubmitState();
                    },

                    "error-callback"() {
                        turnstileToken = "";
                        $("guestbookCaptchaHint").textContent =
                            "Verification failed to load. Please retry.";
                        updateSubmitState();
                    }
                });

                $("guestbookCaptchaHint").textContent =
                    "Complete the human check before submitting.";
            } catch (error) {
                console.error("[Guestbook] Turnstile error:", error);
                $("guestbookCaptchaHint").textContent =
                    "Turnstile couldn't initialize. Check the site key and hostname settings.";
            }
        }

        function loadTurnstile() {
            if (!CONFIG.turnstileSiteKey ||
                CONFIG.turnstileSiteKey === "YOUR_TURNSTILE_SITE_KEY") {
                $("guestbookCaptchaHint").textContent =
                    "Add your public Turnstile site key to guestbook.js to load verification.";
                return;
            }

            if (window.turnstile) {
                renderTurnstile();
                return;
            }

            const existingScript =
                document.querySelector("[data-guestbook-turnstile]");

            if (existingScript) return;

            const script = document.createElement("script");
            script.src =
                "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.dataset.guestbookTurnstile = "true";
            script.onload = renderTurnstile;

            script.onerror = () => {
                $("guestbookCaptchaHint").textContent =
                    "Turnstile failed to load. Check your connection and site key.";
            };

            document.head.append(script);
        }

        async function submitEntry(event) {
            event.preventDefault();

            if (!FRONTEND_SUBMISSIONS_ENABLED) {
                setFormStatus(
                    "Submissions are paused during setup. Your note has not been sent."
                );
                return;
            }

            if (!form.reportValidity()) return;

            if (!turnstileToken) {
                setFormStatus("Please complete human verification first.");
                return;
            }

            // The Worker creates id and createdAt.
            // turnstileToken is verification data, not a guestbook schema field.
            const payload = {
                name: $("guestbookName").value.trim(),
                message: $("guestbookMessage").value.trim(),
                theme: $("guestbookTheme").value,
                color: $("guestbookColor").value,
                sticker: $("guestbookSticker").value,
                layout: $("guestbookLayout").value,
                turnstileToken
            };

            submitButton.disabled = true;
            submitButton.textContent = "Sending…";
            setFormStatus("Sending your note for review…");

            try {
                const response = await fetch(CONFIG.workerUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    if (response.status === 503) {
                        throw new Error("Submissions are still paused on the server.");
                    }

                    if (response.status === 403) {
                        throw new Error("Verification failed. Please complete the human check again.");
                    }

                    throw new Error(result.error || "Couldn't submit the note. Please try again.");
                }

                setFormStatus(
                    "Your note was submitted for review. Thank you for stopping by!"
                );

                form.reset();
                $("guestbookColor").value = "#8dd9c5";
                turnstileToken = "";

                if (window.turnstile && turnstileWidgetId !== null) {
                    window.turnstile.reset(turnstileWidgetId);
                }

                updatePreview();

            } catch (error) {
                console.error("[Guestbook] Submission failed:", error);
                setFormStatus(error.message || "Something went wrong. Please try again.");
            } finally {
                submitButton.textContent = "Send for review ↗";
                updateSubmitState();
            }
        }

        [
            "guestbookName",
            "guestbookMessage",
            "guestbookColor",
            "guestbookTheme",
            "guestbookSticker"
        ].forEach((id) => {
            $(id).addEventListener("input", () => {
                updatePreview();
                updateSubmitState();
            });

            $(id).addEventListener("change", updatePreview);
        });

        $("guestbookLayoutFilter").addEventListener("change", renderEntries);
        $("guestbookRefresh").addEventListener("click", loadEntries);
        form.addEventListener("submit", submitEntry);

        updatePreview();
        updateSubmitState();
        loadEntries();
        loadTurnstile();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGuestbook, { once: true });
    } else {
        initGuestbook();
    }
})();
