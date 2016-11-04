<?php 

if(!function_exists('hash_equals')) {
	function hash_equals($str1, $str2) {
		if(strlen($str1) != strlen($str2)) {
			return false;
		} else {
			$res = $str1 ^ $str2;
			$ret = 0;
			for($i = strlen($res) - 1; $i >= 0; $i--) $ret |= ord($res[$i]);
			return !$ret;
		}
	}
}

class Users extends \DB\Cortex {
	protected $db    = 'DB';
	protected $table = 'users'; 
	protected $fluid = true;
	protected $fieldConf = array(
		'username' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'password' => array(
			'type' => \DB\SQL\Schema::DT_VARCHAR128
		),
		'lock_password' => array(
			'type' => \DB\SQL\Schema::DT_VARCHAR128
		),
		'email' => array(
			'type' => \DB\SQL\Schema::DT_TEXT
		),
		'time' => array(
			'type' => \DB\SQL\Schema::DT_DATETIME,
		),
		'posts' => array(
			'has-many' => array('\Posts', 'user')
		),
		'files' => array(
			'has-many' => array('\Files', 'user')
		),
		'metadata' => array(
			'has-many' => array('\Metadata', 'user')
		),
		'active' => array(
			'type' => \DB\SQL\Schema::DT_BOOL,
		),
		'premium' => array(
			'type' => \DB\SQL\Schema::DT_TINYINT,
		)
	);

	/**
	 * Class contsructer
	 */
	function __construct(){
		parent::__construct();
	}
	/**
	 * Verify valid email id on set
	 * @param  [string] $value [email address]
	 * @return [string] 
	 */
	public function set_email($value) {
		$f3 = Base::instance();
		if (\Audit::instance()->email($value) == false) {
				$value = null;
				$f3->set('_hasError', true);
		}
		return $value;
	} 

	/**
	 * Bcrypt password on set
	 * @param  [string] $value [password]
	 * @return [string] 
	 */
	public function set_password($value) {
		$f3 = Base::instance();
			return \Bcrypt::instance()->hash($value);
	}

	/**
	 * Bcrypt bit password on set
	 * @param  [string] $value [password]
	 * @return [string] 
	 */
	public function set_lock_password($value) {
		$f3 = Base::instance();
			return \Bcrypt::instance()->hash($value);
	}

	/**
	 * Generate a password
	 * @param  integer $length         [description]
	 * @param  boolean $add_dashes     [description]
	 * @param  string  $available_sets [description]
	 * @return string                  [description]
	 */
	public function generateStrongPassword ($length = 9, $add_dashes = false, $available_sets = 'luds')	{
		$sets = array();
		if(strpos($available_sets, 'l') !== false)
			$sets[] = 'abcdefghjkmnpqrstuvwxyz';
		if(strpos($available_sets, 'u') !== false)
			$sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
		if(strpos($available_sets, 'd') !== false)
			$sets[] = '23456789';
		if(strpos($available_sets, 's') !== false)
			$sets[] = '!@#$%&*?';
		$all = '';
		$password = '';
		foreach($sets as $set)
		{
			$password .= $set[array_rand(str_split($set))];
			$all .= $set;
		}
		$all = str_split($all);
		for($i = 0; $i < $length - count($sets); $i++)
			$password .= $all[array_rand($all)];
		$password = str_shuffle($password);
		if(!$add_dashes)
			return $password;
		$dash_len = floor(sqrt($length));
		$dash_str = '';
		while(strlen($password) > $dash_len)
		{
			$dash_str .= substr($password, 0, $dash_len) . '-';
			$password = substr($password, $dash_len);
		}
		$dash_str .= $password;
		return $dash_str;
	}



	/**
	 * Check if email address already exists in db
	 * @param  [string] $email [email address]
	 * @return [bool]        
	 */
	public function email_exits ( $email ) {
		$this->reset();
		$this->load(array('email = ? AND active = 1', $email));
		return $this->valid();
	}

	/**
	 * Check if username already exists in db
	 * @param  [string] $email [email address]
	 * @return [bool]        
	 */
	public function username_exits ( $username ) {
		$this->reset();
		$this->load(array('username = ? AND active = 1', $username));
		return $this->valid();
	}

	/**
	 * Send email verification mail
	 * @param  [type] $key [description]
	 * @return [type]      [description]
	 */
	private function _send_email_verifcation ( $email, $key ) {
		$f3 = Base::instance();
		$base_url = $f3->get('base_url');
		$verify_link = sprintf('%s/verify?email=%s&token=%s', trim($base_url, '/'), $email, $key);
		$f3->set('verify_link', $verify_link);
		$template = new Template;
		$msg = $template->render('email/verify.htm');
		$mail = new PHPMailer;
		$mail->setFrom($f3->get('email_from_address'), $f3->get('email_from_name'));
		$mail->addAddress($email, ''); 
		$mail->isHTML(true); 
		$mail->Subject = $f3->get('email_verify_subject');
		$mail->Body = $msg;
		@$mail->send();
	}

	/**
	 * Add a new user to db
	 * @param  [array] $data [array or user data] [email, username, password]
	 * @return [bool]
	 * 
	 */
	public function add_user ( $data, $validate = false ) {
		$f3 = Base::instance();
		if ( ! $validate || ( ! $this->email_exits( $data['email'] ) && ! $this->username_exits( $data['username'] ) ) ) {
			$this->reset();
				$this->load(array('email = ? AND active = 0', $data['email']));
				$this->erase();
				$this->reset();
			$this->email = $data['email'];
			$this->username = $data['username'];
			$this->password = $data['password'];
			$this->time = date("Y-m-d H:i:s");
			$this->active = true;
			$this->premium = false;
			$this->save();
			$generatedKey = sha1(mt_rand(10000,99999).time().$data['email']);
			$metadata = new Metadata;
			$metadata->add_data($this->get('id'), 'email-verification-hash',$generatedKey);
			$metadata->add_data($this->get('id'), 'email-verified','no');
			$this->_send_email_verifcation($data['email'], $generatedKey);
			$this->create_session();
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Get user by ID
	 * @param  int $user_id
	 * @return Cortex
	 */
	public function get_user_by_id ( $user_id ) {
		$this->reset();
		$user = $this->load(array('id = ?', $user_id));
		if ( $this->valid() ){
			return $user;
		}else{
			return false;
		}
	}
	/**
	 * Recover/reset password
	 * @param  string $username username or email
	 * @return bool
	 */
	public function recover_password ( $username ) {
		if(empty($username) || trim($username) == '')
			return false;
		$f3 = \Base::instance();
		if (\Audit::instance()->email($username) == true){
			$filter = 'email = ?';
		}else{
			$filter = 'username = ?';
		}
		$this->reset();
		$this->load(array($filter,$username));
		if ($this->valid()) {
			$new_pass = $this->generateStrongPassword(10);
			$this->set('password', $new_pass);
			$this->save();
			$f3->set('email_username', $this->get('username'));
			$f3->set('email_password', $new_pass);
			$f3->set('email_name', ucfirst($this->get('username')));
			$template = new Template;
			$msg = $template->render('email/password-recovery.htm');
			$mail = new PHPMailer;
			$mail->setFrom($f3->get('email_from_address'), $f3->get('email_from_name'));
			$mail->addAddress($this->get('email'), ''); 
			$mail->isHTML(true); 
			$mail->Subject = $f3->get('email_password_recovery_subject');
			$mail->Body = $msg;
			@$mail->send();
			return true;
		}else{
			return false;
		}
	}

	/**
	 * Verify user credentials and create session
	 * @param  [string] $username [username or email]
	 * @param  [string] $password [password]
	 * @return bool
	 */
	public function login ( $username, $password ) {
		if(empty($username) || empty($password))
			return;
		$f3 = \Base::instance();
		if (\Audit::instance()->email($username) == true){
			$filter = 'email = ? AND active = ?';
		}else{
			$filter = 'username = ? AND active = ?';
		}
		$this->reset();
		$this->load(array($filter,$username, true));
		if ($this->valid()) {
			///////////////////////////////////////////////////////////////
			// check brute force attack                                  //
			// Implement a way to check if user is trying to bruteforece //
			// Maybe create a new table to check last attempt time       //
			///////////////////////////////////////////////////////////////
			$hash = $this->get('password');
			if ( \Bcrypt::instance()->verify($password, $hash) ) {
				$this->create_session();
				return true;
			}else{
				$this->destroy_session();
				return false;
			}
		}else{
			$this->destroy_session();
			return false;
		}
	}
	/**
	 * Logout a user
	 * @return bool
	 */
	public function logout () {
		$this->destroy_session();
		return true;
	}

	/**
	 * Create a login session
	 * @return null
	 */
	public function create_session () {
		$f3 = \Base::instance();
		$user_browser = $f3->get('AGENT');
		$user_id = str_pad(base_convert($this->get('id'), 10, 16), 12, "0", STR_PAD_LEFT);
		$username = $this->get('username');
		$db_password = $this->get('password');
		$login_string = hash('sha512', $username . $db_password . $user_browser);
		$f3->set('SESSION.token', $login_string);
		$f3->set('SESSION.user', $user_id);
		$f3->set('SESSION.username', $username);
		return true;
	}
	/**
	 * Destroy a login session
	 * @return null
	 */
	public function destroy_session () {
		$f3 = \Base::instance();
		$f3->clear('SESSION.token');
		$f3->clear('SESSION.user');
		$f3->clear('SESSION.username');
		return true;
	}

	/**
	 * Verify user session if user is logged in
	 * @return [bool]
	 */
	public function verify_login () {
		$f3 = \Base::instance();
		if ($this->get_current_user_id() > 0){
			$f3->set('current_user_id', $this->get('id'));
			$f3->set('current_user_username', $this->get('username'));
			return true;
		}
		$this->destroy_session();
		return false;
	}

	/**
	 * Get current user id or 0 if false
	 * @return int 
	 */
	public function get_current_user_id () {
		$f3 = \Base::instance();
		$login_string = $f3->get('SESSION.token');
		$user = $f3->get('SESSION.user');
		$username = $f3->get('SESSION.username');
		if (isset($username, $login_string, $user)){
			$user_browser = $f3->get('AGENT');
			$this->reset();
			$this->load(array('username = ?', $username));
			if ($this->valid()){	
				$username = $this->get('username');
				$db_password = $this->get('password');
				$login_check = hash('sha512', $username . $db_password . $user_browser);
				if (hash_equals($login_check, $login_string) ) {
					return $this->get('id');
				}
			}
		}
		return 0;
	}


	/**
	 * Upgrade user to premium
	 * @param  [type] $userId 
	 * @param  string $date   Premium end date [ date('Y-m-d H:i:s') ], 
	 * @param  string $type   'paid' and 'social', 
	 * @param  string $subscr_id   Paypal subscriber ID, 
	 * @return bool         
	 */
	public function upgrade ( $userId = null, $date = null, $type = 'paid', $subscr_id = null ) {
		if ( empty( $userId )) {
			 return;
		}
		$f3 = Base::instance();
		$this->reset();
		$this->load(array('id = ? AND active = 1', $userId));
		$this->set('premium', '1');
		$this->save();
		$metadata = new Metadata();

		if ( ! empty($date) ) {
			$metadata->add_data( $userId, 'premium-end', $date, true, false, true);
		}

		if ( !empty( $type ) ) {
			$metadata->add_data( $userId, 'premium-type', $type, true, false, true);
		}

		if ( !empty($subscr_id) ) {
			$metadata->add_data($userId, 'subscr-id', $subscr_id, true, false, true);
		}
		
	}


	public function downgrade ( $userId ) {
		if ( empty( $userId )) {
			return;
		}
		$f3 = Base::instance();
		$metadata = new Metadata();

		$this->reset();
		$this->load(array('id = ? AND active = 1', $userId));

		if ( ! $this->valid() ) {
			return;
		}

		$this->set('premium', '0');
		$this->save();
		$metadata->remove_data( $userId, 'premium-type');
		$metadata->remove_data( $userId, 'subscr-id');
		$metadata->remove_data( $userId, 'premium-end');
	}

	/**
	 * Resume/pause subscription
	 * @param  int $userId
	 * @param  string $type   [options: pause, resume. Default: pause]
	 * @return null  
	 */
	public function sub_toggle ( $userId = null, $type = 'pause' ) {
		if ( empty( $userId ) || empty( $type ) ) {
			return;
		}
		$this->reset();
		$this->load(array('id = ?', $userId));
		if ($this->valid()){
			$metadata = new Metadata();
			if ( $type == 'pause' ) {
				$this->set('premium', '-1');
				$this->save();
			}else if ( $type == 'resume' ){
				$this->set('premium', '1');
				$this->save();
			}else if ( $type == 'cancel' ){
				$this->set('premium', '0');
				$this->save();
				$metadata->remove_data( $userId, 'premium-type');
				$metadata->remove_data( $userId, 'premium-end');
			}
		}
	}
}

