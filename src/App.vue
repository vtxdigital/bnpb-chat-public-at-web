<template>
  <div>
    <header class="header">
      <div class="header-content">
        <div class="logo">BNPB Chat Demo</div>
        <nav class="nav">
          <a href="#">Home</a>
          <a href="#">Docs</a>
          <a href="#">About</a>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="hero-content">
        <div class="badge">Demo</div>
        <h1>Website External - Demo Embed Chat Widget BNPB</h1>
        <p>Integrate the BNPB chat widget into your website. The widget URL is configurable via env.</p>
      </div>
    </section>

    <main class="content">
      <div class="card">
        <h3>Responsive Chat Widget</h3>
        <p>This demo shows the chat widget embedded as an iframe. Resize the window to see responsive behavior.</p>
      </div>
      <div class="card">
        <h3>Controls</h3>
        <p>Use the API exposed on the window to control the widget for demo purposes.</p>
      </div>
    </main>

    <div class="info-box">
      <h2>BNPB Chat Embed</h2>
      <p>Configured widget URL: <strong>{{ widgetUrl }}</strong></p>
    </div>

    <ChatWidget />

    <footer class="footer">
      <p>© BNPB Chat Demo</p>
    </footer>
  </div>
</template>

<script>
import ChatWidget from './components/ChatWidget.vue'

export default {
  name: 'App',
  components: { ChatWidget },
  data() {
    return {
      widgetUrl: import.meta.env.VITE_CHAT_WIDGET_URL || 'http://localhost:3333'
    }
  }
}
</script>

<style>
/* Paste essential styles from original index.html (kept concise) */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
.header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display:flex; justify-content:space-between; align-items:center; }
.logo { font-size:24px; font-weight:bold; display:flex; align-items:center; gap:10px }
.nav { display:flex; gap:30px }
.nav a { color:white; text-decoration:none; font-weight:500 }
.hero { background:white; padding:60px 20px; text-align:center }
.hero h1 { font-size:2.5em; color:#1e3c72; margin-bottom:20px }
.badge { display:inline-block; background:#28a745; color:white; padding:8px 20px; border-radius:20px; font-size:0.9em; font-weight:600; margin-bottom:20px }
.content { max-width:1200px; margin:40px auto; padding:0 20px; display:grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap:30px }
.card { background:white; padding:30px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
.info-box { max-width:1200px; margin:40px auto; padding:30px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:12px; color:white; text-align:center }
.footer { background:#2c3e50; color:white; padding:40px 20px; margin-top:60px; text-align:center }

/* Keep responsive rules minimal */
@media (max-width:768px) { .header-content { flex-direction:column; gap:20px } .hero h1 { font-size:2em } }
</style>
