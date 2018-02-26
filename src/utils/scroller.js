// REF: http://www.gizma.com/easing/#expo2

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuint = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t*t*t + 2) + b;
};

export const scrollTo = function (element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuint(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
};
