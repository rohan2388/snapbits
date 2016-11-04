<?php 

/**
 * Ajax class
 */
class Ajax extends Controller {
	protected $img_exts = array('png', 'jpg', 'jpeg', 'gif');
	protected $doc_exts = array('doc', 'txt', 'dot');
	protected $voice_exts = array('wav');

	/**
	 * Initiate a action depending on ajax request
	 * @return null 
	 */
	public function init () {
		$this->path = $this->f3->get('PATH');
		$parts = explode('/', trim($this->path, '/'));
		array_shift($parts);
		if ( ! empty( $parts ) ){
			$func = $parts[0];
			$func = preg_replace("/[^a-zA-Z0-9_]+/", "", $func);
			if ( $func != '' && method_exists( $this, $func ) ){
				array_shift($parts);
				$this->{$func}($parts);
				exit();
			}
		}
		// $this->f3->error(500);
		echo 'Error!';
		exit();
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
	 * Process add post ajax request
	 * @return null
	 */
	public function post_add () {
		$post = $this->f3->get('POST');
		$files = $this->f3->get('FILES');
		$userId = $this->user_id;
		$tags = new Tags();

		$p_data = array();	
		if(!empty($post['title']) && trim($post['title']) != '' && !is_array($post['title'])){
			$p_data['title'] = trim($post['title']);
		}else{
			return;
		}
		if(!empty($post['content']) && trim($post['content']) != '' && !is_array($post['content'])){
			$p_data['content'] = trim($post['content']);
		}else{
			return;
		}
		if(!empty($post['color']) && !is_array($post['color'])){
			$p_data['color'] = trim($post['color']);
		}
		$tagIds = array();
		if(!empty($post['tags']) &&  trim($post['tags']) != '' && !is_array($post['tags'])){
			$tagIds = $tags->add_tags($post['tags'], $userId);
		}
		if(!empty($post['reminder'])){
			if ( !empty($post['reminder']['reminder']) && $post['reminder']['reminder'] != '' && !empty($post['reminder']['time']) && $post['reminder']['time'] != '' ){
				$p_data['reminder'] = json_encode ( array(
					'time' => $post['reminder']['time'],
					'reminder' => $post['reminder']['reminder'],
				) );
				$p_data['notify_on'] = date("U", $post['reminder']['notify']);
			}
		}
		$p_data['lock'] = (!empty($post['lock']) && $post['lock'] == 'true');
		$p_data['time'] = date("Y-m-d H:i:s");
		$p_data['tags'] = $tagIds;		 
		$id = $this->posts->add_post($userId, $p_data);

		// process files
		if(isset($files['imgs'])){
			$_files = array();
			$types = array (
				'jpg' => 'image/jpeg',
				'png' => 'image/png',
				'gif' => 'image/gif',
			);
			$count = count($files['imgs']['name']);
			for ($i = 0; $i < $count; $i++) {
				$__file['name']     = $files['imgs']['name'][$i];
				$__file['type']     = $files['imgs']['type'][$i];
				$__file['tmp_name'] = $files['imgs']['tmp_name'][$i];
				$__file['error']    = $files['imgs']['error'][$i];
				$__file['size']     = $files['imgs']['size'][$i];
				$_files[] = $__file;
			}
			$this->filemanager->add_files($_files, $id, $userId, $types);
		}

		if(isset($files['docs'])){
			$_files = array();
			$types = array (
				'doc' => 'application/msword',
				'txt' => 'text/plain'
			);
			$count = count($files['docs']['name']);
			for ($i = 0; $i < $count; $i++) {
				$__file['name']     = $files['docs']['name'][$i];
				$__file['type']     = $files['docs']['type'][$i];
				$__file['tmp_name'] = $files['docs']['tmp_name'][$i];
				$__file['error']    = $files['docs']['error'][$i];
				$__file['size']     = $files['docs']['size'][$i];
				$_files[] = $__file;
			}
			$this->filemanager->add_files($_files, $id, $userId, $types);
		}

		if(isset($files['voices'])){
			$_files = array();
			$types = array (
				'audio/wav',
				'audio/x-wav',
			);
			$count = count($files['voices']['name']);
			for ($i = 0; $i < $count; $i++) {

				$__file['name']     = 'username'.'-'.substr(str_shuffle(MD5(microtime())), 0, 10).'.wav';
				$__file['type']     = $files['voices']['type'][$i];
				$__file['tmp_name'] = $files['voices']['tmp_name'][$i];
				$__file['error']    = $files['voices']['error'][$i];
				$__file['size']     = $files['voices']['size'][$i];
				$_files[] = $__file;
			}
			$this->filemanager->add_files($_files, $id, $userId, $types);
		}

		$post = $this->posts->get_post($userId, $id);
		
		echo json_encode($post);
		exit();
	}

	/**
	 * Update a post
	 * @return null 
	 */
	public function post_update () {
		$post = $this->f3->get('POST');
		$files = $this->f3->get('FILES');
		$userId = $this->user_id;
		$filemanager = new Files();	
		$posts = new Posts();
		$tags = new Tags();
		
		if(!empty($post['id']) && trim($post['id']) != '' && !is_array($post['id'])){
			$post_id = trim($post['id']);
		}else{
			return;
		}

		$posts->reset();
		$posts->load(array('id = ? AND user = ?', $post_id, $userId));
		if ( ! $posts->valid() ){
			echo json_encode(array('error' => true));
			return;
		}

		if(!empty($post['title']) && trim($post['title']) != '' && !is_array($post['title'])){
			$posts->title = trim($post['title']);
		}else{
			return;
		}
		if(!empty($post['content']) && trim($post['content']) != '' && !is_array($post['content'])){
			$posts->content = trim($post['content']);
		}else{
			return;
		}


		if(!empty($post['reminder'])){
			$posts->reminder = json_encode ( array(
				'time' => $post['reminder']['time'],
				'reminder' => $post['reminder']['reminder'],
			) );
			dump_log($post['reminder']);
			$posts->notify_on = ($post['reminder']['notify'] == '') ? null : date("U", $post['reminder']['notify']);
		}

		if(isset($post['color']) && !is_array($post['color']) && is_string($post['color'])){
			$posts->color = trim($post['color']);
		}
		$tagIds = array();
		if(!empty($post['tags']) &&  trim($post['tags']) != '' && !is_array($post['tags'])){
			$tagIds = $tags->add_tags($post['tags'], $userId);
		}

		if(!empty($post['lock']) && trim($post['lock']) != '' && !is_array($post['lock'])){
			if($post['lock'] == 'true'){
				$posts->lock = true;
			}else{
				$posts->lock = false;
			}
		}

		// process files
		if(isset($files['imgs']) && is_array($files['imgs'])){
			$_files = array();
			$types = array (
				'jpg' => 'image/jpeg',
				'png' => 'image/png',
				'gif' => 'image/gif',
			);
			$count = count($files['imgs']['name']);
			for ($i = 0; $i < $count; $i++) {
				$__file['name']     = $files['imgs']['name'][$i];
				$__file['type']     = $files['imgs']['type'][$i];
				$__file['tmp_name'] = $files['imgs']['tmp_name'][$i];
				$__file['error']    = $files['imgs']['error'][$i];
				$__file['size']     = $files['imgs']['size'][$i];
				$_files[] = $__file;
			}
			$filemanager->add_files($_files, $posts, $userId, $types);
		}

		if(isset($files['docs']) && is_array($files['docs'])){
			$_files = array();
			$types = array (
				'doc' => 'application/msword',
				'txt' => 'text/plain'
			);
			$count = count($files['docs']['name']);
			for ($i = 0; $i < $count; $i++) {
				$__file['name']     = $files['docs']['name'][$i];
				$__file['type']     = $files['docs']['type'][$i];
				$__file['tmp_name'] = $files['docs']['tmp_name'][$i];
				$__file['error']    = $files['docs']['error'][$i];
				$__file['size']     = $files['docs']['size'][$i];
				$_files[] = $__file;
			}
			$filemanager->add_files($_files, $posts, $userId, $types);
		}

		if(isset($files['voices']) && is_array($files['voices'])){
			$_files = array();
			$types = array (
				'audio/wav',
				'audio/x-wav',
			);
			$count = count($files['voices']['name']);
			for ($i = 0; $i < $count; $i++) {

				$__file['name']     = 'username'.'-'.substr(str_shuffle(MD5(microtime())), 0, 10).'.wav';
				$__file['type']     = $files['voices']['type'][$i];
				$__file['tmp_name'] = $files['voices']['tmp_name'][$i];
				$__file['error']    = $files['voices']['error'][$i];
				$__file['size']     = $files['voices']['size'][$i];
				$_files[] = $__file;
			}
			$filemanager->add_files($_files, $posts, $userId, $types);
		}

		// delete files
		if(isset($post['rfiles']) && is_array($post['rfiles'])){
			foreach($post['rfiles'] as $rfile){
				$filemanager->remove_files_by_url($rfile);
			}
		}

		$posts->user = $userId;
		$posts->tags = $tagIds;
		$posts->save();
		$posts->reset();
		$posts->load(array('id = ?', $post_id));
		if($posts->loaded() > 0){
			$_post = $this->format_post($posts, true);
			echo json_encode($_post);
		}else{
			echo json_encode(array('error' => true));
		}
	}

	/**
	 * Get list of tags
	 * @return null
	 */
	public function get_tags () {
		$post = $this->f3->get('POST');
		$userId = $this->user_id;
		$tags = new Tags();
		$tags->has('posts', array('user = ?', $userId));
		$results = $tags->find(array('user = ?', $userId));
		$_tags = array();
		if($results){
			foreach($results as $result){
				array_push($_tags, $result->name);
			}
		}
		echo json_encode($_tags);
		exit();
	}

	/**
	 * Process get post ajax request
	 * @return null
	 */
	public function posts_get () {
		$get = $this->f3->get("POST");
		$count = (empty($get['count']) || $get['count'] == '') ? 10 :  (int) $get['count'];
		$page = (empty($get['page']) || $get['page'] == '') ? 1 :  (int) $get['page'];
		$userId = $this->user_id;
		$posts = new Posts();

		$filters = array();
		$filters[0] = '';

		if(isset($get['filter']) && $get['filter'] != '' && $get['filter'] != '{}'){
			$_filters  = json_decode($get['filter']);
			$_filterColors = $_filterTags = $_filterDate = $_filterAdvanced = array();

			foreach( $_filters as $_filter ) {
				switch ($_filter->type) {
					case 'color':
						$_filterColors[] = $_filter->value;
						break;
					case 'tag':
						$_filterTags[] = $_filter->value;
						break;
					case 'date_from':
						$_filterDate['date_from'] = $_filter->value;
						break;
					case 'date_to':
						$_filterDate['date_to'] = $_filter->value;
						break;
					case 'advanced_with_words':
						$_filterAdvanced['advanced_with_words'] = $_filter->value;
						break;
					case 'advanced_with_exact_phrase':
						$_filterAdvanced['advanced_with_exact_phrase'] = $_filter->value;
						break;
					case 'advanced_with_atleast_words':
						$_filterAdvanced['advanced_with_atleast_words'] = $_filter->value;
						break;
					case 'advanced_without_words':
						$_filterAdvanced['advanced_without_words'] = $_filter->value;
						break;
				}
			}

			if (!empty($_filterColors)) {
				$_str = '(';
				foreach ($_filterColors as $_filterColor){
					$_str .= 'color = ? OR ';
					array_push($filters, $_filterColor);
				}
				$_str = trim($_str, 'OR ');
				$_str .= ')';
				$filters[0] .= $_str.' AND ';
			}

			if (!empty($_filterTags)) {
				$_arr = array();
				$_arr[0] = '(';
				foreach($_filterTags as $_filterTag){
					$_arr[0] .= 'name = ? OR ';
					array_push($_arr, $_filterTag);
				}
				$_arr[0] = trim($_arr[0], 'OR ');
				$_arr[0] .= ')';
				$posts->has('tags',$_arr);
			}

			if (!empty($_filterDate)) {
				$_str = '(';
				if(isset($_filterDate['date_from'])){
					$_str .= "time >= ?";
					$date = explode('/', $_filterDate['date_from']);
					$new  = date('Y-m-d H:i:s', strtotime(implode('-', array_reverse($date))));
					array_push($filters, $new);
				}

				if(isset($_filterDate['date_to'])){
					if(isset($_filterDate['date_from'])){
						$_str .= " AND ";
					}
					$_str .= "time <= ?";
					$date = explode('/', $_filterDate['date_to']);
					$new  = date('Y-m-d H:i:s', strtotime(implode('-', array_reverse($date))));
					array_push($filters, $new);
				}
				$_str .= ')';
				$filters[0] .= $_str.' AND ';
			}

			if (!empty($_filterAdvanced)) {
				$_str = '';

				if(isset($_filterAdvanced['advanced_with_words']) && strlen($_filterAdvanced['advanced_with_words']) > 0){
					$words = explode(' ', $_filterAdvanced['advanced_with_words']);
					$_str .= "(";
					foreach ($words as $word) {
						$_str .= "concat(' ', title, ' ', content, ' ') LIKE ? AND ";
						array_push($filters, "% ".$word." %");
					}
					$_str = trim($_str, 'AND ');
					$_str .= ") AND ";
				}
				
				if(isset($_filterAdvanced['advanced_with_exact_phrase']) && strlen($_filterAdvanced['advanced_with_exact_phrase']) > 0){
					$_str .= "concat(title, ' ', content) LIKE ?";
					array_push($filters, "%".$_filterAdvanced['advanced_with_exact_phrase']."%");
					$_str .= " AND ";
				}

				if(isset($_filterAdvanced['advanced_with_atleast_words']) && strlen($_filterAdvanced['advanced_with_atleast_words']) > 0){
					$words = explode(' ', $_filterAdvanced['advanced_with_atleast_words']);
					$_str .= "(";
					foreach ($words as $word) {
						$_str .= "concat(' ', title, ' ', content, ' ') LIKE ? OR ";
						array_push($filters, "% ".$word." %");
					}
					$_str = trim($_str, 'OR ');
					$_str .= ") AND ";
				}

				if(isset($_filterAdvanced['advanced_without_words']) && strlen($_filterAdvanced['advanced_without_words']) > 0){
					$words = explode(' ', $_filterAdvanced['advanced_without_words']);
					$_str .= "(";
					foreach ($words as $word) {
						$_str .= "concat(' ', title, ' ', content, ' ') NOT LIKE ? AND ";
						array_push($filters, "% ".$word." %");
					}
					$_str = trim($_str, 'AND ');
					$_str .= ") AND ";
				}

				$filters[0] .= $_str;
			}

		}




		$filters[0] .= 'user = ?'; 
		array_push($filters, $userId);
		$result = $posts->paginate($page-1, $count,$filters,array('order'=>'id DESC'));
		$_data = array();
		
		if ($result['subset']) { 
			foreach($result['subset'] as $post){
				$_data[] = $this->format_post($post);
			}
		}

		$data = array(
				'total' => $result['total'],
				'postFetched' => count($_data),
				'page' => $page,
				'limit' => $count,
				'hasNext' => ($result['total'] > ($page*$count) ),
				'posts' => $_data
			);

		echo json_encode($data);
	}

	/**
	 * Process post remove ajax request
	 * @return null 
	 */
	public function post_remove () {
		$get = $this->f3->get("POST");
		$data = array();
		if (empty($get['post_id']) || $get['post_id'] == ''){
			$data['success'] = false;
			echo json_encode($data);
			exit();
		}
		$post_id = (int) $get['post_id'];
		$userId = $this->user_id;
		$posts = new Posts();
		$data['success'] = false;
		$posts->load(array('id = ? AND user = ?', $post_id, $userId));
		if ($posts->valid()){
			if ( ! $posts->get('lock') ){
				$posts->erase();
				$data['success'] = true;
			}else{
				if (!empty($get['token']) && $get['token'] != '') {
					if ( $this->verify_unlocktoken( $get['token'] ) ) {
						$posts->erase();
						$data['success'] = true;
					}
				}
			}
		}
		echo json_encode($data);
		exit();
	}

	/**
	 * Process post get ajax request
	 * @return null 
	 */
	public function post_get () {
		$get = $this->f3->get("POST");
		$data = array();
		if (empty($get['post_id']) || $get['post_id'] == ''){
			$data['success'] = false;
			echo json_encode($data);
			exit();
		}
		$post_id = (int) $get['post_id'];
		$userId = $this->user_id;
		$posts = new Posts();
		$posts->load(array('id = ? AND user = ?', $post_id, $userId));
		$data['success'] = false;
		if ($posts->valid()){
			if ( ! $posts->get('lock') ){
				$data['success'] = true;
				$data['post'] = $this->format_post($posts);				
			}else{
				if (!empty($get['token']) && $get['token'] != '') {
					if ( $this->verify_unlocktoken( $get['token'] ) ) {
						$data['post'] = $this->format_post($posts, true);	
						$data['success'] = true;
					}
				}			
			}
		}
		echo json_encode($data);
		exit();
	}

	public function recover () {
		$username = $this->f3->get("POST.username");
		if (empty($username) || trim($username) == ''){
			echo json_encode(array('success' => false, 'error' => 'empty'));
			return;
		}
		if ( $this->user->recover_password($username) ) {
			echo json_encode(array('success' => true, 'error' => ''));
		}else{
			echo json_encode(array('success' => false, 'error' => 'invalid'));		
		}
	}

	/**
	 * User login
	 * @return null
	 */
	public function login () {
		$username = $this->f3->get("POST.username");
		$password = $this->f3->get("POST.password");

		if (empty($username) || trim($username) == ''){
			echo json_encode(array('error' => true, 'message' => 'Empty username'));
			return;
		}

		if (empty($password) || trim($password) == ''){
			echo json_encode(array('error' => true, 'message' => 'Empty password'));
			return;
		}

		$users = new Users();
		$result = $users->login( $username, $password );
		$data = array(
			'success' => $result,
			'redirect' => trim( $this->f3->get('base_url'), '/' ).'/member'
		);
		echo json_encode($data);
	}
	/**
	 * Signup a new user
	 * @return null 
	 */
	public function signup () {
		$username = $this->f3->get("POST.username");
		$email    = $this->f3->get("POST.email");
		$password = $this->f3->get("POST.password");
		$has_err = false;
		$errors = array();	
		$users = new Users();

		if (!$username || trim($username) == ''){
			$has_err = true;
			$errors['username'] = 'empty';
		}else{
			$username = trim($username);
			$users->load(array('username = ?', $username));
			if ($users->valid()){
				$has_err = true;
				$errors['username'] = 'exists';
			}
		}

		if (!$password || trim($password) == ''){
			$has_err = true;
			$errors['password'] = 'empty';
		}else{
			$password = trim($password);
			if ( ! preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,}/", $password) ) {
				$has_err = true;
				$errors['password'] = 'invalid';
			}
		}

		if (!$email || trim($email) == ''){
			$has_err = true;
			$errors['email'] = 'empty';
		}else{			
			$email = trim($email);
			$users->reset();
			$users->load(array('email = ?', $email));
			if ($users->valid()){
				$has_err = true;
				$errors['email'] = 'exists';
			}
		}

		if (!$has_err){			
			if ( $users->add_user(array(
				'username' => $username,
				'password' => $password,
				'email' => $email,
			)) ) {
				echo json_encode(array('success'=> true, 'username' => $username, 'email' => $email, 'errors' => $errors));
			}else{
				echo json_encode(array('success'=> false, 'errors' => $errors));
			}

		}else{			
			echo json_encode(array('success'=> false, 'errors' => $errors));
		}

	}
	/**
	 * Social share step process
	 * @return null
	 */
	public function social_share () {
		$type = $this->f3->get('POST.type');
		if ( ! empty( $type ) ) {
			$userId = $this->user_id;
			$users = new Users();
			$users->load(array('id = ?', $userId));
			if ($users->valid() ) {
				$error = false;
				switch (trim($type)) {
					case 'facebook':
						$this->metadata->add_data( $userId, 'shared_fb', 'yes', true, false, true);
						break;
					case 'twitter':
						$this->metadata->add_data( $userId, 'shared_twitter', 'yes', true, false, true);
						break;
					case 'email':
						$emails = $this->f3->get('POST.emails');
						$emials_arr = array();
						if ( ! empty( $emails ) && count( $emails ) == 5 ){
							foreach ( $emails as $email ) {
								if ( is_string($email) ){
									$email = trim($email);
									if (filter_var($email, FILTER_VALIDATE_EMAIL)){
										if(!in_array($email, $emials_arr)){
											array_push($emials_arr, $email);
										}
									}
								}
							}
							if ( count($emials_arr) == 5){
								// send emal to all $emials_arr		
								$f3->set('email_username', $this->get('username'));
								$f3->set('email_email', $this->get('email'));	

								$template = new Template;
								$msg = $template->render('email/share.htm');
								$mail = new PHPMailer;
								$mail->setFrom($f3->get('email_from_address'), $f3->get('email_from_name'));
								$mail->isHTML(true); 
								$mail->Subject = $f3->get('email_password_recovery_subject');
								$mail->Body = $msg;
								foreach ($emials_arr as $email) {
									$mail->addAddress($email, ''); 								
								}
								@$mail->send();

								$this->metadata->add_data( $userId, 'shared_email', 'yes', true, false, true);
								break;
							}
						}
						$error = true;
						break;					
					default:
						$error = true;
						break;
				}
				if ($error) 
					echo json_encode(array('success' => false));
				else		
					$this->user->load(array('id = ?', $userId));
					$totalShares = 0;
					$counted =  array();
					foreach( $this->user->get('metadata') as $meta ){
						switch ($meta->get('type')) {
							case 'shared_fb':
							case 'shared_twitter':
							case 'shared_email':
								if ($meta->get('value') == 'yes'){
									if ( ! in_array($meta->get('type'), $counted) ){
										$totalShares++;
										array_push($counted, $meta->get('type'));
									}
									
								}
								break;
						}
					}
					if ( $totalShares  == 3 ) {
						$date = date('Y-m-d H:i:s', strtotime('+1 year'));
						$this->user->upgrade( $userId ,$date, 'unlocked' );
					}

					echo json_encode(array('success' => true));					
			}
		}
	}

	/**
	 * Initial setup form  process
	 * @return null
	 */
	public function setup () {
		$password = $this->f3->get('POST.password');
		$password_re = $this->f3->get('POST.password_re');
		$password_hint = $this->f3->get('POST.password_hint');
		$emails = $this->f3->get('POST.emails');
		$emails2 = $this->f3->get('POST.emails2');

		// detect which form it is
		if ($password && $password_re && $password_hint){
			$type = 'password';
		}else if ($emails && count($emails) > 0){
			$type = 'email';
		}else if ($emails2 && count($emails2) > 0){
			$type = 'emailtosnapbit';
		}

		$error = false;
		$return = array();
		$userId = $this->user_id;
		$users = new Users();
		$users->load(array('id = ?', $userId));
		switch ($type) {
			case 'password':
				if( !empty($password) && is_string($password) ){
					$password = trim($password);
				}else{
					$error = true;
				}
				if( !empty($password_re) && is_string($password_re) ){
					$password_re = trim($password_re);
					if($password != $password_re){
						$error = true;
					}
				}else{
					$error = true;
				}
				if( !empty($password_hint) && is_string($password_hint) ){
					$password_hint = trim($password_hint);
				}else{
					$error = true;
				}

				if(!$error){
					$this->metadata->add_data($userId, 'lockpass_hint', $password_hint, true, false, true);
					$users->lock_password = $password;
					$users->save();
					$return['success'] = true;
				}else{
					$return['success'] = false;					
				}
				break;	
			case 'email':
				$return['success'] = $this->add_reminder( $this->f3->get('POST.emails'), false );
				break;
			case 'emailtosnapbit':
				$return['success'] = $this->add_email2snapbits( $this->f3->get('POST.emails2'), false );	
				break;
			default:
				$return['success'] = false;	
				break;
		}
		echo json_encode($return);
	}

	/**
	 * Verify a session i
	 * @return null
	 */
	public function verify_session () {
		$users = new Users();
		if ($users->verify_login()){
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}
	}

	/**
	 * Verify if unlock token is valid
	 * @param  string $token 
	 * @return bool 
	 */
	public function verify_unlocktoken ( $token ) {	
		$users = new Users();
		$users->load(array('id = ?',$this->user_id));
		if ($users->valid()){
			$hash = ( $users->get('lock_password') )  ?  $users->get('lock_password') : $users->get('password');	
			$user_browser = $this->f3->get('AGENT');
			$user_id = str_pad(base_convert($this->user_id, 10, 16), 12, "0", STR_PAD_LEFT);
			$_token = hash('sha256', $user_id . $hash . $user_browser);
			return hash_equals($_token,$token);
		}else{
			return false;
		}
	}

	/**
	 * Unlock a post, return formatted full post with hash
	 * @return null
	 */
	public function unlock () {
		$data = array();
		$post_id = $this->f3->get('POST.post_id');
		$password = $this->f3->get('POST.password');
		if ( ! $post_id || ! $password ) {
			$data['success'] = false;
			echo json_encode($data);
			return;
		}

		$posts = new Posts();
		$users = new Users();
		$posts->load(array('id = ? AND user = ?', $post_id, $this->user_id));
		if ( ! $posts->valid() ){
			$data['success'] = false;
			echo json_encode($data);
			return;			
		}

		$users->load(array('id = ?', $this->user_id));		
		if ( ! $users->valid() ){
			$data['success'] = false;
			echo json_encode($data);
			return;			
		}

		$hash = ( $users->get('lock_password') )  ?  $users->get('lock_password') : $users->get('password');
		if ( ! Bcrypt::instance()->verify($password, $hash) ){
			$data['success'] = false;
			echo json_encode($data);	
			return;		
		}
		$user_browser = $this->f3->get('AGENT');
		$user_id = str_pad(base_convert($this->user_id, 10, 16), 12, "0", STR_PAD_LEFT);
		$data['token'] = hash('sha256', $user_id . $hash . $user_browser);
		$data['post'] = $this->format_post($posts, true);
		$data['success'] = true;
		echo json_encode($data);
	}

	/**
	 * Add email address to email2snapbit list
	 * @param array $emails [Array of email ids]
	 * @param bool $ajax [If true, it will print out json data. Defalt: true]
	 * @return array Array of emails
	 */
	public function add_email2snapbits ( $emails = null, $ajax = true ) {
		$emails = $emails ?: $this->f3->get('POST.emails');
		$error = false;
		$_emails = array();
		if(!empty($emails) && is_array($emails) ){
			foreach($emails as $email){
				if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false){
					$_emails[] = trim($email);
				}
			}
		}else{
			$error = true;
		}
		if (!$error){
			$userId = $this->user_id;
			foreach ($_emails as $email) {
				$this->metadata->add_data( $userId, 'email2snapbit-email', $email, true, true );
			}
			
			if ($ajax) {
				$data = array(
					'emails' => $_emails,
					'success' => true
				);
				echo json_encode($data);
			}
			return $_emails;
		}else{
			if ($ajax) {
				$data = array(
					'emails' => array(),
					'success' => false
				);
				echo json_encode($data);
			}
			return false;						
		}
	}


	/**
	 * Remove email address from email2snapbit list
	 * @return null
	 */
	public function remove_email2snapbits () {
		$emails = $this->f3->get('POST.emails');
		$error = false;
		$_emails = array();
		if(!empty($emails) && is_array($emails) ){
			foreach($emails as $email){
				if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false){
					$_emails[] = trim($email);
				}
			}
		}else{
			$error = true;
		}

		if (!$error) {
			$userId = $this->user_id;
			foreach ($_emails as $email) {
				$this->metadata->remove_data( $userId, 'email2snapbit-email', $email);
			}
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}
	}

	/**
	 * Set timezone
	 * @return  null 
	 */
	public function set_timezone () {
		$tz = $this->f3->get('POST.timezone');
		if (isset($tz) && trim($tz) != ''){
			$tz = trim($tz);
			if ( in_array($tz, timezone_identifiers_list()) ){
				$userId = $this->user_id;
				$this->metadata->add_data( $userId, 'timezone', $tz, true, false, true);
				echo json_encode($tz);
			}
		}

	}

	/**
	 * Add email address to reminder list
	 * @param array $emails [Array of email ids]
	 * @param bool $ajax [If true, it will print out json data. Defalt: true]
	 * @return array Array of emails
	 */
	public function add_reminder ( $emails = null, $ajax = true ) {
		$emails = $emails ?: $this->f3->get('POST.emails');
		$error = false;
		$_emails = array();
		if(!empty($emails) && is_array($emails) ){
			foreach($emails as $email){
				if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false){
					$_emails[] = trim($email);
				}
			}
		}else{
			$error = true;
		}
		if (!$error){
			$userId = $this->user_id;
			foreach ($_emails as $email) {
				$this->metadata->add_data( $userId, 'reminder-email', $email, true, true );
			}
			
			if ($ajax) {
				$data = array(
					'emails' => $_emails,
					'success' => true
				);
				echo json_encode($data);
			}
			return $_emails;
		}else{
			if ($ajax) {
				$data = array(
					'emails' => array(),
					'success' => false
				);
				echo json_encode($data);
			}
			return false;						
		}
	}


	/**
	 * Remove email address from reminder list
	 * @return null
	 */
	public function remove_reminder () {
		$emails = $this->f3->get('POST.emails');
		$error = false;
		$_emails = array();
		if(!empty($emails) && is_array($emails) ){
			foreach($emails as $email){
				if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false){
					$_emails[] = trim($email);
				}
			}
		}else{
			$error = true;
		}

		if (!$error) {
			$userId = $this->user_id;
			foreach ($_emails as $email) {
				$this->metadata->remove_data( $userId, 'reminder-email', $email);
			}
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}
	}

	/**
	 * Change login password
	 * @return null
	 */
	public function change_password () {
		$pass_ex = $this->f3->get('POST.pass_ex');
		$pass_new = $this->f3->get('POST.pass_new');
		$pass_re = $this->f3->get('POST.pass_re');
		$pass_hint = $this->f3->get('POST.pass_hint'); 
		$errors = array();

		if ( ! $pass_ex || trim($pass_ex) == '' ) {
			$errors['pass_ex'] = 'empty';
		}else{
			$this->user->reset();
			$this->user->load(array('id = ?',$this->user_id));
			if ( $this->user->valid() ) {
				$hash = $this->user->get('password');
				if ( ! Bcrypt::instance()->verify( $pass_ex, $hash ) ) {
					$errors['pass_ex'] = 'wrong';
				}
			}else{
				return;
			}
		}

		if ( ! $pass_new || trim($pass_new) == ''){
			$errors['pass_new'] = 'empty';
		}else{
			$pass_new = trim($pass_new);
			if ( ! preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,}/", $pass_new) ) {
				$errors['pass_new'] = 'invalid';
			}
		}

		if ( ! $pass_re || trim($pass_re) == '' ){
			$errors['pass_new'] = 'empty';
		}else if ( trim($pass_re) != $pass_new ) {
			$errors['pass_new'] = 'mismatch';
		}

		if ( ! $pass_hint || trim($pass_hint) == '' ){
			$errors['pass_hint'] = 'empty';
		}

		if (  count($errors) > 0 ) {
			echo json_encode(array('success' => false, 'errors' => $errors));
			return;
		}


		$this->user->set('password', $pass_new);
		$this->user->save();	
		$this->metadata->add_data($this->user_id, 'pass_hint', $pass_hint, true, false, true);

		$this->user->create_session();
		echo json_encode(array('success' => true, 'errors' => array()));
	}	

	/**
	 * Change lock password
	 * @return null
	 */
	public function change_lockpassword () {
		$pass_ex = $this->f3->get('POST.pass_ex');
		$pass_new = $this->f3->get('POST.pass_new');
		$pass_re = $this->f3->get('POST.pass_re');
		$pass_hint = $this->f3->get('POST.pass_hint'); 
		$errors = array();

		if ( ! $pass_ex || trim($pass_ex) == '' ) {
			$errors['pass_ex'] = 'empty';
		}else{
			$this->user->reset();
			$this->user->load(array('id = ?',$this->user_id));
			if ( $this->user->valid() ) {
				$hash = ( $this->user->get('lock_password') )  ?  $this->user->get('lock_password') : $this->user->get('password');
				if ( ! Bcrypt::instance()->verify( $pass_ex, $hash ) ) {
					$errors['pass_ex'] = 'wrong';
				}
			}else{
				return;
			}
		}

		if ( ! $pass_new || trim($pass_new) == ''){
			$errors['pass_new'] = 'empty';
		}else{
			$pass_new = trim($pass_new);
			if ( ! preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,}/", $pass_new) ) {
				$errors['pass_new'] = 'invalid';
			}
		}

		if ( ! $pass_re || trim($pass_re) == '' ){
			$errors['pass_new'] = 'empty';
		}else if ( trim($pass_re) != $pass_new ) {
			$errors['pass_new'] = 'mismatch';
		}

		if ( ! $pass_hint || trim($pass_hint) == '' ){
			$errors['pass_hint'] = 'empty';
		}

		if (  count($errors) > 0 ) {
			echo json_encode(array('success' => false, 'errors' => $errors));
			return;
		}

		$this->user->set('lock_password', $pass_new);
		$this->user->save();
		$this->metadata->add_data($this->user_id, 'lockpass_hint', $pass_hint, true, false, true);
	

		echo json_encode(array('success' => true, 'errors' => array()));
	}

	/**
	 * Get settings page data
	 * @return null
	 */
	public function get_settings () {
		$userId = $this->user_id;
		$this->user->reset();
		$this->user->load(array('id = ?', $userId));
		if ($this->user->valid()){
			$data = array(
				'email2snapbit_emails' => array(),
				'reminder_emails' => array(),
				'has_pass_hint' => false,
				'is_premium' => 0,
				'timezone' => ''
			);
			$data['is_premium'] = $this->user->get('premium');

			if ( $data['is_premium'] != 1){
				$data['paypal_button_id'] = $this->f3->get('paypal_button_id_settings');
			}


			$metadata = $this->metadata->load_meta($userId);
			if ( $metadata ){
				foreach ($metadata as  $meta) {
					switch ($meta->get('type')) {
						case 'email2snapbit-email':
							array_push($data['email2snapbit_emails'], $meta->get('value'));
							break;				
						case 'reminder-email':
							array_push($data['reminder_emails'], $meta->get('value'));
							break;			
						case 'pass_hint':
							if ( $meta->get('value') != '' ){
								$data['has_pass_hint'] = true;
							}
							break;		
						case 'shared_fb':
							if ( $meta->get('value') != '' ){
								$data['shared_fb'] = true;
							}
						case 'shared_fb':
							if ( $meta->get('value') == 'yes' ){
								$data['shared_fb'] = true;
							}
							break;
						case 'shared_twitter':
							if ( $meta->get('value') == 'yes' ){
								$data['shared_twitter'] = true;
							}
							break;
						case 'shared_email':
							if ( $meta->get('value') == 'yes'){
								$data['shared_email'] = true;
							}
							break;
						case 'timezone':
							$data['timezone'] = $meta->get('value');
							break;
					}
				}
			}

			echo json_encode(array('success' => true, 'data'=>$data));
		}else{
			echo json_encode(array('success' => false, 'data'=> array()));
		}
	}

	/**
	 * Make paypal call to suspend subscription
	 * @return [type] [description]
	 */
	public function subscription_pause () {
		$userId = $this->user_id;	
		$this->user->get_user_by_id($userId);
		if ($this->user->get('premium') != 0 ){
			$this->user->sub_toggle($userId, 'pause');
			echo json_encode('Make paypal call...');			
		}

	}

	/**
	 * Make paypal call to resume subscription
	 * @return [type] [description]
	 */
	public function subscription_resume () {
		$userId = $this->user_id;
		if ($this->user->get('premium') != 0 ){
			$this->user->sub_toggle($userId, 'resume');
			echo json_encode('Make paypal call...');			
		}
	}



	/**
	 * Logout a user
	 * @return null
	 */
	public function logout () {
		$userId = $this->user_id;
		$this->user->logout();
		echo json_encode(true);
	}


	/**
	 * Disable premium upgrade popup
	 * @return null 
	 */
	public function disable_upgrade_popup () {
		$check = $this->f3->get('POST.check');
		if ($check == 'true'){
			$result = true;
			$this->f3->set('SESSION.disable_upgrade_popup', true);
		}else{
			$result = false;
			$this->f3->set('SESSION.disable_upgrade_popup', false);
		}

		echo json_encode( $result );
	}
}