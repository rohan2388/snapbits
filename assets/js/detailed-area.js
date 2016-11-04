(function() {
  window._app.prototype.renderDetailedMediaArea = function(post, $da) {
    var $rendered, rendered, ths;
    if (post == null) {
      post = null;
    }
    if ($da == null) {
      $da = $([]);
    }
    ths = this;
    if (post === null) {
      return;
    }
    post = this.objToPost(post);
    rendered = this.renderDetailedArea(post, true);
    $rendered = $(rendered);
    $da.find('.details-note-wrapper').replaceWith($rendered);
    return $da.find('.details-media-area .voice-player').voicePlayer();
  };

  window._app.prototype.renderDetailedArea = function(post, rerender, token) {
    var data, docs, hasImage, hasMedia, imageUrl, imgs, itemClass, rendered, ths, voiceNotes;
    if (post == null) {
      post = null;
    }
    if (rerender == null) {
      rerender = false;
    }
    if (token == null) {
      token = '';
    }
    ths = this;
    if (post === null) {
      return;
    }
    post = this.objToPost(post);
    if (!rerender) {
      Mustache.parse(this.templates.detailedToolbar);
      rendered = Mustache.render(this.templates.detailedToolbar, {
        locked: post.lock,
        tooltip_lock: this.lang.compose_lock_tooltip,
        premium: window.f3.premium === 'yes' ? true : false
      });
      this.layout.$detailedArea.append(rendered);
    }
    imageUrl = '';
    itemClass = '';
    imgs = [];
    if (hasImage = post.imgs.length > 0) {
      itemClass = 'has-image';
      $.each(post.imgs, function(k, img) {
        if (typeof img.get === 'function' || typeof img.tagName === 'string') {
          if (typeof img.get === 'function') {
            return imgs.push({
              src: img.get(0).src
            });
          } else {
            return imgs.push({
              src: img.src
            });
          }
        } else {
          return imgs.push({
            src: img
          });
        }
      });
    }
    hasMedia = false;
    docs = [];
    if (post.docs.length > 0) {
      hasMedia = true;
      $.each(post.docs, function(k, doc) {
        var _doc;
        _doc = $.extend({
          filename: 'no name',
          ext: '',
          url: '',
          viewUrl: ''
        }, doc);
        return docs.push(_doc);
      });
    }
    voiceNotes = [];
    if (post.voiceNotes.length > 0) {
      hasMedia = true;
      $.each(post.voiceNotes, function(k, voiceNote) {
        var _voiceNote;
        _voiceNote = $.extend({
          filename: 'no name',
          totalTime: '00:00',
          ext: '',
          url: ''
        }, voiceNote);
        return voiceNotes.push(_voiceNote);
      });
    }
    if (post.reminder.time !== '') {
      post.reminder.timetxt = post.reminder.time.replace(' ', ' at ');
      hasMedia = true;
    }
    Mustache.parse(this.templates.detailedNote);
    data = {
      id: post.id,
      title: post.title,
      time: moment.unix(post.time).format('DD/MM/YYYY'),
      content: post.content,
      hasTags: $.trim(post.tags.length) > 0,
      tags: post.tags.split(','),
      color: post.color !== '' ? post.color : 'none',
      hasImage: hasImage,
      imgs: imgs,
      itemClass: itemClass,
      hasMedia: hasMedia,
      docs: docs,
      voiceNotes: voiceNotes,
      reminder: post.reminder.time !== '' ? post.reminder : false
    };
    rendered = Mustache.render(this.templates.detailedNote, data);
    if (!rerender) {
      this.layout.$detailedArea.append(rendered).data('token', token);
      $(document).trigger('details.post.rendered', [app.layout.$detailedArea, token]);
    }
    return rendered;
  };

  $(document).on('details.post.rendered', function(e, $detailsArea, token) {
    if (token == null) {
      token = '';
    }
    setTimeout(function() {
      return window.app.layout.$detailedArealoader.fadeOut('slow');
    }, 700);
    $detailsArea.find('.details-media-area .voice-player').voicePlayer();
    setTimeout(function() {
      return $detailsArea.find('.college').collagePlus();
    }, 600);
    return $detailsArea.detailedEditor();
  });

  $(document).on('details.post.show', function(e, postId, token) {
    if (postId == null) {
      postId = 0;
    }
    if (token == null) {
      token = '';
    }
    token = '';
    if (window.app.tokens !== void 0) {
      if (typeof window.app.tokens[postId] === 'string') {
        token = window.app.tokens[postId];
      }
    }
    window.app.showDedatiledArea();
    return window.app.ajax.get_post(postId, token, {
      'complete': function(post) {
        if (post === void 0) {
          return window.app.pushState('#composer');
        } else {
          window.editorMode = false;
          return window.app.renderDetailedArea(post, false, token);
        }
      }
    });
  });

  $(document).on('details.post.edit', function(e, postId, token) {
    if (postId == null) {
      postId = 0;
    }
    if (token == null) {
      token = '';
    }
    token = '';
    if (window.app.tokens !== void 0) {
      if (typeof window.app.tokens[postId] === 'string') {
        token = window.app.tokens[postId];
      }
    }
    window.app.showDedatiledArea();
    return window.app.ajax.get_post(postId, token, {
      'complete': function(post) {
        if (post === void 0) {
          return window.app.pushState('#composer');
        } else {
          window.editorMode = true;
          return window.app.renderDetailedArea(post, false, token);
        }
      }
    });
  });

}).call(this);
