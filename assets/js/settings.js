
/**
 * Render each settings box
 * @param  {string} type [email2snapbit, reminder, password, bitpassword, plan]
 * @param  {object} data 
 * @param  {bool} events [default: true]
 * @return {jQuery} $rendered
 */

(function() {
  window._app.prototype._renderSettingsBox = function(type, data, events) {
    var $form, $rendered, $timezone, rendered, ths, _changeMethod, _data, _methodAdd, _methodRemove, _validate;
    if (type == null) {
      type = '';
    }
    if (data == null) {
      data = {};
    }
    if (events == null) {
      events = true;
    }
    ths = this;
    rendered = '';
    switch (type) {
      case 'email2snapbit':
        Mustache.parse(this.templates.settings_email2snapbit);
        _data = {
          settings_mail_to_snapbit: this.lang.settings_mail_to_snapbit,
          settings_mail_to_snapbit_text: this.lang.settings_mail_to_snapbit_text,
          settings_mail_to_snapbit_form_head: this.lang.settings_mail_to_snapbit_form_head,
          settings_mail_to_snapbit_email_placeholder: this.lang.settings_mail_to_snapbit_email_placeholder,
          emails: data.email2snapbit_emails
        };
        rendered = Mustache.render(this.templates.settings_email2snapbit, _data);
        break;
      case 'reminder':
        Mustache.parse(this.templates.settings_reminder);
        _data = {
          settings_reminder: this.lang.settings_reminder,
          settings_reminder_text: this.lang.settings_reminder_text,
          settings_reminder_form_head: this.lang.settings_reminder_form_head,
          settings_reminder_email_placeholder: this.lang.settings_reminder_email_placeholder,
          emails: data.reminder_emails
        };
        rendered = Mustache.render(this.templates.settings_reminder, _data);
        break;
      case 'password':
        Mustache.parse(this.templates.settings_password);
        _data = {
          settings_password: this.lang.settings_password,
          settings_password_form_head: this.lang.settings_password_form_head,
          settings_password_existing_placeholder: this.lang.settings_password_existing_placeholder,
          settings_password_password_placeholder: this.lang.settings_password_password_placeholder,
          settings_password_password_re_placeholder: this.lang.settings_password_password_re_placeholder,
          settings_password_hint_placeholder: this.lang.settings_password_hint_placeholder,
          settings_password_submit: this.lang.settings_password_submit,
          has_hint: data.has_pass_hint
        };
        rendered = Mustache.render(this.templates.settings_password, _data);
        break;
      case 'bitpassword':
        Mustache.parse(this.templates.settings_bitpassword);
        _data = {
          settings_bitpassword: this.lang.settings_bitpassword,
          settings_bitpassword_text: this.lang.settings_bitpassword_text,
          settings_bitpassword_form_head: this.lang.settings_bitpassword_form_head,
          settings_bitpassword_existing_placeholder: this.lang.settings_bitpassword_existing_placeholder,
          settings_bitpassword_password_placeholder: this.lang.settings_bitpassword_password_placeholder,
          settings_bitpassword_password_re_placeholder: this.lang.settings_bitpassword_password_re_placeholder,
          settings_bitpassword_hint_placeholder: this.lang.settings_bitpassword_hint_placeholder,
          settings_bitpassword_submit: this.lang.settings_bitpassword_submit
        };
        rendered = Mustache.render(this.templates.settings_bitpassword, _data);
        break;
      case 'plan':
        Mustache.parse(this.templates.settings_plan);
        _data = {
          settings_plan: this.lang.settings_plan,
          settings_plan_free: this.lang.settings_plan_free,
          settings_plan_premium: this.lang.settings_plan_premium,
          settings_plan_button_premium: this.lang.settings_plan_button_premium,
          settings_plan_button_unlock: this.lang.settings_plan_button_unlock,
          settings_plan_button_pause: this.lang.settings_plan_button_pause,
          settings_plan_button_resume: this.lang.settings_plan_button_resume,
          settings_plan_button_selector: this.lang.settings_plan_button_selector,
          isPremium: data.is_premium === 1 ? true : false,
          isPaused: data.is_premium === -1 ? true : false,
          isFree: data.is_premium === 0 ? true : false
        };
        rendered = Mustache.render(this.templates.settings_plan, _data);
    }
    $rendered = $(rendered);
    if (events) {
      switch (type) {
        case 'email2snapbit':
        case 'reminder':
          $form = $rendered.find('form');
          window.tx = $timezone = $form.find('.timezone-selector');
          if (type === 'email2snapbit') {
            _methodRemove = 'removeEmail2snapbits';
            _methodAdd = 'addEmail2snapbits';
          }
          if (type === 'reminder') {
            _methodRemove = 'removeReminder';
            _methodAdd = 'addReminder';
          }
          if ($timezone.length > 0) {
            if (data.timezone !== '') {
              $timezone.val(data.timezone);
            }
            $timezone.selectOrDie();
            $timezone.on('change', function(e) {
              var value;
              value = $.trim($(this).val());
              if (!ths.validateField(value, 'empty')) {
                return ths.ajax.setTimezone(value);
              }
            });
          }
          $form.on('change', 'input', function(e) {
            var $ths, error, exists, value;
            $ths = $(this);
            value = $.trim($ths.val());
            if (error = ths.validateField(value, 'empty|email')) {
              if (error[0] === 'invalidEmail') {
                return $ths.prev().text(ths.lang.settings_mail_to_snapbit_email_invalid);
              } else {
                return $ths.prev().text('');
              }
            } else {
              exists = false;
              $form.find('input[disabled]').each(function() {
                if ($.trim($(this).val()) === value) {
                  return exists = true;
                }
              });
              if (exists) {
                return $ths.prev().text(ths.lang.settings_mail_to_snapbit_email_exists);
              } else {
                $ths.prop('disabled', true).prev().text('');
                $ths.parent().clone().hide().appendTo($form).fadeIn('fast').find('input').prop('disabled', false).val('').prev().text('');
                return ths.ajax[_methodAdd](value, {
                  complete: function(success) {
                    if (!success) {
                      return $ths.remove();
                    }
                  }
                });
              }
            }
          });
          $form.on('click', '.delete', function(e) {
            var $ths, error, value;
            e.preventDefault();
            $ths = $(this);
            value = $.trim($ths.prev('input').val());
            if (error = ths.validateField(value, 'empty|email')) {
              return;
            }
            return ths.ajax[_methodRemove](value, {
              complete: function(success) {
                if (success) {
                  return $ths.parent().fadeOut('fast', function() {
                    return $ths.parent().remove();
                  });
                }
              }
            });
          });
          break;
        case 'password':
        case 'bitpassword':
          $form = $rendered.find('form');
          if (type === 'password') {
            _changeMethod = 'changePassword';
          } else if (type === 'bitpassword') {
            _changeMethod = 'changeLockPassword';
          }
          _validate = function($ths, change) {
            var error, noError, validations, value, _type, _value;
            if (change == null) {
              change = true;
            }
            _type = $ths.prop('type');
            value = $.trim($ths.val());
            noError = true;
            validations = '';
            if (_type === 'password') {
              validations = 'empty|password';
              if ($ths.hasClass('existing') || $ths.hasClass('new_re')) {
                validations = 'empty';
              }
            } else {
              validations = 'empty';
            }
            if (error = ths.validateField(value, validations)) {
              noError = false;
              if (error[0] === 'empty') {
                $ths.val('');
                if (_type === 'password') {
                  ths.fieldError($ths, ths.lang.settings_password_error_password_empty);
                } else {
                  ths.fieldError($ths, ths.lang.settings_password_error_hint_empty);
                }
              } else if (error[0] === 'tooShort') {
                ths.fieldError($ths, ths.lang.settings_password_error_password_short);
              } else if (error[0] === 'invalidAlpha') {
                ths.fieldError($ths, ths.lang.settings_password_error_password_alphabet);
              } else if (error[0] === 'invalidNumeric') {
                ths.fieldError($ths, ths.lang.settings_password_error_password_numeric);
              } else if (error[0] === 'invalidSpecial') {
                ths.fieldError($ths, ths.lang.settings_password_error_password_special);
              }
            } else {
              if ($ths.hasClass('new_re')) {
                _value = $.trim($form.find('input.new').val());
                if (_value !== value) {
                  noError = false;
                  ths.fieldError($ths, ths.lang.settings_password_error_password_mismatch);
                } else {
                  ths.fieldError($ths, '');
                }
              } else {
                ths.fieldError($ths, '');
                if (change === true && $ths.hasClass('new')) {
                  ths.fieldError($form.find('input.new_re').val(''), '');
                }
              }
            }
            return noError;
          };
          $form.on('change', 'input', function(e) {
            var $ths;
            $ths = $(this);
            return _validate($ths);
          });
          $rendered.find('.send-hint a').on('click', function(e) {
            e.preventDefault();
            console.log('Run ajax to send email. Script: settings.coffee ');
            return ths.notifySuccess(ths.lang.settings_password_send_tip_success, ths.lang.settings_password_send_tip_success_ok, true);
          });
          $form.on('click', 'button', function(e) {
            var $button, $pass_ex, $pass_hint, $pass_new, $pass_re, error;
            e.preventDefault();
            error = false;
            $button = $(this);
            $form.find('input').each(function() {
              var $ths;
              $ths = $(this);
              if (!_validate($ths, false)) {
                return error = true;
              }
            });
            if (!error) {
              $pass_ex = $form.find('input[name="password_existing"]');
              $pass_new = $form.find('input[name="password"]');
              $pass_re = $form.find('input[name="password_re"]');
              $pass_hint = $form.find('input[name="password_hint"]');
              data = {
                pass_ex: $.trim($pass_ex.val()),
                pass_new: $.trim($pass_new.val()),
                pass_re: $.trim($pass_re.val()),
                pass_hint: $.trim($pass_hint.val())
              };
              return ths.ajax[_changeMethod](data, {
                complete: function(response) {
                  if (response.success) {
                    ths.notifySuccess(ths.lang.settings_password_save_success, ths.lang.settings_password_save_success_ok, true);
                    $pass_ex.val('').prop('disabled', false);
                    $pass_new.val('').prop('disabled', false);
                    $pass_re.val('').prop('disabled', false);
                    $pass_hint.val('').prop('disabled', false);
                    return $rendered.find('.send-hint').removeClass('hidden');
                  } else {
                    if (response.errors.pass_ex !== void 0) {
                      if (response.errors.pass_ex === 'wrong') {
                        ths.fieldError($pass_ex, ths.lang.settings_password_error_password_wrong);
                      } else if (response.errors.pass_ex === 'empty') {
                        ths.fieldError($pass_ex, ths.lang.settings_password_error_password_empty);
                      }
                    }
                    if (response.errors.pass_new !== void 0) {
                      if (response.errors.pass_new === 'empty') {
                        ths.fieldError($pass_new, ths.lang.settings_password_error_password_empty);
                      } else if (response.errors.pass_new === 'invalid') {
                        ths.fieldError($pass_new, ths.lang.settings_password_error_password_invalid);
                      }
                    }
                    if (response.errors.pass_re !== void 0) {
                      if (response.errors.pass_re === 'empty') {
                        ths.fieldError($pass_re, ths.lang.settings_password_error_password_empty);
                      } else if (response.errors.pass_re === 'mismatch') {
                        ths.fieldError($pass_re, ths.lang.settings_password_error_password_mismatch);
                      }
                    }
                    if (response.errors.pass_hint !== void 0) {
                      if (response.errors.pass_hint === 'empty') {
                        return ths.fieldError($pass_hint, ths.lang.settings_password_error_hint_empty);
                      }
                    }
                  }
                }
              });
            }
          });
          break;
        case 'plan':
          $rendered.find('.plan-options-group a.resume').on('click', function(e) {
            e.preventDefault();
            return ths.ajax.resume_sub({
              complete: function(response) {
                var $_rendered;
                data.is_premium = 1;
                $_rendered = ths._renderSettingsBox('plan', data);
                $rendered.replaceWith($_rendered);
                return window.f3.premium = 'yes';
              }
            });
          });
          $rendered.find('.plan-options-group a.pause').on('click', function(e) {
            e.preventDefault();
            return ths.ajax.pause_sub({
              complete: function(response) {
                var $_rendered;
                data.is_premium = -1;
                $_rendered = ths._renderSettingsBox('plan', data);
                $rendered.replaceWith($_rendered);
                return window.f3.premium = 'no';
              }
            });
          });
      }
    }
    return $rendered;
  };


  /**
   * Render success popup
   * @param  {string} msg
   * @param  {string} btn
   * @param  {bool} autoclose [default: false]
   * @param  {int} delay [default: 5000]
   * @param  {object} cbs [callbacks: ok, close]
   * @return {jQuery} $rendered
   */

  window._app.prototype.notifySuccess = function(msg, btn, autoclose, delay, cbs) {
    var $rendered, data;
    if (msg == null) {
      msg = 'Success';
    }
    if (btn == null) {
      btn = 'Ok';
    }
    if (autoclose == null) {
      autoclose = false;
    }
    if (delay == null) {
      delay = 5000;
    }
    if (cbs == null) {
      cbs = {};
    }
    Mustache.parse(this.templates.settings_popupSuccess);
    data = {
      msg: msg,
      btn: btn
    };
    $rendered = $(Mustache.render(this.templates.settings_popupSuccess, data));
    this.layout.$settingsArea.append($rendered);
    $rendered.find('.button-close a').on('click', function(e) {
      e.preventDefault();
      $rendered.removeClass('show');
      if (typeof cbs.ok === 'function') {
        cbs.ok();
      }
      return setTimeout(function() {
        $rendered.remove();
        if (typeof cbs.close === 'function') {
          return cbs.close();
        }
      }, 550);
    });
    $rendered.addClass('show');
    if (autoclose) {
      setTimeout(function() {
        return $rendered.find('.button-close a').trigger('click');
      }, delay);
    }
    return $rendered;
  };


  /**
   * Render settings page
   * @param  {object} cbs [callbacks: rendered]
   * @return {null}
   */

  window._app.prototype.renderSettingsArea = function(cbs) {
    var data, rendered, ths;
    if (cbs == null) {
      cbs = {};
    }
    this.layout.$settingsArea.removeClass('wide');
    Mustache.parse(this.templates.settings_head);
    data = {
      settings_settings_head: this.lang.settings_settings_head
    };
    rendered = Mustache.render(this.templates.settings_head, data);
    this.layout.$settingsArea.append(rendered);
    ths = this;
    return this.ajax.getSettings({
      complete: function(response) {
        var $rendered;
        if (response.success) {
          $rendered = ths._renderSettingsBox('email2snapbit', response.data);
          ths.layout.$settingsArea.append($rendered);
          $rendered = ths._renderSettingsBox('plan', response.data);
          ths.layout.$settingsArea.append($rendered);
          $rendered = ths._renderSettingsBox('reminder', response.data);
          ths.layout.$settingsArea.append($rendered);
          $rendered = ths._renderSettingsBox('password', response.data);
          ths.layout.$settingsArea.append($rendered);
          $rendered = ths._renderSettingsBox('bitpassword', response.data);
          ths.layout.$settingsArea.append($rendered);
        }
        $(document).trigger('settings.area.rendered', [app.layout.$settingsArea]);
        if (typeof cbs.rendered === 'function') {
          return cbs.rendered();
        }
      }
    });
  };


  /**
   * Render settings plans page
   * @param  {object} [callbacks: rendered]
   * @return {null}
   */

  window._app.prototype.renderSettingsPlans = function(cbs) {
    var data, rendered, ths, unlocked;
    if (cbs == null) {
      cbs = {};
    }
    this.layout.$settingsArea.addClass('wide');
    Mustache.parse(this.templates.settings_head);
    ths = this;
    data = {
      settings_settings_head: this.lang.settings_page_plans_head,
      subpage: true
    };
    rendered = Mustache.render(this.templates.settings_head, data);
    this.layout.$settingsArea.append(rendered);
    unlocked = false;
    return this.ajax.getSettings({
      complete: function(response) {
        var $rendered;
        Mustache.parse(ths.templates.settings_page_plans);
        data = {
          downgrade: !unlocked && response.data.is_premium,
          upgrade: !unlocked && !response.data.is_premium
        };
        $rendered = $(Mustache.render(ths.templates.settings_page_plans, data));
        ths.layout.$settingsArea.append($rendered);
        $rendered.find('.free').on('click', function(e) {
          e.preventDefault();
          return ths.ajax.pause_sub({
            complete: function(response) {
              return ths.notifySuccess('Success', 'OK', false, null, {
                ok: function() {
                  return ths.pushState('#settings');
                }
              });
            }
          });
        });
        if (typeof cbs.rendered === 'function') {
          return cbs.rendered();
        }
      }
    });
  };


  /**
   * Render settings unlock page
   * @param  {object} [callbacks: rendered]
   * @return {null}
   */

  window._app.prototype.renderSettingsUnlock = function(cbs) {
    var data, rendered, ths;
    if (cbs == null) {
      cbs = {};
    }
    this.layout.$settingsArea.removeClass('wide');
    Mustache.parse(this.templates.settings_head);
    ths = this;
    data = {
      settings_settings_head: this.lang.settings_page_unlock_head,
      subpage: true
    };
    rendered = Mustache.render(this.templates.settings_head, data);
    this.layout.$settingsArea.append(rendered);
    return this.ajax.getSettings({
      complete: function(response) {
        var $email_fields, $email_share_btn, $rendered, isValidEmailAddress;
        Mustache.parse(ths.templates.settings_page_unlock);
        data = {
          isPremium: response.data.is_premium,
          shared_fb: response.data.shared_fb !== void 0 ? response.data.shared_fb : false,
          shared_twitter: response.data.shared_twitter !== void 0 ? response.data.shared_twitter : false,
          shared_email: response.data.shared_email !== void 0 ? response.data.shared_email : false
        };
        rendered = Mustache.render(ths.templates.settings_page_unlock, data);
        ths.layout.$settingsArea.append(rendered);
        $rendered = ths.layout.$settingsArea.find('.settings-unlock');
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
                    if (result.done) {
                      return setTimeout(function() {
                        return ths.pushState('#settings');
                      }, 500);
                    }
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
                  if (result.done) {
                    return setTimeout(function() {
                      return ths.pushState('#settings');
                    }, 500);
                  }
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
                    if (result.done) {
                      return setTimeout(function() {
                        return ths.pushState('#settings');
                      }, 500);
                    }
                  }
                }
              });
            }
          }
        });
        if (typeof cbs.rendered === 'function') {
          return cbs.rendered();
        }
      }
    });
  };


  /**
   * Render settings upgrade page
   * @param  {object} [callbacks: rendered]
   * @return {null}
   */

  window._app.prototype.renderSettingsSubscribe = function(cbs) {
    var data, parts, rendered, ths;
    if (cbs == null) {
      cbs = {};
    }
    this.layout.$settingsArea.removeClass('wide');
    Mustache.parse(this.templates.settings_head);
    ths = this;
    data = {
      settings_settings_head: this.lang.settings_page_subscribe_head,
      subpage: true
    };
    rendered = Mustache.render(this.templates.settings_head, data);
    this.layout.$settingsArea.append(rendered);
    parts = ths.getURLhash().split('/');
    return this.ajax.getSettings({
      complete: function(response) {
        var trackingJson;
        if (response.success) {
          if (response.data.is_premium === true) {
            ths.pushState('#settings');
            return;
          }
          trackingJson = JSON.stringify({
            user_id: f3.userId,
            local_timestamp: moment().format('X')
          });
          data = {
            isPremium: response.data.is_premium,
            paypalButtonID: response.data.paypal_button_id !== void 0 ? response.data.paypal_button_id : false,
            tracking_json: trackingJson
          };
          if (parts[2] === 'finish') {
            ths.notifySuccess('Payment processing...', 'OK', false, null, {
              ok: function() {
                return ths.pushState('#settings');
              }
            });
          }
          rendered = Mustache.render(ths.templates.settings_page_subscribe, data);
          ths.layout.$settingsArea.append(rendered);
          if (typeof cbs.rendered === 'function') {
            return cbs.rendered();
          }
        } else {
          if (typeof cbs.error === 'function') {
            return cbs.error();
          }
        }
      }
    });
  };

}).call(this);
