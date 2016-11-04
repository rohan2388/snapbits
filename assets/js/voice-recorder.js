(function() {
  window.makeid = function() {
    var i, possible, text;
    text = "";
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    i = 0;
    while (i <= 8) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      i++;
    }
    return text;
  };

  window.formatTime = function(seconds) {
    var minutes;
    minutes = Math.floor(seconds / 60);
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  };

  $.fn.recoderDestroy = function() {
    var $wrapper;
    $wrapper = $(this);
    if ($wrapper.find('.voice-recorder').length > 0) {
      $wrapper.removeClass('open');
      return $wrapper.stop().slideUp(200, function() {
        return $wrapper.find('.voice-recorder').remove();
      });
    }
  };

  $.fn.recoder = function(settings) {
    var $btn_cancel, $btn_ok, $btn_record, $recorder, $timer, $wrapper, options, rendered, _cancel, _createPlayer, _generateFileName, _getDuration, _isRecording, _ok, _record;
    $wrapper = $(this);
    Mustache.parse(app.templates.recorder);
    rendered = Mustache.render(app.templates.recorder, {
      clickToRecord: 'Click to record'
    });
    $recorder = $(rendered);
    if ($wrapper.hasClass('open')) {
      $wrapper.empty().append($recorder).stop().show();
    } else {
      $wrapper.addClass('open').empty().append($recorder).stop().slideDown(200);
    }
    options = $.extend({
      onOk: function(rendered) {}
    }, settings);
    $btn_record = $recorder.find('.record-start');
    $btn_ok = $recorder.find('.record-ok');
    $btn_cancel = $recorder.find('.record-cancel');
    $timer = $recorder.find('span.timer');
    _generateFileName = function(prepend) {
      var filename, timestamp;
      timestamp = moment().format('DD-MM-YYYY');
      filename = prepend + '-' + timestamp + '-' + makeid().toLowerCase();
      return filename;
    };
    _isRecording = function() {
      return $recorder.hasClass('recording');
    };
    _record = function(e) {
      e.preventDefault();
      if (!_isRecording()) {
        $recorder.addClass('recording');
        return Fr.voice.record(false, function() {});
      }
    };
    _cancel = function(e) {
      e.preventDefault();
      if (_isRecording()) {
        Fr.voice.stop();
        return $recorder.removeClass('recording');
      }
    };
    _ok = function(e) {
      var filename;
      e.preventDefault();
      if (_isRecording()) {
        Fr.voice["export"](_createPlayer, 'blob');
        Fr.voice.stop();
        $recorder.removeClass('recording');
        $wrapper.trigger('recoder.destroy');
        filename = _generateFileName('voice-note');
        return $wrapper.slideUp(200, function() {
          return $recorder.remove();
        });
      }
    };
    _getDuration = function(url, cb) {
      var audio;
      audio = new Audio();
      audio.autoplay = false;
      $(audio).on('loadedmetadata', function() {
        return cb(audio.duration);
      });
      return audio.src = url;
    };
    _createPlayer = function(blob) {
      var url;
      url = URL.createObjectURL(blob);
      if (typeof window.tempVoiceNotes === 'undefined') {
        window.tempVoiceNotes = [];
      }
      window.tempVoiceNotes.push(blob);
      return _getDuration(url, function(duration) {
        var totatTime;
        totatTime = formatTime(duration);
        url = URL.createObjectURL(blob);
        Mustache.parse(app.templates.player);
        rendered = Mustache.render(app.templates.player, {
          totalTime: totatTime,
          url: url
        });
        return options.onOk(rendered, blob, totatTime);
      });
    };
    $btn_record.on('click', _record);
    $btn_cancel.on('click', _cancel);
    return $btn_ok.on('click', _ok);
  };

}).call(this);
