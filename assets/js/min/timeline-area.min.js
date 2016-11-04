(function() {
  window._app.prototype._timelinePosts = {};

  window._app.prototype._postGroupStamps = {
    'today': moment().startOf('day').format('X'),
    'yesterday': moment().subtract(1, 'days').startOf('day').format('X'),
    'thisweek': moment().startOf('week').format('X'),
    'lastweek': moment().subtract(1, 'weeks').startOf('week').format('X'),
    'thismonth': moment().startOf('month').format('X'),
    'lastmonth': moment().subtract(1, 'months').startOf('month').format('X')
  };

  $(document).on('filter.change', function(e, filterData) {
    return window.app.ajax.get_posts(10, 1, {
      filter: filterData,
      complete: function(response) {
        window.app.layout.$timeline.data('pagination', response.hasNext);
        window.app.layout.$timeline.data('page', 1);
        return window.app.renderTimlinePosts(response.posts, true);
      }
    });
  });

  $(document).on('timeline.group.refresh', function(e) {
    return window.app.layout.$timeline.find('.timeline-group').each(function() {
      var $ths;
      $ths = $(this);
      if ($ths.find('.timeline-item').length === 0) {
        $ths.prev('.timeline-stamp').remove();
        return $ths.remove();
      }
    });
  });

  $(document).on('timeline.bottom.reached', function(e) {
    var filterData, pageNum;
    pageNum = window.app.layout.$timeline.data('page');
    if (window.app.layout.$timeline.data('pagination')) {
      filterData = get_filters();
      return window.app.ajax.get_posts(10, pageNum + 1, {
        filter: filterData,
        complete: function(response) {
          window.app.layout.$timeline.data('pagination', response.hasNext);
          window.app.layout.$timeline.data('page', pageNum + 1);
          return window.app.renderTimlinePosts(response.posts, false);
        }
      });
    }
  });

  $(document).on('timeline.post.add', function(e, post) {
    var $group, $progressbar, $rendered, data, group, groupClass, img, reader, rendered, _progress, _rerender;
    group = window.app.getPostGroup(post);
    $rendered = $progressbar = null;
    groupClass = 'group-' + window.app.toSlug(group.txt);
    if (window.app.layout.$timeline.children('.' + groupClass).length > 0) {
      $group = window.app.layout.$timeline.children('.' + groupClass);
    } else {
      Mustache.parse(window.app.templates.timelineGroup);
      data = {
        showdate: group.key !== 'timline_group_today',
        date: group.txt,
        dateClass: groupClass
      };
      rendered = Mustache.render(window.app.templates.timelineGroup, data);
      window.app.layout.$timeline.prepend(rendered);
      $group = window.app.layout.$timeline.children('.' + groupClass);
    }
    post.uploading = true;
    _progress = function(e) {
      var percentComplete;
      if (e.lengthComputable) {
        percentComplete = (e.loaded / e.total) * 100;
        return $progressbar.css('width', percentComplete + '%');
      }
    };
    _rerender = function(post) {
      var $_rendered;
      $_rendered = window.app._renderTimelinePost(post, null, false, true, true, false);
      $rendered.replaceWith($_rendered);
      window.app.pushState('#timeline');
      return window.app.ajax.get_tags({
        complete: function(response) {
          Mustache.parse(window.app.templates.searchTags);
          rendered = Mustache.render(window.app.templates.searchTags, {
            tags: response,
            noTagsFound: window.app.lang.search_no_tags_found
          });
          console.log(rendered);
          return window.app.layout.$timelineArea.find('.timeline-search').find('ul.tags').empty().append(rendered);
        }
      });
    };
    if (post.imgs.length > 0) {
      img = post.imgs[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var _post;
        _post = $.extend({}, post);
        _post.imgs = [e.target.result];
        $rendered = window.app._renderTimelinePost(_post, $group, false, true, false);
        $progressbar = $rendered.find('.upload .upload-progress-bar .upload-pointer');
        return window.app.ajax.add_post(post, {
          progress: _progress,
          complete: _rerender
        });
      };
      return reader.readAsDataURL(img);
    } else {
      $rendered = window.app._renderTimelinePost(post, $group, false, true, false);
      $progressbar = $rendered.find('.upload .upload-progress-bar .upload-pointer');
      return window.app.ajax.add_post(post, {
        progress: _progress,
        complete: _rerender
      });
    }
  });

  window._app.prototype.renderTimlineSearch = function() {
    var $rendered, data, rendered, ths;
    ths = this;
    Mustache.parse(this.templates.searchBar);
    data = {
      searchPlaceholder: this.lang.search_search_placeholder,
      colorTags: this.lang.search_color_tags,
      myTags: this.lang.search_my_tags,
      searchByDate: this.lang.search_search_by_date,
      to: this.lang.search_date_to,
      fromPlaceholder: this.lang.search_date_from_placeholder,
      toPlaceholder: this.lang.search_date_to_placeholder,
      advancedSearch: this.lang.search_advanced_search,
      withAllTheseWords: this.lang.search_with_all_of_these_words,
      withThisExact: this.lang.search_with_this_exact_phrase,
      withAtleastOneOfThese: this.lang.search_with_at_least_one_of_these_words,
      withoutTheseWords: this.lang.search_without_these_words,
      noTagsFound: this.lang.search_no_tags_found
    };
    rendered = Mustache.render(this.templates.searchBar, data);
    $rendered = $(rendered);
    this.layout.$timelineArea.append($rendered);
    $(document).trigger('search.rendered', [app.layout.$timelineArea]);
    return this.ajax.get_tags({
      complete: function(response) {
        Mustache.parse(ths.templates.searchTags);
        rendered = Mustache.render(ths.templates.searchTags, {
          tags: response,
          noTagsFound: ths.lang.search_no_tags_found
        });
        return $rendered.find('ul.tags').empty().append(rendered);
      }
    });
  };

  window._app.prototype.renderTimelineArea = function(page, count, cbs) {
    var $rendered, ths;
    if (page == null) {
      page = 1;
    }
    if (count == null) {
      count = 10;
    }
    if (cbs == null) {
      cbs = {};
    }
    ths = this;
    if (page === 1) {
      Mustache.parse(this.templates.timelineWrapper);
      $rendered = $(Mustache.render(this.templates.timelineWrapper, {
        heading: this.lang.timeline_heading
      }));
      this.layout.$timelineArea.append($rendered);
      ths.layout.$timeline = this.layout.$timelineArea.find('.timeline');
      $rendered.eq(0).find('a.minimize').on('click', function(e) {
        var $ths;
        e.preventDefault();
        $ths = $(this);
        if ($ths.hasClass('active')) {
          $ths.removeClass('active');
          $ths.find('span').removeClass('pe-7s-plus').addClass('pe-7s-less');
          return ths.layout.$timeline.find('.timeline-item.minimized').removeClass('minimized');
        } else {
          $ths.addClass('active');
          $ths.find('span').addClass('pe-7s-plus').removeClass('pe-7s-less');
          return ths.layout.$timeline.find('.timeline-item').addClass('minimized');
        }
      });
    }
    return this.ajax.get_posts(count, page, {
      complete: function(response) {
        ths.layout.$timeline.data('pagination', response.hasNext);
        ths.renderTimlinePosts(response.posts, true);
        if (typeof cbs.rendered === 'function') {
          return cbs.rendered();
        }
      }
    });
  };

  window._app.prototype._renderTimelinePost = function(post, $group, retr, prepend, bindEvents, insert, isLocked) {
    var $input, $rendered, $submit, $unlocker, data, docs, hasImage, hasMedia, imageUrl, img, intval, itemClass, reader, rendered, ths, voiceNotes;
    if ($group == null) {
      $group = $();
    }
    if (retr == null) {
      retr = false;
    }
    if (prepend == null) {
      prepend = false;
    }
    if (bindEvents == null) {
      bindEvents = true;
    }
    if (insert == null) {
      insert = true;
    }
    if (isLocked == null) {
      isLocked = true;
    }
    Mustache.parse(this.templates.timelineItem);
    ths = this;
    post = this.objToPost(post);
    intval = null;
    imageUrl = '';
    itemClass = '';
    if (hasImage = post.imgs.length > 0) {
      itemClass = 'has-image';
      img = post.imgs[0];
      if (typeof img === 'string') {
        imageUrl = img;
      } else {
        reader = new FileReader();
        reader.onload = function(e) {
          return imageUrl = e.target.result;
        };
        reader.readAsDataURL(img);
      }
    }
    hasMedia = false;
    docs = [];
    if (post.docs.length > 0) {
      hasMedia = true;
      $.each(post.docs, function(k, doc) {
        var _doc;
        if (typeof doc.name !== 'undefined') {
          doc.filename = doc.name;
        }
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
        var totalTime, url, _voiceNote;
        if (typeof voiceNote.name === 'undefined') {
          url = voiceNote.url;
          totalTime = voiceNote.totalTime;
        } else {
          url = URL.createObjectURL(voiceNote);
          ({
            totalTime: '00:00'
          });
        }
        _voiceNote = $.extend({
          filename: 'no name',
          totalTime: '00:00',
          ext: '',
          url: ''
        }, {
          url: url,
          totalTime: totalTime
        });
        return voiceNotes.push(_voiceNote);
      });
    }
    if (post.reminder.time !== '') {
      post.reminder.timetxt = post.reminder.time.replace(' ', ' at ');
      hasMedia = true;
    }
    data = {
      id: post.id,
      title: post.title,
      time: moment.unix(post.time).format('DD MMMM YYYY'),
      content: post.content.length > 150 ? post.content.substr(0, 150) + '...' : post.content,
      hasTags: $.trim(post.tags.length) > 0,
      tags: post.tags.split(','),
      color: post.color !== '' ? post.color : 'none',
      hasImage: hasImage,
      imageUrl: imageUrl,
      itemClass: itemClass,
      hasMedia: hasMedia,
      docs: docs,
      voiceNotes: voiceNotes,
      uploading: post.uploading || false,
      reminder: post.reminder.time !== '' ? post.reminder : false,
      lock: post.lock,
      isLocked: post.lock ? isLocked : false
    };
    rendered = Mustache.render(this.templates.timelineItem, data);
    $rendered = $(rendered);
    if (bindEvents) {
      $rendered.find('.medias .voice-player').voicePlayer();
      $rendered.on('click', function(e) {
        if ($rendered.hasClass('minimized')) {
          e.stopPropagation();
          e.preventDefault();
          $rendered.removeClass('minimized');
        }
      });
      $rendered.find('.img-wrapper,h1.title,.tags').css('cursor', 'pointer').on('click', function(e) {
        var $ths, postId, token;
        e.preventDefault();
        $ths = $(this);
        if ($rendered.hasClass('minimized')) {
          console.log('ok');
          return;
        }
        if ($rendered.hasClass('lockable')) {
          if (!$rendered.hasClass('unlocked')) {
            $rendered.toggleClass('hover');
            return;
          }
        }
        postId = $rendered.addClass('active').data('post-id');
        token = $rendered.data('token');
        if (token !== void 0) {
          if (ths.tokens === void 0) {
            ths.tokens = {};
          }
          ths.tokens[postId] = token;
        }
        return ths.pushState('#view/' + postId);
      });
      $rendered.on('touchstart', function(e) {
        return $rendered.find('.actions').removeClass('show');
      });
      $rendered.find('.content-wrapper > .actions .remove').on('click', function(e) {
        var postId, token;
        e.preventDefault();
        postId = $rendered.data('post-id');
        token = $rendered.data('token');
        return window.app.popup('delete', {
          postId: postId,
          token: token
        }, {
          ok: function(data) {
            $rendered.css('transition', 'none').slideUp('slow', function() {
              return $rendered.remove();
            });
            return window.app.ajax.remove_post(postId, token, {
              complete: function(response) {
                return window.app.ajax.get_tags({
                  complete: function(response) {
                    Mustache.parse(window.app.templates.searchTags);
                    rendered = Mustache.render(window.app.templates.searchTags, {
                      tags: response,
                      noTagsFound: window.app.lang.search_no_tags_found
                    });
                    console.log(rendered);
                    return window.app.layout.$timelineArea.find('.timeline-search').find('ul.tags').empty().append(rendered);
                  }
                });
              }
            });
          }
        });
      });
      $rendered.find('.content-wrapper > .actions .edit').on('click', function(e) {
        var postId, token;
        e.preventDefault();
        postId = $rendered.addClass('active').data('post-id');
        token = $rendered.data('token');
        window.app.$timelineItemOnView = $rendered;
        return ths.pushState('#edit/' + postId);
      });
      $rendered.find('.content-wrapper > .actions .lock').on('click', function(e) {
        var $_rendered, _post;
        e.preventDefault();
        _post = {
          id: post.id,
          title: post.title,
          lock: post.lock,
          time: post.time
        };
        if (ths.tokens !== void 0) {
          if (ths.tokens[post.id] !== void 0) {
            delete ths.tokens[post.id];
          }
        }
        $_rendered = ths._renderTimelinePost(_post, null, true, false, true, false);
        return $rendered.replaceWith($_rendered);
      });
      if ($rendered.find('> div.unlocker').length > 0) {
        $unlocker = $rendered.find('> div.unlocker');
        $submit = $unlocker.find('button');
        $input = $unlocker.find('input');
        $submit.on('click', function(e) {
          var password, postId;
          e.preventDefault();
          password = $.trim($input.val());
          if (password !== '') {
            $submit.addClass('disabled');
            postId = $rendered.data('post-id');
            return ths.ajax.unlockPost(postId, password, {
              complete: function(response) {
                var $_rendered;
                if (response.success) {
                  $_rendered = ths._renderTimelinePost(response.post, null, true, false, true, false, false);
                  $_rendered.data('token', response.token);
                  return $rendered.replaceWith($_rendered);
                } else {
                  $submit.removeClass('disabled');
                  $input.addClass('error-shake');
                  $input.val('');
                  return setTimeout(function() {
                    return $input.removeClass('error-shake');
                  }, 850);
                }
              }
            });
          } else {
            $input.addClass('error-shake');
            return setTimeout(function() {
              return $input.removeClass('error-shake');
            }, 850);
          }
        });
      }
    }
    if (insert) {
      $rendered.addClass('animate-standby');
      if (prepend) {
        $group.prepend($rendered);
      } else {
        $group.append($rendered);
      }
    }
    return $rendered;
  };

  window._app.prototype.getPostGroup = function(post) {
    var current, group, lang, monthsDiff, postTime, timestamp, yearsDiff, _return;
    timestamp = post.time;
    group = '';
    if (timestamp > this._postGroupStamps.today) {
      group = this.lang.timline_group_today;
      lang = 'timline_group_today';
    } else if (timestamp > this._postGroupStamps.yesterday) {
      group = this.lang.timline_group_yesterday;
      lang = 'timline_group_yesterday';
    } else if (timestamp > this._postGroupStamps.thisweek) {
      group = this.lang.timline_group_this_week;
      lang = 'timline_group_this_week';
    } else if (timestamp > this._postGroupStamps.lastweek) {
      group = this.lang.timline_group_last_week;
      lang = 'timline_group_last_week';
    } else if (timestamp > this._postGroupStamps.thismonth) {
      group = this.lang.timline_group_this_month;
      lang = 'timline_group_this_month';
    } else if (timestamp > this._postGroupStamps.lastmonth) {
      group = this.lang.timline_group_last_month;
      lang = 'timline_group_last_month';
    } else {
      current = moment();
      postTime = moment.unix(timestamp).startOf('month');
      monthsDiff = current.diff(postTime, 'months');
      if (monthsDiff > 12) {
        yearsDiff = current.diff(postTime, 'years');
        if (yearsDiff > 1) {
          group = this.lang.timline_group_x_year.replace('_X_', yearsDiff);
          lang = 'timline_group_x_year';
        } else {
          group = this.lang.timline_group_last_year;
          lang = 'timline_group_last_year';
        }
      } else {
        group = this.lang.timline_group_x_month.replace('_X_', current.diff(postTime, 'months'));
        lang = 'timline_group_x_month';
      }
    }
    _return = {
      key: lang,
      txt: $.trim(group)
    };
    return _return;
  };

  window._app.prototype.toSlug = function(str) {
    var $slug, trimmed;
    $slug = '';
    trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return $slug.toLowerCase();
  };

  window._app.prototype.renderTimlinePosts = function(posts, clear) {
    var $timestamp, delay, items, ths;
    if (clear == null) {
      clear = false;
    }
    ths = this;
    if (clear) {
      this.layout.$timeline.empty();
    }
    $timestamp = null;
    items = [];
    $.each(posts, function(k, post) {
      var $group, $rendered, data, group, groupClass, rendered;
      group = ths.getPostGroup(post);
      groupClass = 'group-' + ths.toSlug(group.txt);
      if (ths.layout.$timeline.children('.' + groupClass).length > 0) {
        $group = ths.layout.$timeline.children('.' + groupClass);
      } else {
        Mustache.parse(ths.templates.timelineGroup);
        data = {
          showdate: group.key !== 'timline_group_today',
          date: group.txt,
          dateClass: groupClass
        };
        rendered = $(Mustache.render(ths.templates.timelineGroup, data));
        ths.layout.$timeline.append(rendered);
        $group = ths.layout.$timeline.children('.' + groupClass);
        $timestamp = $group.prev('.timeline-stamp');
        items.push($timestamp);
      }
      $rendered = ths._renderTimelinePost(post, $group);
      return items.push($rendered);
    });
    delay = 150;
    return $.each(items, function(key, $item) {
      var _delay;
      _delay = key * delay;
      if (key === 0) {
        return setTimeout(function() {
          return items[key].removeClass('animate-standby');
        }, 20);
      } else {
        return setTimeout(function() {
          return items[key].removeClass('animate-standby');
        }, _delay);
      }
    });
  };

}).call(this);
