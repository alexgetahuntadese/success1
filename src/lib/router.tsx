'use client';

import Link, { type LinkProps } from 'next/link';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Params = Record<string, string | undefined>;

type RouterStateContextValue = {
  params: Params;
};

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type LocationValue = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
};

type CompatLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps | 'href'
> &
  Omit<LinkProps, 'href'> & {
    to: string;
  };

const ROUTER_STATE_PREFIX = '__next-router-state__:';

const RouterStateContext = createContext<RouterStateContextValue>({
  params: {},
});

const readStoredState = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.sessionStorage.getItem(`${ROUTER_STATE_PREFIX}${key}`);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const clearStoredState = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(`${ROUTER_STATE_PREFIX}${key}`);
};

const storeState = (href: string, state: unknown) => {
  if (typeof window === 'undefined' || typeof state === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    `${ROUTER_STATE_PREFIX}${href}`,
    JSON.stringify(state),
  );
};

const getHash = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hash;
};

export const RouterProvider = ({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) => {
  const value = useMemo(() => ({ params }), [params]);
  return (
    <RouterStateContext.Provider value={value}>
      {children}
    </RouterStateContext.Provider>
  );
};

export const useParams = <T extends Params = Params>() => {
  const { params } = useContext(RouterStateContext);
  return params as T;
};

export const useNavigate = () => {
  const router = useRouter();

  return (to: string, options?: NavigateOptions) => {
    if (options && 'state' in options) {
      storeState(to, options.state);
    }

    if (options?.replace) {
      router.replace(to);
      return;
    }

    router.push(to);
  };
};

export const useLocation = (): LocationValue => {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const key = search ? `${pathname}?${search}` : pathname;
  const [hash, setHash] = useState(getHash);
  const [state, setState] = useState(() => readStoredState(key));

  useEffect(() => {
    setHash(getHash());
  }, [pathname, search]);

  useEffect(() => {
    const nextState = readStoredState(key);
    setState(nextState);

    if (nextState !== null) {
      clearStoredState(key);
    }
  }, [key]);

  return {
    pathname,
    search: search ? `?${search}` : '',
    hash,
    state,
  };
};

export const Navigate = ({
  to,
  replace = false,
  state,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, replace, state, to]);

  return null;
};

export const RouterLink = ({ to, ...props }: CompatLinkProps) => {
  return <Link href={to} {...props} />;
};

export { RouterLink as Link };
