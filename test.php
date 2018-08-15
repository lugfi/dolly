<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");


$fichero = 'gente.txt';
if( isset($_POST["pio"]) ){
	file_put_contents($fichero, trim($_POST["pio"])."\n", FILE_APPEND | LOCK_EX);
	echo $_POST["pio"];
}else{
	echo "PHP is running";
}
?>
