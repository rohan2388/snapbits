(function() {
  $.fn.toolsClear = function(animate) {
    var $els, $wrapper;
    if (animate == null) {
      animate = true;
    }
    $wrapper = $(this);
    $els = $wrapper.find('.voice-recorder,.media-uploader,.color-chooser,.reminder-editor');
    if ($els.length > 0) {
      if (animate) {
        return $wrapper.slideUp(200, function() {
          return $els.remove();
        });
      } else {
        return $els.remove();
      }
    }
  };

  $(document).on('compose.area.rendered', function(e, $composeArea) {
    var $college, $gallery, $media_area, $submit, $tools, $tools_area, _addColor, _addDoc, _addImage, _addPlayer, _clearForm, _getData, _reminderSet, _submit, _toolOnClick, _validateField;
    $composeArea.find('.field-tags').initTag();
    $tools = $composeArea.find('.media-options .switch');
    $tools_area = $composeArea.find('.editor-area');
    $media_area = $composeArea.find('.media-area');
    $gallery = $composeArea.find('.gallery-area');
    $college = $gallery.find('.college');
    $college.addClass('edit-mode');
    $submit = $composeArea.find('.submit-group input');
    app.clearComposePost();
    _addPlayer = function(rendered, blob) {
      var $rendered;
      $rendered = $(rendered);
      $rendered.data('blob', blob);
      $rendered.voicePlayer();
      $media_area.append($rendered);
      return $tools.find('a.recorder').removeClass('active');
    };
    _addImage = function($img, file) {
      var $rendered;
      $tools.find('a.image').removeClass('active');
      $rendered = $('<li>').append($img).append('<span class="overlay"><span class="pe-7s-close"></span></span>');
      $rendered.data('file', file);
      $college.append($rendered).collagePlus({
        targetHeight: 150,
        allowPartialLastRow: true
      });
      $rendered.find('.overlay').on('click', function(e) {
        var index, _file;
        e.preventDefault();
        _file = $rendered.data('file');
        index = window.tempImgs.indexOf(_file);
        if (index >= 0) {
          window.tempImgs.splice(index, 1);
        }
        $rendered.remove();
        return $college.collagePlus({
          targetHeight: 150,
          allowPartialLastRow: true
        });
      });
      return $tools.find('a.image').removeClass('active');
    };
    _addDoc = function(rendered, file) {
      var $rendered;
      $rendered = $(rendered);
      $rendered.data('file', file);
      $media_area.append($rendered);
      $tools.find('a.doc').removeClass('active');
      return $rendered.find('.actions .delete').on('click', function(e) {
        var index, _file;
        e.preventDefault();
        _file = $rendered.data('file');
        index = window.tempDocs.indexOf(_file);
        if (index >= 0) {
          window.tempDocs.splice(index, 1);
        }
        return $rendered.remove();
      });
    };
    _addColor = function(color) {
      var $rendered, rendered;
      $media_area.find('.color-viewer').remove();
      $tools_area.colorChooserDestroy();
      $tools.find('a.color').removeClass('active');
      if (color !== '') {
        Mustache.parse(app.templates.colorViewer);
        rendered = Mustache.render(app.templates.colorViewer, {
          color: color
        });
        $rendered = $(rendered);
        $rendered.find('.actions .delete').on('click', function(e) {
          e.preventDefault();
          $tools_area.find('.color-chooser ul li span.color-icon.active').removeClass('active');
          return $rendered.remove();
        });
        return $media_area.append($rendered);
      }
    };
    _reminderSet = function(val) {
      var $rendered, rendered, time;
      $media_area.find('.remider-viewer').remove();
      time = val.time.replace(' ', ' at ');
      window.app.composerPost.reminder = val;
      $tools.find('a.reminder').removeClass('active');
      Mustache.parse(window.app.templates.reminderViewer);
      rendered = Mustache.render(window.app.templates.reminderViewer, {
        time: time
      });
      $rendered = $(rendered);
      $rendered.find('.actions .delete').on('click', function(e) {
        e.preventDefault();
        window.app.composerPost.reminder = {
          time: '',
          reminder: ''
        };
        return $rendered.remove();
      });
      return $media_area.append($rendered);
    };
    _toolOnClick = function(e) {
      var $colorViewer, $ths, color, type;
      e.preventDefault();
      $ths = $(this);
      if ($ths.parent().hasClass('disabled')) {
        tooltip.hide();
        if (window.f3.disabledUpgradePopup !== 'yes') {
          window.app.popup('upgrade', {}, {
            ok: function(data) {
              window.app.pushState('#settings');
              return setTimeout(function() {
                var scrollTop;
                scrollTop = window.app.layout.$settingsArea.find('.box-your-plan').position().top - 15;
                return window.app.layout.$settingsAreaWrapper.find('.scroll-inner').animate({
                  scrollTop: scrollTop
                }, 'slow');
              }, 500);
            },
            remember: function(check) {
              window.f3.disabledUpgradePopup = check ? 'yes' : 'no';
              return window.app.ajax.disableUpgradePopup(check);
            }
          });
        }
        return;
      }
      if ($ths.hasClass('active')) {
        $ths.removeClass('active');
        return $tools_area.toolsClear();
      } else {
        $tools_area.toolsClear(false);
        $tools.find('a.active').removeClass('active');
        $ths.addClass('active');
        type = $ths.data('type');
        switch (type) {
          case 'recorder':
            return $tools_area.recoder({
              onOk: _addPlayer
            });
          case 'image':
            return $tools_area.uploader('image', {
              onOk: _addImage
            });
          case 'doc':
            return $tools_area.uploader('doc', {
              onOk: _addDoc
            });
          case 'color':
            color = false;
            $colorViewer = $media_area.find('.color-viewer');
            if ($colorViewer.length > 0) {
              color = $colorViewer.data('color');
            }
            return $tools_area.colorChooser(color, {
              onOk: _addColor
            });
          case 'reminder':
            return $tools_area.reminderEditor(window.app.composerPost.reminder, {
              onOk: _reminderSet
            });
        }
      }
    };
    _clearForm = function() {
      $composeArea.find('.field-title').val('');
      $composeArea.find('.field-content').val('');
      $gallery.find('.college').empty();
      $media_area.empty();
      $composeArea.find('.field-tags').importTags('');
      window.tempVoiceNotes = [];
      window.docs = [];
      return window.tempImgs = [];
    };
    _getData = function() {
      var _color;
      app.composerPost.title = $composeArea.find('.field-title').val();
      app.composerPost.content = $composeArea.find('.field-content').val();
      if (typeof window.tempVoiceNotes !== 'undefined') {
        $.each(window.tempVoiceNotes, function(e, voiceNote) {
          return app.composerPost.voiceNotes.push(voiceNote);
        });
      }
      if (typeof window.tempDocs !== 'undefined') {
        app.composerPost.docs = window.tempDocs;
      }
      if (typeof window.tempImgs !== 'undefined') {
        app.composerPost.imgs = window.tempImgs;
      }
      _color = $media_area.find('.color-viewer').eq(0).data('color');
      app.composerPost.color = typeof _color === 'undefined' ? '' : _color;
      app.composerPost.tags = $composeArea.find('.tags-group .field-tags').val();
      app.composerPost.lock = $tools.find('.lock').hasClass('active');
      app.composerPost.time = moment().format('X');
      return app.composerPost;
    };
    _validateField = function(e) {
      var $ths;
      $ths = $(this);
      if ($.trim($ths.val()) === '') {
        return $ths.parent().addClass('has-error');
      } else {
        return $ths.parent().removeClass('has-error');
      }
    };
    _submit = function(e) {
      var hasError, post;
      e.preventDefault();
      hasError = false;
      if ($.trim($composeArea.find('.field-title').val()) === '') {
        $composeArea.find('.field-title').parent().addClass('has-error');
        hasError = true;
      }
      if ($.trim($composeArea.find('.field-content').val()) === '') {
        $composeArea.find('.field-content').parent().addClass('has-error');
        hasError = true;
      }
      if (!hasError) {
        post = _getData();
        _clearForm();
        return $(document).trigger('timeline.post.add', [post, $composeArea]);
      }
    };
    $composeArea.find('.field-title,.field-content').on('change', _validateField);
    $tools.on('click', 'a', _toolOnClick);
    return $submit.on('click', _submit);
  });

  window._app.prototype.renderComposeArea = function() {
    var data, rendered;
    Mustache.parse(this.templates.composeArea);
    data = {
      titlePlaceholder: this.lang.compose_title_placeholder,
      contentPlaceholder: this.lang.compose_content_placeholder,
      tagPlaceholder: this.lang.compose_tag_placeholder,
      submit: this.lang.compose_submit,
      tooltip_lock: this.lang.compose_lock_tooltip,
      premium: window.f3.premium === 'yes' ? true : false
    };
    rendered = Mustache.render(this.templates.composeArea, data);
    this.layout.$composeArea.append(rendered);
    return $(document).trigger('compose.area.rendered', [app.layout.$composeArea]);
  };

}).call(this);
