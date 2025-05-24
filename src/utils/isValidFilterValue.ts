export const isValidFilterValue = (
  value: unknown
): value is string | number | boolean | string[] | number[] => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(
      (item) => typeof item === 'string' || typeof item === 'number'
    );
  }
  return false;
};
