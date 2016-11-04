<?php 
class Settings extends Controller {
	public function init () {
		$this->render();
	}

	public function assets () {
		$this->f3->set(
			'_javsScripts',
			array(
				'libs/jquery.js',
				'libs/mustache.js',
				'libs/owl.carousel.js',
				'libs/jquery.tagsinput.js',
				'libs/stylify.js',
				'libs/jquery.scrollbar.js',
				'libs/moment.js',
				'libs/transition.js',
				'libs/collapse.js',
				'libs/bootstrap-datetimepicker.js',
				'libs/jquery.sticky-kit.js',
				'libs/jquery.collagePlus.js',
				'libs/selectordie.js',
				'libs/audio/recorder.js',
				'libs/audio/Fr.voice.js',
				'landing.js',
				'tags.js',
				'search-bar.js',
				'datepicker.js',
				'gallery.js',
				'editor.js',
				'voice-recorder.js',
				'voice-player.js',
				'media-uploader.js',
				'color-chooser.js',
				'reminder.js',
				'app.js',
				'templates.js',
				'lang.js',
				'ajax.js',
				'compose-area.js',
				'timeline-area.js',
				'detailed-area.js',
				'settings.js',
			)
		);
	}

	
	public function render () {
		echo $this->header( true );
		echo $this->layout('settings');
		echo $this->templates(array(
			'settings/content/head.htm',
			'settings/content/email2snapbit.htm',
			'settings/content/reminder.htm',
			'settings/content/password.htm',
			'settings/content/bitpassword.htm',
			'settings/content/popup.htm',
		));	
		echo $this->footer();
	}
}