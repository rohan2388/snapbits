(function() {
  window._app.prototype.getTemplates = function(member) {
    var templates;
    if (member == null) {
      member = true;
    }
    if (member) {
      templates = {
        layoutMemberArea: $('#template-layout-member').html(),
        layoutSettingsArea: $('#template-layout-settings').html(),
        layoutLegalArea: $('#template-layout-legal').html(),
        composeArea: $('#template-compose-area').html(),
        recorder: $('#template-media-recorder').html(),
        player: $('#template-media-player').html(),
        uploader: $('#template-media-uploader').html(),
        doc: $('#template-media-doc').html(),
        colorChooser: $('#template-color-chooser').html(),
        colorViewer: $('#template-color-viewer').html(),
        reminderEditor: $('#template-reminder-editor').html(),
        reminderViewer: $('#template-reminder-viewer').html(),
        searchBar: $('#template-search-bar').html(),
        searchTags: $('#template-search-tags').html(),
        searchFilter: $('#template-search-filter').html(),
        timelineWrapper: $('#template-timeline-wrapper').html(),
        timelineGroup: $('#template-timeline-group').html(),
        timelineItem: $('#template-timeline-item').html(),
        detailedToolbar: $('#template-detailed-toolbar').html(),
        detailedNote: $('#template-detailed-note').html(),
        tags: $('#template-details-tags').html(),
        popupDelete: $('#template-popup-delete').html(),
        popupUpgrade: $('#template-popup-upgrade').html(),
        settings_head: $('#template-settings-head').html(),
        settings_email2snapbit: $('#template-settings-email2snapbit').html(),
        settings_reminder: $('#template-settings-reminder').html(),
        settings_password: $('#template-settings-password').html(),
        settings_bitpassword: $('#template-settings-bitpassword').html(),
        settings_plan: $('#template-settings-plan').html(),
        settings_popupSuccess: $('#template-settings-popup-success').html(),
        settings_page_plans: $('#template-settings-page-plans').html(),
        settings_page_unlock: $('#template-settings-page-unlock').html(),
        settings_page_subscribe: $('#template-settings-page-subscribe').html(),
        legal_pp: $('#template-legal-pp').html(),
        legal_tou: $('#template-legal-tou').html(),
        legal_disclaimer: $('#template-legal-disclaimer').html(),
        legal_cp: $('#template-legal-cp').html(),
        legal: $('#template-legal').html()
      };
    } else {
      templates = {
        sidebarArea: $('#template-sidebar-area').html(),
        signupForm: $('#template-signup-form').html(),
        loginForm: $('#template-login-form').html(),
        smallNav: $('#template-samll-nav').html(),
        banner: $('#template-banner').html(),
        bannerLogin: $('#template-banner-login').html(),
        microsite: $('#template-microsite').html(),
        setupSidebar: $('#template-setup-sidebar').html(),
        stepOne: $('#template-setup-one').html(),
        stepTwo: $('#template-setup-two').html(),
        stepThree: $('#template-setup-three').html(),
        legal_pp: $('#template-legal-pp').html(),
        legal_tou: $('#template-legal-tou').html(),
        legal: $('#template-legal').html()
      };
    }
    return templates;
  };

}).call(this);
