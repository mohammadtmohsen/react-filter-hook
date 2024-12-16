import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseValue } from './utils/helpers';

// import { useDebouncedCallback } from 'use-debounce';

interface DefaultFilters {
  skip: number;
  limit: number;
}

interface UseFilterOptions<T> {
  namespace: string;
  initialFilters: T;
  syncUrlParams?: boolean;
}

const useFilter = <
  T extends Record<string, string | number | boolean | string[] | number[]> &
    Partial<DefaultFilters>
>(
  options: UseFilterOptions<T>
) => {
  const { namespace, initialFilters, syncUrlParams = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const initialParsedFilters = useMemo(() => {
    const defaultFilters: DefaultFilters = {
      skip: 0,
      limit: 5,
    };
    const filters: T & DefaultFilters = {
      ...defaultFilters,
      ...initialFilters,
    };
    if (syncUrlParams) {
      Object.keys(filters).forEach((key) => {
        const paramKey = `${namespace}.${key}`;
        const value = searchParams.get(paramKey);
        if (value !== null) {
          if (filters[key as keyof (T & DefaultFilters)] !== undefined) {
            filters[key as keyof (T & DefaultFilters)] = parseValue(
              value,
              filters[key as keyof (T & DefaultFilters)]
            ) as (T & DefaultFilters)[keyof (T & DefaultFilters)];
          }
        }
      });
    }
    return filters;
  }, [namespace, initialFilters, searchParams, syncUrlParams]);

  const [filters, setFilters] = useState<T & DefaultFilters>(
    initialParsedFilters
  );

  // const debouncedSetSearchParams = useDebouncedCallback((newSearchParams: URLSearchParams) => {
  //   setSearchParams(newSearchParams);
  // }, 1000);

  const onChangeFilter = useCallback(
    (key: keyof (T & DefaultFilters), value: T[keyof T & DefaultFilters]) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters, [key]: value };

        if (syncUrlParams) {
          const newSearchParams = new URLSearchParams(searchParams);
          Object.keys(newFilters).forEach((filterKey) => {
            const paramKey = `${namespace}.${filterKey}`;
            const filterValue = newFilters[filterKey];
            if (Array.isArray(filterValue)) {
              newSearchParams.set(paramKey, filterValue.join(','));
            } else {
              newSearchParams.set(paramKey, String(filterValue));
            }
          });

          // debouncedSetSearchParams(newSearchParams);
          setSearchParams(newSearchParams);
        }

        return newFilters;
      });
    },
    [namespace, searchParams, setSearchParams, syncUrlParams]
  );

  return { filters, onChangeFilter };
};

export default useFilter;
