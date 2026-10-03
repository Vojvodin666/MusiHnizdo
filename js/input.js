export const KEY_BINDINGS = {
  left: {
    swat: 'Space',
  },
  right: {
    swat: 'ArrowLeft',
    avoid: 'ArrowRight',
  },
};

export class InputHandler {
  constructor() {
    this.listeners = [];
    window.addEventListener('keydown', (e) => this.handleKey(e.code));
  }

  onAction(callback) {
    this.listeners.push(callback);
  }

  handleKey(code) {
    for (const [side, bindings] of Object.entries(KEY_BINDINGS)) {
      for (const [action, key] of Object.entries(bindings)) {
        if (key === code) {
          this.listeners.forEach((cb) => cb(side, action));
        }
      }
    }
  }
}
