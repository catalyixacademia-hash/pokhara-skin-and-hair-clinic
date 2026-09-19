import { useEffect } from 'react';

/**
 * Re-run a data loader when the admin tab becomes visible again so list pages
 * stay current without a full page reload.
 */
export function useRefetchOnFocus(refetch: () => void) {
  useEffect(() => {
    const onFocus = () => {
      refetch();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refetch]);
}
