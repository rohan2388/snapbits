(function() {
  $.fn.innerText = function() {
    if (document.body.innerText) {
      return this[0].innerText;
    } else {
      return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
    }
  };

  $.fn.detailedEditor = function() {
    var $da, $n_content, $n_gallery, $n_img_overlay, $n_imgs, $n_media_area, $n_tags, $n_tagsWrapper, $n_tagsfield, $n_timestamp, $n_title, $n_tools_area, $note, $tb_default, $tb_edit, $tbs, post, postDefault, rfiles, tb_edit, token, _createPostObjFromView, _domCache, _editorMode, _onPaste, _previewMode, _remove, _toolsInit;
    $da = $(this);
    $tbs = $tb_default = $tb_edit = $note = $n_title = $n_timestamp = $n_tools_area = $n_media_area = $n_content = $n_tagsWrapper = $n_tags = $n_tagsfield = $n_gallery = $n_imgs = $n_img_overlay = null;
    rfiles = [];
    token = '';
    postDefault = post = {
      title: '',
      content: '',
      timestamp: '',
      tags: '',
      imgs: '',
      color: '',
      color_class: ''
    };
    tb_edit = {};
    _domCache = function() {
      var $tb_remove;
      $tbs = $da.find('.details-toolbar');
      $tb_default = $tbs.find('.default');
      $tb_edit = $tbs.find('.edit');
      $tb_remove = $tbs.find('.remove');
      $note = $da.find('.details-note');
      $n_title = $note.find('> h1.title');
      $n_timestamp = $note.find('> span.timestamp');
      $n_content = $note.find('> div.content');
      $n_tagsWrapper = $da.find('.details-tags');
      $n_tags = $n_tagsWrapper.find('> .tags .tag');
      $n_tagsfield = $n_tagsWrapper.find('.tags-group .field-tags');
      $n_gallery = $da.find('.details-gallery');
      $n_imgs = $n_gallery.find('.college img');
      $n_img_overlay = $n_gallery.find('span.overlay');
      $n_tools_area = $('.details-editor-area');
      $n_media_area = $('.details-media-area');
      return tb_edit = {
        $recoder: $tb_edit.find('.recorder'),
        $image: $tb_edit.find('.image'),
        $doc: $tb_edit.find('.doc'),
        $color: $tb_edit.find('.color'),
        $reminder: $tb_edit.find('.reminder'),
        $lock: $tb_edit.find('.lock')
      };
    };
    _createPostObjFromView = function() {
      var color, _imgs, _post, _tags, _tags_str;
      _post = postDefault;
      _post['title'] = $n_title.text();
      _post['content'] = $n_content.html();
      _post['timestamp'] = moment('01/10/2014', 'DD/MM/YYYY').unix();
      _tags = {};
      _tags_str = '';
      if ($n_tags.length > 0) {
        $n_tags.each(function() {
          var $ths, txt;
          $ths = $(this);
          txt = $ths.text();
          _tags_str += txt + ',';
          return _tags[txt.toLowerCase()] = txt;
        });
      }
      _tags_str = _tags_str.slice(0, -1);
      _post['tags'] = _tags;
      _post['tags_str'] = _tags_str;
      _imgs = {};
      if ($n_imgs.length > 0) {
        $n_imgs.each(function() {
          var $ths, id, url;
          $ths = $(this);
          url = $ths.attr('src');
          id = $ths.data('id');
          return _imgs[id] = url;
        });
      }
      _post['imgs'] = _imgs;
      color = $note.classWithPrefix('color-');
      if (color !== '') {
        _post['color'] = '#' + color;
        _post['color_class'] = 'color-' + color;
      }
      return _post;
    };
    _onPaste = function(e) {
      var $result, clipboardData, htmlText, plaintext;
      e.preventDefault();
      clipboardData = e.clipboardData || window.clipboardData;
      plaintext = clipboardData.getData('Text');
      htmlText = (e.originalEvent || e).clipboardData.getData('text/html');
      if (plaintext.length > 0 && htmlText !== '') {
        $result = $('<div></div>').append($(htmlText));
      } else {
        $result = $('<div></div>').append(plaintext);
      }
      return document.execCommand("insertHTML", false, $result.text());
    };
    _toolsInit = function() {
      tb_edit.inited = true;
      tb_edit.$recoder.on('click', function(e) {
        var $ths;
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
        if (tb_edit.$recoder.hasClass('active')) {
          tb_edit.$recoder.removeClass('active');
          return $n_tools_area.recoderDestroy();
        } else {
          tb_edit.$reminder.removeClass('active');
          tb_edit.$image.removeClass('active');
          tb_edit.$doc.removeClass('active');
          tb_edit.$color.removeClass('active');
          tb_edit.$recoder.addClass('active');
          $n_tools_area.toolsClear(false);
          return $n_tools_area.recoder({
            onOk: function(rendered, blob, duration) {
              var $rendered;
              $rendered = $(rendered);
              $rendered.data('blob', blob);
              $rendered.data('duration', duration);
              $n_media_area.append($rendered);
              $rendered.voicePlayer();
              tb_edit.$recoder.removeClass('active');
              return $n_tools_area.removeClass('open');
            }
          });
        }
      });
      tb_edit.$image.on('click', function(e) {
        var $ths;
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
        if (tb_edit.$image.hasClass('active')) {
          tb_edit.$image.removeClass('active');
          return $n_tools_area.uploaderDestroy();
        } else {
          tb_edit.$reminder.removeClass('active');
          tb_edit.$recoder.removeClass('active');
          tb_edit.$doc.removeClass('active');
          tb_edit.$color.removeClass('active');
          tb_edit.$image.addClass('active');
          $n_tools_area.toolsClear(false);
          return $n_tools_area.uploader('image', {
            onOk: function($img, file) {
              var $rendered;
              $rendered = $('<li>').append($img).append('<span class="overlay"><span class="pe-7s-close"></span></span>');
              $rendered.data('file', file);
              $n_gallery.find('.college').append($rendered).collagePlus({
                allowPartialLastRow: true
              });
              tb_edit.$image.removeClass('active');
              return $n_tools_area.removeClass('open');
            }
          });
        }
      });
      tb_edit.$doc.on('click', function(e) {
        var $ths;
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
        if (tb_edit.$doc.hasClass('active')) {
          tb_edit.$doc.removeClass('active');
          return $n_tools_area.uploaderDestroy();
        } else {
          tb_edit.$reminder.removeClass('active');
          tb_edit.$recoder.removeClass('active');
          tb_edit.$image.removeClass('active');
          tb_edit.$color.removeClass('active');
          tb_edit.$doc.addClass('active');
          $n_tools_area.toolsClear(false);
          return $n_tools_area.uploader('doc', {
            onOk: function(rendered, file) {
              var $rendered;
              $rendered = $(rendered);
              $rendered.data('file', file);
              $n_media_area.append($rendered);
              tb_edit.$doc.removeClass('active');
              return $n_tools_area.removeClass('open');
            }
          });
        }
      });
      tb_edit.$color.on('click', function(e) {
        var color;
        e.preventDefault();
        if (tb_edit.$color.hasClass('active')) {
          tb_edit.$color.removeClass('active');
          return $n_tools_area.colorChooserDestroy();
        } else {
          tb_edit.$reminder.removeClass('active');
          tb_edit.$recoder.removeClass('active');
          tb_edit.$image.removeClass('active');
          tb_edit.$doc.removeClass('active');
          tb_edit.$color.addClass('active');
          $n_tools_area.toolsClear(false);
          color = $note.classWithPrefix('color-');
          return $n_tools_area.colorChooser(color, {
            onOk: function(color) {
              var colorClass;
              colorClass = 'color-' + color;
              $note.removeClassPrefix('color-').addClass(colorClass).data('color', color);
              $n_tagsWrapper.removeClassPrefix('color-').addClass(colorClass);
              tb_edit.$color.removeClass('active');
              window.app.layout.$detailedAreaProgress.addClass(colorClass);
              return $n_tools_area.colorChooserDestroy();
            }
          });
        }
      });
      tb_edit.$reminder.on('click', function(e) {
        var $data, $ths;
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
        if (tb_edit.$reminder.hasClass('active')) {
          tb_edit.$reminder.removeClass('active');
          return $n_tools_area.reminderEditorDestroy();
        } else {
          tb_edit.$recoder.removeClass('active');
          tb_edit.$image.removeClass('active');
          tb_edit.$doc.removeClass('active');
          tb_edit.$color.removeClass('active');
          tb_edit.$reminder.addClass('active');
          $n_tools_area.toolsClear(false);
          $data = $.extend({
            time: "",
            reminder: ""
          }, {
            time: $note.data('time'),
            reminder: $note.data('reminder')
          });
          return $n_tools_area.reminderEditor($data, {
            onOk: function(val) {
              var $rendered, rendered, time;
              $note.data('time', val.time);
              $note.data('reminder', val.reminder);
              tb_edit.$reminder.removeClass('active');
              $n_media_area.find('.remider-viewer').remove();
              time = val.time.replace(' ', ' at ');
              Mustache.parse(window.app.templates.reminderViewer);
              rendered = Mustache.render(window.app.templates.reminderViewer, {
                time: time
              });
              $rendered = $(rendered);
              return $n_media_area.append($rendered);
            }
          });
        }
      });
      return tb_edit.$lock.on('click', function(e) {
        var $ths;
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
        if (tb_edit.$lock.hasClass('active')) {
          tb_edit.$lock.removeClass('active');
          return $note.data('lock', false);
        } else {
          tb_edit.$lock.addClass('active');
          return $note.data('lock', true);
        }
      });
    };
    _editorMode = function(e) {
      e.preventDefault();
      _domCache();
      $tbs.addClass('editing');
      post = _createPostObjFromView();
      $n_title.attr('contenteditable', 'true');
      $n_content.attr('contenteditable', 'true');
      $n_content.get(0).addEventListener('paste', _onPaste);
      $n_media_area.addClass('edit-mode');
      $n_gallery.find('.college').addClass('edit-mode');
      window.app.layout.$menuMob.addClass('editor');
      rfiles = $note.data('rFiles');
      if (typeof rfiles === 'undefined') {
        rfiles = [];
      }
      $n_gallery.find('.college').off().on('click', 'span.overlay', function(e) {
        var $parent;
        e.preventDefault();
        $parent = $(this).parent();
        if (typeof $parent.data('file') === 'undefined') {
          rfiles.push($parent.find('img').attr('src'));
        }
        $parent.remove();
        return $n_gallery.find('.college').collagePlus({
          allowPartialLastRow: true
        });
      });
      $n_media_area.off();
      $n_media_area.on('click', '.doc-viewer .actions .delete', function(e) {
        var $doc, $ths;
        e.preventDefault();
        $ths = $(this);
        $doc = $ths.closest('.doc-viewer');
        if (typeof $doc.data('file') === 'undefined') {
          rfiles.push($doc.find('a.dl').attr('href'));
        }
        return $doc.remove();
      });
      $n_media_area.on('click', '.remider-viewer .actions .delete', function(e) {
        e.preventDefault();
        $note.data('time', '');
        return $note.data('reminder', '');
      });
      $n_tagsWrapper.addClass('editor-mode');
      $n_tagsfield.initTag();
      $n_tagsfield.importTags(post.tags_str);
      return _toolsInit();
    };
    _previewMode = function(e) {
      var html, rendered, tags, tagsStr, _progress, _rerender;
      e.preventDefault();
      _domCache();
      $tbs.removeClass('editing');
      html = $n_content.removeAttr('contenteditable').html();
      $n_content.html(html + ' ');
      $n_content.get(0).removeEventListener('paste', _onPaste);
      html = $n_title.removeAttr('contenteditable').html();
      $n_title.html(html + ' ');
      $n_media_area.removeClass('edit-mode');
      window.app.layout.$menuMob.removeClass('editor');
      $n_gallery.find('.college').removeClass('edit-mode').collagePlus();
      $n_tagsWrapper.removeClass('editor-mode');
      tagsStr = $n_tagsfield.val();
      tags = tagsStr.split(',');
      Mustache.parse(window.app.templates.tags);
      rendered = Mustache.render(window.app.templates.tags, {
        tags: tags
      });
      $n_tagsWrapper.find('> .tags').replaceWith(rendered);
      $n_tools_area.toolsClear();
      tb_edit.$recoder.off('click').removeClass('active');
      tb_edit.$image.off('click').removeClass('active');
      tb_edit.$doc.off('click').removeClass('active');
      tb_edit.$color.off('click').removeClass('active');
      tb_edit.$reminder.off('click').removeClass('active');
      tb_edit.$lock.off('click');
      post = {};
      post.rfiles = rfiles;
      post.id = $note.data('post-id');
      post.title = $n_title.text();
      post.content = $n_content.innerText();
      post.voiceNotes = [];
      post.voiceNotesMeta = [];
      window.tempVoiceNotes = [];
      $n_media_area.find('.voice-player').each(function() {
        var $ths, blob;
        $ths = $(this);
        blob = $ths.data('blob');
        if (typeof blob !== 'undefined') {
          post.voiceNotes.push(blob);
          return post.voiceNotesMeta.push($ths.data('duration'));
        }
      });
      post.docs = [];
      window.tempDocs = [];
      $n_media_area.find('.doc-viewer:not(.remider-viewer)').each(function() {
        var $ths, file;
        $ths = $(this);
        file = $ths.data('file');
        if (typeof file !== 'undefined') {
          return post.docs.push(file);
        }
      });
      post.imgs = [];
      window.tempImgs = [];
      $n_gallery.find('.college').find('li').each(function() {
        var $ths, file;
        $ths = $(this);
        file = $ths.data('file');
        if (typeof file !== 'undefined') {
          return post.imgs.push(file);
        }
      });
      post.color = $note.classWithPrefix('color-');
      post.tags = tagsStr;
      post.lock = tb_edit.$lock.hasClass('active');
      post.time = moment().format('X');
      post.reminder = {
        reminder: $note.data('reminder'),
        time: $note.data('time')
      };
      _progress = function(e) {
        var percentComplete;
        if (e.lengthComputable) {
          percentComplete = (e.loaded / e.total) * 100;
          window.app.layout.$detailedAreaProgress.css('width', percentComplete + '%');
          return window.app.layout.$detailedArealoader.addClass('progress').show();
        }
      };
      _rerender = function(post) {
        var $_rendered;
        rfiles = [];
        $_rendered = window.app._renderTimelinePost(post, null, false, true, true, false, false);
        $_rendered.addClass('active');
        window.app.layout.$timeline.find('.timeline-item[data-post-id="' + post.id + '"]').replaceWith($_rendered);
        window.app.renderDetailedMediaArea(post, $da);
        return setTimeout(function() {
          return window.app.layout.$detailedArealoader.removeClass('progress').hide();
        }, 1500);
      };
      token = $da.data('token');
      return window.app.ajax.update_post(post, token, {
        progress: _progress,
        complete: _rerender
      });
    };
    _remove = function(e) {
      var postId;
      e.preventDefault();
      postId = $note.data('post-id');
      token = '';
      if (window.app.tokens !== void 0) {
        if (typeof window.app.tokens[postId] === 'string') {
          token = window.app.tokens[postId];
        }
      }
      return window.app.popup('delete', {
        postId: postId,
        token: token
      }, {
        ok: function(data) {
          window.app.showComposerArea();
          window.app.layout.$timeline.find('.timeline-item[data-post-id="' + postId + '"]').remove();
          $(document).trigger('timeline.group.refresh');
          return window.app.ajax.remove_post(postId, token, {});
        }
      });
    };
    _domCache();
    $tb_default.find('.edit').on('click', _editorMode);
    $tb_edit.find('.save').on('click', _previewMode);
    $tb_default.find('.remove').on('click', _remove);
    if (window.editorMode) {
      return $tb_default.find('.edit').trigger('click');
    }
  };

}).call(this);
