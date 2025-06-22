'use client';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { ErrorResponse } from '../types/shared';
import { fetcher } from '../utils/fetcher';

interface Props {
  children: ReactNode;
}

function SWRProvider({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          const _error = error as ErrorResponse;
          if (_error.statusCode < 500) return;
          if (retryCount >= 5) return;

          setTimeout(() => revalidate({ retryCount }), 5000);
        },
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}

export default SWRProvider;
