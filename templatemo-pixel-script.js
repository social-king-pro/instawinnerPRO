/*

TemplateMo 617 Pixel Forge
https://templatemo.com/tm-617-pixel-forge

*/

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Aspect ratio buttons
document.querySelectorAll('.aspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.aspect-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Winner picker demo
const generateBtn = document.getElementById('generateBtn');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const generatedImage = document.getElementById('generatedImage');
const imageActions = document.getElementById('imageActions');
const postUrlInput = document.getElementById('postUrlInput');
const videoPreview = document.getElementById('videoPreview');
const previewUrl = document.getElementById('previewUrl');
const instagramEmbed = document.getElementById('instagramEmbed');
const winnerKicker = document.getElementById('winnerKicker');
const winnerName = document.getElementById('winnerName');
const winnerMeta = document.getElementById('winnerMeta');
const usernameRoller = document.getElementById('usernameRoller');

const fallbackUsernames = [
    '@maya.creates',
    '@thegiveawayhub',
    '@sana.styles',
    '@urbanfinds.co',
    '@reelwithravi',
    '@dailydeals.in',
    '@nisha.reels',
    '@stylebyaman',
    '@mini.market',
    '@kavya.clicks',
    '@trendbasket',
    '@socialwithsam',
    '@vibe.store',
    '@aarav.media',
    '@creator.neha'
];

const PICK_DELAY_MS = 60000;
let loadedUsernames = [...fallbackUsernames];
let selectedWinner = fallbackUsernames[0];
let pickTimer = null;

function getInstagramUrl(value) {
    try {
        const url = new URL(value);
        const host = url.hostname.replace(/^www\./, '');
        const supportedPath = /^\/(p|reel|tv)\//.test(url.pathname);

        if (host !== 'instagram.com' || !supportedPath) {
            return null;
        }

        url.search = '';
        url.hash = '';
        return url.toString();
    } catch {
        return null;
    }
}

function processInstagramEmbed() {
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
        return;
    }

    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript) {
        existingScript.addEventListener('load', () => {
            if (window.instgrm && window.instgrm.Embeds) {
                window.instgrm.Embeds.process();
            }
        }, { once: true });
    }
}

function updateVideoPreview() {
    const url = postUrlInput.value.trim();
    if (!url) {
        videoPreview.classList.remove('visible');
        instagramEmbed.replaceChildren();
        return;
    }

    videoPreview.classList.add('visible');
    instagramEmbed.replaceChildren();

    const instagramUrl = getInstagramUrl(url);
    if (!instagramUrl) {
        previewUrl.textContent = 'Use a public Instagram post, reel, or TV URL to show the playable preview here.';
        return;
    }

    previewUrl.textContent = instagramUrl;

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.dataset.instgrmVersion = '14';
    blockquote.dataset.instgrmPermalink = instagramUrl;

    const link = document.createElement('a');
    link.href = instagramUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'View this Instagram post';

    blockquote.appendChild(link);
    instagramEmbed.appendChild(blockquote);
    processInstagramEmbed();
}

postUrlInput.addEventListener('input', updateVideoPreview);

async function loadUsernames() {
    try {
        const response = await fetch('users.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load users.json');

        const data = await response.json();
        const users = Array.isArray(data) ? data : data.users;
        const cleanUsers = users
            .filter(user => typeof user === 'string')
            .map(user => user.trim())
            .filter(Boolean);

        if (cleanUsers.length) {
            loadedUsernames = cleanUsers;
        }

        if (typeof data.winner === 'string' && data.winner.trim()) {
            selectedWinner = data.winner.trim();
        } else {
            selectedWinner = loadedUsernames[0];
        }
    } catch (error) {
        selectedWinner = fallbackUsernames[0];
        console.warn('Using fallback usernames:', error);
    }
}

function renderUsernameRoller() {
    const track = document.createElement('div');
    track.className = 'username-track';
    const names = [...loadedUsernames, ...loadedUsernames];

    names.forEach(name => {
        const item = document.createElement('div');
        item.className = 'username-item';
        item.textContent = name;
        track.appendChild(item);
    });

    usernameRoller.replaceChildren(track);
}

generateBtn.addEventListener('click', async () => {
    if (pickTimer) {
        clearTimeout(pickTimer);
    }

    updateVideoPreview();
    generateBtn.classList.add('loading');
    await loadUsernames();

    renderUsernameRoller();
    winnerKicker.textContent = 'Analyzing comments';
    winnerMeta.textContent = 'Loading eligible Instagram usernames...';
    generatedImage.classList.add('visible', 'is-spinning');
    outputPlaceholder.classList.add('has-image');
    outputPlaceholder.style.display = 'none';
    imageActions.classList.remove('visible');

    pickTimer = setTimeout(() => {
        generateBtn.classList.remove('loading');
        winnerKicker.textContent = 'Winner selected';
        winnerName.textContent = selectedWinner;
        winnerMeta.textContent = `${loadedUsernames.length} eligible Instagram usernames loaded | winner set in users.json`;
        generatedImage.classList.remove('is-spinning');
        imageActions.classList.add('visible');
        pickTimer = null;
    }, PICK_DELAY_MS);
});

// Pricing toggle
const pricingToggle = document.getElementById('pricingToggle');
pricingToggle.addEventListener('click', () => {
    pricingToggle.classList.toggle('yearly');
    const isYearly = pricingToggle.classList.contains('yearly');
    
    document.querySelectorAll('.price-value[data-monthly]').forEach(price => {
        price.textContent = isYearly ? price.dataset.yearly : price.dataset.monthly;
    });

    document.querySelectorAll('.pricing-toggle span').forEach((span, i) => {
        if (i === 0) span.classList.toggle('active', !isYearly);
        if (i === 1) span.classList.toggle('active', isYearly);
    });

    // Show/hide yearly total
    document.querySelectorAll('.price-yearly-total').forEach(total => {
        total.classList.toggle('visible', isYearly);
    });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .price-card, .how-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
