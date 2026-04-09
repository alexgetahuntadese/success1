import ParseImport from "parse";

/** Vite env values sometimes include BOM, spaces, or accidental quotes from .env editors. */
const stripEnv = (value: string | undefined): string | undefined => {
  if (value == null || typeof value !== "string") {
    return undefined;
  }
  let s = value.replace(/^\uFEFF/, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.length > 0 ? s : undefined;
};

type ParseModule = typeof ParseImport;

const resolveParseModule = (mod: ParseModule): ParseModule => {
  const candidate = mod as unknown as { default?: ParseModule };
  if (candidate?.default?.User && candidate?.default?.initialize) {
    return candidate.default;
  }
  return mod;
};

const Parse = resolveParseModule(ParseImport);

const APP_ID = stripEnv(import.meta.env.VITE_BACK4APP_APP_ID);
const JS_KEY = stripEnv(import.meta.env.VITE_BACK4APP_JS_KEY);
const rawServer =
  stripEnv(import.meta.env.VITE_BACK4APP_SERVER_URL) ||
  "https://parseapi.back4app.com";
const serverURL = `${rawServer.replace(/\/+$/, "")}/`;

export const isParseConfigured = Boolean(Parse && APP_ID && JS_KEY);

/** True when Parse SDK and Back4App keys are ready for sign-in / session. */
export const isParseAuthReady = () =>
  Boolean(
    isParseConfigured &&
      Parse &&
      Parse.User &&
      Parse.Query &&
      Parse.Object,
  );

if (!APP_ID || !JS_KEY) {
  console.warn(
    "Back4App credentials missing. Set VITE_BACK4APP_APP_ID and VITE_BACK4APP_JS_KEY (e.g. in .env locally, or Vercel Environment Variables), then restart dev server / redeploy.",
  );
} else {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = serverURL;
}

export default Parse;
