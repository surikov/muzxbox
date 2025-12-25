<?php
$link = $_GET['img'];
$url = urldecode($link);
//header('Content-Type: image/png');
$ok = -3;
$ok = readfile($url);
if ($ok) {
} else {
}
//echo "url " . $url;
echo "ok ".$ok;
echo "\nexit";
exit;
