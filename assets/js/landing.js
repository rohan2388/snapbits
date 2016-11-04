function initbanner($banner){
	var $slides = $banner.find('.banner_slide');
	var currentEq = 0;
	var animating = false;
	var $scrollBtn = $banner.find('.banner-nav .scroll-down a')
	$scrollBtn.on('click', function(e){
		e.preventDefault();
		height = $banner.height()
		window.app.layout.$content.animate({scrollTop: height}, 'slow')

	});
	$slides.each(function(){
		var $ths = $(this);
		var url = $ths.data('img');

		$ths.stylify({
			'background-image': url
		});

	});
	$slides.eq(0).addClass('current');


	var _slideIn = function(eq){
		if (animating) {
        	return false;
        }
        animating = true;
        var $oldSlide = $slides.eq(currentEq);
        var $newSlide = $slides.eq(eq);
        currentEq = eq;
        $newSlide.addClass('next-in');
        $oldSlide.addClass('next-out').removeClass('current');

        setTimeout(function(){
        	$newSlide.addClass('transitioning');
        	$oldSlide.addClass('transitioning');

        	setTimeout(function(){
        		$newSlide.addClass('current').removeClass('transitioning next-in');
        		$oldSlide.removeClass('transitioning next-out');
        		animating = false;
        	}, 1100);

        }, 30);


	}

	var intrval = setInterval(function(){
		if (window.app.isMobile && window.app.layout.$viewportPan.hasClass('mob-sidebar-view'))
			return

		if ($slides.length < 2)
			return

		var newEq = currentEq + 1;
		if (newEq >= $slides.length) {
			newEq = 0;
		}
		_slideIn(newEq);
	}, 5000);

}
function bannerEvents($banner){
	var $nav = $banner.prev('.nav')
}

function micrositeEvents($microsite){
	var $micronav   = $microsite.find('.micro-nav')
	var $micronavLeft   = $micronav.find('.nav-left')
	var $micronavRight  = $micronav.find('.nav-right')
	var menuHeight  = -2;
	var $banner     = $microsite.prev()
	var $howItWorks = $microsite.find('.micro-howitworks')
	var $features = $microsite.find('.micro-features')
	var $plans = $microsite.find('.micro-plans')
	var $reviews = $microsite.find('.micro-reviews')

	window.app.layout.$content.on('scroll', function(e){
		var bannerHeight = $banner.height()
		var scrollTop = $(this).scrollTop()
		// sticky naviagation
		if (scrollTop > bannerHeight){
			$microsite.addClass('sticky-nav')
		}else{
			$microsite.removeClass('sticky-nav')
		}

		// change active nav
		if (scrollTop > ( (bannerHeight/2) + $reviews.position().top)){
			$micronavLeft.find('a[data-target]:not(a[data-target="micro-reviews"])').removeClass('active')
			$micronavLeft.find('a[data-target="micro-reviews"]').addClass('active')
		} else if (scrollTop > ( (bannerHeight/2) + $plans.position().top)){
			$micronavLeft.find('a[data-target]:not(a[data-target="micro-plans"])').removeClass('active')
			$micronavLeft.find('a[data-target="micro-plans"]').addClass('active')
		} else if (scrollTop > ( (bannerHeight/2) + $features.position().top)){
			$micronavLeft.find('a[data-target]:not(a[data-target="micro-features"])').removeClass('active')
			$micronavLeft.find('a[data-target="micro-features"]').addClass('active')
		} else if (scrollTop > ( (bannerHeight/2) + $howItWorks.position().top - menuHeight)){
			$micronavLeft.find('a[data-target]:not(a[data-target="micro-howitworks"])').removeClass('active')
			$micronavLeft.find('a[data-target="micro-howitworks"]').addClass('active')
		}else{
			$micronavLeft.find('a[data-target="micro-howitworks"]').removeClass('active')
		}
	});

	$micronavLeft.on('click', 'a', function(e){
		e.preventDefault();
		var $ths = $(this);
		var clss = $ths.data('target')
		var scrollTop = $banner.height() + $microsite.find('.'+clss).position().top - menuHeight
		window.app.layout.$content.animate({scrollTop: scrollTop}, 'slow')
	});

	$micronavRight.on('click', 'a.login', function(e){
		e.preventDefault()
		window.app.renderLoginContent()
	});

	$micronavRight.on('click', 'a[href="#tos"]', function(e){
		e.preventDefault();
		window.app.renderLegalContent($(this).attr('href').replace('#', ''));
	});

	$microsite.find('.to-signup').on('click', function(e){
		e.preventDefault()
		if ( window.app.isMobile ) {
			if ( window.app.layout.$viewportPan.hasClass('mob-sidebar-view') == false ) {			
				window.app.layout.$viewport.fadeOut( 'fast',function(){
					window.app.layout.$viewportPan.css('transition', 'none').addClass('mob-sidebar-view');
					setTimeout(function(){
						window.app.layout.$viewportPan.addClass('mob-sidebar-view');
						window.app.layout.$viewport.fadeIn('fast');
					}, 50);				
				});
			}
		}

	});

	$microsite.find('a.scroll-link').on('click', function(e){
		e.preventDefault();
		var $ths = $(this);
		var clss = $ths.data('target')
		var scrollTop = $banner.height() + $microsite.find('.'+clss).position().top - menuHeight
		window.app.layout.$content.animate({scrollTop: scrollTop}, 'slow')
	});
}

function initCarousel($microsite){
	$microsite.find(".owl-carousel-wrapper").each(function(){
		var $carousel = $(this);
		var $wrapper = $carousel.parent();
		var $prev = $wrapper.find('.owl-carousel-nav.nav-prev');
		var $next = $wrapper.find('.owl-carousel-nav.nav-next');

		$carousel.owlCarousel({
			items: 3,
			margin: 60,
			loop: true,
			responsive : {
				0 : {
					items: 1
				},
				480 : {
					items: 3,
					margin: 60
				}
			}
		});


		$prev.on('click',function(e){
			e.preventDefault();
			$carousel.trigger('prev.owl.carousel');
		});

		$next.on('click',function(e){
			e.preventDefault();
			$carousel.trigger('next.owl.carousel');
		});

	});
}


function initReviews($microsite){
	$microsite.find(".owl-review-carousel-wrapper").each(function(){
		var $carousel = $(this);
		var $wrapper = $carousel.parent();
		var $prev = $wrapper.find('.owl-carousel-nav.nav-prev');
		var $next = $wrapper.find('.owl-carousel-nav.nav-next');

		$carousel.owlCarousel({
			items: 1,
			margin: 15,
			loop: true,
			nav: false,
			dots: true
		});


		$prev.on('click',function(e){
			e.preventDefault();
			$carousel.trigger('prev.owl.carousel');
		});

		$next.on('click',function(e){
			e.preventDefault();
			$carousel.trigger('next.owl.carousel');
		});

	});
}


$(document).on('banner.rendered', function(e, $banner){
	initbanner($banner);
	bannerEvents($banner);
})

$(document).on('microsite.rendered', function(e, $microsite){
	micrositeEvents($microsite);
})
$(document).on('microsite.visible', function(e, $microsite){
	initCarousel($microsite);
	initReviews($microsite);
})