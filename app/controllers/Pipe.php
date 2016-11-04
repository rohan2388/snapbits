<?php 
 /**
  * Pipe email
  */
 class Pipe extends Controller {
 	protected $key = '6l7238B989';
 	protected $password = 'jo~5~S^Nw+XRFg488Q<r(V8V3Xq6])';

 	/**
 	 * Get user by email id
 	 * @param  string $email
 	 * @return Cortex/false
 	 */
 	public function get_user_id ( $email = '' ) {
 		if ( $email == '')
 			return false;

 		$this->metadata->reset();
 		$this->metadata->load(array('type = ? AND value = ?', 'email2snapbit-email', $email));
 		if ( $this->metadata->valid() ) {
 			return $this->metadata->get('user');
 		}else{
 			return false;
 		}

 	}

	public function init () {
		$key = $this->f3->get('POST.key');
		$password = $this->f3->get('POST.password');
		if ( empty($key) || empty($password) ) {
			dump_log('empty');
			return;
		}

		if ( $key != $this->key || $password != $this->password ) {
			dump_log('mismatch');
			return;
		}

		$from = trim( $this->f3->get('POST.from') );
		$subject = trim( $this->f3->get('POST.subject') );
		$body = trim( strip_tags( $this->f3->get('POST.body') ) );

		$user =  $this->get_user_id($from);
		dump_log($user->id);

		if ( $user ) {
			$this->posts->add_post( $user, array(
				'title' => $subject,
				'content' => $body
			) );
		}
;

	}

}