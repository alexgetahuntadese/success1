import 'parse/dist/parse.min.js';
import type ParseType from 'parse';

// Back4App configuration using environment variables
const APP_ID = import.meta.env.VITE_BACK4APP_APP_ID;
const JS_KEY = import.meta.env.VITE_BACK4APP_JS_KEY;
const SERVER_URL = "https://parseapi.back4app.com/";

const Parse = (globalThis as typeof globalThis & { Parse?: ParseType }).Parse;
export const isParseConfigured = Boolean(Parse && APP_ID && JS_KEY);

if (!Parse) {
  console.error('Parse SDK failed to load in browser context.');
} else if (!APP_ID || !JS_KEY) {
  console.warn('Back4App credentials missing. Set VITE_BACK4APP_APP_ID and VITE_BACK4APP_JS_KEY to enable auth.');
} else {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = SERVER_URL;
}

export default Parse;
