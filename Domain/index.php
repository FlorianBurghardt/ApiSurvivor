<?php
#region usings
declare(strict_types = 1);
namespace de\fburghardt\ApiSurvivor\Domain;

use de\fburghardt\ApiSurvivor\Application\Controller\StartUp;
use de\fburghardt\Library\Enum\StatusCode;
use de\fburghardt\Library\Exception\MyException;
use de\fburghardt\Library\Helper\ClassLoader;
#endregion
// exit();
#region bindings
require_once(__DIR__.'/../../Library/Helper/ClassLoader.php');
ClassLoader::instantiateClassloader();
#endregion
#region try
try
{
	$site = new StartUp();
}
#endregion
#region catch
catch (MyException | \Throwable $e)
{
	if (method_exists($e, 'getInnerCode'))
	{
		$_SERVER['errorCode'] = StatusCode::from($e->getCode());
		$_SERVER['innerErrorCode'] = $e->getInnerCode();
	}
	else
	{
		$_SERVER['errorCode'] = StatusCode::INTERNAL_SERVER_ERROR;
		$_SERVER['innerErrorCode'] = $e->getCode();
	}
	$_SERVER['errorMessage'] = $e->getMessage();

	header_remove();
	header("HTTP/1.1 ".$_SERVER['errorCode']->value. " ".$_SERVER['errorCode']->name);
	header("error_message: ".$_SERVER['errorMessage']);
	header("inner_error_code: ".$_SERVER['innerErrorCode']);

	include_once('exception.php');
	exit();
}
#endregion
?>