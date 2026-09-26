<?php
error_log('start------------------------------------');

function imagecopymerge_alpha(
	$dst_im,
	$src_im,
	$dst_x,
	$dst_y,
	$src_x,
	$src_y,
	$src_w,
	$src_h,
	$pct
) {
	$cut = imagecreatetruecolor($src_w, $src_h);
	imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h);
	imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h);
	imagecopymerge($dst_im, $cut, $dst_x, $dst_y, 0, 0, $src_w, $src_h, $pct);
}
function dropfile($name){
	error_log($name);
	if (is_file('./tmp/'.$name)) {
		unlink('./tmp/'.$name);
	}
}
function limitcheck()
{
	$files = scandir('./tmp/');
	usort($files, function($a, $b) {
		return filemtime('./tmp/'.$a) - filemtime('./tmp/'.$b);
	});
	
	//foreach ($files as $value) {
	//	error_log($value);
	//}

	$cnt=count($files);
	error_log($cnt);
	$lmt=3210;
	for($ii=0;$ii<($cnt-$lmt);$ii++){
		dropfile($files[$ii]);
	}
}
$key = $_GET["key"];
$postdata = file_get_contents("php://input");
$file = './tmp/' . $key . '.png';

ob_end_clean();
$gdimage = imagecreatefromstring($postdata);
$imgPlay = imagecreatefrompng('./theme/play500.png');
imagecopymerge_alpha(
	$gdimage,
	$imgPlay,
	0,
	0,
	0,
	0,
	500,
	500,
	100
);
imagepng($gdimage, $file);
$gdimage = null;
$imgPlay = null;
limitcheck();

//file_put_contents($file, $postdata);
echo $key;

error_log('done------------------------------------');
