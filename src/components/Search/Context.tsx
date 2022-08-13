import React from 'react';
import useDebounce from '../../hooks/useDebounce';

declare type UseQueryHook<T> = (searchTerm: string, o: { skip?: boolean }) => { data: T; isFetching?: boolean };

interface SearchContext<T> {
  anchorEl?: React.MutableRefObject<HTMLDivElement>;
  searchValue?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTeardown?: () => void;
  searching?: boolean;
  hasWindow?: boolean;
  openResult?: boolean;
  result?: T;
}

const SearchContext = React.createContext<SearchContext<unknown>>({
  searching: false,
});

interface SearchProviderProps<T> {
  minTerm?: number;
  useQuery: UseQueryHook<T>;
}

export const SearchProvider = <T extends unknown>({ minTerm, useQuery, children }: React.PropsWithChildren<SearchProviderProps<T>>) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [hasWindow, setHasWindow] = React.useState(false);
  const [openResult, setOpenResult] = React.useState(false);
  const debouncedSearchTerm = useDebounce<string>(searchValue, 500);
  const anchorEl = React.useRef<HTMLDivElement>();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, [searchValue]
  );

  // Handle 1st phase of the research
  React.useEffect(() => {
    if (debouncedSearchTerm.length >= minTerm) {
      if (!hasWindow) {
        setHasWindow(true);
      }
    } else {
      setHasWindow(false);
    }
  }, [debouncedSearchTerm]);

  // Handle 2st phase of the research: showing results
  React.useEffect(() => {
    if (debouncedSearchTerm.length >= 3 && Boolean(anchorEl?.current) && hasWindow) {
      setOpenResult(true);
    } else {
      setOpenResult(false);
    }
  }, [debouncedSearchTerm, anchorEl, hasWindow]);

  const onTeardown = () => {
    setHasWindow(false);
    setSearchValue('');
  };

  const { data: result, isFetching } = useQuery(debouncedSearchTerm, { skip: !openResult });

  return (
    <SearchContext.Provider value={{
      anchorEl,
      searchValue,
      onInputChange,
      onTeardown,
      searching: isFetching,
      result,
      hasWindow,
      openResult,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

SearchProvider.defaultProps = {
  minTerm: 3
}

export default SearchContext;