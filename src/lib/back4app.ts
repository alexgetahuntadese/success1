// Back4App/Parse SDK configuration
import Parse from 'parse/dist/parse.min.js';

const BACK4APP_APP_ID = import.meta.env.VITE_BACK4APP_APP_ID || '';
const BACK4APP_JS_KEY = import.meta.env.VITE_BACK4APP_JS_KEY || '';
const BACK4APP_SERVER_URL = 'https://parseapi.back4app.com';

// Initialize Parse
Parse.initialize(BACK4APP_APP_ID, BACK4APP_JS_KEY);
Parse.serverURL = BACK4APP_SERVER_URL;

export { Parse };
export default Parse;
