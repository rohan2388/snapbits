<?php 

/**
 * Verify email
 */
class Verify extends Controller {

	public function render ( $msg ) {
		echo '<!DOCTYPE html>';
		echo '<html>';
		echo '<head>';
		echo '<title>Snapbits Email Verification</title>';
		echo '<head>';
		echo '<body>';
		echo '<script>';
		echo 'alert("'.$msg.'");';
		echo 'window.location = "'.trim($this->f3->get('base_url'), '/').'/member";';
		echo '</script>';
		echo '</body>';
		echo '</html>';
		die();
	}

	/**
	 * Proccess verify URL
	 * @return null
	 */
	public function init()	{
		$hash = $this->f3->get('GET.token');
		$email = $this->f3->get('GET.email');

		if ( !empty($email) & !empty($hash) ) {
			if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false){
				if( $this->user->email_exits(trim($email)) ){
					$user_id = $this->user->get('id');
					$email_verified = $this->metadata->load_meta($user_id, 'email-verified');
					$email_verification_hash = $this->metadata->load_meta($user_id, 'email-verification-hash');
					if ( $email_verified[0]->get('value') == 'no' ) {
						if ($email_verification_hash[0]->get('value') == $hash){
							$email_verified[0]->set('value', 'yes');
							$email_verified[0]->save();
							$this->render('Email address verified');
						}
					}else{
						$this->render('Email address already verified');
					}
				}
				
			}
		}

		$this->render('Invalid URL. Please try again.');
	}
}