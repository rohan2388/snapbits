<?php 
require_once('vendor/autoload.php');
// use Tracy\Debugger;
// Debugger::enable(Debugger::DEVELOPMENT);

$f3 = Base::instance();

/**
 * Dump log in e_log.txt file
 * @param  string  $variable Variable to print
 * @param  boolean $clear    Clear file before priniting
 * @return null 
 */
function dump_log($variable = '', $clear = false) {
	$file = 'e_log.txt';
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

$f3->config('config.ini');
$f3->config('routes.ini');
$f3->set('base_path', realpath(dirname(__FILE__)));
$f3->run();