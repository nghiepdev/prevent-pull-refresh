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
  } catch (e) {}

  if (supportsOverscroll) {
    return (document.body.style.overscrollBehaviorY = 'contain');
  } else {
    const head = document.head || document.body;
    const style = document.createElement('style');
    const css = `
      ::-webkit-scrollbar {
        width: 5px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.2);
      }
      body {
        -webkit-overflow-scrolling: auto!important;
      }
    `;

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  try {
    addEventListener('test', null, {
      get passive() {
        supportsPassive = true;
      },
    });
  } catch (e) {}

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
    supportsPassive ? {passive: true} : false,
  );

  document.addEventListener(
    'touchmove',
    touchmoveHandler,
    supportsPassive ? {passive: false} : false,
  );
})();
