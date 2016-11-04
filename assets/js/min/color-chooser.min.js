(function() {
  $.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
      var classes;
      classes = el.className.split(" ").filter(function(c) {
        return c.lastIndexOf(prefix, 0) !== 0;
      });
      return el.className = $.trim(classes.join(" "));
    });
    return this;
  };

  $.fn.classWithPrefix = function(prefix) {
    var className;
    className = null;
    this.each(function(i, el) {
      var classes;
      classes = el.className.split(" ").filter(function(c) {
        return c.lastIndexOf(prefix, 0) === 0;
      });
      return className = $.trim(classes.join(" "));
    });
    className = className.replace(prefix, '');
    if (typeof className === 'undefined') {
      return '';
    } else {
      return className;
    }
  };

  $.fn.colorChooserDestroy = function() {
    var $wrapper;
    $wrapper = $(this);
    if ($wrapper.find('.color-chooser').length > 0) {
      $wrapper.removeClass('open');
      return $wrapper.slideUp(200, function() {
        return $wrapper.find('.color-chooser').remove();
      });
    }
  };

  $.fn.colorChooser = function(color, settings) {
    var $chooser, $rendered, $wrapper, options, rendered, _onClick;
    if (color == null) {
      color = '';
    }
    options = $.extend({
      onOk: function() {},
      color: color
    }, settings);
    $wrapper = $(this);
    Mustache.parse(app.templates.colorChooser);
    rendered = Mustache.render(app.templates.colorChooser, {});
    $rendered = $(rendered);
    if ($wrapper.hasClass('open')) {
      $wrapper.empty().append($rendered).stop().show();
    } else {
      $wrapper.addClass('open').empty().append($rendered).stop().slideDown(200);
    }
    $chooser = $rendered.find('.colors');
    _onClick = function(e) {
      var $ths;
      e.preventDefault();
      $ths = $(this);
      if (!$ths.hasClass('active')) {
        $chooser.find('span.active').removeClass('active');
        $ths.addClass('active');
        color = $ths.data('color');
        if (typeof options.onOk === "function") {
          return options.onOk(color);
        }
      } else {
        $chooser.find('span.active').removeClass('active');
        if (typeof options.onOk === "function") {
          return options.onOk('');
        }
      }
    };
    $chooser.on('click', 'span.color-icon', _onClick);
    if (options.color !== '') {
      return $chooser.find('.color-' + options.color).addClass('active');
    }
  };

}).call(this);
