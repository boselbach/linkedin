<?php

class Config 
{
	protected static $config = [
		'linkedin' => [
			'company' => 'falcon social',
			'appName' => 'testApp',
			'apiKey' => '770cl8anmswfjz',
			'apiSecret' => 'YTtjPrGzBwQbR0Rk',			
			'scope' => 'r_fullprofile r_emailaddress rw_nus r_network',
			'authenticationUrl' => 'https://www.linkedin.com/uas/oauth2/authorization?',
			'accessTokenUrl' => 'https://www.linkedin.com/uas/oauth2/accessToken?',
			'redirectUrl' => "http://falcon.dev:80/"
		]
	];

	public static function get($key = false)
	{
		if ($key && array_key_exists($key, self::$config)) {
			return (object)self::$config[$key];
		}
		
		return (object)self::$config;
	}
}