<?php 

class Posts extends \DB\Cortex {
	protected $img_exts = array('png', 'jpg', 'jpeg', 'gif');
	protected $doc_exts = array('doc', 'txt', 'dot');
	protected $voice_exts = array('wav');
	
	protected $db    = 'DB';
	protected $table = 'posts'; 
	protected $fluid = true;
	protected $fieldConf = array(
		'title' => array(
			'type' => \DB\SQL\Schema::DT_TEXT,
			'nullable' => false,
		),
		'content' => array(
			'type' => \DB\SQL\Schema::DT_LONGTEXT,
			'nullable' => false,
		),
		'color' => array(
			'type' => \DB\SQL\Schema::DT_TEXT
		),
		'time' => array(
			'type' => \DB\SQL\Schema::DT_DATETIME
		),
		'lock' => array(
			'type' => \DB\SQL\Schema::DT_BOOL,
		),
		'user' => array(
			'belongs-to-one' => '\Users'
		),
		'files' => array(
			'has-many' => array('\Files', 'post')
		),
		'tags' => array(
			'has-many' => array('\Tags', 'posts')
		),
		'reminder' => array(
			'type' => \DB\SQL\Schema::DT_TEXT
		),
		'notify_on' => array(
			'type' => \DB\SQL\Schema::DT_INT
		)
	);


	/**
	 * Class contsructer
	 */
	function __construct(){
		parent::__construct();
		$this->beforeerase(function($self){
			// cleanup files
			if(count($self->files) > 0) {
				$Files = new Files();
				foreach($self->files as $file){
					$file->erase();
				}
			}
			// cleanup tags
			if(count($self->tags) > 0) {
				foreach($self->tags as $tag){
					if (count($tag->posts) <= 1){
						$tag->erase();
					}
				}
			}			
		});
	}

	/**
	 * Format a post db object to jsonable array
	 */
	
	private function format_post ( $post, $ignore_lock = false ) {
		$data = array();
		$data['id'] = $post->id;
		$data['title'] = nl2br($post->title);
		$data['lock'] = $post->lock;
		$data['time'] = strtotime($post->time);


		if (!$ignore_lock){
			if ($data['lock']){
				$data['content'] = '';
				$data['color'] = '';
				return $data;
			}
		}
		$data['content'] = nl2br($post->content);
		$data['color'] = ($post->color) ? $post->color : '';
		if($post->reminder != ''){
			$data['reminder'] = json_decode($post->reminder);
		}

		if ( count($post->tags) > 0 ) {
			$data['tags'] = '';
			foreach($post->tags as $tag){
				$data['tags'] .= $tag->name.',';
			}
			$data['tags'] = trim($data['tags'], ',');
		}

		if ( count($post->files) > 0 ) {
			$data['imgs'] = $data['docs'] = $data['voiceNotes'] = array();
			foreach($post->files as $file){			
				switch ($file->ext) {
					case in_array($file->ext, $this->img_exts):
						$data['imgs'][] = $file->download_url;
						break;
					case in_array($file->ext, $this->doc_exts):
						$data['docs'][] = array(
							'filename' => $file->filename,
							'ext' => $file->ext,
							'url' => $file->download_url.'?download=true',
							'raw_url' => $file->download_url,
							'viewUrl' => '',
						);
						break;
					case in_array($file->ext, $this->voice_exts):
						$data['voiceNotes'][] = array(
							'url' => $file->download_url,
							'totalTime' => '00:00',
						);
						break;
				}
			}
		}
		return $data;
	}

	/**
	 * Add a new post
	 * @param int $userId
	 * @param array  $data  [title,content,color,reminder,notify_on,lock,tags]
	 */
	public function add_post ( $userId = null, $data = array() ) {
		if (empty($userId)){
			return false;
		}

		$this->reset();
		$this->set('user', $userId);

		if ( ! empty( $data['title'] ) ){
			$this->set('title', $data['title']);
		}

		if ( ! empty( $data['content'] ) ){
			$this->set('content', $data['content']);
		}

		if ( ! empty( $data['color'] ) ){
			$this->set('color', $data['color']);
		}
		if ( ! empty( $data['reminder'] ) ){
			$this->set('reminder', $data['reminder']);
		}

		if ( ! empty( $data['notify_on'] ) ){
			$this->set('notify_on', $data['notify_on']);
		}

		if ( ! empty( $data['lock'] ) ){
			$this->set('lock', $data['lock']);
		}else{
			$this->set('lock', false);
		}

		if ( ! empty( $data['tags'] ) ){
			$this->set('tags', $data['tags']);
		}

		$this->set('time', date("Y-m-d H:i:s"));


		$the_post = $this->save();
		return $the_post->get('id');
	}

	/**
	 * Get a post from db
	 * @param  int $userId 
	 * @param  int $id     post ID
	 * @param  bool $raw   [default: false]
	 * @return array|cortex|bool  
	 */
	public function get_post ( $userId = null, $id = null, $raw = false ) {
		if ( empty( $id ) || empty( $userId ) ){
			return false;
		}

		$this->reset();
		$post = $this->load(array('id = ? AND user = ?', $id, $userId));
		if ( $this->valid() ){
			if ($raw){
				return $post;
			}else{
				return $this->format_post($post);
			}
		}else{
			return false;
		}
	}

	
}
