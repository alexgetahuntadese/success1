'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type NavigateOptions = {
  replace?: boolean;
};

type RoutePattern = {
  regex: RegExp;
  keys: string[];
};

const routePatterns: RoutePattern[] = [
  { regex: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapter\/([^/]+)\/difficulty\/([^/]+)\/quiz\/?$/, keys: ['grade', 'subject', 'chapterId', 'difficulty'] },
  { regex: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapters\/?$/, keys: ['grade', 'subject'] },
  { regex: /^\/grade\/([^/]+)\/subjects\/?$/, keys: ['grade'] },
  { regex: /^\/grade\/([^/]+)\/?$/, keys: ['grade'] },
  { regex: /^\/notes\/([^/]+)\/([^/]+)\/?$/, keys: ['grade', 'subject'] },
  { regex: /^\/notes\/([^/]+)\/?$/, keys: ['grade'] },
  { regex: /^\/books\/([^/]+)\/?$/, keys: ['grade'] },
  { regex: /^\/matric\/([^/]+)\/([^/]+)\/([^/]+)\/?$/, keys: ['year', 'stream', 'subject'] },
  { regex: /^\/matric\/([^/]+)\/([^/]+)\/?$/, keys: ['year', 'stream'] },
  { regex: /^\/matric\/([^/]+)\/?$/, keys: ['year'] },
  { regex: /^\/session\/([^/]+)\/?$/, keys: ['sessionCode'] },
];

const parseParams = (pathname: string) => {
  const normalized = pathname.split('?')[0].split('#')[0];
  for (const pattern of routePatterns) {
    const match = pattern.regex.exec(normalized);
    if (match) {
      const params: Record<string, string> = {};
      pattern.keys.forEach((key, index) => {
        params[key] = decodeURIComponent(match[index + 1] ?? '');
      });
      return params;
    }
  }
  return {};
};

export const useNavigate = () => {
  const router = useRouter();

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (to === -1) {
        return router.back();
      }
      if (to === 1) {
        return router.forward();
      }
      return;
    }

    if (options?.replace) {
      return router.replace(to);
    }

    return router.push(to);
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    pathname,
    search: searchParams ? `?${searchParams.toString()}` : '',
    state: null,
  };
};

export const useParams = () => {
  const pathname = usePathname();

  return useMemo(() => parseParams(pathname || '/'), [pathname]);
};

export const Navigate = ({
  to,
  replace = false,
}: {
  to: string;
  replace?: boolean;
}) => {
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

export { Link };
