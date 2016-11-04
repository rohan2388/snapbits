<?php 

class Metadata extends \DB\Cortex {
	protected $db    = 'DB';
	protected $table = 'metadata'; 
	protected $fluid = true;
	protected $fieldConf = array(
		'type' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'value' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'user' => array(
			'belongs-to-one' => '\Users'
		),
		'time' => array(
			'type' => \DB\SQL\Schema::DT_DATETIME
		),

	);  

	/**
	 * Class contsructer
	 */
	function __construct(){
		parent::__construct();
	}

	/**
	 * Insert new meta data
	 * @param string/int $userId 
	 * @param string $type 
	 * @param string $value
	 * @param string $no_repeat Default: true // match type
	 * @param string $strict_no_repeat Default: false // match both type and value
	 * @param string $replace Default: false // replace if matched
	 * @return null
	 */
	public function add_data ( $userId, $type = '', $value = '', $no_repeat = true, $strict_no_repeat = false, $replace = false ) {
		if ( ! $userId ){
			return;
		}
		if ( $type == '' || $value == '' ) {
			return;
		}
		if ($no_repeat){
			$this->reset();			
			if ( $strict_no_repeat ){
				$this->load(array('type = ? AND value = ? AND user = ?', $type, $value, $userId));
			}else{
				$this->load(array('type = ? AND user = ?', $type, $userId));
			}
			if ($this->valid()){
				if ($replace) {
					$this->type = $type;
					$this->value = $value;
					$this->time = date("Y-m-d H:i:s");
					$this->save();
				}
				return;
			}
		}

		$this->reset();
		$this->type = $type;
		$this->value = $value;
		$this->time = date("Y-m-d H:i:s");
		$this->user = $userId;
		$this->save();
	}

	/**
	 * Remove a meta
	 * @param  string/int $userId
	 * @param  string $type 
	 * @param  string $value 
	 * @return null
	 */
	public function remove_data ( $userId, $type = '', $value = null) {
		if ( ! $userId ) {
			return;
		}
		if ( $type == '' || $value == '' ) {
			return;
		}
		$this->reset();

		if (empty($value)){
			$this->load(array('type = ? AND user = ?', $type, $userId));
		}else{
			$this->load(array('type = ? AND value = ? AND user = ?', $type, $value, $userId));
		}

		if ($this->valid()){
			$this->erase();
		}

	}

	/**
	 * Load meta data
	 * @param  string/int $userId
	 * @param  string $type 
	 * @return Cortex object
	 */
	public function load_meta ( $userId, $type = null ) {
		$this->reset();
		if (!isset($type)){
			$result = $this->find(array('user = ?', $userId));
		}else{
			$result = $this->find(array('type = ? AND user = ?', $type, $userId));
		}
		return $result;
	}
}
