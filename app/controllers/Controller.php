<?php 
/**
 * Main Controller class
 */
class Controller {
	/**
	 * F3 instance
	 * @var object
	 */
	protected $f3;
	/**
	 * SQL object
	 * @var object
	 */
	protected $db;
	/**
	 * Session object
	 * @var object
	 */
	protected $session;
	/**
	 * Template engine object
	 * @var object
	 */
	protected $templates;

	/**
	 * Check user auth and redirect if necessary
	 * @return bool 
	 */
	private function check_auth () {
		$users = new Users();
		if ( ! $users->verify_login() ){
			$this->f3->reroute($this->f3->get('base_url'));		
		}else{
			// $this->user_id = $this->f3->get('current_user_id');
			$local_vars = $this->f3->get('local_vars');
			$this->user->load(array('id = ?', $this->user_id));
			if( $this->user->valid() ) {
				$local_vars[] = array( 'name' => 'premium', 'value' => ( $this->user->get('premium') > 0) ? 'yes' : 'no' );
				$this->f3->set('local_vars',$local_vars);
			}
		}		
	}

	/**
	 * Before route functuin
	 * @return null 
	 */
	public function beforeroute () {
		$this->user_id = $this->user->get_current_user_id();

		$params = $this->f3->get('PARAMS');
		if ( 
				$params[0] != '/' && $params[0] != '/ajax/login'  
			&&  $params[0] != '/ajax/social_share' 
			&&  $params[0] != '/ajax/setup' 
			&&  $params[0] != '/ajax/signup' 
			&&  $params[0] != '/ajax/verify_session'
			&&  $params[0] != '/ajax/recover'
			&&  $params[0] != '/cron'
			&&  $params[0] != '/pipe'
		)
		{
			$this->check_auth();
		}

		$local_vars = $this->f3->get('local_vars');
		$local_vars[] = array( 'name' => 'userId', 'value' => ( $this->user_id > 0 ) ? $this->user_id : false );
		if ( $params[0] == '/' ) {
			$local_vars[] = array( 'name' => 'paypalButtonID', 'value' => $this->f3->get('paypal_button_id') );
		}

		$this->f3->set('local_vars',$local_vars);
	}

	/**
	 * After route functuin
	 * @return null 
	 */
	public function afterroute () {

	}

	/**
	 * Main contructer
	 */
	public function __construct () {
		$this->f3 = Base::instance();
		$this->db = new DB\SQL(
				$this->f3->get('devdb'),
				$this->f3->get('devusername'),
				$this->f3->get('devpassword'),
				array( \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION )
			);
		$this->session = new \DB\SQL\Session($this->db,'sessions',true,function(){
			return true;
		});
		$this->f3->CSRF = $this->session->csrf();
		$this->f3->copy('CSRF','SESSION.csrf');
		$this->f3->set('DB', $this->db);
		$this->f3->set('session', $this->session);

		$this->f3->set('local_vars', array(
			array('name' => 'csrf', 'value' => $this->f3->CSRF),
			array('name' => 'site_url', 'value' => $this->f3->get('base_url')),
			array('name' => 'username', 'value' => $this->f3->get('SESSION.username')),
			array('name' => 'disabledUpgradePopup', 'value' => ( $this->f3->get('SESSION.disable_upgrade_popup') ) ? 'yes' : 'no' ),
		));

		$this->template    = new Template;
		$this->_extendTemplateEngine();
		
		$this->metadata    = new Metadata;
		$this->user        = new Users;
		$this->posts       = new Posts;
		$this->filemanager = new Files;

	}

	/**
	 * Extend default fatfreeframework template engine
	 * @return null 
	 */
	public function _extendTemplateEngine () {
		$this->template->extend('ignore',
			function($node) {
				return $node[0];
			}
		);	
	}


	/**
	 * Render views
	 * @param  array  $templates name of the templates
	 * @return string            rendered html
	 */
	public function templates ( $templates = array() ) {
		$rendered = "";
		if( ! empty ( $templates ) ) {
			foreach ( $templates as $template ) {
				if (false === strpos($template, '.htm')) {
					$template = $template.'.htm';
				}
				$rendered .= $this->template->render($template);
			}
		}

		return $rendered;
	}
	/**
	 * Render page header
	 * @return string rendered html
	 */
	public function header () {
		$this->assets();
		return $this->template->render('global/header.htm');
	}
	/**
	 * Render page layout
	 * @param  string $type directory name where layout.htm is located
	 * @return string       rendered html
	 */
	public function layout ( $type = 'login' ) {
		return $this->template->render($type.'/layout.htm');
	}

	/**
	 * Render page footer
	 * @return string rendered html
	 */
	public function footer ( $small = false ) {
		$ret = '';
		if (!$small){
			$ret .= $this->template->render('global/footer.htm');
			$ret .= $this->template->render('global/body-close.htm');
		}else{
			$ret .= $this->template->render('global/body-close.htm');			
		}
		return $ret;
	}

	/**
	 * [assets description]
	 * @return [null] 
	 */
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
			)
		);
	}

}