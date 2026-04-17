'use client';

import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type NavigateOptions = {
  replace?: boolean;
  scroll?: boolean;
  state?: any;
};

const routeParamPatterns: Array<{ pattern: RegExp; keys: string[] }> = [
  {
    pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapter\/([^/]+)\/difficulty\/([^/]+)\/quiz\/?$/,
    keys: ['grade', 'subject', 'chapterId', 'difficulty'],
  },
  {
    pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapters\/?$/,
    keys: ['grade', 'subject'],
  },
  {
    pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/?$/,
    keys: ['grade', 'subject'],
  },
  {
    pattern: /^\/grade\/([^/]+)\/?$/,
    keys: ['grade'],
  },
  {
    pattern: /^\/notes\/([^/]+)\/([^/]+)\/?$/,
    keys: ['grade', 'subject'],
  },
  {
    pattern: /^\/notes\/([^/]+)\/?$/,
    keys: ['grade'],
  },
  {
    pattern: /^\/books\/([^/]+)\/?$/,
    keys: ['grade'],
  },
  {
    pattern: /^\/matric\/([^/]+)\/([^/]+)\/([^/]+)\/?$/,
    keys: ['yearNum', 'streamKey', 'subject'],
  },
  {
    pattern: /^\/matric\/([^/]+)\/([^/]+)\/?$/,
    keys: ['yearNum', 'streamKey'],
  },
  {
    pattern: /^\/matric\/([^/]+)\/?$/,
    keys: ['yearNum'],
  },
  {
    pattern: /^\/session\/([^/]+)\/?$/,
    keys: ['sessionCode'],
  },
];

const customLocationStateKey = '__next_app_custom_location_state__';

export const useNavigate = () => {
  const router = useRouter();

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      }
      return;
    }

    if (options?.state && typeof window !== 'undefined') {
      (window as any)[customLocationStateKey] = options.state;
    }

    if (options?.replace) {
      router.replace(to, { scroll: options?.scroll });
    } else {
      router.push(to, { scroll: options?.scroll });
    }
  };
};

export const useParams = () => {
  const pathname = usePathname() || '/';

  return useMemo(() => {
    for (const route of routeParamPatterns) {
      const match = pathname.match(route.pattern);
      if (!match) continue;

      return route.keys.reduce<Record<string, string>>((acc, key, index) => {
        acc[key] = decodeURIComponent(match[index + 1] ?? '');
        return acc;
      }, {});
    }

    return {};
  }, [pathname]);
};

export const useLocation = () => {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  return useMemo(() => {
    const search = searchParams ? `?${searchParams.toString()}` : '';
    const state = typeof window !== 'undefined' ? (window as any)[customLocationStateKey] ?? window.history.state : null;

    return {
      pathname,
      search,
      state,
    };
  }, [pathname, searchParams]);
};

export const Navigate = ({ to, replace = false }: { to: string; replace?: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
};

export const Link = ({ href, to, ...props }: { href?: string; to?: string; [key: string]: any }) => {
  const resolvedHref = href ?? to;

  if (!resolvedHref) {
    throw new Error('Link component requires an href or to prop.');
  }

  return <NextLink href={resolvedHref} {...props} />;
};