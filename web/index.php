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
	App::run('Index', 'fetch');
}
elseif (preg_match('/export/', $_SERVER['REQUEST_URI'])) {
	App::run('Index', 'export');
}
else {
	App::run('Index', 'index');
}