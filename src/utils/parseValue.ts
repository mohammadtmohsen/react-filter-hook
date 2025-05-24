export const parseValue = (
  value: string,
  defaultValue: string | number | boolean | string[] | number[]
) => {
  if (Array.isArray(defaultValue)) {
    return value
      .split(',')
      .map((item) =>
        typeof defaultValue[0] === 'number' ? parseFloat(item) : item
      );
  }
  if (typeof defaultValue === 'boolean') return value === 'true';
  if (typeof defaultValue === 'number') return parseFloat(value);
  return value;
};
