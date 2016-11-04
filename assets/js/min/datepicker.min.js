(function() {
  $.fn.datePicker = function() {
    var $els;
    $els = $(this);
    return $els.each(function() {
      var $el, format, options;
      $el = $(this);
      format = $el.data('format');
      if (format === void 0) {
        format = 'date';
      }
      if (format === 'date') {
        options = {
          useCurrent: false,
          format: 'DD/MM/YYYY',
          icons: {
            previous: 'pe-7s-angle-left',
            next: 'pe-7s-angle-right'
          }
        };
      } else {
        options = {
          useCurrent: false,
          format: 'DD/MM/YYYY HH:mm',
          sideBySide: true,
          icons: {
            previous: 'pe-7s-angle-left',
            next: 'pe-7s-angle-right',
            up: "pe-7s-angle-up",
            down: "pe-7s-angle-down"
          }
        };
      }
      $el.datetimepicker(options);
      $el.on('dp.show', function(e) {
        return $el.parent().addClass('focused');
      });
      $el.on('dp.hide', function(e) {
        return $el.parent().removeClass('focused');
      });
      return $el.on('dp.update dp.show', function(e) {
        var $last, $table, $trs;
        $table = $el.next().find('.datepicker-days .table-condensed');
        $trs = $table.find('tbody tr');
        if ($trs.length === 6) {
          $last = $trs.eq(5);
          if ($last.find('.new').length === 7) {
            return $last.hide();
          }
        }
      });
    });
  };

}).call(this);
