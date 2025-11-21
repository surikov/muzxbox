<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no" />
	<link rel="stylesheet" type="text/css" href="theme/midiru.css">
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
		<a href="zdbgfsgfbsbgf">
			<div class="pageheader"><span class="homelink">🠜</span> Архив MIDI𝄞ru</div>
		</a>
		<div class="itemslist">
			<h1>Музыка</h1>
			<div class="itemscolumn">
				<?php
				try {
					$sql = 'select'
						. '		parsedfile.filename as filename'
						. '		,music.title as title'
						. '		,music.date as date'
						. '		,artists.artist as artist'
						. '		,artists.id as artistid'
						. '		,authors.name as author'
						. '		,authors.id as authorsid'
						. '		,authors.city as acity'
						. ' from parsedfile'
						. '		left join music on music.id=parsedfile.filename'
						. '		left join artists on music.artist=artists.id'
						. '		left join authors on music.author=authors.id';
					$sql = $sql . '	order by music.date,music.title';
					$sql = $sql . ' limit ' . $limit . ' offset ' . ($limit * $offset) . ';';
					$result = $dbconnection->query($sql);
					if ($result) {
						while ($row = $result->fetch_assoc()) {
							$songurl = "loader.html?url=https://mzxbox.ru/midi/midiru-archive-2022-02-25/music_files/"
								. $row["filename"]
								. ".mid&title="
								. str_replace('\'', '"', $row["title"]);
				?>
							<a href="<?php echo ($songurl) ?>" class="itemrow">
								<div class="singleitem"><?php echo ($row["title"]); ?>
									<br /><span class="itemsmallinfo"><?php echo ($row["date"]); ?>, <?php echo ($row["author"]); ?> / <?php echo ($row["acity"]); ?>, <?php echo ($row["artist"]); ?></span>
									<br /><span class="itemsmallinfo">короткая, гитары, много ударных</span>
								</div>
							</a>
				<?php
						}
					}
				} catch (Exception $e) {
					echo '<p>Caught exception: ',  $e, '</p>';
				}
				?>
			</div>
		</div>
		<div class="navigationdiv">
			<div class="naviline">
				<?php
				$countresult = $dbconnection->query("select count(*) as cnt from parsedfile;");
				$countrow = $countresult->fetch_assoc();
				$pagecount = ceil(intval($countrow["cnt"]) / $limit);
				for ($ii = 0; $ii < 100; $ii++) {
					$linkoffset = floor($ii * $pagecount / 100);
					$startsegment = $offset;
					$endsegment = $offset + $pagecount / 100;
					if ($linkoffset >= $startsegment && $linkoffset <= $endsegment) {
				?>
						<a href="<?php echo ($pageurl) ?>">
							<div class="posisegment"></div>
						</a>
					<?php
					} else {
						$pageurl = "midiru.php?page=" . $linkoffset;
					?>
						<a href="<?php echo ($pageurl) ?>">
							<div class="navsegment"></div>
						</a>
				<?php
					}
				}
				?>
				<!--
				<a href="find.php">
					<div class="navsegment"></div>
				</a>
				<a href="find.php">
					<div class="navsegment"></div>
				</a>
				<a href="find.php">
					<div class="posisegment"></div>
				</a>
				<a href="find.php">
					<div class="posisegment"></div>
				</a>
				<a href="find.php">
					<div class="navsegment"></div>
				</a>
				-->
			</div>
			<div class="pagenum">
				<?php
				if ($offset > 0) {
					$preoffset = "midiru.php?page=" . ($offset - 1);
				?>
					<div class="gopage"><a href="<?php echo ($preoffset) ?>">🠜</a></div>
				<?php
				} else {
				?>
					<div class="gopage">🠜</div>
				<?php
				}
				?>
				<div class="curpage"><?php echo ($offset); ?></div>

				<?php
				if ($offset < $pagecount) {
					$nextoffset = "midiru.php?page=" . ($offset + 1);
				?>
					<div class="gopage"><a href="<?php echo ($nextoffset) ?>">🠞</a></div>
				<?php
				} else {
				?>
					<div class="gopage">🠞</div>
				<?php
				}
				?>
			</div>
		</div>
	</div>
</body>

</html>