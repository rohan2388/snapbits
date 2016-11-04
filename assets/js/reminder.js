(function() {
  $.fn.reminderEditorDestroy = function(e) {
    var $wrapper;
    $wrapper = $(this);
    if ($wrapper.find('.reminder-editor').length > 0) {
      $wrapper.removeClass('open');
      return $wrapper.slideUp(200, function() {
        return $wrapper.find('.reminder-editor').remove();
      });
    }
  };

  $.fn.reminderEditor = function(time, settings) {
    var $btnWrapper, $date, $reminder, $rendered, $set, $wrapper, data, options, prevdata, rendered, _onChange, _onClick;
    options = $.extend({
      onOk: function() {}
    }, settings);
    time = $.extend({
      time: '',
      reminder: ''
    }, time);
    $wrapper = $(this);
    Mustache.parse(app.templates.reminderEditor);
    data = {
      setAndDateTime: app.lang.reminder_editor_set_date_time,
      remindMe: app.lang.reminder_editor_remind_me,
      dontRemindMe: app.lang.reminder_editor_dont_remind_me,
      onTime: app.lang.reminder_editor_on_time,
      before10Min: app.lang.reminder_editor_10_min_before,
      before30Min: app.lang.reminder_editor_30_min_before,
      before1Hour: app.lang.reminder_editor_1_hour_before,
      before2Hours: app.lang.reminder_editor_2_hours_before,
      before1Day: app.lang.reminder_editor_1_day_before,
      before1Week: app.lang.reminder_editor_1_week_before,
      time: time.time
    };
    switch (time.reminder) {
      case 'no':
        data.valno = true;
        break;
      case 'on-time':
        data.valonTime = true;
        break;
      case '10-min':
        data.valmin10 = true;
        break;
      case '30-min':
        data.valmin30 = true;
        break;
      case '1-hour':
        data.valhr1 = true;
        break;
      case '2-hours':
        data.valhr2 = true;
        break;
      case '1-day':
        data.valday1 = true;
        break;
      case '1-week':
        data.valweek1 = true;
    }
    rendered = Mustache.render(app.templates.reminderEditor, data);
    $rendered = $(rendered);
    $date = $rendered.find('.date-field input');
    $reminder = $rendered.find('.dropdown-field .reminder');
    if (time.time === '') {
      $date.val(moment().format('DD/MM/YY HH:MM')).datePicker();
    } else {
      $date.datePicker();
    }
    $reminder.selectOrDie();
    $btnWrapper = $rendered.find('.reminder-row.hidden');
    $set = $btnWrapper.find('.btn-set');
    if ($wrapper.hasClass('open')) {
      $wrapper.empty().append($rendered).stop().show();
    } else {
      $wrapper.addClass('open').empty().append($rendered).stop().slideDown(200);
    }
    $wrapper.slideDown(200);
    prevdata = {
      time: $date.val(),
      reminder: $reminder.val()
    };
    _onChange = function(e) {
      var $ths, oldVal, type;
      e.preventDefault();
      $ths = $(this);
      type = $ths.attr('class');
      oldVal = prevdata[type];
      prevdata.time = $.trim($date.val());
      prevdata.reminder = $.trim($reminder.val());
      if (oldVal !== prevdata[type]) {
        return $btnWrapper.show();
      }
    };
    _onClick = function(e) {
      e.preventDefault();
      prevdata.time = $date.val();
      prevdata.reminder = $reminder.val();
      $wrapper.reminderEditorDestroy();
      return options.onOk(prevdata);
    };
    $date.on('dp.change change', _onChange);
    $reminder.on('change', _onChange);
    return $set.on('click', _onClick);
  };

}).call(this);
