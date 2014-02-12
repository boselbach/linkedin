<?php
class BaseController
{
	public function sessionStart($name)
	{
		session_name($name);
		session_start();
	}

	public function session($key, $value = false)
	{
		if ($value) {
			$_SESSION[$key] = $value;	
		}
		else {
			return (string)$_SESSION[$key];
		}
		
	}

	public function redirect($url)
	{
		header("Location: $url");
		exit;
	}
}