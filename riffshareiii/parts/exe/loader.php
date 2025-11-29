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
			<a href="javascript:history.back()">
				<div class="pageheader">
					<div> &lt;&lt; назад</div>
				</div>
			</a>
			<div>
				&nbsp;
			</div>
		</div>

		<div class="itemslist">
			<div class="fileinfo">
				<div class='fileplay'>
					<a href='javascript:startload();'><img class='buttonplay' src="theme/img/buttonplay.png" /></a>
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
							. '		,music.note as note'
							//. '		,music.average_rate as rate'
							. '		,music.date as date'
							. '		,music.desc as mudesc'
							. '		,left(music.lyrics,40) as lyrics'
							. '		,artists.artist as artist'
							. '		,artists.id as artistid'
							. '		,authors.name as author'
							. '		,authors.id as authorsid'
							. '		,authors.city as acity'
							. '		,authors.url as aurl'

							. '		,authors.hw as ahw'
							. '		,statuses.status as astatus'
							. '		,types.type as mutype'
							. '		,standards.standard as mustandard'
							. ' from parsedfile'
							. '		left join music on music.id=parsedfile.filename'
							. '		left join artists on music.artist=artists.id'
							. '		left join authors on music.author=authors.id'
							. '		left join statuses on authors.status=statuses.id'
							. '		left join types on music.type=types.id'
							. '		left join standards on music.standard=standards.id'
							. '		where parsedfile.filename="' . $file . '";';
						$result = $dbconnection->query($sql);

						if ($result) {
							$row = $result->fetch_assoc();
							//$murate = intval($row["rate"]);
					?>
							<p>
								<?php
								echo ($row["date"]);
								/*echo " ".$murate;
								for ($ii = 0; $ii < $murate; $ii++) {
									echo "+";
								}
								for ($ii = $murate; $ii < 6; $ii++) {
									echo "-";
								}*/
								?>
							</p>
							<h2><?php echo ($row["title"]); ?></h2>
							<p>тип: <?php echo ($row["mutype"]); ?></p>
							<p>инструмент: <?php echo ($row["mustandard"]); ?></p>
							<p><?php echo (songduration04label($row["songduration"])); ?>,
								<?php echo (avgtempo02label($row["avgtempo"])); ?>,
								бас <?php echo (10 * intval($row["bass"])); ?>%,
								аккорды <?php echo (30 * intval($row["chords"])); ?>%,
								ударных <?php echo (30 * intval($row["drums"])); ?>%
							</p>
							<p><?php echo ($row["note"]); ?></p>
							<p><?php echo ($row["mudesc"]); ?></p>
							<p><a class='linkinfo' href="lyrics.php?file=<?php echo $file; ?>"><?php echo ($row["lyrics"]); ?></a>...</p>
							<p><a class='linkinfo' href="artist?file=<?php echo $file; ?>">раздел: <?php echo ($row["artist"]); ?></a></p>
							<p><a class='linkinfo' href="author.php?author=<?php echo ($row["authorsid"]); ?>">автор: <?php echo ($row["astatus"]); ?> <?php echo ($row["author"]); ?></a></p>
							<p><a class='linkinfo' href="city?file=<?php echo $file; ?>">город: <?php echo ($row["acity"]); ?></a></p>



					<?php
							$result->close();
						}
					} catch (Exception $e) {
						echo '<p>Caught exception: ',  $e, '</p>';
					}
					?>
				</div>
			</div>
			<div class="itemslist">
				<div class="itemscolumn">
					<?php
					$sql = 'select'
						. ' 	comments.date as date'
						. ' 	,comments.comment as comment'
						. ' 	,comments.reply as reply'
						. ' 	,comments.id_author as name'
						. '		,authors.id as authorsid'
						. ' 	,authors.name'
						. ' from comments '
						. ' 	join authors on authors.id=comments.id_author '
						. ' where id_music=' . $file
						. ' order by date,comments.id';
					$result = $dbconnection->query($sql);

					if ($result) {
						while ($row = $result->fetch_assoc()) {
					?>
							<div class="itemsmallline">
								<?php echo ($row["date"]); ?><a class='linkinfo' href="author.php?author=<?php echo ($row["authorsid"]); ?>">: <?php echo ($row["name"]); ?>
									<br /><?php echo ($row["comment"]); ?>
								</a>
								<br />- <i><?php echo ($row["reply"]); ?></i>
							</div>
					<?php
						}
						$result->close();
					}
					$dbconnection->close();
					?>
				</div>
			</div>
		</div>

		<div>
			<a href="midiru.php">
				<div class="pageheader">
					<div> Архив MIDI𝄞ru</div>
				</div>
			</a>
		</div>
	</div>
</body>

</html>