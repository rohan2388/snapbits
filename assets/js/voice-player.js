(function() {
  window._player = function() {
    var ths;
    this.url = '';
    this.audio = new Audio;
    this.audio.autoplay = false;
    this._ths = this;
    ths = this;
    this.animationId = null;
    this.stopRefresh = false;
    this.$audio = $(this.audio);
    this.$player = $([]);
    this.intval = 0;
    this.frameRequestId = 0;
    this.getSrc = function() {
      return this.audio.src;
    };
    this.setSrc = function(url) {
      return this.audio.src = url;
    };
    this.pause = function() {
      return this.audio.pause();
    };
    this.play = function() {
      return this.audio.play();
    };
    this.stop = function() {
      this.audio.pause();
      return this.audio.currentTime = 0;
    };
    this.load = function() {
      return this.audio.load();
    };
    this.duration = function() {
      return this.audio.duration;
    };
    this.formatTime = function(secs) {
      var hr, min, sec;
      secs = parseInt(secs);
      hr = Math.floor(secs / 3600);
      min = Math.floor((secs - (hr * 3600)) / 60);
      sec = Math.floor(secs - (hr * 3600) - (min * 60));
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return min + ':' + sec;
    };
    this.seekTo = function(time) {
      return this.audio.currentTime = time;
    };
    this.updateEventListener = function(settings) {
      var options;
      options = $.extend({
        timeupdate: function() {},
        ended: function() {},
        pause: function() {
          return {
            progress: function() {}
          };
        }
      }, settings);
      this.$audio.off();
      this.$audio.on('ended', options.ended.bind(this));
      this.$audio.on('pause', options.pause.bind(this));
      return this.$audio.on('play', options.progress.bind(this));
    };
    return this;
  };

  window.player = new _player();

  $.fn.voicePlayer = function() {
    var $els;
    $els = $(this);
    if ($els.length === 0) {
      return $els;
    }
    return $els.each(function() {
      var $controlIcon, $currentTime, $player, $playerControl, $progress, $progressPointer, $progressWrapper, $totalTime, Xmax, Xmin, isDragging, pauseIcon, playIcon, progressWidth, _drag, _dragStop, _ended, _pause, _progress, _resize, _seekTo, _togglePlay, _update;
      $player = $(this);
      playIcon = 'pe-7s-play';
      pauseIcon = 'pe-7s-power';
      $playerControl = $player.find('.player-control');
      $controlIcon = $playerControl.find('span');
      $progressWrapper = $player.find('.progress-wrapper');
      $currentTime = $progressWrapper.find('.current-time');
      $totalTime = $progressWrapper.find('.total-time');
      $progress = $progressWrapper.find('.progress');
      $progressPointer = $progress.find('.progress-pointer');
      progressWidth = 0;
      Xmin = 0;
      Xmax = 0;
      _update = function(time, formatted) {
        var duration, percent;
        if (!window.player.stopRefresh) {
          time = parseInt(player.audio.currentTime, 10);
          formatted = player.formatTime(time);
          $currentTime.text(formatted);
          duration = window.player.duration();
          if (!isNaN(duration)) {
            formatted = window.player.formatTime(duration);
            $totalTime.text(formatted);
            percent = Math.ceil((100 * time) / duration);
            return $progressPointer.css('left', percent + '%');
          }
        }
      };
      _ended = function() {
        window.player.pause();
        window.player.seekTo(0);
        cancelAnimationFrame(window.player.frameRequestId);
        $progressPointer.css('left', '0px');
        return $player.removeClass('playing');
      };
      _pause = function() {
        return cancelAnimationFrame(window.player.frameRequestId);
      };
      _progress = function() {
        var _step;
        cancelAnimationFrame(window.player.frameRequestId);
        _step = function() {
          var duration, formatted, percent, time, _time;
          if (!window.player.stopRefresh) {
            if (window.player.audio.readyState > 0) {
              _time = window.player.audio.currentTime;
              time = parseInt(_time, 10);
              formatted = window.player.formatTime(time);
              $currentTime.text(formatted);
              duration = window.player.duration();
              if (!isNaN(duration)) {
                formatted = window.player.formatTime(duration);
                $totalTime.text(formatted);
                percent = (100 * _time) / duration;
                $progressPointer.css('left', percent + '%');
                console.log('Progress frame....');
              }
            }
          }
          return window.player.frameRequestId = requestAnimationFrame(_step);
        };
        return window.player.frameRequestId = requestAnimationFrame(_step);
      };
      _togglePlay = function(e) {
        var src;
        e.preventDefault();
        if ($player.hasClass('playing')) {
          $player.removeClass('playing');
          return window.player.pause();
        } else {
          window.player.$player.removeClass('playing');
          $player.addClass('playing');
          src = $player.data('audio-url');
          if (src !== player.getSrc()) {
            window.player.pause();
            window.player.$player.find('.progress-pointer').css('left', '0');
            window.player.updateEventListener({
              timeupdate: _update,
              ended: _ended,
              pause: _pause,
              progress: _progress
            });
            player.setSrc(src);
            _resize();
            player.play();
          } else {
            _resize();
            player.play();
          }
          return window.player.$player = $player;
        }
      };
      _seekTo = function(e) {
        var duration, percent, relativePos, seekto, x;
        e.preventDefault();
        if ($player.hasClass('playing')) {
          x = e.clientX || e.screenX;
          if (x >= Xmin && x <= Xmax) {
            relativePos = x - Math.floor(Xmin);
            percent = (100 * relativePos) / progressWidth;
            duration = window.player.duration();
            seekto = Math.floor((duration * percent) / 100);
            return window.player.seekTo(seekto);
          }
        }
      };
      _resize = function() {
        progressWidth = $progress.width();
        Xmin = $progress.offset().left;
        return Xmax = Xmin + progressWidth;
      };
      $playerControl.on('click', _togglePlay);
      $progress.on('click', _seekTo);
      _resize();
      isDragging = false;
      _drag = function(e) {
        var duration, percent, relativePos, seekto, x;
        e.preventDefault();
        x = e.clientX || e.screenX;
        if (x >= Xmin && x <= Xmax) {
          relativePos = x - Math.floor(Xmin);
          percent = (100 * relativePos) / progressWidth;
          duration = window.player.duration();
          seekto = Math.floor((duration * percent) / 100);
          $progressPointer.css('left', percent + '%');
          window.player.seekTo(seekto);
        }
        return console.log('Seeking...');
      };
      _dragStop = function(e) {
        e.preventDefault();
        $(document).off('mousemove', _drag);
        $(document).off('mouseup', _dragStop);
        return window.player.stopRefresh = false;
      };
      $progressPointer.mousedown(function(e) {
        e.preventDefault();
        window.player.stopRefresh = true;
        $(document).on('mousemove', _drag);
        return $(document).on('mouseup', _dragStop);
      });
      return $(document).on('voice.player.repos', _resize);
    });
  };

}).call(this);
