<template>
  <div id="bnpb-chat-widget-container" ref="container">
    <iframe
      id="bnpb-chat-widget-iframe"
      :src="widgetUrl"
      title="BNPB Chat Widget"
      allowfullscreen
      allow="clipboard-write"
      loading="lazy"
      ref="iframe"
      style="width:100%; height:100%; border:0; display:block; min-height:auto; min-width:auto; border-radius:inherit;"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'ChatWidget',
  data() {
    return {
      currentState: {
        isOpen: false,
        hasConversation: false
      },
      widgetUrl: import.meta.env.VITE_CHAT_WIDGET_URL || 'http://localhost:3333'
    }
  },
  mounted() {
    this.container = this.$refs.container;
    this.iframe = this.$refs.iframe;
    this.updateContainerSize();

    window.addEventListener('message', this.onMessage);
    window.addEventListener('resize', this.onResize);

    this.iframe.addEventListener('load', () => {
      console.log('🖼️ Chat widget iframe loaded successfully');
      console.log('📍 Widget URL:', this.widgetUrl);
    });

    this.iframe.addEventListener('error', (error) => {
      console.error('❌ Error loading chat widget:', error);
    });

    // Expose public API
    window.BNPBChatWidget = {
      getState: () => ({ ...this.currentState }),
      setState: (state) => { this.currentState = { ...this.currentState, ...state }; this.updateContainerSize(); },
      collapse: () => { this.currentState = { isOpen: false, hasConversation: false }; this.updateContainerSize(); }
    };
  },
  beforeUnmount() {
    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    updateContainerSize() {
      if (!this.container) return;

      this.container.classList.remove('collapsed', 'conversation-list', 'message-drawer');

      if (!this.currentState.isOpen) {
        this.container.classList.add('collapsed');
      } else if (this.currentState.hasConversation) {
        this.container.classList.add('message-drawer');
      } else {
        this.container.classList.add('conversation-list');
      }

      // Check for collision when open
      if (this.currentState.isOpen) {
        this.checkCollision();
      }

      console.log('📏 Container size updated:', { state: this.currentState, className: this.container.className, dimensions: { width: this.container.offsetWidth, height: this.container.offsetHeight } });
    },
    checkCollision() {
      if (!this.currentState.isOpen) return;

      const containerRect = this.container.getBoundingClientRect();

      const criticalElements = document.querySelectorAll('button:not([class*="chat"]):not([class*="widget"]), input[type="submit"], input[type="button"], .btn:not([class*="chat"]), [role="button"]:not([class*="chat"])');
      let hasCollision = false;

      criticalElements.forEach(element => {
        if (element === this.container || this.container.contains(element)) return;

        const elementRect = element.getBoundingClientRect();

        if (this.isOverlapping(containerRect, elementRect)) {
          const overlapArea = this.calculateOverlapArea(containerRect, elementRect);
          const elementArea = elementRect.width * elementRect.height;
          const minArea = 2000;
          const minOverlapPercentage = 0.3;

          const overlapPercentage = overlapArea / elementArea;

          if (elementArea >= minArea && overlapPercentage >= minOverlapPercentage) {
            hasCollision = true;
            console.log('🚨 Critical element significantly blocked:', element, { elementSize: `${elementRect.width}x${elementRect.height}`, area: elementArea, overlapPercentage: Math.round(overlapPercentage * 100) + '%' });
          }
        }
      });
    },
    calculateOverlapArea(rect1, rect2) {
      const overlapWidth = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
      const overlapHeight = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
      return overlapWidth * overlapHeight;
    },
    isOverlapping(rect1, rect2) {
      return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    },
    onMessage(event) {
      const { type, source, data } = event.data || {};

      if (type === 'CHAT_WIDGET_STATE_CHANGE' && source === 'chat-widget-iframe') {
        console.log('📡 Received chat widget state change:', data);

        this.currentState = { isOpen: data.isOpen, hasConversation: data.hasConversation };
        this.updateContainerSize();
      }

      if (type === 'CHAT_WIDGET_CSS_VARIABLES' && source === 'chat-widget-iframe') {
        if (data && data.variables) {
          Object.entries(data.variables).forEach(([property, value]) => {
            this.container.style.setProperty(`--chat-widget-${property}`, value);
          });
          console.log('✅ Container CSS variables updated');
        }
      }
    },
    onResize() {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = setTimeout(() => {
        if (this.currentState.isOpen) {
          console.log('🔄 Window resized - checking collision');
          this.checkCollision();
        }
      }, 250);
    }
  }
}
</script>

<style scoped>
/* Widget styles (copied and scoped) */
#bnpb-chat-widget-container { position: fixed; bottom: 0; right: 0; z-index: 999999; background: transparent; pointer-events: none; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); transform-origin: bottom right; }
#bnpb-chat-widget-iframe { width:100%; height:100%; border:none; display:block; background:transparent; pointer-events:auto; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.15); }

#bnpb-chat-widget-container.collapsed { --chat-widget-width:80px; --chat-widget-height:80px; --chat-widget-max-height:80px; width:var(--chat-widget-width); height:var(--chat-widget-height); }
#bnpb-chat-widget-container.conversation-list { --chat-widget-width:380px; --chat-widget-height:600px; --chat-widget-max-height:80vh; width:var(--chat-widget-width); height:var(--chat-widget-height); max-height:var(--chat-widget-max-height); }
#bnpb-chat-widget-container.message-drawer { --chat-widget-width:420px; --chat-widget-height:650px; --chat-widget-max-height:85vh; width:var(--chat-widget-width); height:var(--chat-widget-height); max-height:var(--chat-widget-max-height); }

@media (max-width:768px) {
  #bnpb-chat-widget-container.conversation-list { --chat-widget-width:320px; --chat-widget-height:500px; --chat-widget-max-height:75vh; }
  #bnpb-chat-widget-container.message-drawer { --chat-widget-width:360px; --chat-widget-height:550px; --chat-widget-max-height:80vh; }
}

@media (max-width:480px) {
  #bnpb-chat-widget-container.conversation-list { --chat-widget-width:100%; --chat-widget-height:100%; --chat-widget-max-height:70vh; }
  #bnpb-chat-widget-container.message-drawer { --chat-widget-width:100%; --chat-widget-height:100%; --chat-widget-max-height:75vh; }
}
</style>
