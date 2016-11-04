<?php 
/**
 * Run cron job
 */
class Cron extends Controller {

	/**
	 * Get array of reminders to be sent
	 * @return Cortex/false
	 */
	public function get_reminders () {
		$timestamp = time();
		$timestamp_range = array(
				'start' => ($timestamp - 56),
				'end'   => ($timestamp + 16)
			);
		$this->posts->reset();
		$results = $this->posts->find(array('notify_on > ?  AND notify_on < ?', $timestamp_range['start'],$timestamp_range['end']));
		return $results;
	}

	/**
	 * Send reminder emails
	 * @param  Cortex $reminders
	 * @return null
	 */
	public function send_reminders ( $reminders ) {
		foreach ($reminders  as $reminder) {
			$reminder_info = json_decode($reminder->reminder);
			$this->f3->set('email_username', $reminder->user->username);
			$this->f3->set('email_to', $reminder->user->email);
			$this->f3->set('email_title', $reminder->title);
			$this->f3->set('email_content', $reminder->content);	
			$this->f3->set('email_event_time', str_replace(' ', ' at ', trim($reminder_info->time)));
			$this->f3->set('email_bit_url', $this->f3->get('base_url').'member#view/'.$reminder->id);
			$reminder->set('notify_on', '');
			$reminder->save();

			$_emails = array();
			// foreach( $reminder->user->metadata )
			if( count($reminder->user->metadata) > 0){
				foreach( $reminder->user->metadata as $metadata ) {
					if ( $metadata->get('type') == 'reminder-email' ) {
						$_emails[] = $metadata->get('value');
					}
				}
			}

			if (count($_emails) > 0) {
				$msg = $this->template->render('email/reminder.htm');
				$mail = new PHPMailer;
				$mail->setFrom($this->f3->get('email_from_address'), $this->f3->get('email_from_name'));
				$mail->isHTML(true); 
				$mail->Subject = $this->f3->get('email_reminder_subject');
				$mail->Body = $msg;
				foreach ($_emails as $email) {
					$mail->addAddress($email, $reminder->user->username);
				} 
				@$mail->send();
			}
		}
	}

	public function init () {
		$reminders = $this->get_reminders();
		if ($reminders)
			$this->send_reminders($reminders);
	}
}