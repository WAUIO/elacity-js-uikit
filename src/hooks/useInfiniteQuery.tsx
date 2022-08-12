/* eslint-disable no-restricted-syntax */
import React from 'react';
import { uid } from '@elacity-js/lib';
import { throttle } from 'lodash';
import { useInView } from 'react-intersection-observer';
import useMounted from './useMounted';

interface QueryResult<T> {
  isLoading?: boolean;
  total?: number;
  offset?: number;
  data?: T[];
  error?: Error;
  requestId?: string;
}

declare type QueryHook<T, Q> = (query: Q, options?: { skip?: boolean }) => QueryResult<T>;

export interface InfiniteQueryParams<T, Q> {
  pageSize: number;
  index?: number;
  query: Q;
  useQuery: QueryHook<T, Q>;
  onRequestId?: (requestGroupId: string, requestId: string) => void;
}

export default <T, Q extends { from?: number; count?: number }>({
  useQuery,
  query,
  index,
  pageSize,
  onRequestId,
}: InfiniteQueryParams<T, Q>) => {
  const requestGroupId = React.useRef<string>(uid());
  const mounted = useMounted();
  const [currentPage, setCurrent] = React.useState(index || 1);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '20px',
    initialInView: false,
  });

  const { isLoading, data, requestId, ...currentResult } = useQuery(
    {
      ...query,
      from: (currentPage - 1) * pageSize,
      count: pageSize,
    },
    { skip: currentPage === 0 }
  );

  const loadNext = React.useCallback(
    throttle(() => {
      // console.log('[LazyLoad] Loading next range', currentPage + 1);
      setCurrent((prev) => prev + 1);
    }, 500),
    []
  );

  // load the next range of data when the witness is showing in the viewport
  React.useEffect(() => {
    if (mounted && inView && !isLoading && currentPage * pageSize < currentResult?.total) {
      loadNext();
    }
  }, [inView]);

  React.useEffect(() => {
    if (requestId) {
      onRequestId?.(requestGroupId.current, requestId);
    }
  }, [requestId]);

  return {
    ref,
    inView,
    data: data || [],
    total: currentResult?.total || 0,
    isLoading,
    requestId,
    currentPage,
    offset: currentResult?.offset || 0,
    rewindZero: () => setCurrent(1),
  };
};
