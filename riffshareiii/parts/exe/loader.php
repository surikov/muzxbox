<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
	<link rel="stylesheet" type="text/css" href="theme/midiru.css">
	<script type='text/javascript' src='./js/mzxbxlib.js'></script>
	<script type='text/javascript' src='./js/doload.js'></script>
	<title>MIDI.ru Archive</title>
</head>

<body>

	<?php
	try {
		include('connect.php');
	} catch (Exception $e) {
		echo '<p>Caught exception: ',  $e, '</p>';
	}
	?>

	<div class="pagediv>">
		<div class="headerbox">
			<a href="zdbgfsgfbsbgf">
				<div class="pageheader">
					<div> Архив MIDI𝄞ru11</div>
				</div>
			</a>
			<div>
				&nbsp;
			</div>
		</div>

		<div class="itemslist">
			<div class="fileinfo">
				<div class='fileplay'>
					<img class='buttonplay' src="theme/img/buttonplay.png" onclick='startload();' />
				</div>
				<div class="fileinforows">
					<?php
					try {
						$sql = 'select'
							. '		parsedfile.filename as filename'
							. '		,parsedfile.avgtempo as avgtempo'
							. '		,parsedfile.songduration as songduration'
							. '		,parsedfile.bass as bass'
							. '		,parsedfile.chords as chords'
							. '		,parsedfile.drums as drums'
							. '		,music.title as title'
							. '		,music.date as date'
							. '		,artists.artist as artist'
							. '		,artists.id as artistid'
							. '		,authors.name as author'
							. '		,authors.id as authorsid'
							. '		,authors.city as acity'
							. '		,authors.url as aurl'
							. '		,authors.desc as adesc'
							. '		,authors.hw as ahw'
							. '		,statuses.status as astatus'
							. ' from parsedfile'
							. '		left join music on music.id=parsedfile.filename'
							. '		left join artists on music.artist=artists.id'
							. '		left join authors on music.author=authors.id'
							. '		left join statuses on authors.status=statuses.id'
							. '		where parsedfile.filename="' . $file . '";';
						$result = $dbconnection->query($sql);
						if ($result) {
							$row = $result->fetch_assoc();
					?>
							<p><b><?php echo ($row["title"]); ?></b></p>
							<p>раздел: <?php echo ($row["artist"]); ?></p>
							<p><?php echo ($row["author"]); ?>
								<br /><?php echo ($row["aurl"]); ?>
								<br /><?php echo ($row["adesc"]); ?>
								<br />hardware: <?php echo ($row["ahw"]); ?>
								<br />статус: <?php echo ($row["astatus"]); ?>
							</p>
							<p>город: <?php echo ($row["acity"]); ?></p>
							<p><?php echo ($row["date"]); ?></p>
							<p><?php echo (songduration04label($row["songduration"])); ?>,
							<?php echo (avgtempo02label($row["avgtempo"])); ?>,
							бас <?php echo (10 * intval($row["bass"])); ?>%,
							аккорды <?php echo (30 * intval($row["chords"])); ?>%,
							ударных <?php echo (30 * intval($row["drums"])); ?>%

					<?php
						}
					} catch (Exception $e) {
						echo '<p>Caught exception: ',  $e, '</p>';
					}
					?>
				</div>
			</div>
		</div>
		<div>
			<a href="zdbgfsgfbsbgf">
				<div class="pageheader">
					<div> Архив MIDI𝄞ru</div>
				</div>
			</a>
		</div>
	</div>
</body>

</html>