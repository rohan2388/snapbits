<?php 
class MemberArea extends Controller {
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
				'libs/jquery.mobile-events.js',
				'libs/audio/recorder.js',
				'libs/audio/Fr.voice.js',
				'libs/audio/Fr.voice.js',
				// 'libs/moment-timezone.js',
				'libs/tooltip.js',
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
				'legal.js',
			)
		);
	}

	
	public function render () {
		echo $this->header( true );
		echo $this->layout('member');
		echo $this->templates(array(
			'member/compose/form.htm',
			'member/misc/recorder.htm',
			'member/misc/player.htm',
			'member/misc/uploader.htm',
			'member/misc/color-chooser.htm',
			'member/misc/doc.htm',
			'member/misc/color-viewer.htm',
			'member/misc/reminder-editor.htm',
			'member/misc/reminder-viewer.htm',
			'member/misc/popup-delete.htm',
			'member/misc/popup-upgrade.htm',
			'member/timeline/search.htm', 
			'member/timeline/timeline.htm', 
			'member/detailed/toolbar.htm', 
			'member/detailed/note.htm', 
			'settings/content/head.htm',
			'settings/content/email2snapbit.htm',
			'settings/content/reminder.htm',
			'settings/content/password.htm',
			'settings/content/bitpassword.htm',
			'settings/content/plan.htm',
			'settings/content/popup.htm',
			'settings/content/page-plans.htm',
			'settings/content/page-unlock.htm',
			'settings/content/page-subscribe.htm',
			'legal/privacy-policy.htm',
			'legal/terms-of-use.htm',
			'legal/disclaimer.htm',
			'legal/cookies-policy.htm',
		));	
		echo $this->footer();
	}
}