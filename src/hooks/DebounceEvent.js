let time;
export const debounceEvent = (fn, wait = 800) => {
  clearTimeout(time, (time = setTimeout(() => fn(), wait)));
};
