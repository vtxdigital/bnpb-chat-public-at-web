# BNPB Chat - Vue 3 Demo

This repo contains a small Vue 3 + Vite demo that embeds the BNPB chat widget in an iframe. The widget URL is configurable via an environment variable.

Environment:
- VITE_CHAT_WIDGET_URL (defaults to http://localhost:3333)

Quick start:

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

Deploying & Embedding
----------------------

Follow these steps to build, host, and embed the widget into a client's website.

1) Build the static bundle

```bash
npm run build
```

The output will be in the `dist/` directory. Confirm the files exist:

```
dist/index.html
dist/assets/*
```

2) Host the `dist/` directory on a static host

You can host `dist/` on any static file host (Netlify, Vercel, Cloudflare Pages, Amazon S3 + CloudFront, or your web server). Example quick options:

- Netlify: drag & drop `dist/` into Netlify's site deploy or connect the repo and set the build command `npm run build` and publish directory `dist`.
- Vercel: use `vercel` CLI or connect the repo; set output directory to `dist`.
- S3 + CloudFront: upload `dist/` to an S3 bucket and configure CloudFront for CDN + HTTPS.

Suppose the hosted URL becomes:

```
https://chat.examplecdn.com
```

3) Embed on the client website

Option A — Simple iframe (fastest, isolated):

```html
<iframe
	src="https://chat.examplecdn.com"
	title="BNPB Chat Widget"
	style="position:fixed; bottom:0; right:0; width:380px; height:600px; border:0; border-radius:12px; z-index:999999;"
	allow="clipboard-write"
	loading="lazy">
</iframe>
```

Option B — Async loader (injects DOM + lightweight API):

Paste this before `</body>` on the client page:

```html
<script>
(function () {
	const WIDGET_URL = 'https://chat.examplecdn.com';
	const containerId = 'bnpb-chat-widget-container';
	if (document.getElementById(containerId)) return;

	const container = document.createElement('div');
	container.id = containerId;
	container.style.position = 'fixed';
	container.style.bottom = '0';
	container.style.right = '0';
	container.style.zIndex = '999999';
	container.style.width = '80px';
	container.style.height = '80px';
	container.style.pointerEvents = 'none';
	container.style.transition = 'all .3s cubic-bezier(.4,0,.2,1)';
	container.style.transformOrigin = 'bottom right';

	const iframe = document.createElement('iframe');
	iframe.id = 'bnpb-chat-widget-iframe';
	iframe.src = WIDGET_URL;
	iframe.title = 'BNPB Chat Widget';
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.border = '0';
	iframe.loading = 'lazy';
	iframe.allow = 'clipboard-write';

	container.appendChild(iframe);
	document.body.appendChild(container);

	window.BNPBChatWidget = {
		setState: (state) => {
			if (state && state.isOpen) {
				container.style.width = '380px';
				container.style.height = '600px';
			} else {
				container.style.width = '80px';
				container.style.height = '80px';
			}
			iframe.contentWindow && iframe.contentWindow.postMessage({ type: 'SET_STATE', source: 'parent', data: state }, '*');
		},
		getState: () => ({})
	};
})();
</script>
```

4) Security & best practices

- Serve the hosted widget via HTTPS.
- In the widget (iframe) code, validate `event.origin` for messages before trusting data.
- Consider adding a CSP on the hosting side to restrict origins if needed.

Optional improvements
- Add an endpoint or query-string configuration to tailor the widget per client (for example `https://chat.examplecdn.com/?client=acme`).
- Add health-checking or a small loading placeholder in the loader script.

If you want I can deploy `dist/` to Netlify or Vercel for you and return a public URL, or add response handlers so the loader snippet's `getState` can receive live state via postMessage. Tell me which provider you'd like and I can deploy it automatically.
