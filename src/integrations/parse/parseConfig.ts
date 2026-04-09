import Parse from "parse";

// Back4App (trim so copy/paste / Vercel values with spaces still work)
const APP_ID = import.meta.env.VITE_BACK4APP_APP_ID?.trim();
const JS_KEY = import.meta.env.VITE_BACK4APP_JS_KEY?.trim();
const rawServer =
  import.meta.env.VITE_BACK4APP_SERVER_URL?.trim() || "https://parseapi.back4app.com";
const serverURL = `${rawServer.replace(/\/+$/, "")}/`;

export const isParseConfigured = Boolean(Parse && APP_ID && JS_KEY);

if (!APP_ID || !JS_KEY) {
  console.warn(
    "Back4App credentials missing. Set VITE_BACK4APP_APP_ID and VITE_BACK4APP_JS_KEY (e.g. in .env locally, or Vercel Environment Variables), then restart dev server / redeploy.",
  );
} else {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = serverURL;
}

export default Parse;
