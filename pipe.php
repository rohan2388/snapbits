#!/usr/bin/php -q
<?php
// Set a long timeout in case we're dealing with big files
set_time_limit(600);
ini_set('max_execution_time',600);

require_once('vendor/mailreader-master/mailReader.php');

/**
 * Dump log in e_log.txt file
 * @param  string  $variable Variable to print
 * @param  boolean $clear    Clear file before priniting
 * @return null 
 */
function dump_log($variable = '', $clear = false) {
	$file = __DIR__.'/e_log.txt';
	if (!file_exists($file)){
		touch($file);
	}


	$current = file_get_contents($file);
	$debug = debug_backtrace();
	if ($clear)
		$current = '';

	$current .= "***********************************";
	$current .= "\n* Date: ".date('d-m-Y - h:i:a');
	$current .= "\n* ";
	if (isset($debug[0]['file']))
		$current .= "\n* File: ".$debug[0]['file'];
	if (isset($debug[0]['line']))
		$current .= "\n* line: ".$debug[0]['line'];
	$current .= "\n***********************************\n";

	$current .= "\n".var_export($variable, TRUE);
	$current .= "\n";
	$current .= "\n";
	$current .= "\n";
	file_put_contents($file, $current);
}






$save_directory = __DIR__.'/uploads/emails';

$mr = new mailReader($save_directory,false);
$mr->readEmail();

$email = array(
	'from' => $mr->from_email,
	'subject' => $mr->subject,
	'body' => $mr->body,
	'key' => '6l7238B989',
	'password' => 'jo~5~S^Nw+XRFg488Q<r(V8V3Xq6])'
);


// $ch = curl_init();
// curl_setopt($ch, CURLOPT_URL,"http://snapbits.kbqa.co.za/pipe");
// curl_setopt($ch, CURLOPT_POST, true);
// curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($email));
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, FALSE);
// $result = curl_exec ($ch);
// curl_close ($ch);

// $url = 'http://snapbits.kbqa.co.za/pipe?'.http_build_query($email);
// dump_log($url);
// file_put_contents('email.txt', file_get_contents($url));




$handle = curl_init('http://snapbits.kbqa.co.za/pipe');
curl_setopt($handle, CURLOPT_POST, true);
curl_setopt($handle, CURLOPT_POSTFIELDS, $email);
curl_exec($handle);
curl_close($handle);
