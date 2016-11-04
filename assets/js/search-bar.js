(function() {
  var filters;

  window.uniqId = function() {
    return Math.round(new Date().getTime() + (Math.random() * 100));
  };

  filters = {};

  window.get_filters = function() {
    var arr;
    arr = [];
    $.each(filters, function(key, val) {
      var obj, parts, _parts;
      parts = val.split(':');
      switch (parts[0]) {
        case 'color':
          obj = {
            type: 'color',
            value: parts[1]
          };
          return arr.push(obj);
        case 'tag':
          obj = {
            type: 'tag',
            value: parts[1]
          };
          return arr.push(obj);
        case 'date':
          obj = {
            type: 'date_' + parts[1],
            value: parts[2]
          };
          return arr.push(obj);
        case 'advanced':
          _parts = parts[1].split('|separator|');
          return $.each(_parts, function(k, v) {
            var __parts;
            __parts = v.split('|equal|');
            obj = {
              type: 'advanced_' + __parts[0],
              value: __parts[1]
            };
            return arr.push(obj);
          });
      }
    });
    return arr;
  };

  $.fn.initSearch = function() {
    var $advancedFields, $colors, $date_field, $date_wrapper, $dropdowns, $mobSearch, $mobSearchField, $mobSearchTags, $myTags, $searchBox, $searchOptions, $switch, $tag_field, $tags, $wrapper, beginsWith, mobFilterIgnore, mobFilterTimeoutID, _addFilter, _removeFilter;
    $wrapper = $(this);
    $tags = $wrapper.find('.my-tags').find('.tags');
    $mobSearch = window.app.layout.$menuMob.find('.btn-search-wrapper');
    $mobSearchTags = window.app.layout.$menuMob.find('.btn-search-wrapper').find('.search-tags-wrapper');
    $mobSearchField = window.app.layout.$menuMob.find('.btn-search-wrapper').find('.search-tag-filter-field');
    $date_wrapper = $wrapper.find('.date');
    $date_wrapper.find('.date-field input.to').val(moment().format('DD/MM/YYYY'));
    $date_wrapper.find('.date-field input').datePicker();
    $date_wrapper.find('.date-field input').on('focus', function(e) {
      return $(this).parent().addClass('focused');
    });
    $date_wrapper.find('.date-field input').on('blur', function(e) {
      return $(this).parent().removeClass('focused');
    });
    $searchBox = $wrapper.find('.search-box');
    $searchOptions = $wrapper.find('.search-options');
    $searchBox.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $searchOptions.slideDown('fast');
      return setTimeout(function() {
        return $(document).trigger('sticky.recalc');
      }, 300);
    });
    $searchOptions.on('click', function(e) {
      return e.stopPropagation();
    });
    $(document).on('click', function(e) {
      if (!window.app.isMobile) {
        $searchOptions.slideUp('fast');
        $searchOptions.find('.options-group.dropdown.active').removeClass('active').find('.dropdown-section').slideUp('fast');
        return setTimeout(function() {
          return $(document).trigger('sticky.recalc');
        }, 300);
      }
    });
    $dropdowns = $searchOptions.find('.options-group.dropdown');
    $switch = $dropdowns.find('.label-area');
    $switch.on('click', function(e) {
      var $parent, $section, $ths;
      e.preventDefault();
      $ths = $(this);
      $parent = $ths.parent();
      $section = $ths.next();
      if ($parent.hasClass('active')) {
        $section.slideUp('fast');
        return $parent.removeClass('active');
      } else {
        $searchOptions.find('.options-group.dropdown.active').removeClass('active').find('.dropdown-section').slideUp('fast');
        $section.slideDown('fast');
        $parent.addClass('active');
        if ($parent.hasClass('my-tags')) {
          if ($tags.hasClass('inited') === false) {
            $tags.scrollbar();
            $tags.addClass('inited');
          }
          return $tags.scrollTop(0);
        }
      }
    });
    $colors = $searchOptions.find('.color-tags').find('ul.colors');
    $colors.on('click', 'li .color-icon', function(e) {
      var $ths, txt;
      e.preventDefault();
      $ths = $(this);
      txt = $ths.data('search-tag');
      if ($ths.hasClass('active')) {
        return _removeFilter(txt);
      } else {
        return _addFilter(txt);
      }
    });
    $myTags = $searchOptions.find('.my-tags');
    $myTags.on('click', 'ul.tags li span[data-search-tag]', function(e) {
      var $ths, txt;
      e.preventDefault();
      $ths = $(this);
      txt = $ths.data('search-tag');
      if ($ths.parent().hasClass('active')) {
        return _removeFilter(txt);
      } else {
        return _addFilter(txt);
      }
    });
    $date_field = $searchOptions.find('.date').find('.from,.to');
    $date_field.on('dp.change', function(e) {
      var $ths, date, txt;
      $ths = $(this);
      date = $ths.val();
      if ($ths.hasClass('from')) {
        txt = 'date:from:' + date;
      } else {
        txt = 'date:to:' + date;
      }
      if (date !== '') {
        return _addFilter(txt);
      } else {
        return _removeFilter(txt);
      }
    });
    $advancedFields = $searchOptions.find('.advanced').find('input');
    $advancedFields.on('change', function(e) {
      var i, txt;
      txt = "advanced:";
      i = 0;
      $advancedFields.each(function() {
        var $ths, key, val;
        $ths = $(this);
        val = $ths.val();
        key = $ths.attr('name');
        if ($.trim(val) !== '') {
          i++;
          if (i > 1) {
            txt += "|separator|";
          }
          return txt += $.trim(key) + "|equal|" + $.trim(val);
        }
      });
      if (i > 0) {
        return _addFilter(txt);
      } else {
        return _removeFilter(txt);
      }
    });
    $tag_field = $wrapper.find('.search-box-inner');
    $tag_field.on('click', '.filter a', function(e) {
      var $tag, txt;
      e.preventDefault();
      $tag = $(this).parent();
      txt = $tag.data('value');
      return _removeFilter(txt);
    });
    $mobSearchTags.off('click', '.filter a').on('click', '.filter a', function(e) {
      var $tag, txt;
      e.preventDefault();
      $tag = $(this).parent();
      txt = $tag.data('value');
      return _removeFilter(txt);
    });
    mobFilterTimeoutID = 0;
    mobFilterIgnore = false;
    beginsWith = function(needle, haystack) {
      return haystack.substr(0, needle.length) === needle;
    };
    $mobSearchField.on('input clear', function(e) {
      var $ths, val;
      $ths = $(this);
      val = $ths.val();
      if (mobFilterIgnore) {
        return;
      }
      clearTimeout(mobFilterTimeoutID);
      mobFilterIgnore = true;
      mobFilterTimeoutID = setTimeout(function() {
        return mobFilterIgnore = false;
      }, 250);
      if ($.trim(val) !== '') {
        $searchOptions.addClass('tags-only');
        return $tags.find('li').removeClass('visible').each(function() {
          var text;
          $ths = $(this);
          text = $ths.find('span').text();
          if (beginsWith(val.toLowerCase(), text.toLowerCase())) {
            return $ths.addClass('visible');
          }
        });
      } else {
        $ths.val('');
        return $searchOptions.removeClass('tags-only');
      }
    });
    _addFilter = function(txt) {
      var color, data, date, dateFormated, fields_str, filterData, id, isNew, rendered, tag, toOrFrom, type;
      type = txt.split(':')[0];
      Mustache.parse(app.templates.searchFilter);
      id = 'filter-id-' + uniqId();
      switch (type) {
        case 'color':
          color = txt.replace('color:', '');
          data = {
            "class": "filter-color color-" + color,
            txt: "",
            id: id,
            value: txt
          };
          rendered = Mustache.render(app.templates.searchFilter, data);
          filters[id] = txt;
          $tag_field.append(rendered);
          $mobSearchTags.append(rendered);
          $colors.find('li .color-icon[data-search-tag="' + txt + '"]').addClass('active');
          break;
        case 'tag':
          tag = txt.replace('tag:', '');
          data = {
            "class": "filter-tag",
            txt: tag,
            id: id,
            value: txt
          };
          rendered = Mustache.render(app.templates.searchFilter, data);
          filters[id] = txt;
          $tag_field.append(rendered);
          $mobSearchTags.append(rendered);
          $myTags.find('ul.tags li span[data-search-tag="' + txt + '"]').parent().addClass('active');
          break;
        case 'date':
          date = txt.replace('date:', '');
          isNew = true;
          toOrFrom = date.split(':')[0];
          date = date.replace(toOrFrom + ":", "");
          dateFormated = toOrFrom + " " + date;
          dateFormated = dateFormated.replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
          });
          $.each(filters, function(key, val) {
            var txtSplit, valSplit;
            valSplit = val.split(':');
            txtSplit = txt.split(':');
            if (valSplit[0] + ':' + valSplit[1] === txtSplit[0] + ':' + txtSplit[1]) {
              isNew = false;
              return id = key;
            }
          });
          if (isNew === true) {
            data = {
              "class": "filter-date " + toOrFrom,
              txt: dateFormated,
              id: id,
              value: txt
            };
            rendered = Mustache.render(app.templates.searchFilter, data);
            filters[id] = txt;
            $tag_field.append(rendered);
            $mobSearchTags.append(rendered);
          } else {
            filters[id] = txt;
            $tag_field.find('.filter.' + toOrFrom).find('span').text(dateFormated).parent().data('value', txt);
            $mobSearchTags.find('.filter.' + toOrFrom).find('span').text(dateFormated).parent().data('value', txt);
          }
          break;
        case 'advanced':
          fields_str = txt.replace('advanced:', '');
          isNew = true;
          $.each(filters, function(key, val) {
            var _type;
            _type = val.split(':')[0];
            if (_type === 'advanced') {
              isNew = false;
              return id = key;
            }
          });
          if (isNew) {
            data = {
              "class": "filter-advanced",
              txt: "Advanced Search",
              id: id,
              value: txt
            };
            rendered = Mustache.render(app.templates.searchFilter, data);
            $tag_field.append(rendered);
            $mobSearchTags.append(rendered);
          } else {
            $tag_field.find('.filter.filter-advanced').data('value', txt);
            $mobSearchTags.find('.filter.filter-advanced').data('value', txt);
          }
          filters[id] = txt;
      }
      $mobSearchField.val('');
      $mobSearchField.trigger('clear').focus();
      filterData = get_filters();
      return $(document).trigger('filter.change', [filterData]);
    };
    _removeFilter = function(txt) {
      var date, fields_str, filterData, toOrFrom, type;
      type = txt.split(':')[0];
      switch (type) {
        case 'color':
          $.each(filters, function(key, val) {
            if (txt === val) {
              $('.filter-tag-id-' + key).remove();
              delete filters[key];
              return $colors.find('li .color-icon[data-search-tag="' + val + '"]').removeClass('active');
            }
          });
          break;
        case 'tag':
          $.each(filters, function(key, val) {
            if (txt === val) {
              $('.filter-tag-id-' + key).remove();
              delete filters[key];
              return $myTags.find('ul.tags li span[data-search-tag="' + val + '"]').parent().removeClass('active');
            }
          });
          break;
        case 'date':
          date = txt.replace('date:', '');
          toOrFrom = date.split(':')[0];
          $.each(filters, function(key, val) {
            var value;
            if (txt === val) {
              $('.filter-tag-id-' + key).remove();
              delete filters[key];
              if (toOrFrom === 'to') {
                value = moment().format('DD/MM/YYYY');
              } else {
                value = '';
              }
              return $searchOptions.find('.date').find('.' + toOrFrom).val(value);
            }
          });
          break;
        case 'advanced':
          fields_str = txt.replace('advanced:', '');
          $.each(filters, function(key, val) {
            if ('advanced' === val.split(':')[0]) {
              $('.filter-tag-id-' + key).remove();
              delete filters[key];
              return $advancedFields.val('');
            }
          });
      }
      filterData = get_filters();
      return $(document).trigger('filter.change', [filterData]);
    };
    return $(document).on('filter.change', function(e) {
      if ($.isEmptyObject(filters)) {
        return $tag_field.find('span.placeholder').show();
      } else {
        return $tag_field.find('span.placeholder').hide();
      }
    });
  };

  $(document).on('search.rendered', function(e, $timelineArea) {
    return $timelineArea.find('.timeline-search').initSearch();
  });

}).call(this);
