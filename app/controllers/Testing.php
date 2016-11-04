<?php 
class Testing extends Controller {

	public function init () {

		$date = date('Y-m-d H:i:s', strtotime('+1 year'));
		var_dump($date);


	}

}