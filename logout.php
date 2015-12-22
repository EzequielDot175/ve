<?php

ob_start();
require_once('../core_nufarm/libs.php');

	session_start();
	session_destroy();

	if (isset($_GET['type'])) {
		header('Location: /control');
	}else{
		header('Location: /');
	}


