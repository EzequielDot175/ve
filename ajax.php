<?php 
	require_once('../core_nufarm/libs.php');

	Ajax::Angular();

	Utils::POST('vendedor_estrella',function(){
		Ajax::call($_POST['method']);
	});


 ?>