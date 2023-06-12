<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: X-Requested-With");

include './secret.inc';

$fichero = 'gente.txt';
$rows_number = 13;

// Build POST request to get the reCAPTCHA v3 score from Google
$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
#$recaptcha_secret = 'included'; // Insert your secret key here
$recaptcha_response = $_POST['recaptcha_response'];

// Make the POST request
$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);

$recaptcha = json_decode($recaptcha);
// Take action based on the score returned
if ($recaptcha->success == true && $recaptcha->score >= 0.5 && $recaptcha->action == 'submit') {
   // This is a human. Insert the message into database OR send a mail
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
   // Score less than 0.5 indicates suspicious activity. Return an error
   echo "Something went wrong. Please try again later";
}




?>
