(function() {
  window._app = function() {
    this.baseURL = window.f3.site_url.replace(/\/$/, '');
    return this;
  };


  /**
   * Default composer post
   * @type {Object}
   */

  _app.prototype.composerPost = {};


  /**
   * enable/disable tab close confirmation
   * @param  {bool} active
   * @return {null}
   */

  _app.prototype.closeConfirm = function(active) {
    var message;
    message = "You have unsaved data. Are you sure to leave the page?";
    if (active) {
      return window.onbeforeunload = function() {
        return message;
      };
    } else {
      return window.onbeforeunload = null;
    }
  };


  /**
   * Validate field 
   * @param  {string} str [field value]
   * @param  {string/array} type [type array or string of validation keys seprated by '|']
   * @param  {bool} escape [default: true]
   * @return {array/bool}  [false or array of errors]
   */

  _app.prototype.validateField = function(str, types, escape) {
    var _errors;
    if (str == null) {
      str = '';
    }
    if (types == null) {
      types = 'empty';
    }
    if (escape == null) {
      escape = true;
    }
    if (typeof types !== 'object') {
      types = types.split('|');
    }
    _errors = [];
    if (window.emailRegEx === void 0) {
      window.emailRegEx = new RegExp(/^((?!\.)[a-z0-9._%+-]+(?!\.)\w)@[a-z0-9-\.]+\.[a-z.]{2,5}(?!\.)\w$/i);
      window.passRegEx = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,}/);
      window.passRegExAlpha = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])/);
      window.passRegExNumeric = new RegExp(/^(?=.*\d)/);
      window.passRegExSpecial = new RegExp(/^(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/);
    }
    $.each(types, function(k, type) {
      switch ($.trim(type)) {
        case 'empty':
          if ($.trim(str) === '') {
            return _errors.push('empty');
          }
          break;
        case 'email':
          if (!window.emailRegEx.test(str)) {
            return _errors.push('invalidEmail');
          }
          break;
        case 'password':
          if (str.length < 7) {
            return _errors.push('tooShort');
          } else {
            if (!window.passRegExAlpha.test(str)) {
              return _errors.push('invalidAlpha');
            } else if (!window.passRegExNumeric.test(str)) {
              return _errors.push('invalidNumeric');
            } else if (!window.passRegExSpecial.test(str)) {
              return _errors.push('invalidSpecial');
            }
          }
      }
    });
    if (_errors.length > 0) {
      return _errors;
    } else {
      return false;
    }
  };


  /**
   * Animate error notice above field 
   * @param  {jQuery} $field
   * @param  {string} str
   * @return {null}
   */

  _app.prototype.fieldError = function($field, str, escape) {
    var $msg;
    if (str == null) {
      str = '';
    }
    if (escape == null) {
      escape = false;
    }
    $msg = $field.prev('.msg');
    if ($msg.length === 0) {
      return;
    }
    if (str === '') {
      if ($msg.text() !== '') {
        return $msg.stop().fadeOut('fast', function() {
          return $msg.text('');
        });
      } else {
        return $msg.text('');
      }
    } else {
      if ($msg.text() !== '') {
        if (escape) {
          $msg.text(str);
        } else {
          $msg.html(str);
        }
        return $msg.stop().show().fadeIn('fast');
      } else {
        $msg.hide();
        if (escape) {
          $msg.text(str);
        } else {
          $msg.html(str);
        }
        return $msg.stop().fadeIn('fast');
      }
    }
  };


  /**
   * convert to post object
   * @param  {object} obj
   * @return {object} Post object
   */

  _app.prototype.objToPost = function(obj) {
    var blankPost, post;
    blankPost = {
      id: 0,
      title: '',
      content: '',
      voiceNotes: [],
      docs: [],
      imgs: [],
      color: '',
      tags: '',
      reminder: {
        time: '',
        reminder: ''
      },
      lock: false,
      time: 0
    };
    post = $.extend(blankPost, obj);
    return post;
  };


  /**
   * clear compose post object
   * @return {null}
   */

  _app.prototype.clearComposePost = function() {
    this.composerPost = this.objToPost({});
    return app.composerPost;
  };


  /**
   * 	scrollbar function
   * @return {null}
   */

  _app.prototype.initScrollBars = function() {
    var $detailedAreaInner, $scrollInner, $timelineScrollInner, adjust, ths;
    ths = this;
    adjust = -200;
    $scrollInner = ths.layout.$viewportPan.find('.scroll-inner');
    $timelineScrollInner = this.layout.$timelineAreaWrapper.find('.scroll-inner');
    $detailedAreaInner = this.layout.$detailedAreaWrapper.find('.scroll-inner');
    ths.timeScrollEvent = true;
    if (ths.isMobile) {
      $scrollInner.scrollbar('destroy');
    } else {
      $scrollInner.scrollbar();
    }
    $(window).resize(function() {
      if (!ths.isMobile) {
        return $scrollInner.scrollbar();
      } else {
        return $scrollInner.scrollbar('destroy');
      }
    });
    $timelineScrollInner.on('scroll', function(e) {
      var $ths, ch, scrollTop, vh;
      $ths = $(this);
      vh = ths.layout.$timelineAreaWrapper.height();
      ch = ths.layout.$timelineArea.height();
      scrollTop = $ths.scrollTop();
      if (scrollTop > 150) {
        if (!ths.mobShowArrow) {
          ths.mobShowArrow = true;
          $(document).trigger('menu.mob.showArrow');
        }
      } else {
        if (ths.mobShowArrow) {
          ths.mobShowArrow = false;
          $(document).trigger('menu.mob.hideArrow');
        }
      }
      if ((scrollTop + vh) >= ch + adjust) {
        if (ths.timeScrollEvent) {
          ths.timeScrollEvent = false;
          return $(document).trigger('timeline.bottom.reached');
        }
      } else {
        if (!ths.timeScrollEvent) {
          return ths.timeScrollEvent = true;
        }
      }
    });
    return $detailedAreaInner.on('scroll', function(e) {
      var $ths, ch, scrollTop, vh;
      $ths = $(this);
      vh = ths.layout.$detailedAreaWrapper.height();
      ch = ths.layout.$detailedArea.height();
      scrollTop = $ths.scrollTop();
      if (scrollTop > 150) {
        if (!ths.mobShowArrow) {
          ths.mobShowArrow = true;
          $(document).trigger('menu.mob.showArrow');
        }
      } else {
        if (ths.mobShowArrow) {
          ths.mobShowArrow = false;
          $(document).trigger('menu.mob.hideArrow');
        }
      }
      if ((scrollTop + vh) >= ch + adjust) {
        if (ths.timeScrollEvent) {
          ths.timeScrollEvent = false;
          return $(document).trigger('timeline.bottom.reached');
        }
      } else {
        if (!ths.timeScrollEvent) {
          return ths.timeScrollEvent = true;
        }
      }
    });
  };


  /**
   * Hash change event
   * @return {null}
   */

  _app.prototype.initHashEvent = function() {
    var hash;
    hash = '';
    if (window.location.hash) {
      hash = window.location.hash.replace("#", "");
    }
    $(document).trigger('hash', [hash]);
    return $(window).on('hashchange', function(e) {
      e.preventDefault();
      hash = window.location.hash.replace("#", "");
      return $(document).trigger('hash', [hash]);
    });
  };


  /**
   * Get URL hash
   * @return {string} hash
   */

  _app.prototype.getURLhash = function() {
    if (window.location.hash) {
      return window.location.hash.replace("#", "");
    } else {
      return false;
    }
  };


  /**
   * Add push state
   * @param  {string} url [hash or url to push]
   * @return {null}
   */

  _app.prototype.pushState = function(url) {
    var site_url;
    if (url.indexOf('#') === 0) {
      site_url = window.location.protocol + '//' + window.location.hostname + window.location.pathname + url;
    } else {
      site_url = url;
    }
    window.history.pushState(null, null, site_url);
    $(window).trigger('hashchange');
    return true;
  };


  /**
   * Show menu
   * @param  {bool} clear [default: false]
   * @return {null}
   */

  _app.prototype.showMenuArea = function(clear) {
    if (clear == null) {
      clear = false;
    }
    return this.layout.$viewport.toggleClass('show-nav');
  };


  /**
   * Show post details area
   * @param  {bool} clear [default: true]
   * @return {null}
   */

  _app.prototype.showDedatiledArea = function(clear) {
    var composeAreaWidth;
    if (clear == null) {
      clear = true;
    }
    if (clear) {
      this.layout.$detailedArealoader.removeClass('progress').show();
      this.layout.$detailedAreaProgress.css('width', '0px');
      this.layout.$detailedAreaWrapper.find('.scroll-inner').scroll();
      this.layout.$detailedArea.empty();
    }
    composeAreaWidth = this.layout.$composeAreaWrapper.width();
    this.layout.$viewport.removeClass('composer-view').addClass('detailed-view');
    if (this.isMobile) {
      this.layout.$viewportPan.css('transform', 'translateX(-200vw)');
    } else {
      this.layout.$viewportPan.css('transform', 'translateX(-' + composeAreaWidth + 'px)');
    }
    return this.layout.$menuMob.removeClass('show-composer').removeClass('show-page').addClass('show-post').addClass('back-btn');
  };


  /**
   * Show compose area
   * @param  {bool} clear [default: true]
   * @return {null}
   */

  _app.prototype.showComposerArea = function(clear) {
    if (clear == null) {
      clear = true;
    }
    if (clear) {
      this.layout.$composeArea.find('.field-title').val('');
      this.layout.$composeArea.find('.field-content').val('');
      this.layout.$composeArea.find('.college').empty();
      this.layout.$composeArea.find('.media-area').empty();
      this.layout.$composeArea.find('.field-tags').importTags('');
      window.tempVoiceNotes = [];
      window.docs = [];
      window.tempImgs = [];
    }
    this.layout.$viewport.removeClass('detailed-view').addClass('composer-view');
    this.layout.$viewportPan.css('transform', 'translateX(0)');
    this.layout.$timeline.find('.timeline-item').removeClass('active');
    return this.layout.$menuMob.removeClass('show-post').addClass('show-composer').removeClass('show-page').addClass('back-btn');
  };


  /**
   * Show timeline area
   * @param  {bool} clear [default: true]
   * @return {null}
   */

  _app.prototype.showTimelineArea = function(clear) {
    if (clear == null) {
      clear = true;
    }
    if (clear) {
      this.layout.$composeArea.find('.field-title').val('');
      this.layout.$composeArea.find('.field-content').val('');
      this.layout.$composeArea.find('.college').empty();
      this.layout.$composeArea.find('.media-area').empty();
      this.layout.$composeArea.find('.field-tags').importTags('');
      window.tempVoiceNotes = [];
      window.docs = [];
      window.tempImgs = [];
    }
    this.layout.$viewport.removeClass('detailed-view').removeClass('composer-view');
    this.layout.$timelineAreaWrapper.find('.scroll-inner').scroll();
    if (this.isMobile) {
      this.layout.$viewportPan.css('transform', 'translateX(-100vw)');
    } else {
      this.layout.$viewportPan.css('transform', 'translateX(0)');
    }
    app.layout.$timeline.find('.timeline-item').removeClass('active');
    return this.layout.$menuMob.removeClass('show-composer').removeClass('show-post').removeClass('show-page').removeClass('back-btn');
  };


  /**
   * Hide post details area
   * @return {null}
   */

  _app.prototype.hideDedatiledArea = function() {
    this.layout.$viewport.removeClass('detailed-view');
    return this.layout.$viewportPan.css('transform', 'translateX(0)');
  };


  /**
   * bind menu events
   */

  _app.prototype.BindNavEvents = function() {
    var ths;
    ths = this;
    this.layout.$composerBtn.on('click', function(e) {
      if (!$(this).hasClass('static')) {
        e.preventDefault();
        return ths.pushState('#composer');
      }
    });
    this.layout.$menuBtn.on('click', function(e) {
      e.preventDefault();
      return ths.showMenuArea();
    });
    this.layout.$viewport.find('.menu-area').find('.menu').on('click', 'a', function(e) {
      ths.showMenuArea();
      if ($(this).hasClass('logout')) {
        e.preventDefault();
        return ths.ajax.logout({
          complete: function(response) {
            return window.location.href = window.f3.site_url;
          }
        });
      }
    });
    $(document).on('menu.mob.showArrow', function() {
      return $('.menu-wrapper').find('.mob-menu').addClass('show-scroll');
    });
    $(document).on('menu.mob.hideArrow', function() {
      return $('.menu-wrapper').find('.mob-menu').removeClass('show-scroll');
    });
    return this.layout.$menuMob.find('ul').on('click', 'a', function(e) {
      var $ths, postId, token;
      $ths = $(this);
      if ($ths.hasClass('btn-menu-toggle')) {
        e.preventDefault();
        if ($ths.closest('.mob-menu').hasClass('back-btn')) {
          return window.history.back();
        } else if ($ths.closest('.mob-menu').hasClass('show-search')) {
          window.app.layout.$menuMob.removeClass('show-search');
          window.app.layout.$viewport.removeClass('show-search');
          return window.app.layout.$timelineArea.find('.timeline-search').removeClass('show-search');
        } else {
          return ths.showMenuArea();
        }
      } else if ($ths.hasClass('btn-composer-add')) {
        e.preventDefault();
        return ths.layout.$composeArea.find('.submit-group input').trigger('click');
      } else if ($ths.hasClass('btn-edit-save')) {
        e.preventDefault();
        return ths.layout.$detailedArea.find('.details-toolbar').find('ul.edit').find('a.save').trigger('click');
      } else if ($ths.hasClass('btn-scrollup')) {
        e.preventDefault();
        if (window.app.layout.$viewport.hasClass('detailed-view')) {
          return window.app.layout.$detailedAreaWrapper.find('.scroll-inner').animate({
            scrollTop: 0
          }, 'slow');
        } else if (window.app.layout.$viewport.hasClass('composer-view')) {
          return window.app.layout.$composeAreaWrapper.find('.scroll-inner').animate({
            scrollTop: 0
          }, 'slow');
        } else {
          return window.app.layout.$timelineAreaWrapper.find('.scroll-inner').animate({
            scrollTop: 0
          }, 'slow');
        }
      } else if ($ths.hasClass('btn-search')) {
        e.preventDefault();
        $ths = $(this);
        if ($ths.closest('.mob-menu').hasClass('show-search')) {
          window.app.layout.$menuMob.removeClass('show-search');
          window.app.layout.$viewport.removeClass('show-search');
          return window.app.layout.$timelineArea.find('.timeline-search').removeClass('show-search');
        } else {
          window.app.layout.$menuMob.addClass('show-search');
          window.app.layout.$viewport.addClass('show-search');
          return window.app.layout.$timelineArea.find('.timeline-search').addClass('show-search');
        }
      } else if ($ths.hasClass('btn-detailed-delete')) {
        e.preventDefault();
        postId = $('.details-note').data('post-id');
        token = $('.details-note').data('token');
        return window.app.popup('delete', {
          postId: postId,
          token: token
        }, {
          ok: function(data) {
            window.app.pushState('#timeline');
            $('.timeline-item[data-post-id="' + postId + '"]').slideUp('slow', function() {
              return $(this).remove();
            });
            return window.app.ajax.remove_post(postId, token, {
              complete: function(response) {}
            });
          }
        });
      } else if ($ths.hasClass('btn-detailed-edit')) {
        e.preventDefault();
        postId = $('.details-note').data('post-id');
        token = $('.details-note').data('token');
        return $('.details-toolbar').find('.default').find('.edit').trigger('click');
      }
    });
  };


  /**
   * Cache Layout
   * @return {null}
   */

  _app.prototype.cacheDom = function() {
    if (this.layout === void 0 || this.layout.$viewportPan === void 0) {
      this.layout = {
        $viewport: $('.viewport'),
        $menuArea: $('.menu-area'),
        $menuBtn: $('.menu-wrapper').find('.burger a'),
        $composerBtn: $('.menu-wrapper').find('.composer a'),
        $menuMob: $('.menu-wrapper').find('.mob-menu')
      };
    }
    this.layout.$viewportPan = this.layout.$viewport.find('.viewport-pan');
    this.layout.$menuArea = this.layout.$viewport.find('.menu-area');
    this.layout.$composeAreaWrapper = this.layout.$viewport.find('.compose-area');
    this.layout.$detailedAreaWrapper = this.layout.$viewport.find('.detailed-area');
    this.layout.$timelineAreaWrapper = this.layout.$viewport.find('.timeline-area');
    this.layout.$composeArea = this.layout.$viewport.find('.compose-area .scroll-inner');
    this.layout.$timelineArea = this.layout.$viewport.find('.timeline-area .scroll-inner .container');
    this.layout.$detailedArea = this.layout.$viewport.find('.detailed-area .scroll-inner .container');
    this.layout.$detailedArealoader = this.layout.$viewport.find('.detailed-area .loader');
    this.layout.$detailedAreaProgress = this.layout.$viewport.find('.detailed-area .progress-bar');
    this.layout.$settingsAreaWrapper = this.layout.$viewport.find('.settings-area');
    this.layout.$settingsArea = this.layout.$viewport.find('.settings-area .scroll-inner .container');
    this.layout.$legalAreaWrapper = this.layout.$viewport.find('.legal-area');
    return this.layout.$legalArea = this.layout.$viewport.find('.legal-area .scroll-inner .container');
  };


  /**
   * Render  popup
   * @param  {string} type [delete, upgrade]
   * @param  {object} data [it will be return with cb]
   * @param  {object} cbs [callbacks: close, ok, remember]
   * @return {null}
   */

  window._app.prototype.popup = function(type, _data, cbs) {
    var $rendered, data, rendered;
    if (type == null) {
      type = 'delete';
    }
    if (_data == null) {
      _data = {};
    }
    if (cbs == null) {
      cbs = {};
    }
    switch (type) {
      case 'delete':
        Mustache.parse(this.templates.popupDelete);
        data = {
          popup_delete_heading: this.lang.popup_delete_heading,
          popup_delete_text: this.lang.popup_delete_text,
          popup_delete_btn_delete: this.lang.popup_delete_btn_delete,
          popup_delete_btn_cancel: this.lang.popup_delete_btn_cancel
        };
        rendered = Mustache.render(this.templates.popupDelete, data);
        break;
      case 'upgrade':
        Mustache.parse(this.templates.popupUpgrade);
        data = {
          popup_upgrade_heading: this.lang.popup_upgrade_heading,
          popup_upgrade_text: this.lang.popup_upgrade_text,
          popup_upgrade_btn_sub: this.lang.popup_upgrade_btn_sub,
          popup_upgrade_btn_cancel: this.lang.popup_upgrade_btn_cancel,
          popup_upgrade_checkbox_remember: this.lang.popup_upgrade_checkbox_remember
        };
        rendered = Mustache.render(this.templates.popupUpgrade, data);
    }
    $rendered = $('<div>').addClass('popup-modal').data('data', _data).append(rendered);
    $('body').find('.popup-modal').remove();
    $('body').append($rendered);
    $rendered.find('.action-cancel,.popup-close').on('click', function(e) {
      e.preventDefault();
      $rendered.removeClass('show');
      return setTimeout(function() {
        $rendered.remove();
        if (typeof cbs.close === 'function') {
          return cbs.close($rendered.data('data'));
        }
      }, 550);
    });
    $rendered.find('.action-ok').on('click', function(e) {
      e.preventDefault();
      $rendered.removeClass('show');
      if (typeof cbs.ok === 'function') {
        cbs.ok($rendered.data('data'));
      }
      return setTimeout(function() {
        return $rendered.remove();
      }, 550);
    });
    $rendered.find(".checkbox input").change(function() {
      if (typeof cbs.remember === 'function') {
        return cbs.remember(this.checked);
      }
    });
    setTimeout(function() {
      return $rendered.addClass('show');
    }, 50);
    return $rendered;
  };


  /**
   * app init function
   * @return {null}
   */

  _app.prototype.init = function() {
    var ths;
    _app.prototype._ths = this;
    ths = this;
    $(window).resize(function() {
      if ($(window).width() <= 768) {
        return ths.isMobile = true;
      } else {
        return ths.isMobile = false;
      }
    }).resize();
    this.cacheDom();
    _app.prototype.templates = this.getTemplates();
    _app.prototype.lang = this.getLang();
    this.BindNavEvents();
    this.currentPage = '';
    $(document).on('hash', function(e, hash) {
      var $viewportPan, parts;
      parts = hash.split('/');
      if (parts[parts.length - 1] === '') {
        parts = parts.slice(0, parts.length - 1);
      }
      if (parts[0] === 'settings') {
        if (parts.length === 1) {
          if (ths.currentPage !== 'settings') {
            ths.currentPage = 'settings';
            Mustache.parse(ths.templates.layoutSettingsArea);
            $viewportPan = $(Mustache.render(ths.templates.layoutSettingsArea, {}));
            ths.layout.$viewportPan.addClass('no-transition');
            ths.layout.$composerBtn.parent().addClass('show');
            return ths.layout.$viewportPan.fadeOut('fast', function() {
              ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
              ths.cacheDom();
              ths.initScrollBars();
              $viewportPan.addClass('no-transition');
              return ths.renderSettingsArea({
                rendered: function() {
                  ths.layout.$menuMob.removeClass('show-composer').removeClass('show-scroll').removeClass('show-post').removeClass('show-search').removeClass('back-btn').addClass('show-page');
                  return ths.layout.$viewportPan.fadeIn('fats', function() {
                    return ths.layout.$viewportPan.removeClass('no-transition');
                  });
                }
              });
            });
          }
        } else if (parts.length === 2 || parts.length === 3) {
          if (parts[1] === 'plans') {
            if (ths.currentPage !== 'settings/plans') {
              ths.currentPage = 'settings/plans';
              Mustache.parse(ths.templates.layoutSettingsArea);
              $viewportPan = $(Mustache.render(ths.templates.layoutSettingsArea, {}));
              ths.layout.$viewportPan.addClass('no-transition');
              ths.layout.$composerBtn.parent().addClass('show');
              return ths.layout.$viewportPan.fadeOut('fast', function() {
                ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
                ths.cacheDom();
                ths.initScrollBars();
                $viewportPan.addClass('no-transition');
                return ths.renderSettingsPlans({
                  rendered: function() {
                    return ths.layout.$viewportPan.fadeIn('fats', function() {
                      return ths.layout.$viewportPan.removeClass('no-transition');
                    });
                  }
                });
              });
            }
          } else if (parts[1] === 'unlock') {
            if (ths.currentPage !== 'settings/unlock') {
              ths.currentPage = 'settings/unlock';
              Mustache.parse(ths.templates.layoutSettingsArea);
              $viewportPan = $(Mustache.render(ths.templates.layoutSettingsArea, {}));
              ths.layout.$viewportPan.addClass('no-transition');
              ths.layout.$composerBtn.parent().addClass('show');
              return ths.layout.$viewportPan.fadeOut('fast', function() {
                ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
                ths.cacheDom();
                ths.initScrollBars();
                $viewportPan.addClass('no-transition');
                return ths.renderSettingsUnlock({
                  rendered: function() {
                    return ths.layout.$viewportPan.fadeIn('fats', function() {
                      return ths.layout.$viewportPan.removeClass('no-transition');
                    });
                  }
                });
              });
            }
          } else if (parts[1] === 'subscribe') {
            if (ths.currentPage !== 'settings/subscribe') {
              ths.currentPage = 'settings/subscribe';
              Mustache.parse(ths.templates.layoutSettingsArea);
              $viewportPan = $(Mustache.render(ths.templates.layoutSettingsArea, {}));
              ths.layout.$viewportPan.addClass('no-transition');
              ths.layout.$composerBtn.parent().addClass('show');
              return ths.layout.$viewportPan.fadeOut('fast', function() {
                ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
                ths.cacheDom();
                ths.initScrollBars();
                $viewportPan.addClass('no-transition');
                return ths.renderSettingsSubscribe({
                  rendered: function() {
                    return ths.layout.$viewportPan.fadeIn('fats', function() {
                      return ths.layout.$viewportPan.removeClass('no-transition');
                    });
                  }
                });
              });
            }
          }
        }
      } else if (parts.length === 2 && parts[0] === 'legal') {
        ths.currentPage = 'legal';
        Mustache.parse(ths.templates.layoutLegalArea);
        $viewportPan = $(Mustache.render(ths.templates.layoutLegalArea, {}));
        ths.layout.$viewportPan.addClass('no-transition');
        ths.layout.$composerBtn.parent().addClass('show');
        return ths.layout.$viewportPan.fadeOut('fast', function() {
          ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
          ths.cacheDom();
          ths.initScrollBars();
          $viewportPan.addClass('no-transition');
          return ths.renderLegalArea(parts[1], {
            rendered: function() {
              ths.layout.$menuMob.removeClass('show-composer').removeClass('show-scroll').removeClass('show-post').removeClass('show-search').removeClass('back-btn').addClass('show-page');
              return ths.layout.$viewportPan.fadeIn('fats', function() {
                return ths.layout.$viewportPan.removeClass('no-transition');
              });
            }
          });
        });
      } else {
        if (ths.currentPage !== 'member') {
          ths.currentPage = 'member';
          Mustache.parse(ths.templates.layoutMemberArea);
          $viewportPan = $(Mustache.render(ths.templates.layoutMemberArea, {}));
          ths.layout.$viewportPan.addClass('no-transition');
          ths.layout.$composerBtn.parent().removeClass('show');
          ths.layout.$viewport.removeClass('detailed-view');
          return ths.layout.$viewportPan.fadeOut('fast', function() {
            ths.layout.$viewportPan.hide().empty().replaceWith($viewportPan.hide());
            ths.cacheDom();
            ths.initScrollBars();
            ths.renderComposeArea();
            ths.renderTimlineSearch();
            return ths.renderTimelineArea(null, null, {
              rendered: function() {
                ths.layout.$timeline.data('page', 1);
                $viewportPan.addClass('no-transition');
                return $viewportPan.fadeIn('fats', function() {
                  $viewportPan.removeClass('no-transition');
                  parts = hash.split('/');
                  if (parts[0] === 'view' && parts[1] !== void 0) {
                    return $(document).trigger('details.post.show', [parts[1]]);
                  } else if (parts[0] === 'edit' && parts[1] !== void 0) {
                    return $(document).trigger('details.post.edit', [parts[1]]);
                  } else if (parts[0] === 'composer') {
                    ths.currentSection = 'composer';
                    return ths.showComposerArea();
                  } else {
                    ths.currentSection = 'timeline';
                    return ths.showTimelineArea();
                  }
                });
              }
            });
          });
        } else {
          parts = hash.split('/');
          if (parts[0] === 'view' && parts[1] !== void 0) {
            $(document).trigger('details.post.show', [parts[1]]);
            return ths.currentSection = 'details';
          } else if (parts[0] === 'edit' && parts[1] !== void 0) {
            $(document).trigger('details.post.edit', [parts[1]]);
            return ths.currentSection = 'details';
          } else if (parts[0] === 'composer') {
            ths.currentSection = 'composer';
            return ths.showComposerArea();
          } else {
            ths.currentSection = 'timeline';
            return ths.showTimelineArea();
          }
        }
      }
    });
    $(window).resize(function() {
      if (ths.currentSection === 'composer') {
        return ths.showComposerArea(false);
      } else if (ths.currentSection === 'timeline') {
        return ths.showTimelineArea(false);
      } else if (ths.currentSection === 'details') {
        return ths.showDedatiledArea(false);
      }
    });
    return this.initHashEvent();
  };

  $(document).ready(function() {
    window.app = new _app();
    return window.app.init();
  });

}).call(this);
