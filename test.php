<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");

include('secret.inc');

$fichero = 'gente.txt';
$rows_number = 13;

if (isset($_POST['action']) && ($_POST['action'] == 'process')) {

	$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'; 
	#$recaptcha_secret = 'En secret.inc (no incluido)'; 
	$recaptcha_response = $_POST['recaptcha_response']; 
	$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response); 
	$recaptcha = json_decode($recaptcha); 




	if($recaptcha->score >= 0.7){

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

	} else {

	  echo "Deshonra tu oveja";

	}

}




?>
