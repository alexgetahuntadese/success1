import type {
  AuthSessionResponse,
  RegisterInput,
  SignInInput,
  UpdateProfileInput,
} from "@/lib/auth/types";

const AUTH_TOKEN_STORAGE_KEY = "studyAppAuthToken";

const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!configured) {
    return "/api";
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};

const getStoredToken = () => window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

const setStoredToken = (token: string | null | undefined) => {
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const normalizePhoneNumber = (value: string) => {
  const compact = value.replace(/[^\d+]/g, "");

  if (!compact) {
    return "";
  }

  if (compact.startsWith("+")) {
    return compact;
  }

  if (compact.startsWith("251")) {
    return `+${compact}`;
  }

  if (compact.startsWith("0")) {
    return `+251${compact.slice(1)}`;
  }

  return compact;
};

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    // Ignore JSON parsing failures and fall back to status-based messages.
  }

  if (response.status === 401) {
    return "Your session has expired. Sign in again.";
  }

  if (response.status === 404) {
    return "The auth server route could not be found.";
  }

  if (response.status === 500) {
    return "Server error (500). The authentication service is temporarily unavailable. Please try again later or contact support.";
  }

  if (response.status >= 500) {
    return "The auth server had a problem. Try again in a moment.";
  }

  return `Request failed with HTTP ${response.status}.`;
};

const requestJson = async <T>(path: string, init: RequestInit = {}) => {
  const token = getStoredToken();
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;
  
  console.log(`[API] ${init.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  console.log(`[API] Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');
  
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    console.error(`[API] Expected JSON but got: ${contentType}`, text.substring(0, 200));
    throw new Error(`Server returned non-JSON response. Check if API server is running at ${baseUrl}`);
  }
  
  if (contentLength === '0' || !response.body) {
    throw new Error('Server returned empty response');
  }

  return (await response.json()) as T;
};

const persistSession = (payload: AuthSessionResponse) => {
  setStoredToken(payload.token ?? payload.session?.accessToken ?? null);
  return payload;
};

export const backendAuthService = {
  async getSession(): Promise<AuthSessionResponse> {
    const token = getStoredToken();

    if (!token) {
      return {
        session: null,
        profile: null,
      };
    }

    try {
      return persistSession(await requestJson<AuthSessionResponse>("/auth/me"));
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("expired")) {
        setStoredToken(null);
        return {
          session: null,
          profile: null,
        };
      }

      throw error;
    }
  },

  async register(input: RegisterInput): Promise<AuthSessionResponse> {
    return persistSession(
      await requestJson<AuthSessionResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: input.fullName.trim(),
          phone: normalizePhoneNumber(input.phone),
          password: input.password,
        }),
      }),
    );
  },

  async signIn(input: SignInInput): Promise<AuthSessionResponse> {
    return persistSession(
      await requestJson<AuthSessionResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          phone: normalizePhoneNumber(input.phone),
          password: input.password,
        }),
      }),
    );
  },

  async updateProfile(input: UpdateProfileInput): Promise<AuthSessionResponse> {
    return persistSession(
      await requestJson<AuthSessionResponse>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email?.trim() || null,
        }),
      }),
    );
  },

  async signOut() {
    setStoredToken(null);

    try {
      await requestJson("/auth/logout", {
        method: "POST",
      });
    } catch {
      // The local token is already cleared, so a remote logout failure is not blocking.
    }
  },
};
