<?php

class indexController extends BaseController
{
	protected $linkedinConfig;

	public function __construct()
	{
		$this->sessionStart('linkedin');
		$this->linkedinConfig = Config::get('linkedin');
	}

	public function init()
	{
		if ($this->session('access_token')) {
			return true;
		}

		if ($_GET['error']) {
			return false;
		}
		
		if ($_GET['code'] && $this->session('state') == $_GET['state']) {
			if($this->getAccessToken($code)) {
				$this->redirect('/');
			}
		}
		else {
			$this->getAuthorizationCode();	
		}
	}

	public function index()
	{
		app::makeView('index');
	}

	public function fetch()
	{
		try {
			$query = $resource = $_POST['fetch'];

		    $params = [
		    	'oauth2_access_token' => $this->session('access_token'),
		        'format' => 'json',
		    ];
		     
		    $url = 'https://api.linkedin.com' . $resource . '?' . http_build_query($params);
		    $context = stream_context_create(['http' => ['method' => 'GET']]);
		    $response = file_get_contents($url, false, $context);

		} catch (Exception $e) {
			echo $e->getMessage();
		}

	    echo $response;
	}

	public function export()
	{
		$data = $_POST['data'];
		$fp = fopen('file.csv', 'w');

		foreach ($data as $key => $value) {
			fputcsv($fp, $value);
		}

		fclose($fp);
	}

	protected function getAuthorizationCode()
	{
		$params = [
			'response_type' => 'code',
			'client_id' => $this->linkedinConfig->apiKey,
			'scope' => $this->linkedinConfig->scope,
			'state' => uniqid('', true),
			'redirect_uri' => $this->linkedinConfig->redirectUrl
		];

		$url = $this->linkedinConfig->authenticationUrl . http_build_query($params);
		$this->session('state', $params['state']);
		$this->redirect($url);
	}

	protected function getAccessToken($code)
	{
		$params = [
			'grant_type' => 'authorization_code',
			'client_id' => $this->linkedinConfig->apiKey,
			'client_secret' => $this->linkedinConfig->apiSecret,
			'code' => $_GET['code'],
			'redirect_uri' => $this->linkedinConfig->redirectUrl
		];

		$url = $this->linkedinConfig->accessTokenUrl . http_build_query($params);
		
		$context = stream_context_create(['http' => ['method' => 'POST']]);
		$response = @file_get_contents($url, false, $context);

		$token = json_decode($response);

		$this->session('access_token', $token->access_token);
		$this->session('expires_in', $token->expires_in);
		$this->session('expires_at', time() + $_SESSION['expires_in']);
		
		return true;
	}
}