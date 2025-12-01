<?php
include('dbcfg/dbcfgdata.php');
function shutDownFunction()
{
	$error = error_get_last();
	if (!empty($error)) {
		if ($error['type'] === E_ERROR) {
			echo '<p>on shutdown: ', error_get_last()['message'], '</p>';
		}
	}
}
function getVarOrSpace($name)
{
	if (empty($_GET[$name])) {
		return '';
	} else {
		return $_GET[$name];
	}
}
function getIntOrNegative($name)
{
	if (array_key_exists($name, $_GET)) {
		if (strlen($_GET[$name]) > 0) {
			return intval($_GET[$name]);
		}
	}
	return -1;
}
register_shutdown_function('shutDownFunction');
$limit = 15;
$steps = 100;
$author=getIntOrNegative('author');
$tempo=getIntOrNegative('tempo');
$duration=getIntOrNegative('duration');
$bass=getIntOrNegative('bass');
$chords=getIntOrNegative('chords');
$drums=getIntOrNegative('drums');
$artist=getIntOrNegative('artist');
$offset = intval(getVarOrSpace("page"));
$file = intval(getVarOrSpace("file"));
$find = getVarOrSpace("find");
$find = trim(str_replace(array("'", "\"", "%", "&", "<", ">"), "", $find));
$dbconnection = new mysqli($servername, $username, $password, $db);
if ($dbconnection->connect_errno) {
	echo "<p>Failed to connect to MySQL: " . $mysqli->connect_error . '</p>';
}
function markWhat($txt, $find)
{
	if (empty($find)) {
		return $txt;
	} else {
		$start = strpos(mb_strtolower($txt), mb_strtolower($find));
		if ($start === false) {
			return $txt;
		} else {
			$begin = substr($txt, 0, $start);
			$found = substr($txt, $start, strlen($find));
			$end = substr($txt, strlen($begin) + strlen($find));
			$res = $begin . '<b>' . $found . '</b>' . $end;
			return $res;
		}
	}
}
function songduration04label($txt)
{
	if ('' . $txt == '0') {
		return 'фрагмент';
	} else {
		if ('' . $txt == '1') {
			return 'короткая';
		} else {
			if ('' . $txt == '2') {
				return 'не длинная';
			} else {
				if ('' . $txt == '3') {
					return 'длинная';
				} else {
					if ('' . $txt == '4') {
						return 'продолжительная';
					} else {
						return $txt;
					}
				}
			}
		}
	}
}
function avgtempo02label($txt)
{
	if ('' . $txt == '0') {
		return 'очень медленная';
	} else {
		if ('' . $txt == '1') {
			return 'медленная';
		} else {
			if ('' . $txt == '2') {
				return 'ритмичная';
			} else {
				if ('' . $txt == '3') {
					return 'быстрая';
				} else {
					if ('' . $txt == '4') {
						return 'очень быстрая';
					} else {
						return $txt;
					}
				}
			}
		}
	}
}
