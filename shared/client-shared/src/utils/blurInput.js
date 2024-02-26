export const blurInput = () => {
  if ('ontouchstart' in document.documentElement) {
    document.activeElement.blur();
  }
};
