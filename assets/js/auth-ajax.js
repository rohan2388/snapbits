(function() {
  window._app.prototype.ajax = {

    /*
    	 *# @brief Login user
    	 *# @param {object} data 
    	 *# @param {object} options and callbacks
     */
    verifySession: function(options) {
      var optiins;
      optiins = $.extend({
        complete: function() {}
      }, options);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/verify_session',
        data: {},
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
        }
      });
    },

    /*
    	 *# @brief Recover password
    	 *# @param {object} data
    	 *# @param {object} options and callbacks
     */
    passowrdRecover: function(data, options) {
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      data = $.extend({
        username: ''
      }, data);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/recover',
        data: {
          username: data.username
        },
        dataType: 'json',
        success: function(response) {
          console.log(response);
          return options.complete(response);
        }
      });
    },

    /*
    	 *# @brief Login user
    	 *# @param {object} data 
    	 *# @param {object} options and callbacks
     */
    login: function(data, options) {
      var optiins;
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      optiins = $.extend({
        complete: function() {}
      }, options);
      data = $.extend({
        username: '',
        password: ''
      }, data);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/login',
        data: {
          username: data.username,
          password: data.password
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
        }
      });
    },

    /*
    	 *# @brief Signup user
    	 *# @param {object} data 
    	 *# @param {object} options and callbacks
     */
    signup: function(data, options) {
      var optiins;
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      optiins = $.extend({
        complete: function() {}
      }, options);
      data = $.extend({
        username: '',
        email: '',
        password: ''
      }, data);
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/signup',
        data: {
          username: data.username,
          password: data.password,
          email: data.email
        },
        dataType: 'json',
        success: function(response) {
          return options.complete(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
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

    /*
    	 *# @brief Save optional setup forms
    	 *# @param {object} data 
    	 *# @param {object} options and callbacks
     */
    setup: function(data, options) {
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
      return $.ajax({
        type: 'POST',
        url: window.app.baseURL + '/ajax/setup',
        data: data,
        dataType: 'html',
        success: function(response) {
          console.log(response);
          return options.complete(true);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR.responseText);
        }
      });
    }
  };

}).call(this);
