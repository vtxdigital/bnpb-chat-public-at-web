/**
 * Chat Widget Loader Script
 * This script safely loads the Vue chat widget on client websites
 * Usage: <script src="https://your-domain.com/widget-loader.js"></script>
 */

(function() {
  'use strict';

  // Configuration - customize these values
  const WIDGET_CONFIG = {
    apiUrl: 'https://your-api-domain.com',
    cssUrl: 'https://your-cdn.com/widget.css',
    jsUrl: 'https://your-cdn.com/widget.js',
    websiteId: window.chatWidgetConfig?.websiteId || 'default'
  };

  // Prevent double initialization
  if (window.__chatWidgetLoaded) {
    console.warn('Chat widget already loaded');
    return;
  }
  window.__chatWidgetLoaded = true;

  class ChatWidgetLoader {
    constructor() {
      this.shadowRoot = null;
      this.container = null;
    }

    // Create isolated container with Shadow DOM
    createContainer() {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'chat-widget-root';
      
      // Attach Shadow DOM for complete CSS isolation
      this.shadowRoot = this.container.attachShadow({ mode: 'open' });
      
      // Create mount point inside shadow DOM
      const mountPoint = document.createElement('div');
      mountPoint.id = 'chat-widget-app';
      this.shadowRoot.appendChild(mountPoint);
      
      // Append to body
      document.body.appendChild(this.container);
      
      return mountPoint;
    }

    // Load CSS into Shadow DOM
    async loadStyles() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = WIDGET_CONFIG.cssUrl;
      
      return new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
        this.shadowRoot.appendChild(link);
      });
    }

    // Load Vue app script
    async loadScript() {
      const script = document.createElement('script');
      script.src = WIDGET_CONFIG.jsUrl;
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Initialize the widget
    async init() {
      try {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
          });
        }

        // Create isolated container
        const mountPoint = this.createContainer();

        // Load styles into shadow DOM
        await this.loadStyles();

        // Load Vue app script
        await this.loadScript();

        // Wait for Vue app to be available
        await this.waitForVueApp();

        // Initialize Vue app in shadow DOM
        if (window.initChatWidget) {
          window.initChatWidget(mountPoint, {
            apiUrl: WIDGET_CONFIG.apiUrl,
            websiteId: WIDGET_CONFIG.websiteId
          });
        }

        console.log('Chat widget loaded successfully');
      } catch (error) {
        console.error('Failed to load chat widget:', error);
      }
    }

    // Wait for Vue app to be available
    waitForVueApp(maxAttempts = 50) {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const check = () => {
          attempts++;
          
          if (window.initChatWidget) {
            resolve();
          } else if (attempts >= maxAttempts) {
            reject(new Error('Vue app failed to load'));
          } else {
            setTimeout(check, 100);
          }
        };
        
        check();
      });
    }
  }

  // Alternative: Iframe-based isolation (if Shadow DOM is not preferred)
  class IframeChatWidget {
    createIframe() {
      const iframe = document.createElement('iframe');
      iframe.id = 'chat-widget-iframe';
      iframe.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        z-index: 999999;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        border-radius: 12px;
      `;
      iframe.src = `${WIDGET_CONFIG.apiUrl}/widget?id=${WIDGET_CONFIG.websiteId}`;
      
      document.body.appendChild(iframe);
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createIframe());
      } else {
        this.createIframe();
      }
    }
  }

  // Use Shadow DOM implementation (iframe disabled)
  const USE_SHADOW_DOM = true;

  if (USE_SHADOW_DOM) {
    const loader = new ChatWidgetLoader();
    loader.init();
  } else {
    // Iframe implementation disabled
    console.warn('Iframe implementation is disabled. Using Shadow DOM only.');
    const loader = new ChatWidgetLoader();
    loader.init();
  }

  // Expose global API for client website
  window.ChatWidget = {
    open: () => {
      // Dispatch event to open widget
      const event = new window.CustomEvent('chat-widget-open');
      window.dispatchEvent(event);
    },
    close: () => {
      const event = new window.CustomEvent('chat-widget-close');
      window.dispatchEvent(event);
    },
    sendMessage: (message) => {
      const event = new window.CustomEvent('chat-widget-send', { detail: message });
      window.dispatchEvent(event);
    }
  };
})();
