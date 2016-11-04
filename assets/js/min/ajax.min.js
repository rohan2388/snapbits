(function() {
  window._app.prototype.ajax = {

    /*
    	 *# @brief 	Calculate when to send notification
    	 *# @param {object} _reminder
     */
    calculate_notify_time: function(_reminder) {
      var reminder, timestamp;
      if (_reminder == null) {
        _reminder = {};
      }
      reminder = $.extend({
        reminder: '',
        time: ''
      }, _reminder);
      timestamp = moment(reminder.time, 'DD/MM/YYYY HH:mm').format('X');
      switch (reminder.reminder) {
        case 'on-time':
          timestamp = timestamp;
          break;
        case '10-min':
          timestamp = timestamp - (10 * 60);
          break;
        case '30-min':
          timestamp = timestamp - (30 * 60);
          break;
        case '1-hour':
          timestamp = timestamp - (60 * 60);
          break;
        case '2-hours':
          timestamp = timestamp - (120 * 60);
          break;
        case '1-day':
          timestamp = timestamp - (24 * 60 * 60);
          break;
        case '1-week':
          timestamp = timestamp - (7 * 24 * 60 * 60);
          break;
        default:
          timestamp = '';
      }
      return timestamp;
    },

    /*
    	 *#  @brief  Add post to db
    	 *#  @param  object Post object from composer form
    	 *#  @param  object settings.progress and settings.complete event handler
     */
    add_post: function(post, settings) {
      var fd, options;
      options = $.extend({
        progress: function(e) {},
        complete: function(post) {}
      }, settings);
      fd = new FormData();
      fd.append('title', post.title);
      fd.append('content', post.content);
      fd.append('color', post.color);
      fd.append('tags', post.tags);
      fd.append('time', post.time);
      fd.append('lock', post.lock);
      $.each(post.docs, function(k, doc) {
        var filename;
        filename = doc.filename || doc.name;
        return fd.append('docs[]', doc, filename);
      });
      $.each(post.imgs, function(k, img) {
        var filename;
        filename = img.filename || img.name;
        return fd.append('imgs[]', img, filename);
      });
      $.each(post.voiceNotes, function(k, voice) {
        return fd.append('voices[]', voice);
      });
      fd.append('reminder[reminder]', post.reminder.reminder);
      fd.append('reminder[time]', post.reminder.time);
      fd.append('reminder[notify]', window.app.ajax.calculate_notify_time(post.reminder));
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/post_add',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        xhr: function() {
          var xhr;
          xhr = $.ajaxSettings.xhr();
          xhr.upload.addEventListener('progress', options.progress, false);
          return xhr;
        },
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(textStatus);
        }
      });
    },

    /*
    	 *#  @brief  Update a post
    	 *#  @param  object Post object editor
    	 *#  @param  string token 
    	 *#  @param  object settings.progress and settings.complete event handler
     */
    update_post: function(post, token, settings) {
      var fd, options;
      if (token == null) {
        token = '';
      }
      options = $.extend({
        progress: function(e) {},
        complete: function(post) {}
      }, settings);
      fd = new FormData();
      fd.append('id', post.id);
      fd.append('title', post.title);
      fd.append('content', post.content);
      fd.append('color', post.color);
      fd.append('tags', post.tags);
      fd.append('time', post.time);
      fd.append('lock', post.lock);
      fd.append('token', token);
      fd.append('reminder[reminder]', post.reminder.reminder);
      fd.append('reminder[time]', post.reminder.time);
      fd.append('reminder[notify]', window.app.ajax.calculate_notify_time(post.reminder));
      $.each(post.rfiles, function(k, rfile) {
        return fd.append('rfiles[]', rfile);
      });
      $.each(post.docs, function(k, doc) {
        var filename;
        filename = doc.filename || doc.name;
        return fd.append('docs[]', doc, filename);
      });
      $.each(post.imgs, function(k, img) {
        var filename;
        filename = img.filename || img.name;
        return fd.append('imgs[]', img, filename);
      });
      $.each(post.voiceNotes, function(k, voice) {
        return fd.append('voices[]', voice);
      });
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/post_update',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        xhr: function() {
          var xhr;
          xhr = $.ajaxSettings.xhr();
          xhr.upload.addEventListener('progress', options.progress, false);
          return xhr;
        },
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
        }
      });
    },

    /*
    	 *# @brief      Gets the posts from db.
    	 *# @param      count     init		number of posts to fetch
    	 *# @param      page      init 		page number
    	 *# @param      settings  object 	settings object
     */
    get_tags: function(settings) {
      var fd, options;
      options = $.extend({
        complete: function(response) {}
      }, settings);
      fd = new FormData();
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/get_tags',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(textStatus);
        }
      });
    },

    /**
    	 * Gets the posts from db
    	 * @param  {int} count
    	 * @param  {int} page
    	 * @param  {object} settings [filters object]
    	 * @return {null}
     */
    get_posts: function(count, page, settings) {
      var fd, options;
      if (count == null) {
        count = 10;
      }
      if (page == null) {
        page = 1;
      }
      if (settings == null) {
        settings = {};
      }
      options = $.extend({
        filter: {},
        complete: function(post) {}
      }, settings);
      fd = new FormData();
      fd.append('count', count);
      fd.append('page', page);
      fd.append('filter', JSON.stringify(options.filter));
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/posts_get',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /*
    	 *# @brief Remove a post.
    	 *# @param {string/int} postId
    	 *# @param {string} token
    	 *# @param {object} settings Callback and other settings
     */
    remove_post: function(postId, token, options) {
      var fd;
      if (token == null) {
        token = '';
      }
      if (options == null) {
        options = {};
      }
      if (typeof postId === 'undefined') {
        return;
      }
      options = $.extend({
        complete: function() {},
        error: function() {}
      }, options);
      fd = new FormData();
      fd.append('post_id', postId);
      fd.append('token', token);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/post_remove',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          options.error();
          return console.log(errorThrown);
        }
      });
    },

    /*
    	 *# @brief      Get a single post by ID.
    	 *# @param      postId    init
    	 *# @param      token	string
    	 *# @param {object} optoons Callback
     */
    get_post: function(postId, token, settings) {
      var fd, options;
      if (token == null) {
        token = '';
      }
      if (typeof postId === 'undefined') {
        return;
      }
      options = $.extend({
        complete: function() {},
        error: function() {}
      }, settings);
      fd = new FormData();
      fd.append('post_id', postId);
      fd.append('token', token);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/post_get',
        data: fd,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(response) {
          return options.complete(response.post);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /*
    	 *# @brief	Unlock a post
    	 *# @param {int} postId 
    	 *# @param {string} password
    	 *# @param {object} optoons Callback
     */
    unlockPost: function(postId, password, options) {
      if (password == null) {
        password = '';
      }
      if (options == null) {
        options = {};
      }
      if (typeof postId === 'undefined' || typeof password === 'undefined') {
        return;
      }
      options = $.extend({
        complete: function() {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/unlock',
        data: {
          post_id: postId,
          password: password
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Add email address to email2snapbit list
    	 * @param {string} email 
    	 * @param {object} options
     */
    addEmail2snapbits: function(email, options) {
      if (options == null) {
        options = {};
      }
      if (email === void 0) {
        return;
      }
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/add_email2snapbits',
        data: {
          emails: [email]
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response.success);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Remove email address from email2snapbit list
    	 * @param {string} email 
    	 * @param {object} options
     */
    removeEmail2snapbits: function(email, options) {
      if (options == null) {
        options = {};
      }
      if (email === void 0) {
        return;
      }
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/remove_email2snapbits',
        data: {
          emails: [email]
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Add email address to reminder list
    	 * @param {string} email 
    	 * @param {object} options
     */
    addReminder: function(email, options) {
      if (options == null) {
        options = {};
      }
      if (email === void 0) {
        return;
      }
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/add_reminder',
        data: {
          emails: [email]
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response.success);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Remove email address from reminder list
    	 * @param {string} email 
    	 * @param {object} options
     */
    removeReminder: function(email, options) {
      if (options == null) {
        options = {};
      }
      if (email === void 0) {
        return;
      }
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/remove_reminder',
        data: {
          emails: [email]
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Set timezone
    	 * @param {string} timezone
    	 * @param {object} options
     */
    setTimezone: function(timezone, options) {
      if (options == null) {
        options = {};
      }
      if (timezone === void 0) {
        return;
      }
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/set_timezone',
        data: {
          timezone: timezone
        },
        dataType: 'json',
        success: function(response) {
          if (typeof options.complete === 'function') {
            return options.complete(response);
          }
        }
      });
    },

    /**
    	 * Change login password
    	 * @param  {object} data
    	 * @param  {object} options
    	 * @return {null}
     */
    changePassword: function(data, options) {
      if (typeof data !== 'object' || data.length === 0) {
        return;
      }
      data = $.extend({
        pass_ex: '',
        pass_new: '',
        pass_re: '',
        pass_hint: ''
      }, data);
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/change_password',
        data: {
          pass_ex: data.pass_ex,
          pass_new: data.pass_new,
          pass_re: data.pass_re,
          pass_hint: data.pass_hint
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Change lock password
    	 * @param  {object} data
    	 * @param  {object} options
    	 * @return {null}
     */
    changeLockPassword: function(data, options) {
      if (typeof data !== 'object' || data.length === 0) {
        return;
      }
      data = $.extend({
        pass_ex: '',
        pass_new: '',
        pass_re: '',
        pass_hint: ''
      }, data);
      options = $.extend({
        complete: function(response) {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/change_lockpassword',
        data: {
          pass_ex: data.pass_ex,
          pass_new: data.pass_new,
          pass_re: data.pass_re,
          pass_hint: data.pass_hint
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /**
    	 * Get settings
    	 * @param  {object} options [callbacks: complete]
    	 * @return {null}
     */
    getSettings: function(options) {
      if (options == null) {
        options = {};
      }
      options = $.extend({
        complete: function() {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/get_settings',
        data: {},
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(errorThrown);
        }
      });
    },

    /*
    	 *# @brief Register social share
    	 *# @param {object} data 
    	 *# @param {object} options and callbacks
     */
    shared: function(data, options) {
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      options = $.extend({
        complete: function() {}
      }, options);
      if (data === void 0) {
        return;
      }
      data = $.extend({
        type: '',
        emails: []
      }, data);
      console.log(data);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/social_share',
        data: {
          type: data.type,
          emails: data.emails
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response.success);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
        }
      });
    },

    /**
    	 * Pause subscription
    	 * @param  {object} options 
    	 * @return {null}
     */
    pause_sub: function(options) {
      if (options == null) {
        options = {};
      }
      options = $.extend({
        complete: function() {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/subscription_pause',
        data: {},
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        }
      });
    },

    /**
    	 * Resume subscription
    	 * @param  {object} options 
    	 * @return {null}
     */
    resume_sub: function(options) {
      if (options == null) {
        options = {};
      }
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/subscription_resume',
        data: {},
        dataType: 'json',
        success: function(response) {
          if (typeof options.complete === 'function') {
            return options.complete(response);
          }
        }
      });
    },

    /**
    	 * Logout user
    	 * @param  {object} options
    	 * @return {null}
     */
    logout: function(options) {
      if (options == null) {
        options = {};
      }
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/logout',
        data: {},
        dataType: 'json',
        success: function(response) {
          if (typeof options.complete === 'function') {
            return options.complete(response);
          }
        }
      });
    },

    /**
    	 * Disable upgrade popup
    	 * @param  {bool} check
    	 * @param  {object} options
    	 * @return {null}
     */
    disableUpgradePopup: function(check, options) {
      if (options == null) {
        options = {};
      }
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/disable_upgrade_popup',
        data: {
          check: check
        },
        dataType: 'json',
        success: function(response) {
          if (typeof options.complete === 'function') {
            return options.complete(response);
          }
        }
      });
    }
  };

}).call(this);
