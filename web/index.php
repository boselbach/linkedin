<?php

define('PUBLIC_PATH', realpath(dirname(__FILE__)));
define('APPLICATION_PATH', PUBLIC_PATH . '/../');

set_include_path(
	implode(
		PATH_SEPARATOR, 
		[
			APPLICATION_PATH . '/app/',
			APPLICATION_PATH . '/app/controllers',
			get_include_path()
		]
	)
);

function __autoload($class) {
    include $class . '.php';
}

if (preg_match('/fetch/', $_SERVER['REQUEST_URI'])) {
	app::run('index', 'fetch');
}
elseif (preg_match('/export/', $_SERVER['REQUEST_URI'])) {
	app::run('index', 'export');
}
else {
	app::run('index', 'index');
}

