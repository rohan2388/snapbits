(function() {
  window.filesToUpload = [];

  $.fn.uploaderDestroy = function() {
    var $wrapper;
    $wrapper = $(this);
    if ($wrapper.find('.media-uploader').length > 0) {
      $wrapper.removeClass('open');
      return $wrapper.stop().slideUp(200, function() {
        return $wrapper.find('.media-uploader').remove();
      });
    }
  };

  $.fn.uploader = function(uploaderType, settings) {
    var $dropzone, $input, $uploader, $wrapper, dragEnterCounter, isUploading, options, rendered, _click, _dragenter, _dragleave, _dragover, _drop, _processUploads, _uploadFiles;
    if (uploaderType == null) {
      uploaderType = 'image';
    }
    options = $.extend({
      onOk: function() {}
    }, settings);
    $wrapper = $(this);
    Mustache.parse(app.templates.uploader);
    rendered = Mustache.render(app.templates.uploader, {});
    $uploader = $(rendered);
    $dropzone = $uploader.find('.media-dropzone');
    if ($wrapper.hasClass('open')) {
      $wrapper.empty().append($uploader).stop().show();
    } else {
      $wrapper.addClass('open').empty().append($uploader).stop().slideDown(200);
    }
    $input = $('<input>');
    $input.attr({
      'type': 'file',
      'multiple': true
    });
    if (uploaderType === 'image') {
      $input.attr('accept', 'image/*');
    }
    $input.hide();
    $uploader.append($input);
    isUploading = false;
    _processUploads = function() {
      return $wrapper.slideUp(200, function() {
        return $wrapper.find('.media-uploader').remove();
      });
    };
    _uploadFiles = function(e) {
      var dt, files;
      files = null;
      dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
      files = e.target.files || (dt && dt.files);
      $dropzone.removeClass('dragover');
      $.each(files, function(e, file) {
        var reader, type;
        type = file.type;
        if (uploaderType === 'image') {
          if (type === 'image/png' || type === 'image/jpeg' || type === 'image/gif') {
            if (typeof window.tempImgs === 'undefined') {
              window.tempImgs = [];
            }
            window.tempImgs.push(file);
            reader = new FileReader();
            reader.onload = function(e) {
              var $img;
              $img = $('<img/>');
              $img.attr('src', e.target.result);
              return options.onOk($img, file);
            };
            reader.readAsDataURL(file);
          }
        }
        if (uploaderType === 'doc') {
          if (typeof window.tempDocs === 'undefined') {
            window.tempDocs = [];
          }
          window.tempDocs.push(file);
          Mustache.parse(app.templates.doc);
          rendered = Mustache.render(app.templates.doc, {
            filename: file.name
          });
          return options.onOk(rendered, file);
        }
      });
      return _processUploads();
    };
    _dragover = function(e) {
      return e.preventDefault();
    };
    _dragenter = function(e) {
      e.preventDefault();
      dragEnterCounter++;
      return $dropzone.addClass('dragover');
    };
    _dragleave = function(e) {
      e.preventDefault();
      dragEnterCounter--;
      if (dragEnterCounter === 0) {
        return $dropzone.removeClass('dragover');
      }
    };
    _drop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return _uploadFiles(e);
    };
    _click = function(e) {
      e.preventDefault();
      return $input.click();
    };
    dragEnterCounter = 0;
    $dropzone.bind({
      dragenter: _dragenter,
      dragleave: _dragleave,
      dragover: _dragover,
      drop: _drop,
      dragdrop: _drop,
      click: _click
    });
    return $input.on('change', _uploadFiles);
  };

}).call(this);
