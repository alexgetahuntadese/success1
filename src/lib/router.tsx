'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useNavigate = () => {
  const router = useRouter();

  return (to: string | number) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      }
    } else {
      router.push(to);
    }
  };
};

export const useParams = () => {
  return {};
};

export const useLocation = () => {
  return { pathname: '/', search: '' };
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
    throw new Error("Link component requires an href or to prop.");
  }

  return <NextLink href={resolvedHref} {...props} />;
};