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
	<script language="javascript">
		function findprompt() {
			let what = prompt("Поиск по тексту", "<?php echo ($find); ?>");
			if (what != null) {
				console.log('what', what);
				let url = 'midiru.php?find=' + what;
				window.location = url;
			}
		}
	</script>
	<div class="pagediv>">
		<div class="headerbox">
			<a href="midiru.php">
				<div class="pageheader">
					<div> Архив MIDI𝄞ru</div>
				</div>
			</a>
			<div>
				<a href="javascript:findprompt();">
					<nobr><span class="zoomicon">🔍</span></nobr>
				</a>
			</div>
		</div>
		<div class="navigationdiv">
			<div class="naviline">
				<?php
				$listtitle = '';
				$where = "";
				$selection = '';
				if (!empty($find)) {
					$listtitle = 'поиск: '.$find;
					$selection = "&find=" . $find;
					$where = " where music.title like '%" . $find
						. "%' or artists.artist like '%" . $find
						. "%' or authors.name like '%" . $find
						. "%' or authors.city like '%" . $find . "%'";
				}
				if ($author >= 0) {
					$listtitle = 'автор: ' . $author;
					$selection = "&author=" . $author;
					$where = " where authors.id=" . $author;
					try {
						$sql = "select name as name from authors where id=" . $author;
						$result = $dbconnection->query($sql);
						if ($result) {
							$row = $result->fetch_assoc();
							$listtitle = 'автор: ' . $row["name"];
							$result->close();
						}
					} catch (Exception $e) {
						echo '<p>Caught exception: ',  $e, '</p>';
					}
				}
				if ($artist >= 0) {
					$listtitle = 'раздел: ' . $artist;
					$selection = "&artist=" . $artist;
					$where = " where artists.id=" . $artist;
					try {
						$sql = "select artist as name from artists where id=" . $artist;
						$result = $dbconnection->query($sql);
						if ($result) {
							$row = $result->fetch_assoc();
							$listtitle = 'раздел: ' . $row["name"];
							$result->close();
						}
					} catch (Exception $e) {
						echo '<p>Caught exception: ',  $e, '</p>';
					}
				}
				$sql = "select count(*) as cnt"
					. " from parsedfile"
					. "		left join music on music.id=parsedfile.filename"
					. "		left join artists on music.artist=artists.id"
					. "		left join authors on music.author=authors.id"
					. '		left join statuses on authors.status=statuses.id'
					. $where . ";";
				//echo $find;
				$countresult = $dbconnection->query($sql);
				$countrow = $countresult->fetch_assoc();
				$pagecount = ceil(intval($countrow["cnt"]) / $limit);
				$stepsize = $pagecount / $steps;
				for ($ii = 0; $ii < $steps; $ii++) {
					$linkoffset = floor($ii * $stepsize);
					if ($linkoffset >= $offset && $linkoffset < ceil($offset + $stepsize)) {
				?>
						<div class="posisegment"></div>
					<?php
					} else {
						$pageurl = "midiru.php?page=" . $linkoffset . $selection;
					?>
						<a href="<?php echo ($pageurl) ?>">
							<div class="navsegment"></div>
						</a>
				<?php
					}
				}
				?>
			</div>
			<div class="pagenum">
				<?php
				if ($offset > 0) {
					$preoffset = "midiru.php?page=" . ($offset - 1) . $selection;
				?>
					<a href="<?php echo ($preoffset) ?>">
						<div class="gopage">&nbsp;&nbsp;&nbsp;&lt;&lt;</div>
					</a>
				<?php
				} else {
				?>
					<div class="gopage">&nbsp;&nbsp;&nbsp;&lt;&lt;</div>
				<?php
				}
				?>
				<div class="curpage"> &nbsp;&nbsp;&nbsp;<?php echo ('' . ($offset + 1)); ?>&nbsp;&nbsp;&nbsp; </div>

				<?php
				if ($offset < $pagecount) {
					$nextoffset = "midiru.php?page=" . ($offset + 1) . $selection;
				?>
					<a href="<?php echo ($nextoffset) ?>">
						<div class="gopage">&gt;&gt;&nbsp;&nbsp;&nbsp;</div>
					</a>
				<?php
				} else {
				?>
					<div class="gopage">&gt;&gt;&nbsp;&nbsp;&nbsp;</div>
				<?php
				}
				?>
			</div>
		</div>
		<div class="itemslist">
			<div class="itemscolumn">
				<?php
				if (! empty($listtitle)) {
				?>
					<div class='listtitle'><a href='midiru.php'>[x] <?php echo ($listtitle); ?></a></div>
					<?php
				}
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
						. '		,music.comments_count as ccnt'
						. '		,artists.artist as artist'
						. '		,artists.id as artistid'
						. '		,authors.name as author'
						. '		,authors.id as authorsid'
						. '		,authors.city as acity'
						. '		,statuses.status as astatus'
						. ' from parsedfile'
						. '		left join music on music.id=parsedfile.filename'
						. '		left join artists on music.artist=artists.id'
						. '		left join authors on music.author=authors.id'
						. '		left join statuses on authors.status=statuses.id';
					$sql = $sql . $where;
					$sql = $sql . '	order by music.date,music.title';
					$sql = $sql . ' limit ' . $limit . ' offset ' . ($limit * $offset) . ';';
					$result = $dbconnection->query($sql);
					if ($result) {
						while ($row = $result->fetch_assoc()) {
							$safetitle = $row["title"];
							$safetitle = str_replace('"', "", $safetitle);
							$safetitle = str_replace('"', "", $safetitle);

							$songurl =
								"loader.php?file="
								. $row["filename"]
								. "&url=https://mzxbox.ru/midi/midiru-archive-2022-02-25/music_files/"
								. $row["filename"]
								. ".mid&title="
								. $safetitle;
							$ccnt = intval($row["ccnt"]);
							$star = '';
							if ($ccnt > 0) {
								$star = '☆';
							}
							if ($ccnt > 5) {
								$star = '☆☆';
							}
							if ($ccnt > 22) {
								$star = '☆☆☆';
							}
					?>
							<a href="<?php echo ($songurl) ?>" class="itemrow">
								<div class="singleitem"><?php echo ($star . ' ' . markWhat($row["title"], $find)); ?>
									<br /><span class="itemsmallinfo"><?php echo ($row["date"]); ?>, <?php echo ($row["astatus"]); ?> <?php echo (markWhat($row["author"], $find)); ?> / <?php echo (markWhat($row["acity"], $find)); ?>, <?php echo (markWhat($row["artist"], $find)); ?></span>
									<br /><span class="itemsmallinfo"><?php echo (songduration04label($row["songduration"])); ?>, <?php echo (avgtempo02label($row["avgtempo"])); ?>, бас <?php echo (10 * intval($row["bass"])); ?>%, аккорды <?php echo (30 * intval($row["chords"])); ?>%, ударных <?php echo (30 * intval($row["drums"])); ?>%</span>
								</div>
							</a>
				<?php
						}
						$result->close();
					}
					$dbconnection->close();
				} catch (Exception $e) {
					echo '<p>Caught exception: ',  $e, '</p>';
				}
				?>
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