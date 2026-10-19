<?php
$title=$_GET["title"];
$bg=$_GET["bg"];
$txt=$_GET["txt"];
$postdata = file_get_contents("php://input");
$key=rand(12345678,92345678);
$file = '../share/'.$key.'.json';
file_put_contents($file, $postdata);
$encodedurl='https%3A%2F%2Fdaw1024.com%2Fshare%2F'.$key.'.html';

$html = <<<HTMLPREVIEW
<html>

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta charset="UTF-8">

	<meta name="twitter:card" content="summary" />
    <meta property="og:title" content="$title" />
    <meta property="og:url" content="https://daw1024.com/share/$key.html" />
    <meta property="og:image" content="https://daw1024.com/share/$key.png" />
    <meta property="og:description" content="Minium Studio project" />
    <meta property="og:site_name" content="Minium Studio" />

	<script type='text/javascript' src='../minium/js/tmploader.js'></script>
	
	<title>$title</title>
	<style>
		#sharingbuttonsio {
			position: absolute;
			width: 95%;
			bottom: 10px;
			text-align: center;
		}

		:root {
			--mode-colorFree: #cc33bb;
			--mode-colorAdv: #00aabb;
			--mode-color: #00aabb;
			--background-color: $bg;
			--text-color: $txt;
		}

		h1 {
			text-align: center;
		}

		

		body {
	
			background-color: var(--background-color);
			
			color: var(--text-color);
			
		}
		button {
	
			height:1cm;
			
		}

		#picDiv {
			text-align: center;
			width: 100%;
		}

		#picImg {
			text-align2: center;
			width1: 100%;
			width2: 7cm;
			margin-top2:0.005cm;
			border: 1px solid #66666633;
		}
	</style>

</head>

<body>
	
	<h1 id="labeltxt">$title</h1>
	<p id="picDiv">
		<img id='picImg' src="https://daw1024.com/share/$key.png" 
		width2=500px 
		height2=500px 
		onclick="starttmpload($key);" />
	</p>
	<div id="sharingbuttonsio">
		<div>
			<button onclick='starttmpload($key);'>▶ Play</button> <button onclick='starttmpshare($key);'>✉ Share</button>
		</div>
		<div>&nbsp;</div>
	</div>
	
</body>
</html>
HTMLPREVIEW;
$file = '../share/'.$key.'.html';
file_put_contents($file, $html);
echo $key;

