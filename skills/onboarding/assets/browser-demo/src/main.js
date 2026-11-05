import { UnleashClient } from 'unleash-proxy-client';
import './style.css';

const config = import.meta.env;
const flagName = config.VITE_UNLEASH_FLAG_NAME;
const flagUrl = config.VITE_UNLEASH_FLAG_URL;
const app = document.querySelector('#app');
app.innerHTML = `
  <header><a class="brand" href="#">fieldwork<span>®</span></a><span class="tagline">Less stuff. More outside.</span><span class="cart">Your bag <span>1</span></span></header>
  <main>
    <section class="intro"><span class="eyebrow">THE EVERYDAY COLLECTION</span><h1>Good things.<br>Ready to go.</h1><p>Made for the coffee run. Built for the long way home.</p></section>
    <div class="shop">
      <section class="product" aria-label="Product">
        <div class="product-art"><span class="edition">FIELD NOTES / No. 01</span><div class="orb"></div><div class="bottle"><div class="cap"></div><div class="bottle-label">fw<span>TAKE THE<br>LONG WAY.</span></div></div><span class="art-foot">DESIGNED FOR EVERY DAY ↗</span></div>
        <div class="product-info"><div><h2>The everyday bottle</h2><p>750ml · Sage · Built to keep up</p></div><strong>$32</strong></div>
      </section>
      <section class="checkout" aria-label="Checkout">
        <div class="checkout-top"><span class="eyebrow">YOUR NEXT ADVENTURE</span><span id="feature-label" class="feature-label" hidden>NEW EXPERIENCE</span></div>
        <h2 id="checkout-title">Make it yours.</h2><p id="checkout-description">A little less scrolling. A little more exploring.</p>
        <div class="order"><span>Everyday bottle <small>× 1</small></span><strong>$32.00</strong></div>
        <div id="standard-checkout"><label>Email address<input type="email" placeholder="you@example.com" autocomplete="email" /></label><label>Delivery address<input placeholder="Where should we send it?" autocomplete="street-address" /></label><button id="standard-button" class="secondary" type="button">Continue to delivery <span>→</span></button></div>
        <div id="express-checkout" hidden><div class="express-card"><span class="spark">✦</span><div><strong>Your next adventure, one tap away.</strong><p>Skip the forms. Get straight to the good part.</p></div></div><button id="express-button" class="primary" type="button">Express checkout <span>↗</span></button><div class="express-benefits"><span>✓ No forms</span><span>✓ Free delivery</span><span>✓ More outside</span></div></div>
        <p id="checkout-result" role="status" class="checkout-result"></p><p class="demo-note">A demo store. No payments or orders are placed.</p>
      </section>
    </div>
    <aside class="onboarding" aria-label="Unleash connection"><div class="connection"><span id="connection-dot" class="dot"></span><span id="connection-label">Connecting to Unleash…</span></div><div id="toggle-instruction">Keep this page open. Your flag controls the checkout.</div><a id="flag-link" target="_blank" rel="noopener noreferrer" hidden>Open your flag in Unleash ↗</a></aside>
    <div id="live-announcement" class="sr-only" aria-live="polite"></div>
    <div id="change-toast" class="change-toast" role="status" hidden></div>
  </main><footer>Fewer things. Better experiences.<span>Built with Unleash ↗</span></footer>`;

const byId = (id) => document.getElementById(id);
let connected = false;
let previous;
let toastTimer;

if (flagUrl) {
  try {
    const url = new URL(flagUrl);
    if (['https:', 'http:'].includes(url.protocol)) {
      byId('flag-link').href = url.href;
      byId('flag-link').hidden = false;
    }
  } catch { /* The app remains usable without a handover link. */ }
}

function render(enabled) {
  byId('standard-checkout').hidden = enabled;
  byId('express-checkout').hidden = !enabled;
  byId('feature-label').hidden = !enabled;
  byId('checkout-title').textContent = enabled ? 'Less checkout. More out there.' : 'Make it yours.';
  byId('checkout-description').textContent = enabled ? 'Your new express checkout is live. No refresh. No redeploy.' : 'A little less scrolling. A little more exploring.';
  if (previous !== enabled) byId('checkout-result').textContent = '';
  document.body.classList.toggle('express-enabled', enabled);
  byId('toggle-instruction').textContent = enabled ? 'That’s a live release. Turn the flag off to bring the original checkout back.' : 'Turn your flag on in Unleash. Watch the checkout change right here.';
  document.documentElement.dataset.flagEnabled = String(enabled);
  if (previous !== undefined && previous !== enabled) {
    const message = enabled ? '✦ Express checkout is live. You just shipped a feature.' : 'Original checkout restored. Just as quickly.';
    byId('live-announcement').textContent = message;
    byId('change-toast').textContent = message;
    byId('change-toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { byId('change-toast').hidden = true; }, 6000);
    console.info(`[Unleash demo] ${flagName}: ${previous ? 'ON' : 'OFF'} → ${enabled ? 'ON' : 'OFF'}`);
  }
  previous = enabled;
}

byId('standard-button').onclick = () => { byId('checkout-result').textContent = 'The original checkout takes you through delivery and payment next.'; };
byId('express-button').onclick = () => { byId('checkout-result').textContent = 'You’re all set. That was the whole checkout. See you outside!'; };

if (!config.VITE_UNLEASH_FRONTEND_URL || !config.VITE_UNLEASH_FRONTEND_TOKEN || !flagName) {
  byId('connection-label').textContent = 'One setup step left: add the frontend token to .env, then restart the demo.';
  byId('connection-dot').classList.add('error');
  byId('toggle-instruction').textContent = 'Your agent can help finish the connection.';
} else {
  const client = new UnleashClient({
    url: new URL('/unleash-api', window.location.origin).href,
    clientKey: config.VITE_UNLEASH_FRONTEND_TOKEN,
    appName: 'unleash-fieldwork-demo',
    refreshInterval: 2,
  });
  const sync = () => {
    connected = true;
    document.documentElement.dataset.connection = 'connected';
    byId('connection-label').textContent = 'Connected to Unleash · listening for changes';
    byId('connection-dot').className = 'dot connected';
    render(client.isEnabled(flagName));
  };
  client.on('ready', sync);
  client.on('update', () => { if (connected) sync(); });
  client.on('recovered', sync);
  client.on('error', () => {
    document.documentElement.dataset.connection = 'error';
    byId('connection-label').textContent = 'Connection interrupted. Check the URL, token, and environment.';
    byId('connection-dot').className = 'dot error';
    byId('toggle-instruction').textContent = 'Showing the last received experience while the SDK reconnects.';
  });
  client.start().catch(() => { /* The error event updates the connection state. */ });
}
