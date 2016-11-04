<?php 

class Tags extends \DB\Cortex {
	protected $db    = 'DB';
	protected $table = 'tags'; 
	protected $fluid = true;
	protected $fieldConf = array(
		'name' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'user' => array(
			'belongs-to-one' => '\Users'
		),
		'posts' => array(
			'has-many' => array('\Posts', 'tags')
		),

	);  

	/**
	 * Class contsructer
	 */
	function __construct(){
		parent::__construct();
	}

	/**
	 * Add tags (if don't exist) to db
	 * @param  string $tags name
	 * @param  user $user User id or mapper object
	 * @return array array of tag ids
	 */
	public function add_tags ( $tags = null, $user = null ) {
		if (empty($user)){
			return;
		}
		if (empty($tags)){
			return;
		}

		if(!is_array($tags)){
			$tags = explode(',', $tags);
		}
		$_ids = array();
		foreach($tags as $tag){
			$tag = trim($tag);
			$this->reset();
			$this->load(array('name = ? AND user = ?', $tag, $user));
			if( $this->loaded() === 0){
				$this->reset();
				$this->name = $tag;
				$this->user = $user;
				$this->save();
			}
			$_ids[] = $this->id;
		}
		$this->reset();
		return $_ids;
	}
}
