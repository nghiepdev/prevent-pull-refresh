'use strict';

(function () {
  var isChrome = window.chrome || navigator.userAgent.match('CriOS');
  var isTouch = 'ontouchstart' in document.documentElement;

  if (!isChrome || !isTouch) {
    return;
  }

  var supportsOverscroll = false;
  var supportsPassive = false;
  var lastTouchY = 0;
  var maybePrevent = false;

  try {
    if (CSS.supports('overscroll-behavior-y', 'contain')) {
      supportsOverscroll = true;
    }
  } catch (e) {}

  if (supportsOverscroll) {
    return (document.body.style.overscrollBehaviorY = 'contain');
  } else {
    var head = document.head || document.body;
    var style = document.createElement('style');
    var css =
      '\n      ::-webkit-scrollbar {\n        width: 5px;\n      }\n      ::-webkit-scrollbar-thumb {\n        border-radius: 5px;\n        background-color: rgba(0, 0, 0, 0.2);\n      }\n      body {\n        -webkit-overflow-scrolling: auto!important;\n      }\n    ';
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  try {
    window.addEventListener('test', null, {
      get passive() {
        supportsPassive = true;
      },
    });
  } catch (e) {}

  var setTouchStartPoint = function setTouchStartPoint(event) {
    lastTouchY = event.touches[0].clientY;
  };

  var isScrollingUp = function isScrollingUp(event) {
    var touchY = event.touches[0].clientY;
    var touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;
    return touchYDelta > 0;
  };

  var touchstartHandler = function touchstartHandler(event) {
    if (event.touches.length !== 1) return;
    setTouchStartPoint(event);
    maybePrevent = window.pageYOffset === 0;
  };

  var touchmoveHandler = function touchmoveHandler(event) {
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
    supportsPassive
      ? {
          passive: true,
        }
      : false
  );
  document.addEventListener(
    'touchmove',
    touchmoveHandler,
    supportsPassive
      ? {
          passive: false,
        }
      : false
  );
})();
