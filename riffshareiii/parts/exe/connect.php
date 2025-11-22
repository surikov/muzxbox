<?php
include('dbcfg/dbcfgdata.php');
function shutDownFunction()
{
	$error = error_get_last();
	if ($error['type'] === E_ERROR) {
		echo '<p>ops ', error_get_last()['message'], '</p>';
	}
}
register_shutdown_function('shutDownFunction');
$limit = 15;
$steps = 100;
$offset = intval($_GET["page"]);
$find = $_GET["find"];
$find = trim(str_replace(array("'", "\"", "%", "&", "<", ">"), "", $find));
$dbconnection = new mysqli($servername, $username, $password, $db);
if ($dbconnection->connect_errno) {
	echo "<p>Failed to connect to MySQL: " . $mysqli->connect_error . '</p>';
}
