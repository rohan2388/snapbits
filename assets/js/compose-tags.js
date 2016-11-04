(function() {
  $.fn.initTag = function() {
    var $els;
    $els = $(this);
    return $els.each(function() {
      var $el, placeholder;
      $el = $(this);
      if ($el.hasClass('ready') === false) {
        placeholder = $el.attr('placeholder');
        $el.removeAttr('placeholder');
        $el.tagsInput({
          defaultText: placeholder,
          height: 'auto',
          width: 'auto',
          minInputWidth: 50
        });
        return $el.addClass('ready');
      }
    });
  };

}).call(this);
