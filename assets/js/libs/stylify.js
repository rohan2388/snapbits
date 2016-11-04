(function ($) {
	"use strict";
	window.$__style = $('<style type="text/css"></style>');	
	$('head').append($__style);

	$.fn.stylify = function (styles){
		if (typeof styles == 'undefined')
			return;	
		var ths = this;
		var $el = $(this);
		var _styles = [];
     	for (var i = 0; i <= (arguments.length - 1) ; i++) {
     		_styles.push(arguments[i])
     	}

		var _makeid = function(length){
			var text = "";
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
			for( var i=0; i < length; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}

     	var _each = function(k,style){
     		if (typeof style == 'string' ){
     			$el.attr('style', style);
     		}else if (typeof style == 'object'){
     			var html = '';
     			var className = 'stylify-'+_makeid(10);
     			var hasQuery = false;
     			var hasBackgroundImg = false;
     			var normal,at2x;

				var __each = function(key,val){
					if (key == 'query'){
						hasQuery = val;
					}else if (key == 'background-image'){
						hasBackgroundImg = true;
						normal = val.replace(/@2x\./, '.');
						at2x = normal.replace(/(\.\w+$)/, '@2x$1');
					}else{
						html += key + ':' + val + ';'
					}
				}


     			$.each(style, __each);


     			if (hasBackgroundImg && !hasQuery){
     				html += 'background-image' + ': url("' + normal + '");'   				
     			}

     			html = '.'+className+'{'+html+'}';
     			if (hasBackgroundImg && !hasQuery) {
     				html += '@media (-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx) { .'+className+' { background-image: url("'+at2x+'");} }';

     			}

     			if (hasQuery){
     				html = '@media '+hasQuery+'{'+html+'}';
     			}


     			$el.addClass(className);
     			$__style.append(html);
     		}
     	}
     	$(_styles).each(_each);

	} 

})(jQuery);
