<?php
use dezlov\PayPal\IpnListener;

/**
 * IPN proccessor
 */
class Ipn {
	protected $log = true;
	protected $sandbox = true;


	public function __construct () {
		$this->f3 = Base::instance();
		$this->db = new DB\SQL(
				$this->f3->get('devdb'),
				$this->f3->get('devusername'),
				$this->f3->get('devpassword'),
				array( \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION )
			);		
		$this->f3->set('DB', $this->db);		
		$this->metadata = new Metadata;
		$this->user     = new Users;
	}
	/**
	 * Parse POST data
	 * @return null
	 */
	public function parse_data () {
		if ( empty($this->IPN) ) {
			$raw_post_data = file_get_contents('php://input');
			$raw_post_array = explode('&', $raw_post_data);
			$IPN = array();	
			$IPN['cmd'] = '_notify-validate';	
			foreach ($raw_post_array as $keyval) {
				$keyvals = explode ('=', $keyval);	
				if (count($keyvals) == 2){
				$IPN[$keyvals[0]] = urldecode($keyvals[1]);
				}
			}
			$this->IPN = $IPN;
		}
	}


	/**
	 * Log ipn
	 * @return [type] [description]
	 */
	public function log_ipn () {		
		$txt = "***********************************************************************\n";
		$txt .= "* Date:".date("d-m-Y - h:i:a")."\n";
		$txt .= "***********************************************************************\n";
		$txt .= var_export($this->IPN, true)."\n";
		$txt .= "***********************************************************************\n\n\n";
		file_put_contents('ipn.txt',$txt, FILE_APPEND );
	}
	

	/**
	 * Verify IPN
	 * Note: For some reason, sandbox verification always return error code 400, so it will not verify data
	 * @return bool
	 */
	public function verifyIPN(){
		$this->parse_data();
		$IPN = $this->IPN;
		if(empty($IPN['verify_sign'])){
			return false;
		}		
		
		$PaypalHost = ($this->sandbox) ? 'www.sandbox.paypal.com' : 'www.paypal.com';		
		$cURL = curl_init();
		curl_setopt($cURL, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($cURL, CURLOPT_SSL_VERIFYHOST, false);
		//curl_setopt($cURL, CURLOPT_CAINFO, 'api_cert_chain.crt');	
		curl_setopt($cURL, CURLOPT_URL, "https://{$PaypalHost}/cgi-bin/webscr");
		curl_setopt($cURL, CURLOPT_ENCODING, 'gzip');
		curl_setopt($cURL, CURLOPT_BINARYTRANSFER, true);
		curl_setopt($cURL, CURLOPT_POST, true); // POST back
		curl_setopt($cURL, CURLOPT_POSTFIELDS, http_build_query($IPN)); // the $IPN
		curl_setopt($cURL, CURLOPT_HEADER, false);
		curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($cURL, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
		curl_setopt($cURL, CURLOPT_FORBID_REUSE, true);
		curl_setopt($cURL, CURLOPT_FRESH_CONNECT, true);
		curl_setopt($cURL, CURLOPT_CONNECTTIMEOUT, 30);
		curl_setopt($cURL, CURLOPT_TIMEOUT, 30);
		curl_setopt($cURL, CURLINFO_HEADER_OUT, true);
		curl_setopt($cURL, CURLOPT_HTTPHEADER, array(
			'Connection: close',
			'Expect: ',
		));
		$Response = curl_exec($cURL);
		$Status = (int)curl_getinfo($cURL, CURLINFO_HTTP_CODE);
		curl_close($cURL);

		if ( $this->log ) {
			$this->log_ipn();
		}

		if ($this->sandbox) {
			return true;
		}else{

			if(empty($Response) or !preg_match('~^(VERIFIED|INVALID)$~i', $Response = trim($Response)) or !$Status){
				return null;
			}
			if(intval($Status / 100) != 2){
				return false;
			}
			return !strcasecmp($Response, 'VERIFIED');
		}
	}


	/**
	 * Proccess IPN 
	 * @return null
	 */
	public function init () {		
		if ( ! $this->verifyIPN() ){
			dump_log('IPN Failed');
			return;
			exit;
		}

		$IPN = $this->IPN;
		$custom = json_decode($IPN['custom']);
		$user_id = $custom->user_id;

		switch ($IPN['txn_type']) {
			case 'subscr_payment':
				//////////////////////////////////
				//subscription payment recieved //
				//////////////////////////////////	
				$user = $this->user->get_user_by_id($user_id);
				if ($user) {
					if ( $payment_status == 'Completed' ) {
						$this->user->upgrade($user_id, date('Y-m-d H:i:s', time()+2592000), $IPN['subscr_id']);
					}

				}
				break;

			case 'subscr_signup':
				////////////////////////////////////////
				//subscription bought payment pending //
				////////////////////////////////////////
				$user = $this->user->get_user_by_id($user_id);
				if ($user) {
					$sub_end_date = (strtotime($IPN['subscr_date']) + 2592000);
					$this->user->upgrade($user_id, date('Y-m-d H:i:s', $sub_end_date), $IPN['subscr_id']);
				}
				break;
			case 'subscr_eot':
				/////////////////////////////
				//subscription end of term //
				/////////////////////////////
				$user = $this->user->get_user_by_id($user_id);
				if ($user) {
					$this->user->downgrade($user_id);
				}
			case 'subscr_cancel':
				//////////////////////////
				//subscription canceled //
				//////////////////////////
				$user = $this->user->get_user_by_id($user_id);
				if ($user) {
					// $this->user->downgrade($user_id);
				}
			default:
				# code...
				break;
		}




		// $payer_id = $response['payer_id'];	
		// $subscr_id = $response['subscr_id'];	
		// $amount = $response['amount3'];	
		// $custom = json_decode($response['custom']);	
		// $receiver_email = $response['receiver_email'];
		// $payment_status = $response['payment_status'];
		// $pending_reason = $response['pending_reason'];
		// $subscr_date = $response['subscr_date'];
		// $txn_type = $response['txn_type'];

		// $user_id = $custom->user_id;

		// switch ($txn_type) {
		// 	case 'subscr_payment':
		// 		//////////////////////////////////
		// 		//subscription payment recieved //
		// 		//////////////////////////////////		
		// 		$user = $this->user->get_user_by_id($user_id);	
		// 		$this->metadata->add_data($user_id, 'subscr_id', $subscr_id, true, false, false);
					
		// 		if ( $payment_status == 'Pending' ) {
		// 			$this->metadata->add_data($user_id, 'payment_status', 'pending', true, false, true);	
		// 			$this->metadata->add_data($user_id, 'pending_reason', $pending_reason, true, false, true);				
		// 		}else{					
		// 			$this->metadata->remove_data($user_id, 'pending_reason');
		// 		}

		// 		if ($payment_status == 'Completed') {
		// 			$this->metadata->add_data($user_id, 'payment_status', 'completed', true, false, true);
		// 		}else if ($payment_status == 'Denied' || $payment_status == 'Failed' || $payment_status == 'Refunded' || $payment_status == 'Reversed' || $payment_status == 'Voided') {
		// 			$this->metadata->add_data($user_id, 'payment_status', 'failed', true, false, true);
		// 		}

		// 		break;

		// 	case 'subscr_signup':
		// 		////////////////////////////////////////
		// 		//subscription bought payment pending //
		// 		////////////////////////////////////////				
		// 		$user = $this->user->get_user_by_id($user_id);
		// 		$user->set('premium', 1);	
		// 		$user->save();
		// 		$this->metadata->add_data($user_id, 'subscr_id', $subscr_id, true, false, true);
		// 		$this->metadata->add_data($user_id, 'payment_status', 'pending', true, false, false);
		// 		$this->metadata->add_data($user_id, 'subscr_start_date', time(), true, false, true);
		// 		$this->metadata->add_data($user_id, 'subscr_end_date', (strtotime($subscr_date) + 2592000), true, false, true);

		// 		break;

		// 	case 'subscr_eot':
		// 		/////////////////////////////
		// 		//subscription end of term //
		// 		/////////////////////////////
		// 		$user = $this->user->get_user_by_id($user_id);	
		// 		$user->set('premium', 0);
		// 		$user->save();
		// 		$this->metadata->remove_data($user_id, 'payment_status');
		// 		$this->metadata->remove_data($user_id, 'subscr_id');				
		// 		$this->metadata->remove_data($user_id, 'subscr_end_date');				
		// 		$this->metadata->remove_data($user_id, 'subscr_start_date');				
		// 		break;

		// 	case 'subscr_cancel':
		// 		//////////////////////////
		// 		//subscription canceled //
		// 		//////////////////////////
		// 		$user = $this->user->get_user_by_id($user_id);	
		// 		$user->set('premium', 0);
		// 		$user->save();
		// 		$this->metadata->remove_data($user_id, 'payment_status');
		// 		$this->metadata->remove_data($user_id, 'subscr_id');
		// 		$this->metadata->remove_data($user_id, 'subscr_end_date');
		// 		$this->metadata->remove_data($user_id, 'subscr_start_date');
		// 		break;	

		// 	default:
		// 		# code...
		// 		break;
		// }


		exit;
	}
}