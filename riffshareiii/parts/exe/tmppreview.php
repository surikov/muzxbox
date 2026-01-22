<?php
$key=$_GET["key"];
$postdata = file_get_contents("php://input");
$file = './tmp/'.$key.'.png';
file_put_contents($file, $postdata);
echo $key;

