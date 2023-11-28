<?php
namespace de\fburghardt\ApiSurvivor\Domain;

$errorCode = $_SERVER['errorCode'];
$errorMessage = $_SERVER['errorMessage'];
$innerCode = $_SERVER['innerErrorCode'];

unset($_SERVER['errorMessage']);
unset($_SERVER['errorCode']);
unset($_SERVER['innerErrorCode']);
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $errorCode->value." ".$errorCode->name; ?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="author" content="Florian Burghardt">
		<meta name="creator" content="Florian Burghardt">
		<link rel="icon" type="image/JPG" href="https://apisurvivor.fburghardt.de/img/favicon.png">
		<link rel="stylesheet" type="text/css" href="https://apisurvivor.fburghardt.de/css/custom.css">	
	</head>
	<body>
		<?php
			echo '<h1 class="exception"><u>'.
				$errorCode->value." ".
				$errorCode->name.'</u></h1>';
			if (isset($innerCode) && $innerCode != 0)
			{
				echo '<h2 class="exception"><u>Inner Exception Code:</u></h2>';
				echo '<h3 class="exception exceptionContent">'.$innerCode.'</h3>';
			}
			if (isset($errorMessage))
			{
				echo '<h2 class="exception"><u>Exception Message:</u></h2>';
				echo '<h3 class="exception exceptionContent">'.$errorMessage.'</h3>';
			}
		?>
		<div class="exception">
			<img src="https://apisurvivor.fburghardt.de/img/exception.png" alt="Exception" class="exception"/>
		</div>
	</body>
</html>