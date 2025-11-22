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
			let what = prompt("Поиск", "<?php echo ($find); ?>");
			if (what != null) {
				console.log('what', what);
				let url = 'midiru.php?find=' + what;
				window.location = url;
			}
		}
	</script>
	<div class="pagediv>">
		<div class="headerbox">
			<a href="zdbgfsgfbsbgf">
				<div class="pageheader">
					<div> Архив MIDI𝄞ru</div>
				</div>
			</a>
			<a href="javascript:findprompt();">
				<div class="zoomicon">🔍</div>
			</a>
		</div>
		<div class="navigationdiv">
			<div class="naviline">
				<?php
				$where = "";
				if (!empty($find)) {
					$where = " where music.title like '%" . $find . "%'";
				}
				$sql = "select count(*) as cnt from parsedfile left join music on music.id=parsedfile.filename"	. $where . ";";
				//echo $find;
				$countresult = $dbconnection->query($sql);
				$countrow = $countresult->fetch_assoc();
				$pagecount = ceil(intval($countrow["cnt"]) / $limit);
				$stepsize = $pagecount / $steps;
				for ($ii = 0; $ii < $steps; $ii++) {
					$linkoffset = floor($ii * $stepsize);
					if ($linkoffset >= $offset && $linkoffset < $offset+$stepsize) {
				?>
						<div class="posisegment"></div>
					<?php
					} else {
						$pageurl = "midiru.php?page=" . $linkoffset . "&find=" . $find;
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
					$preoffset = "midiru.php?page=" . ($offset - 1) . "&find=" . $find;
				?>
					<a href="<?php echo ($preoffset) ?>">
						<div class="gopage">&nbsp;&nbsp;&nbsp;🠜</div>
					</a>
				<?php
				} else {
				?>
					<div class="gopage">&nbsp;&nbsp;&nbsp;🠜</div>
				<?php
				}
				?>
				<div class="curpage">
					<nobr>&nbsp;&nbsp;&nbsp;<?php echo ('' . ($offset + 1)); ?>&nbsp;&nbsp;&nbsp;</nobr>
				</div>

				<?php
				if ($offset < $pagecount) {
					$nextoffset = "midiru.php?page=" . ($offset + 1) . "&find=" . $find;
				?>
					<a href="<?php echo ($nextoffset) ?>">
						<div class="gopage">🠞&nbsp;&nbsp;&nbsp;</div>
					</a>
				<?php
				} else {
				?>
					<div class="gopage">🠞&nbsp;&nbsp;&nbsp;</div>
				<?php
				}
				?>
			</div>
		</div>
		<div class="itemslist">
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
					$sql = $sql . $where;
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