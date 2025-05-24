import { FilterOptions } from '../useFilters.types';
import { getSearchParams } from './getSearchParams';
import { isValidFilterValue } from './isValidFilterValue';
import { parseValue } from './parseValue';

export const getFiltersFromUrl = <
  T extends Record<string, string | number | boolean | string[] | number[]>
>(
  options: FilterOptions<T>
): T => {
  const { namespace, initialFilters } = options;
  const currentFilters = { ...initialFilters };
  const searchParams = getSearchParams();

  (Object.keys(initialFilters) as Array<keyof T>).forEach((key) => {
    const paramKey = namespace ? `${namespace}-${String(key)}` : String(key);
    const urlValue = searchParams.get(paramKey);
    const defaultValue = initialFilters[key];

    if (urlValue !== null && isValidFilterValue(defaultValue)) {
      currentFilters[key] = parseValue(urlValue, defaultValue) as T[keyof T];
    }
  });

  return currentFilters;
};
