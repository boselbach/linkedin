<?php

define('VIEWS', APPLICATION_PATH . 'app/views/');

class App
{
	public static function run($controller, $action)
	{
		try {
			$controller = "{$controller}Controller";
			
			if ($controller = new $controller()) {
				if ($controller->init()) {
					$controller->{$action}();	
				}
			}

		} catch (Exception $e) {
			echo $e->getMessage();
		}

	}

	public static function makeView($file)
	{
		$view = VIEWS . "{$file}.phtml";
		if (file_exists($view)) {
			include_once $view;
		}
	}
}