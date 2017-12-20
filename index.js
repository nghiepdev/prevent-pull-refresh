(() => {
  const isChrome = window.chrome || navigator.userAgent.match('CriOS');
  const isTouch = 'ontouchstart' in document.documentElement;

  if (!isChrome || !isTouch) {
    return;
  }

  let supportsOverscroll = false;
  let supportsPassive = false;
  let lastTouchY = 0;
  let maybePrevent = false;

  try {
    if (CSS.supports('overscroll-behavior-y', 'contain')) {
      supportsOverscroll = true;
    }

    addEventListener('test', null, {
      get passive() {
        supportsPassive = true;
      },
    });
  } catch (e) {}

  if (supportsOverscroll) {
    return (document.body.style.overscrollBehaviorY = 'contain');
  }

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

  document.addEventListener(
    'touchstart',
    touchstartHandler,
    supportsPassive ? { passive: true } : false
  );

  document.addEventListener('touchmove', touchmoveHandler);
})();
