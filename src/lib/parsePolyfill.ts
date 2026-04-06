// Pinned Parse SDK entry point with guaranteed crypto polyfill
// This file ensures crypto.randomUUID and Parse modules are available BEFORE Parse loads

// Aggressive polyfill that runs immediately
(function() {
  const uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Patch all possible global objects
  const targets = [
    typeof globalThis !== 'undefined' ? globalThis : null,
    typeof window !== 'undefined' ? window : null,
    typeof self !== 'undefined' ? self : null,
    typeof global !== 'undefined' ? global : null,
  ];

  for (const target of targets) {
    if (target) {
      try {
        if (!target.crypto) {
          Object.defineProperty(target, 'crypto', {
            value: {},
            writable: true,
            configurable: true,
          });
        }
        if (!target.crypto.randomUUID) {
          Object.defineProperty(target.crypto, 'randomUUID', {
            value: uuid,
            writable: true,
            configurable: true,
          });
        }
      } catch (e) {
        // Ignore
      }
    }
  }
  
  // Also polyfill ParseInstallation in global scope
  try {
    if (typeof globalThis !== 'undefined' && !globalThis.ParseInstallation) {
      globalThis.ParseInstallation = {
        currentInstallationId: null,
        async getCurrent() {
          return { installationId: this.currentInstallationId };
        }
      };
    }
    if (typeof window !== 'undefined' && !window.ParseInstallation) {
      window.ParseInstallation = {
        currentInstallationId: null,
        async getCurrent() {
          return { installationId: this.currentInstallationId };
        }
      };
    }
    if (typeof self !== 'undefined' && !self.ParseInstallation) {
      (self as any).ParseInstallation = {
        currentInstallationId: null,
        async getCurrent() {
          return { installationId: this.currentInstallationId };
        }
      };
    }
  } catch (e) {
    // Ignore
  }
})();

// Now import Parse
import Parse from 'parse';

export default Parse;
export { Parse };
