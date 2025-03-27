import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseValue } from './utils/helpers';

interface UseFilterOptions<T> {
  namespace?: string;
  initialFilters: T;
}

function useFilter<
  T extends Record<string, string | number | boolean | string[] | number[]>
>(options: UseFilterOptions<T>) {
  const { namespace, initialFilters } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const derivedFilters: T = { ...initialFilters };

    Object.keys(derivedFilters).forEach((key) => {
      const paramKey = namespace ? `${namespace}-${key}` : key;
      const urlValue = searchParams.get(paramKey);
      if (urlValue !== null) {
        derivedFilters[key as keyof T] = parseValue(
          urlValue,
          derivedFilters[key as keyof T]
        ) as T[keyof T];
      }
    });

    return derivedFilters;
  }, [namespace, initialFilters, searchParams]);

  const onChangeFilter = useCallback(
    (key: keyof T, value?: T[keyof T], option?: { resetSkip?: boolean }) => {
      const newSearchParams = new URLSearchParams(searchParams);

      const paramKey = namespace ? `${namespace}-${String(key)}` : key;
      if (!value) {
        newSearchParams.delete(String(paramKey));
      } else if (Array.isArray(value)) {
        newSearchParams.set(String(paramKey), value.join(','));
      } else {
        newSearchParams.set(String(paramKey), String(value));
      }

      if (option?.resetSkip) {
        newSearchParams.set(namespace ? `${namespace}-skip` : 'skip', '0');
      }

      setSearchParams(newSearchParams);
    },
    [namespace, searchParams, setSearchParams]
  );

  return {
    filters,
    onChangeFilter,
  };
}

export default useFilter;
