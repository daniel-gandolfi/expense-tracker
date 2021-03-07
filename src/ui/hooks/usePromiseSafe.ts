import { useEffect } from 'react';

export function usePromiseSafe<ThenResult>(
  promise: Promise<ThenResult>,
  thenCallback: (res: ThenResult) => void,
  catchCallback?: (error: unknown) => void
) {
  let isMounted = true;
  useEffect(() => {
    promise.then(
      function (res) {
        if (isMounted) {
          thenCallback(res);
        }
      },
      function (res) {
        if (isMounted && catchCallback) {
          catchCallback(res);
        }
      }
    );
  }, [isMounted, promise, thenCallback, catchCallback]);
  return () => (isMounted = false);
}
