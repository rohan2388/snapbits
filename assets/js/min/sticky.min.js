(function() {
  $.fn.sticky = function() {
    var $container, $doc, $inner, $ths, $win, ch, h, is_fixed, maxSt, minSt, w, wh, _onScroll;
    $doc = $(document);
    $win = $(window);
    $ths = $(this);
    $inner = $ths.find('.sticky-inner');
    $container = $ths.parent();
    is_fixed = false;
    wh = $win.height();
    ch = $container.height();
    h = $inner.height();
    w = $ths.width();
    maxSt = ch - wh;
    minSt = $inner.offset().top + (h - wh);
    if (minSt < 0) {
      minSt = 5;
    }
    $doc.on('sticky.recalc', function() {
      wh = $win.height();
      ch = $container.height();
      h = $inner.height();
      w = $ths.width();
      maxSt = ch - wh;
      minSt = $inner.offset().top + (h - wh);
      if (minSt < 0) {
        return minSt = 5;
      }
    });
    _onScroll = function() {
      var bottom, scrollTop, top;
      scrollTop = $doc.scrollTop();
      if (scrollTop > minSt && scrollTop < maxSt) {
        if (!is_fixed) {
          $inner.addClass('stick').width(w);
          top = wh - h;
          $inner.css('top', top + 'px');
          $inner.css('bottom', 'auto');
          return is_fixed = true;
        }
      } else if (scrollTop > minSt && scrollTop >= maxSt) {
        bottom = (wh + scrollTop) - ch;
        $inner.css('top', 'auto');
        return $inner.css('bottom', bottom + 'px');
      } else {
        $inner.removeClass('stick').removeAttr('style');
        return is_fixed = false;
      }
    };
    $doc.on('scroll', _onScroll);
    return $win.resize(function() {
      return $doc.trigger('sticky.recalc');
    });
  };

  $(document).ready(function() {
    var $scrollInner;
    $scrollInner = $('.scroll-inner');
    $scrollInner.scrollbar();
    return $(window).resize(function() {
      return $scrollInner.scrollbar();
    });
  });

}).call(this);
