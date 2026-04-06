import Parse from "parse";

// Polyfill crypto.randomUUID for older browsers / Vite
if (!crypto.randomUUID) {
  crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Initialize Parse - REPLACE WITH YOUR ACTUAL CREDENTIALS
Parse.initialize("2dJOHkwjo9evu8ZwvgEcJpEABMwVH7EnGQJYZRFk", "lLvAT8fr2PTOmMvXGuXq4X8yJuJgnQk6VuIoB62k");
Parse.serverURL = "https://parseapi.back4app.com/";

// Disable Installation tracking for web apps
Parse.Installation = undefined;

// Optional: allow safe currentUser access
Parse.User.enableUnsafeCurrentUser();

export default Parse;
