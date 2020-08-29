<?php
/*
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");


$fichero = 'gente.txt';
$rows_number = 13;
if( isset($_POST["pio"]) ){
	$data = trim($_POST["pio"]);
	if( substr_count($data, ',') % $rows_number == 0){
		file_put_contents($fichero, $data."\n", FILE_APPEND | LOCK_EX);
		echo $_POST["pio"];
	}else{
		echo "PHP is not running";
	}
}else{
	echo "PHP is running";
}
*/
?>