export const setSearchParams = (searchParams: URLSearchParams): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const newUrl = new URL(window.location.href);
  const searchString = searchParams.toString();
  newUrl.search = searchString ? `?${searchString}` : '';
  window.history.pushState({}, '', newUrl.toString());
};
