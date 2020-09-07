<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");

include('secret.inc');

$fichero = 'gente.txt';
$rows_number = 13;

$captcha = json_decode(file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$recaptcha_secret.'&response='.$_POST['response'].'&remoteip='.$_SERVER['REMOTE_ADDR']));
if ($captcha->success == false) {
    print_r(json_encode(array('status' => 'error', 'message' => 'No valid Captcha')));
	echo "PHP is running".$recaptcha_secret.":o";
} else {
    // Everything went ok...
	if( isset($_POST["pio"]) ){
		$data = trim($_POST["pio"]);
		if( substr_count($data, ',') % $rows_number == 0){
			file_put_contents($fichero, $data."\n", FILE_APPEND | LOCK_EX);
			echo $_POST["pio"];
		}else{
			echo "PHP is not running".$recaptcha_secret.":o";
		}
	}else{
		echo "PHP is running".$recaptcha_secret.":o";
	}
}




?>
