(function() {
  window._app = function() {
    this.baseURL = window.f3.site_url.replace(/\/$/, '');
    return this;
  };


  /*
   *# @brief      	scrollbar function
   *# 
   *# @return 		null
   */

  _app.prototype.initScrollBars = function() {
    var $scrollInner, adjust, ths;
    ths = this;
    adjust = -200;
    $scrollInner = this.layout.$viewport.find('.scroll-inner');
    ths.timeScrollEvent = true;
    if (ths.isMobile) {
      $scrollInner.scrollbar('destroy');
    } else {
      $scrollInner.scrollbar();
    }
    return $(window).resize(function() {
      if (!ths.isMobile) {
        return $scrollInner.scrollbar();
      } else {
        return $scrollInner.scrollbar('destroy');
      }
    });
  };


  /*
   *# @brief Validate field
   *#
   *# @return null
   */

  _app.prototype.validateField = function(str, types) {
    var _errors;
    if (str == null) {
      str = '';
    }
    if (types == null) {
      types = 'empty';
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


  /*
   *# @brief Render sidebar signup form
   *#
   *# @return null
   */

  _app.prototype.renderSignupForm = function(focus, animate) {
    var $email, $form, $password, $rendered, $username, $wrapper, data, ths, _emailTest, _passwordTest, _usernameTest;
    if (focus == null) {
      focus = true;
    }
    if (animate == null) {
      animate = true;
    }
    ths = this;
    if (this.sidebarRenderedOnce === void 0) {
      Mustache.parse(this.templates.sidebarArea);
      $wrapper = $(Mustache.render(this.templates.sidebarArea, {}));
      this.layout.$sidebar.append($wrapper);
      this.sidebarRenderedOnce = true;
    }
    Mustache.parse(this.templates.signupForm);
    data = {
      loginHeading: this.lang.login_heading,
      loginUsernamePlaceholder: this.lang.login_username_placeholder,
      loginPasswordPlaceholder: this.lang.login_password_placeholder,
      loginSubmitButton: this.lang.login_submit_button,
      loginForgotPassword: this.lang.login_forgot_password,
      loginSeparator: this.lang.login_separator,
      loginFormSwitch: this.lang.login_form_switch
    };
    $rendered = $(Mustache.render(this.templates.signupForm, data));
    if (animate) {
      this.layout.$sidebar.find('.forms-wrapper').fadeOut('fast', function() {
        return $(this).empty().append($rendered).fadeIn('fast').next('.steps-wrapper').empty().hide();
      });
    } else {
      this.layout.$sidebar.find('.forms-wrapper').empty().append($rendered).next('.steps-wrapper').empty().hide();
    }
    $rendered.find('.form-switch').on('click', function(e) {
      e.preventDefault();
      return ths.renderLoginContent();
    });
    if (focus) {
      $rendered.find('.form-group:eq(0) input').focus();
    }
    $rendered.find('a[href="#tos"],a[href="#pp"],a[href="#legal"]').on('click', function(e) {
      e.preventDefault();
      return ths.renderLegalContent($(this).attr('href').replace('#', ''));
    });
    $rendered.on('click', 'a.to-recover', function(e) {
      e.preventDefault();
      return ths.renderLoginContent(true, {
        rendered: function() {
          console.log('ok');
          return $('.btn-forgot-passowrd').trigger('click');
        }
      });
    });
    $form = $rendered.find('form');
    $username = $form.find('input[name="username"]');
    $email = $form.find('input[name="email"]');
    $password = $form.find('input[name="password"]');
    _usernameTest = function() {
      var error, username;
      username = $.trim($username.val());
      if (error = ths.validateField(username, 'empty')) {
        $username.prev().html(ths.lang.signup_error_username_empty);
        return false;
      } else {
        $username.prev().html('');
        return true;
      }
    };
    _emailTest = function() {
      var email, error;
      email = $.trim($email.val());
      if (error = ths.validateField(email, 'empty|email')) {
        if (error[0] === 'invalidEmail') {
          $email.prev().html(ths.lang.signup_error_email_invalid);
        } else {
          $email.prev().html(ths.lang.signup_error_email_empty);
        }
        return false;
      } else {
        $email.prev().html('');
        return true;
      }
    };
    _passwordTest = function() {
      var error, password;
      password = $.trim($password.val());
      if (error = ths.validateField(password, 'empty|password')) {
        if (error[0] === 'tooShort') {
          $password.prev().html(ths.lang.signup_error_password_short);
        } else if (error[0] === 'invalidAlpha') {
          $password.prev().html(ths.lang.signup_error_password_alphabet);
        } else if (error[0] === 'invalidNumeric') {
          $password.prev().html(ths.lang.signup_error_password_numeric);
        } else if (error[0] === 'invalidSpecial') {
          $password.prev().html(ths.lang.signup_error_password_special);
        } else {
          $password.prev().html(ths.lang.signup_error_password_empty);
        }
        return false;
      } else {
        $password.prev().html('');
        return true;
      }
    };
    $username.on('change', _usernameTest);
    $email.on('change', _emailTest);
    $password.on('change', _passwordTest);
    return $form.find('.submit-group').find('input').on('click', function(e) {
      var $ths, hasErorr;
      e.preventDefault();
      $ths = $(this);
      hasErorr = false;
      if (!_usernameTest()) {
        hasErorr = true;
      }
      if (!_emailTest()) {
        hasErorr = true;
      }
      if (!_passwordTest()) {
        hasErorr = true;
      }
      if (!hasErorr) {
        return ths.ajax.signup({
          username: $.trim($username.val()),
          email: $.trim($email.val()),
          password: $.trim($password.val())
        }, {
          complete: function(response) {
            if (response.success) {
              ths.username = response.username;
              ths.email = response.email;
              return ths.pushState('#setup');
            } else {
              if (response.errors.username !== void 0) {
                if (response.errors.username === 'empty') {
                  $username.prev().html(ths.lang.signup_error_username_empty);
                } else if (response.errors.username === 'exists') {
                  $username.prev().html(ths.lang.signup_error_username_exists);
                }
              }
              if (response.errors.email !== void 0) {
                if (response.errors.email === 'empty') {
                  $email.prev().html(ths.lang.signup_error_email_invalid);
                } else if (response.errors.email === 'exists') {
                  $email.prev().html(ths.lang.signup_error_email_exists);
                }
              }
              if (response.errors.password !== void 0) {
                if (response.errors.password === 'empty') {
                  return $password.prev().html(ths.lang.signup_error_password_empty);
                } else if (response.errors.password === 'invalid') {
                  return $password.prev().html(ths.lang.signup_error_password_invalid);
                }
              }
            }
          }
        });
      }
    });
  };


  /*
   *# @brief Render sidebar login form
   *#
   *# @return null
   */

  _app.prototype.renderLoginForm = function(focus, animate) {
    var $closeForgotPassword, $forgot, $forgotForm, $forgotFormWrapper, $forgotUsername, $loginForm, $loginFormWrapper, $password, $rendered, $username, $wrapper, data, ths, _forgotUsernameTest, _passwordTest, _usernameTest;
    if (focus == null) {
      focus = true;
    }
    if (animate == null) {
      animate = true;
    }
    ths = this;
    if (this.sidebarRenderedOnce === void 0) {
      Mustache.parse(this.templates.sidebarArea);
      $wrapper = $(Mustache.render(this.templates.sidebarArea, {}));
      this.layout.$sidebar.append($wrapper);
      this.sidebarRenderedOnce = true;
    }
    Mustache.parse(this.templates.loginForm);
    data = {
      loginHeading: this.lang.login_heading,
      loginUsernamePlaceholder: this.lang.login_username_placeholder,
      loginPasswordPlaceholder: this.lang.login_password_placeholder,
      loginSubmitButton: this.lang.login_submit_button,
      loginForgotPassword: this.lang.login_forgot_password,
      loginSeparator: this.lang.login_separator,
      loginFormSwitch: this.lang.login_form_switch,
      forgotHeading: this.lang.forgot_heading,
      forgotUsernamePlaceholder: this.lang.forgot_username_placeholder,
      forgotSubmitButton: this.lang.forgot_submit_button
    };
    $rendered = $(Mustache.render(this.templates.loginForm, data));
    if (animate) {
      this.layout.$sidebar.find('.forms-wrapper').fadeOut('fast', function() {
        return $(this).empty().append($rendered).fadeIn('fast').next('.steps-wrapper').empty().hide();
      });
    } else {
      this.layout.$sidebar.find('.forms-wrapper').empty().append($rendered).next('.steps-wrapper').empty().hide();
    }
    $rendered.find('.form-switch').on('click', function(e) {
      e.preventDefault();
      return ths.renderSignupContent();
    });
    if (focus) {
      $rendered.find('.form-group:eq(0) input').focus();
    }
    $loginForm = $rendered.find('.login-form');
    $loginFormWrapper = $loginForm.closest('.login-form-wrapper');
    $username = $loginForm.find('input[name="username"]');
    $password = $loginForm.find('input[name="password"]');
    $forgot = $loginFormWrapper.find('a.btn-forgot-passowrd');
    $forgotForm = $rendered.find('.forgot-form');
    $forgotFormWrapper = $forgotForm.closest('.forgot-form-wrapper');
    $forgotUsername = $forgotForm.find('input[name="username"]');
    $closeForgotPassword = $forgotFormWrapper.find('.closeForgotPassword');
    _usernameTest = function() {
      var errors, username;
      username = $.trim($username.val());
      if (errors = ths.validateField(username, 'empty')) {
        $username.prev().text(ths.lang.login_error_username_empty);
        return false;
      } else {
        $username.prev().text('');
        return true;
      }
    };
    _passwordTest = function() {
      var errors, password;
      password = $.trim($password.val());
      if (errors = ths.validateField(password, 'empty')) {
        $password.prev().text(ths.lang.login_error_password_empty);
        return false;
      } else {
        $password.prev().text('');
        return true;
      }
    };
    $username.on('change', _usernameTest);
    $password.on('change', _passwordTest);
    $loginForm.find('.submit-group').find('input').on('click', function(e) {
      var $ths, hasErorr;
      e.preventDefault();
      $ths = $(this);
      hasErorr = false;
      if (!_usernameTest()) {
        hasErorr = true;
      }
      if (!_passwordTest()) {
        hasErorr = true;
      }
      if (!hasErorr) {
        return ths.ajax.login({
          username: $.trim($username.val()),
          password: $.trim($password.val())
        }, {
          complete: function(response) {
            if (response.success) {
              return window.location = response.redirect;
            } else {
              return $ths.prev().text(ths.lang.login_error_invalid_credentials);
            }
          }
        });
      }
    });
    $forgot.on('click', function(e) {
      e.preventDefault();
      return $loginFormWrapper.fadeOut('fast', function() {
        return $forgotFormWrapper.fadeIn('fast');
      });
    });
    $closeForgotPassword.on('click', function(e) {
      e.preventDefault();
      return $forgotFormWrapper.fadeOut('fast', function() {
        return $loginFormWrapper.fadeIn('fast');
      });
    });
    _forgotUsernameTest = function() {
      var errors, username;
      username = $.trim($forgotUsername.val());
      if (errors = ths.validateField(username, 'empty')) {
        $forgotUsername.prev().text(ths.lang.login_error_username_empty);
        return false;
      } else {
        $forgotUsername.prev().text('');
        return true;
      }
    };
    $forgotUsername.on('change', _forgotUsernameTest);
    return $forgotForm.find('.submit-group').find('input').on('click', function(e) {
      var $ths;
      e.preventDefault();
      $ths = $(this);
      if (_forgotUsernameTest()) {
        return ths.ajax.passowrdRecover({
          username: $.trim($forgotUsername.val())
        }, {
          complete: function(response) {
            var $notice;
            if (response.success) {
              $notice = $('<div class="notice success">' + ths.lang.forgot_success + '</div>');
              $loginForm.before($notice);
              return $forgotFormWrapper.fadeOut('fast', function() {
                return $loginFormWrapper.fadeIn('fast');
              });
            } else {
              return $forgotUsername.prev().text(ths.lang.forgot_error_invalid);
            }
          }
        });
      }
    });
  };


  /*
   *# @brief		render small nav
   *#
   *# @return  	null
   */

  _app.prototype.renderSmallNav = function(signup) {
    var $rendered;
    if (signup == null) {
      signup = false;
    }
    Mustache.parse(this.templates.smallNav);
    $rendered = $(Mustache.render(this.templates.smallNav, {
      signup: signup
    }));
    this.layout.$content.append($rendered);
    $rendered.on('click', 'a.login', function(e) {
      e.preventDefault();
      return window.app.renderLoginContent();
    });
    return $rendered.on('click', 'a.signup', function(e) {
      e.preventDefault();
      return window.app.renderSignupContent();
    });
  };


  /*
   *# @brief		render signup banner
   *#
   *# @return  	null
   */

  _app.prototype.renderSignupBanner = function() {
    var $rendered;
    Mustache.parse(this.templates.banner);
    $rendered = $(Mustache.render(this.templates.banner, {}));
    this.layout.$content.append($rendered);
    return $(document).trigger('banner.rendered', [$rendered]);
  };


  /*
   *# @brief		render login banner
   *#
   *# @return  	null
   */

  _app.prototype.renderLoginBanner = function() {
    var $rendered;
    Mustache.parse(this.templates.bannerLogin);
    $rendered = $(Mustache.render(this.templates.bannerLogin, {}));
    this.layout.$content.append($rendered);
    return $(document).trigger('banner.rendered', [$rendered]);
  };


  /*
   *# @brief		render microsite
   *#
   *# @return  	null
   */

  _app.prototype.renderMicrosite = function() {
    var $rendered;
    Mustache.parse(this.templates.microsite);
    $rendered = $(Mustache.render(this.templates.microsite, {}));
    this.layout.$content.append($rendered);
    $(document).trigger('microsite.rendered', [$rendered]);
    return $rendered;
  };


  /*
   *# @brief	Render sidebar - setup screen step one
   *#
   *# @return 	null
   */

  _app.prototype.renderSidebarSetupStep = function(step) {
    var $rendered, $wrapper, rendered;
    if (step == null) {
      step = 1;
    }
    step = parseInt(step) - 1;
    if (step > 2) {
      return;
    }
    if (this.sidebarRenderedOnce === void 0) {
      Mustache.parse(this.templates.sidebarArea);
      $wrapper = $(Mustache.render(this.templates.sidebarArea, {}));
      this.layout.$sidebar.append($wrapper);
      this.sidebarRenderedOnce = true;
    }
    if (this.layout.$sidebar.find('.steps-wrapper .signup-steps').length === 0) {
      Mustache.parse(this.templates.setupSidebar);
      rendered = Mustache.render(this.templates.setupSidebar, {
        name: this.username
      });
      $rendered = $(rendered);
      $rendered.find('.steps li:eq(' + step + ') span').addClass('active');
      return this.layout.$sidebar.find('.forms-wrapper').empty().next('.steps-wrapper').append($rendered).show();
    } else {
      this.layout.$sidebar.find('.steps-wrapper .signup-steps').find('.steps li span').removeClass('active');
      return this.layout.$sidebar.find('.steps-wrapper .signup-steps').find('.steps li:eq(' + step + ') span').addClass('active');
    }
  };


  /*
   *# @brief	Render content - setup screen step one
   *#
   *# @return 	null
   */

  _app.prototype.renderContentSetupStep = function(step) {
    var $email_fields, $email_share_btn, $form, $left, $navs, $password, $password_hint, $password_re, $rendered, $right, $stepone, $steps, $stepthree, $steptwo, $wrapper, height, isFree, isValidEmailAddress, proccedToStepThree, template, ths, trackingJson, _currentPos;
    if (step == null) {
      step = 1;
    }
    step = parseInt(step);
    if (step > 3) {
      return;
    }
    this.layout.$content.empty();
    this.renderSmallNav();
    isFree = false;
    if (step === 2 && this.setup.plan !== void 0) {
      isFree = this.setup.plan === 'free' ? true : false;
    }
    template = step === 1 ? app.templates.stepOne : step === 2 ? this.templates.stepTwo : this.templates.stepThree;
    Mustache.parse(template);
    trackingJson = JSON.stringify({
      user_id: f3.userId,
      local_timestamp: moment().format('X')
    });
    $rendered = $(Mustache.render(template, {
      isFree: isFree,
      paypalButtonID: window.f3.paypalButtonID,
      tracking_json: trackingJson
    }));
    this.layout.$content.append($rendered);
    ths = this;
    if (step === 1) {
      ths.setup.plan = null;
      $rendered.find('.plans').find('.select a').on('click', function(e) {
        var type;
        e.preventDefault();
        type = $(this).attr('class');
        if (type === 'premium') {
          ths.setup.plan = 'premium';
        } else {
          ths.setup.plan = 'free';
        }
        return ths.pushState('#setup-step-2');
      });
      $rendered.find('.plans').find('.toggle-view a').on('click', function(e) {
        var $ths;
        e.preventDefault();
        $ths = $(this);
        return $ths.closest('.plan').toggleClass('show-full');
      });
    }
    if (step === 2) {
      ths.shared = {
        fb: false,
        twttr: false,
        email: false
      };
      proccedToStepThree = function(force) {
        var goNext;
        if (force == null) {
          force = false;
        }
        goNext = false;
        if (force) {
          goNext = true;
        } else {
          if (ths.shared.fb && ths.shared.twttr && ths.shared.email) {
            goNext = true;
          }
        }
        if (goNext) {
          return ths.pushState('#setup-step-3');
        }
      };
      isValidEmailAddress = function(emailAddress) {
        var pattern;
        pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
      };
      $rendered.find('.share-fb-btn').on('click', function(e) {
        var $ths;
        $ths = $(this);
        e.preventDefault();
        return FB.ui({
          display: 'popup',
          method: 'share',
          href: 'http://jade-lang.com/reference/code/'
        }, function(response) {
          if (typeof response === 'object') {
            return ths.ajax.shared({
              type: 'facebook'
            }, {
              complete: function(result) {
                if (result) {
                  $ths.closest('.share-card').addClass('done');
                  ths.shared.fb = true;
                  return proccedToStepThree();
                }
              }
            });
          } else {
            ths.shared.fb = false;
            return $ths.closest('.share-card').removeClass('done');
          }
        });
      });
      twttr.ready(function(twtter) {
        return twttr.events.bind('tweet', function(e) {
          return ths.ajax.shared({
            type: 'twitter'
          }, {
            complete: function(result) {
              if (result) {
                $rendered.find('.twitter.share-card').addClass('done');
                ths.shared.twttr = true;
                return proccedToStepThree();
              }
            }
          });
        });
      });
      $email_fields = $rendered.find('.email.share-card').find('input');
      $email_share_btn = $rendered.find('.email.share-card').find('.share-email-btn');
      $email_fields.on('change', function(e) {
        var allFilled, usedEmails;
        allFilled = true;
        usedEmails = [];
        $email_fields.each(function() {
          var $ths, val;
          $ths = $(this);
          val = $.trim($ths.val());
          if (val !== '' && isValidEmailAddress(val)) {
            if ($.inArray(val, usedEmails) === -1) {
              return usedEmails.push(val);
            } else {
              allFilled = false;
              return $email_share_btn.addClass('disabled');
            }
          } else {
            allFilled = false;
            return $email_share_btn.addClass('disabled');
          }
        });
        if (allFilled) {
          return $email_share_btn.removeClass('disabled');
        }
      });
      $email_share_btn.on('click', function(e) {
        var $ths, allFilled, usedEmails;
        e.preventDefault();
        $ths = $(this);
        if (!$ths.hasClass('disabled')) {
          allFilled = true;
          usedEmails = [];
          $email_fields.each(function() {
            var val;
            $ths = $(this);
            val = $.trim($ths.val());
            if (val !== '' && isValidEmailAddress(val)) {
              if ($.inArray(val, usedEmails) === -1) {
                return usedEmails.push(val);
              } else {
                allFilled = false;
                return $email_share_btn.addClass('disabled');
              }
            } else {
              allFilled = false;
              return $email_share_btn.addClass('disabled');
            }
          });
          if (allFilled) {
            return ths.ajax.shared({
              type: 'email',
              emails: usedEmails
            }, {
              complete: function(result) {
                if (result) {
                  $rendered.find('.email.share-card').addClass('done');
                  ths.shared.email = true;
                  return proccedToStepThree();
                }
              }
            });
          }
        }
      });
      $rendered.find('.step-skipper a').on('click', function(e) {
        e.preventDefault();
        return proccedToStepThree(true);
      });
    }
    if (step === 3) {
      _currentPos = 1;
      $steps = $rendered.find('.setup-steps');
      $wrapper = $steps.find('.steps-wrapper');
      $left = $steps.find('.arrow-left');
      $right = $steps.find('.arrow-right');
      $navs = $steps.find('.nav-dots');
      height = $wrapper.find('.setup-step:eq(0)').outerHeight();
      $wrapper.height(height);
      $left.on('click', function(e) {
        var className, eq;
        e.preventDefault();
        if (_currentPos > 1) {
          _currentPos--;
          eq = _currentPos - 1;
          className = _currentPos === 1 ? 'show-first' : _currentPos === 2 ? 'show-second' : _currentPos === 3 ? 'show-third' : void 0;
          $steps.removeClass('show-first').removeClass('show-second').removeClass('show-third').addClass(className);
          height = $wrapper.find('.setup-step:eq(' + eq + ')').outerHeight();
          $navs.find('.dot.active').removeClass('active');
          $navs.find('.dot:eq(' + eq + ')').addClass('active');
          return $wrapper.animate({
            height: height
          }, 500);
        }
      });
      $right.on('click', function(e) {
        var className, eq;
        e.preventDefault();
        if (_currentPos < 3) {
          _currentPos++;
          eq = _currentPos - 1;
          className = _currentPos === 1 ? 'show-first' : _currentPos === 2 ? 'show-second' : _currentPos === 3 ? 'show-third' : void 0;
          $steps.removeClass('show-first').removeClass('show-second').removeClass('show-third').addClass(className);
          height = $wrapper.find('.setup-step:eq(' + eq + ')').outerHeight();
          $navs.find('.dot.active').removeClass('active');
          $navs.find('.dot:eq(' + eq + ')').addClass('active');
          return $wrapper.animate({
            height: height
          }, 500);
        }
      });
      $navs.on('click', '.dot', function(e) {
        var $ths, className, eq;
        e.preventDefault();
        $ths = $(this);
        if (!$ths.hasClass('active')) {
          eq = $ths.index();
          _currentPos = eq + 1;
          className = _currentPos === 1 ? 'show-first' : _currentPos === 2 ? 'show-second' : _currentPos === 3 ? 'show-third' : void 0;
          $steps.removeClass('show-first').removeClass('show-second').removeClass('show-third').addClass(className);
          height = $wrapper.find('.setup-step:eq(' + eq + ')').outerHeight();
          $navs.find('.dot.active').removeClass('active');
          $navs.find('.dot:eq(' + eq + ')').addClass('active');
          return $wrapper.animate({
            height: height
          }, 500);
        }
      });
      $stepone = $rendered.find('.setup-step.one');
      $password = $stepone.find('input[name="password"]');
      $password_re = $stepone.find('input[name="password_re"]');
      $password_hint = $stepone.find('input[name="password_hint"]');
      $stepone.find('button.submit').on('click', function(e) {
        var errors, hasErorr, password, password_hint, password_re;
        e.preventDefault();
        password = $.trim($password.val());
        if (errors = ths.validateField(password, 'empty')) {
          hasErorr = true;
          $password.prev().text(ths.lang.login_error_password_empty);
        } else {
          $password.prev().text('');
        }
        password_re = $.trim($password_re.val());
        if (errors = ths.validateField(password_re, 'empty')) {
          hasErorr = true;
          $password_re.prev().text(ths.lang.login_error_password_empty);
        } else {
          if (password !== password_re) {
            hasErorr = true;
            $password_re.prev().text(ths.lang.login_error_password_unmatched);
          } else {
            $password_re.prev().text('');
          }
        }
        password_hint = $.trim($password_hint.val());
        if (errors = ths.validateField(password_hint, 'empty')) {
          hasErorr = true;
          $password_hint.prev().text(ths.lang.login_error_password_hint_empty);
        } else {
          $password_hint.prev().text('');
        }
        if (!hasErorr) {
          return ths.ajax.setup({
            password: password,
            password_re: password_re,
            password_hint: password_hint
          }, {
            complete: function(response) {
              if (response) {
                return $right.trigger('click');
              }
            }
          });
        }
      });
      $stepone.find('button.skip').on('click', function(e) {
        e.preventDefault();
        return $right.trigger('click');
      });
      $steptwo = $rendered.find('.setup-step.two');
      $form = $steptwo.find('form');
      $steptwo.on('change', 'input.email-field', function(e) {
        var $group, $ths, error, val;
        $ths = $(this);
        val = $.trim($ths.val());
        if (error = ths.validateField(val, 'empty|email')) {
          if (error[0] === 'invalidEmail') {
            return $ths.prev().text(ths.lang.login_error_email_invalid);
          } else {
            return $ths.prev().text(ths.lang.login_error_email_empty);
          }
        } else {
          $ths.prev().text('');
          $group = $ths.closest('.form-group');
          $group.clone().insertAfter($group).find('input').val('');
          height = $steptwo.outerHeight();
          return $steptwo.closest('.steps-wrapper').height(height);
        }
      });
      $steptwo.find('button.submit').on('click', function(e) {
        var $emails, emails;
        e.preventDefault();
        emails = [];
        $emails = $steptwo.find('input.email-field');
        $emails.each(function() {
          var $ths, val;
          $ths = $(this);
          val = $.trim($ths.val());
          if (!ths.validateField(val, 'empty|email')) {
            return emails.push(val);
          }
        });
        if (emails.length > 0) {
          return ths.ajax.setup({
            emails: emails
          }, {
            complete: function(response) {
              if (response) {
                return $right.trigger('click');
              }
            }
          });
        }
      });
      $steptwo.find('button.skip').on('click', function(e) {
        e.preventDefault();
        return $right.trigger('click');
      });
      $stepthree = $rendered.find('.setup-step.three');
      $form = $stepthree.find('form');
      $stepthree.on('change', 'input.email-field', function(e) {
        var $group, $ths, error, val;
        $ths = $(this);
        val = $.trim($ths.val());
        if (error = ths.validateField(val, 'empty|email')) {
          if (error[0] === 'invalidEmail') {
            return $ths.prev().text(ths.lang.login_error_email_invalid);
          } else {
            return $ths.prev().text(ths.lang.login_error_email_empty);
          }
        } else {
          $ths.prev().text('');
          $group = $ths.closest('.form-group');
          $group.clone().insertAfter($group).find('input').val('');
          height = $stepthree.outerHeight();
          return $stepthree.closest('.steps-wrapper').height(height);
        }
      });
      $stepthree.find('button.submit').on('click', function(e) {
        var $emails, emails;
        e.preventDefault();
        emails = [];
        $emails = $stepthree.find('input.email-field');
        $emails.each(function() {
          var $ths, val;
          $ths = $(this);
          val = $.trim($ths.val());
          if (!ths.validateField(val, 'empty|email')) {
            return emails.push(val);
          }
        });
        if (emails.length > 0) {
          return ths.ajax.setup({
            emails2: emails
          }, {
            complete: function(response) {
              if (response) {
                return window.location = f3.site_url + 'member/';
              }
            }
          });
        }
      });
      $stepthree.find('button.skip').on('click', function(e) {
        e.preventDefault();
        return window.location = window.f3.site_url + 'member/';
      });
      return $rendered.find('.step-skipper a').on('click', function(e) {
        e.preventDefault();
        return window.location = window.f3.site_url + 'member/';
      });
    }
  };


  /*
   *# @brief	Hash change event
   *#
   *# @return  null
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


  /*
   *# @brief	Get URL hash
   *#
   *# @return  string	hash
   */

  _app.prototype.getURLhash = function() {
    if (window.location.hash) {
      return window.location.hash.replace("#", "");
    } else {
      return false;
    }
  };


  /* 
   *# @brief      	Add push state
   *# 
   *# @return 		null
   */

  _app.prototype.pushState = function(url) {
    var site_url;
    if (url.indexOf('#') === 0) {
      site_url = f3.site_url + url;
    } else {
      site_url = url;
    }
    window.history.pushState(null, null, site_url);
    $(window).trigger('hashchange');
    return true;
  };


  /* 
   *# @brief      	Render default login page
   *# 
   *# @return 		null
   */

  _app.prototype.renderSignupContent = function(animate, renderForm) {
    var $microsite, ths;
    if (animate == null) {
      animate = true;
    }
    if (renderForm == null) {
      renderForm = true;
    }
    ths = this;
    if (renderForm) {
      this.renderSignupForm();
    }
    if (animate) {
      return this.layout.$content.fadeOut('fast', function() {
        var $microsite;
        ths.layout.$content.empty();
        ths.layout.$content.empty();
        ths.renderSmallNav();
        ths.renderSignupBanner();
        $microsite = ths.renderMicrosite();
        ths.layout.$content.fadeIn('fast');
        return setTimeout(function() {
          return $(document).trigger('microsite.visible', [$microsite]);
        }, 100);
      });
    } else {
      ths.layout.$content.empty();
      ths.renderSmallNav();
      ths.renderSignupBanner();
      $microsite = ths.renderMicrosite();
      return $(document).trigger('microsite.visible', [$microsite]);
    }
  };


  /**
   * Render login area
   * @return {null}
   */

  _app.prototype.renderLoginContent = function(animate, cbs) {
    var ths;
    if (animate == null) {
      animate = true;
    }
    if (cbs == null) {
      cbs = {};
    }
    ths = this;
    this.renderLoginForm();
    if (animate) {
      return this.layout.$content.fadeOut('fast', function() {
        ths.layout.$content.empty();
        ths.renderSmallNav(true);
        ths.renderLoginBanner();
        if (typeof cbs.rendered === 'function') {
          cbs.rendered();
        }
        return ths.layout.$content.fadeIn('fast');
      });
    } else {
      this.layout.$content.empty();
      this.renderSmallNav(true);
      this.renderLoginBanner();
      if (typeof cbs.rendered === 'function') {
        return cbs.rendered();
      }
    }
  };

  _app.prototype.renderLegalContent = function(type) {
    var $rendered, rendered, ths;
    if (type == null) {
      type = 'tos';
    }
    ths = this;
    switch (type) {
      case 'tos':
        Mustache.parse(this.templates.legal_tou);
        rendered = Mustache.render(this.templates.legal_tou, {});
        break;
      case 'pp':
        Mustache.parse(this.templates.legal_pp);
        rendered = Mustache.render(this.templates.legal_pp, {});
        break;
      case 'legal':
        Mustache.parse(this.templates.legal);
        rendered = Mustache.render(this.templates.legal, {});
    }
    $rendered = $('<div class="legal container">' + rendered + '</div>');
    if (!ths.isMobile) {
      this.layout.$content.fadeOut('fast', function() {
        ths.layout.$content.empty().append($rendered);
        return ths.layout.$content.fadeIn('fast');
      });
    } else {
      ths.layout.$content.empty().append($rendered);
      ths.layout.$content.fadeIn('fast');
      ths.layout.$viewport.fadeOut('fast', function() {
        ths.layout.$viewportPan.css('transition', 'none').removeClass('mob-sidebar-view');
        return setTimeout(function() {
          return ths.layout.$viewport.fadeIn('fast');
        }, 50);
      });
    }
    return $rendered.find('a.minimize').on('click', function(e) {
      e.preventDefault();
      if (ths.isMobile) {
        return ths.layout.$viewport.fadeOut('fast', function() {
          ths.layout.$viewportPan.css('transition', 'none').addClass('mob-sidebar-view');
          return setTimeout(function() {
            return ths.layout.$viewport.fadeIn('fast', function() {
              return ths.renderSignupContent(false, false);
            });
          }, 50);
        });
      } else {
        return ths.renderSignupContent(false, false);
      }
    });
  };


  /* 
   *# @brief      	app init function
   *# 
   *# @return 		null
   */

  _app.prototype.init = function() {
    var ths;
    _app.prototype._ths = ths = this;
    window.app.setup = {};
    if ($.trim(window.f3.username) !== '') {
      this.username = window.f3.username;
    }
    $(window).resize(function() {
      if ($(window).width() <= 768) {
        return ths.isMobile = true;
      } else {
        return ths.isMobile = false;
      }
    }).resize();
    _app.prototype.layout = {
      $viewport: $('.viewport'),
      $viewportPan: $('.viewport-pan'),
      $sidebarWrapper: $('.sidebar'),
      $sidebar: $('.sidebar').find('.scroll-inner'),
      $contentWrapper: $('.page-content'),
      $content: $('.page-content').find('.scroll-inner')
    };
    _app.prototype.templates = this.getTemplates(false);
    _app.prototype.lang = this.getLang(false);
    this.initScrollBars();
    $(document).on('hash', function(e, hash) {
      if (hash === 'setup' || hash === 'setup-step-2' || hash === 'setup-step-3') {
        return ths.ajax.verifySession({
          complete: function(response) {
            if (response) {
              if (hash === 'setup') {
                ths.layout.$viewportPan.css('transition', 'none').removeClass('mob-sidebar-view');
                ths.renderSidebarSetupStep(1);
                return ths.renderContentSetupStep(1);
              } else if (hash === 'setup-step-2') {
                ths.layout.$viewportPan.css('transition', 'none').removeClass('mob-sidebar-view');
                ths.renderSidebarSetupStep(2);
                return ths.renderContentSetupStep(2);
              } else if (hash === 'setup-step-3') {
                ths.layout.$viewportPan.css('transition', 'none').removeClass('mob-sidebar-view');
                ths.renderSidebarSetupStep(3);
                return ths.renderContentSetupStep(3);
              }
            } else {
              return ths.pushState(f3.site_url);
            }
          }
        });
      } else {
        return ths.renderSignupContent();
      }
    });
    this.initHashEvent();
    return $(document).find('.mob-menu').on('click', 'a', function(e) {
      var $ths;
      e.preventDefault();
      if (ths.isMobile) {
        $ths = $(this);
        if ($ths.hasClass('login')) {
          if (!ths.layout.$viewportPan.hasClass('mob-sidebar-view')) {
            $ths.closest('.mob-menu').find('a.active').removeClass('active');
            return ths.layout.$viewport.fadeOut('fast', function() {
              ths.layout.$viewportPan.css('transition', 'none').addClass('mob-sidebar-view');
              ths.renderLoginForm(null, false);
              return setTimeout(function() {
                ths.layout.$viewportPan.addClass('mob-sidebar-view');
                return ths.layout.$viewport.fadeIn('fast');
              }, 50);
            });
          } else {
            return ths.renderLoginForm();
          }
        } else if ($ths.hasClass('home')) {
          if (!$ths.hasClass('active')) {
            $ths.closest('.mob-menu').find('a.active').removeClass('active');
            $ths.addClass('active');
            return ths.layout.$viewport.fadeOut('fast', function() {
              ths.layout.$viewportPan.css('transition', 'none').removeClass('mob-sidebar-view');
              if (ths.layout.$content.find('.legal-head').length > 0) {
                ths.renderSignupContent(false, false);
              }
              return setTimeout(function() {
                return ths.layout.$viewport.fadeIn('fast');
              }, 50);
            });
          }
        }
      }
    });
  };


  /* 
   *# @brief      	fire up app
   *# 
   *# @return 		null
   */

  $(document).ready(function() {
    window.app = new _app();
    return window.app.init();
  });

}).call(this);
