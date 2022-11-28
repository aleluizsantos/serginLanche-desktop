let time;
export const debounceEvent = (fn, wait = 1000) => {
  clearTimeout(time, (time = setTimeout(() => fn(), wait)));
};
