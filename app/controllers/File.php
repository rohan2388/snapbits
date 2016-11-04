<?php 

/**
 * File fetcher
 */
class File extends Controller {

	/**
	*	Detect MIME type using file extension
	* 	Copied from F3 WEB class
	*	@return string
	*	@param $file string
	**/
	function mime($file) {
		if (preg_match('/\w+$/',$file,$ext)) {
			$map=array(
				'au'=>'audio/basic',
				'avi'=>'video/avi',
				'bmp'=>'image/bmp',
				'bz2'=>'application/x-bzip2',
				'css'=>'text/css',
				'dtd'=>'application/xml-dtd',
				'doc'=>'application/msword',
				'gif'=>'image/gif',
				'gz'=>'application/x-gzip',
				'hqx'=>'application/mac-binhex40',
				'html?'=>'text/html',
				'jar'=>'application/java-archive',
				'jpe?g'=>'image/jpeg',
				'js'=>'application/x-javascript',
				'midi'=>'audio/x-midi',
				'mp3'=>'audio/mpeg',
				'mpe?g'=>'video/mpeg',
				'ogg'=>'audio/vorbis',
				'pdf'=>'application/pdf',
				'png'=>'image/png',
				'ppt'=>'application/vnd.ms-powerpoint',
				'ps'=>'application/postscript',
				'qt'=>'video/quicktime',
				'ram?'=>'audio/x-pn-realaudio',
				'rdf'=>'application/rdf',
				'rtf'=>'application/rtf',
				'sgml?'=>'text/sgml',
				'sit'=>'application/x-stuffit',
				'svg'=>'image/svg+xml',
				'swf'=>'application/x-shockwave-flash',
				'tgz'=>'application/x-tar',
				'tiff'=>'image/tiff',
				'txt'=>'text/plain',
				'wav'=>'audio/wav',
				'xls'=>'application/vnd.ms-excel',
				'xml'=>'application/xml',
				'zip'=>'application/x-zip-compressed'
			);
			foreach ($map as $key=>$val)
				if (preg_match('/'.$key.'/',strtolower($ext[0])))
					return $val;
		}
		return 'application/octet-stream';
	}

	/**
	*	Transmit file to HTTP client; Return file size if successful,
	* 	Copied from F3 WEB class
	*	FALSE otherwise
	*	@return int|FALSE
	*	@param $file string
	*	@param $filename string
	*	@param $force bool
	**/
	function send($file, $filename='filename',$force=TRUE) {
		if (!is_file($file))
			return FALSE;
		$size=filesize($file);
		if (PHP_SAPI!='cli') {
			header('Content-Type: '.($this->mime($file)));
			if ($force){
				header('Content-Disposition: attachment; '.
					'filename="'.$filename.'"');
			}else{
				header('Content-Disposition: filename="'.$filename.'"');				
			}
			header('Accept-Ranges: bytes');
			header('Content-Length: '.$size);
			header('X-Powered-By: '.Base::instance()->get('PACKAGE'));
		}
		$ctr=0;
		$handle=fopen($file,'rb');
		$start=microtime(TRUE);
		while (!feof($handle) &&
			($info=stream_get_meta_data($handle)) &&
			!$info['timed_out'] && !connection_aborted()) {
			// Send 1KiB and reset timer
			echo fread($handle,1024);
		}
		fclose($handle);
		return $size;
	}


	/**
	 * Grab real file by hash
	 * @param  object $f3   instance
	 * @param  array $args 
	 * @return null  
	 */
	public function init ($f3, $args) {
		$hash = $args['filename'];
		if ( strlen($hash) != 24 ){
			$this->f3->error(404);
		}
		$force = false;
		$get = $this->f3->get("GET");
		if(!empty($get['download']) && $get['download'] == 'true'){
			$force = true;
		}

		$files = new Files();
		$files->load(array('hash = ?', $hash));
		if (!$this->send($files->get('path'), $files->filename, $force))
			$this->f3->error(404);

	}
}