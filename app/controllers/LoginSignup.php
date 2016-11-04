<?php 
class LoginSignup extends Controller {
	public function init () {
		$this->render();
	}

	public function assets () {
		$this->f3->set(
			'_javsScripts',
			array(
				'libs/jquery.js',
				'libs/moment.js',
				'libs/mustache.js',
				'libs/owl.carousel.js',
				'libs/jquery.tagsinput.js',
				'libs/stylify.js',
				'libs/jquery.scrollbar.js',
				'landing.js',
				'loginApp.js',
				'templates.js',
				'lang.js',
				'auth-ajax.js',
			)
		);
	}

	
	public function render () {
		echo $this->header();
		echo $this->layout('login');
		echo $this->templates(array(
			'login/sidebar/sidebar-area.htm',
			'login/sidebar/login-form.htm',
			'login/sidebar/signup-form.htm',
			'login/sidebar/setup-steps.htm',
			'login/content/small-nav.htm',
			'login/content/banner.htm',
			'login/content/microsite.htm',
			'login/content/step-one.htm',
			'login/content/step-two.htm',
			'login/content/step-three.htm',
			'legal/privacy-policy.htm',
			'legal/terms-of-use.htm',
			'legal/legal.htm',
		));	
		echo $this->footer(true);
	}
}