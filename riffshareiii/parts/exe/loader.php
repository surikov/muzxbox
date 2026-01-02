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
							$info = $row["mudesc"];
							$info = str_replace("\n", "<br/>", $info);
							$info = str_replace("\r", "<br/>", $info);
							$info = str_replace("<br/><br/>", "<br/>", $info);
							$munote = $row["note"];
							$munote = str_replace("\n", "<br/>", $munote);
							$munote = str_replace("\r", "<br/>", $munote);
							$munote = str_replace("<br/><br/>", "<br/>", $munote);
							$fileurl='../midi/midiru-archive-2022-02-25/music_files/'.$file.'.mid';
					?>

							<p><?php echo ($row["date"]); ?></p>
							<h2><?php echo ($row["title"]); ?></h2>
							<p><a class='linkinfo' href="midiru.php?artist=<?php echo ($row["artistid"]); ?>"><?php echo ($row["artist"]); ?></a></p>
							<p>тип: <?php echo ($row["mutype"]); ?></p>
							<p>инструмент: <?php echo ($row["mustandard"]); ?></p>
							<p><a class='linkinfo' href="midiru.php?duration=<?php echo ($row["songduration"]); ?>">размер: <?php echo (songduration04label($row["songduration"])); ?></a></p>
							<p><a class='linkinfo' href="midiru.php?tempo=<?php echo ($row["avgtempo"]); ?>">темп: <?php echo (avgtempo02label($row["avgtempo"])); ?></a></p>
							<p><a class='linkinfo' href="midiru.php?bass=<?php echo ($row["bass"]); ?>">бас: <?php echo (10 * intval($row["bass"])); ?>%</a></p>
							<p><a class='linkinfo' href="midiru.php?chords=<?php echo ($row["chords"]); ?>">аккорды: <?php echo (30 * intval($row["chords"])); ?>%</a></p>
							<p><a class='linkinfo' href="midiru.php?drums=<?php echo ($row["drums"]); ?>">ударные: <?php echo (30 * intval($row["drums"])); ?>%</a></p>
							<p><?php echo ($munote); ?></p>
							<p><?php echo ($info); ?></p>


							<p><a class='linkinfo' href="author.php?author=<?php echo ($row["authorsid"]); ?>">автор: <?php echo ($row["astatus"]); ?> <?php echo ($row["author"]); ?></a></p>
							<p>город: <?php echo ($row["acity"]); ?></p>

							<p><a class='linkinfo' href="lyrics.php?file=<?php echo $file; ?>"><?php echo ($row["lyrics"]); ?></a>...</p>
							<p><a class='linkinfo' href="<?php echo $fileurl; ?>">скачать</a></p>


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