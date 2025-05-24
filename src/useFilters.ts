import { useCallback, useState } from 'react';
import { FilterOptions } from './useFilters.types';
import { getSearchParams } from './utils/getSearchParams';
import { setSearchParams } from './utils/setSearchParams';
import { getFiltersFromUrl } from './utils/getFiltersFromUrl';

function useFilters<
  T extends Record<string, string | number | boolean | string[] | number[]>
>(options: FilterOptions<T>) {
  const [, forceUpdate] = useState({});

  const onChangeFilter = useCallback(
    (key: keyof T, value?: T[keyof T], option?: { resetSkip?: boolean }) => {
      const { namespace } = options;
      const searchParams = getSearchParams();
      const paramKey = namespace ? `${namespace}-${String(key)}` : String(key);

      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        searchParams.delete(paramKey);
      } else if (Array.isArray(value)) {
        searchParams.set(paramKey, value.join(','));
      } else {
        searchParams.set(paramKey, String(value));
      }

      if (option?.resetSkip) {
        searchParams.set(namespace ? `${namespace}-skip` : 'skip', '0');
      }

      setSearchParams(searchParams);
      forceUpdate({});
    },
    [options]
  );

  return {
    filters: getFiltersFromUrl(options),
    onChangeFilter,
  };
}

export default useFilters;
