import Parse from '@/lib/parsePolyfill';

// Back4App configuration using environment variables
const APP_ID = import.meta.env.VITE_BACK4APP_APP_ID;
const JS_KEY = import.meta.env.VITE_BACK4APP_JS_KEY;
const SERVER_URL = "https://parseapi.back4app.com/";

if (!APP_ID || !JS_KEY) {
  console.error('Back4App credentials missing. Please check your .env file for VITE_BACK4APP_APP_ID and VITE_BACK4APP_JS_KEY.');
}

try {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = SERVER_URL;
  console.log('[Parse] Initialized successfully');
} catch (error) {
  console.error('[Parse] Initialization failed:', error);
}

export default Parse;
