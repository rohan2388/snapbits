<?php 

class Files extends \DB\Cortex {
	protected $db    = 'DB';
	protected $table = 'files'; 
	protected $fluid = true;
	protected $fieldConf = array(
		'filename' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'path' => array(
			'type' => \DB\SQL\Schema::DT_TEXT
		),
		'hash' => array(
			'type' => VARCHAR48
		),
		'time' => array(
			'type' => \DB\SQL\Schema::DT_DATETIME
		),
		'user' => array(
			'belongs-to-one' => '\Users'
		),
		'post' => array(
			'belongs-to-one' => '\Posts'
		)
	);
	/**
	 * Class contsructer
	 */
	function __construct(){
		parent::__construct();
		// Popluate virtual fields
		$this->onload(function($self){
			$f3 = Base::instance();
			$base_url = trim($f3->get('base_url'), '/');
			$self->virtual('ext', pathinfo($self->filename, PATHINFO_EXTENSION));
			$self->virtual('download_url', $base_url.'/file/'.$self->hash);
	
		});

		$this->beforeerase(function($self){
			if(file_exists($self->path) && !is_dir($self->path)){
				unlink($self->path);
			}
		});
	}
	/**
	 * Generate unique id
	 * @return string (24 chars)
	 */
	public function generateUniqID() {
		return strtr(base64_encode(random_bytes(18)),'+/','-_');
	}

	public function random_string($length) {		
		$key = '';
		$keys = array_merge(range(0, 9), range('a', 'z'));

		for ($i = 0; $i < $length; $i++) {
			$key .= $keys[array_rand($keys)];
		}
		return $key;
	}

	private function add_db_entry ( $filename, $path, $user = null, $post = null ) {
		while( $hash = $this->generateUniqID() ) {
			if (!file_exists($file_path)){
				$this->reset();
				$this->load(array('hash = ?', $hash));
				if($this->loaded() === 0){
					break;
				}
			}
		}
		$this->reset();
		$this->filename = $filename;
		$this->path = $path;
		$this->hash = $hash;
		$this->time = date("Y-m-d H:i:s");
		$this->user = $user;
		$this->post = $post;
		$this->save();		
		// $this->post = $post;
	}

	/**
	 * Compress image
	 * @param  string $source      Image path
	 * @param  string $destination
	 * @param  [type] $quality     [description]
	 * @return bool 
	 */
	public function compress($source, $destination, $quality) {
		$info = getimagesize($source);
		if ($info['mime'] == 'image/jpeg') 
			$image = imagecreatefromjpeg($source);
		elseif ($info['mime'] == 'image/gif') 
			$image = imagecreatefromgif($source);
		elseif ($info['mime'] == 'image/png') 
			$image = imagecreatefrompng($source);
		else
			return false;

		imagejpeg($image, $destination, $quality);

		return true;
	}

	public function add_files ( $files = array(), $post = null, $user = null, $types = array() ) {
		$f3 = Base::instance();
		$file_dir = trim($f3->get('base_path'), '/').'/'.trim($f3->get('upload_dir'), '/').'/';
		if ( empty($user) || empty($post) ){
			return;
		}

		foreach ( $files as $file ) {
			if ( !isset($file['error']) || is_array($file['error'])	){
				continue;
			}
			$original_name = basename($file["name"]);
			$original_ext = pathinfo($original_name, PATHINFO_EXTENSION);

			$finfo = new finfo(FILEINFO_MIME_TYPE);
			$type = $finfo->file($file['tmp_name']);
			if(!in_array($type, $types)){
				continue;
			}

			$_file_dir = $file_dir.$original_ext;
			if (!file_exists($_file_dir) && !is_dir($_file_dir)) {
				mkdir($_file_dir, 0777, true);         
			}

			while( $_filename = $this->random_string(18) ){
				$filename = $_filename.'.'.$original_ext;
				$file_path = $_file_dir.'/'.$filename;
				if (!file_exists($file_path)){
					break;
				}
			}
			move_uploaded_file($file['tmp_name'], $file_path);
			$this->compress($file_path,$file_path, 75);
			$this->add_db_entry($original_name, $file_path, $user, $post);		
		}
	}


	public function remove_files_by_url ( $url = '' ) {
		if ( $url == '')
			return;
		$f3 = Base::instance();
		$hash = str_replace($f3->get('base_url').'file/', '', $url);
		if (strlen($hash) > 24) {
			$hash = strstr($hash, '?', true);
		}
		if (strlen($hash) == 24){
			$this->reset();
			$this->load(array('hash = ?', $hash));
			if ( $this->loaded() > 0 ){
				$path = $this->path;
				if(file_exists($path) && !is_dir($path)){
					unlink($path);
				}
				$this->erase();
			}
		}
	}
}
