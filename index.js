(() => {
  let lastTouchY = 0;
  let maybePrevent = false;

  const setTouchStartPoint = event => {
    lastTouchY = event.touches[0].clientY;
  };

  const isScrollingUp = event => {
    const touchY = event.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;

    lastTouchY = touchY;

    return touchYDelta > 0;
  };

  const touchstartHandler = event => {
    if (event.touches.length !== 1) return;
    setTouchStartPoint(event);
    maybePrevent = window.pageYOffset === 0;
  };

  const touchmoveHandler = event => {
    if (maybePrevent) {
      maybePrevent = false;
      if (isScrollingUp(event)) {
        return event.preventDefault();
      }
    }
  };

  document.addEventListener('touchstart', touchstartHandler);
  document.addEventListener('touchmove', touchmoveHandler);
})();
