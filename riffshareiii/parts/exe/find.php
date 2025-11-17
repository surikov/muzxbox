<html>

<body>
	<h1>
		test
	</h1>
	<p>
		<?php echo ('start11'); ?>
	</p>

	<?php
	include('dbcfg/dbcfgdata.php');
	function shutDownFunction()
	{
		$error = error_get_last();
		// Fatal error, E_ERROR === 1
		if ($error['type'] === E_ERROR) {
			// Do your stuff
			echo '<p>ops ', error_get_last()['message'], '</p>';
		}
	}
	register_shutdown_function('shutDownFunction');



	try {
		echo '<p>start: ', $servername, ': ', $username, ': ', $password, ': ', $db, '</p>';
		$dbconnection = new mysqli($servername, $username, $password, $db);
		if ($dbconnection->connect_errno) {
			echo "<p>Failed to connect to MySQL: " . $mysqli->connect_error . '</p>';
			//exit();
		} else {
			echo '<p>connected: ', $servername, ': ', $username, ': ', $password, ': ', $db, '</p>';
			//$sql = 'select filename as filename from parsedfile limit 10 offset 12345;'; //' 'select count(*) from parsedfile123;';
			$limit = 10;
			$offset = intval($_GET["page"]);
			if ($offset < 0) {
				$offset = 0;
			}
			$pre1 = $offset - 1;
			$pre10 = $offset - 10;
			$pre100 = $offset - 100;
			$pre1000 = $offset - 1000;
			$next1 = $offset + 1;
			$next10 = $offset + 10;
			$next100 = $offset + 100;
			$next1000 = $offset + 1000;
			$sql = 'select'
				. '	parsedfile.filename as filename'
				. '	,music.title as title'
				. '	,artists.artist as artist'
				. '	,authors.name as author'
				. ' from parsedfile'
				. '	left join music on music.id=parsedfile.filename'
				. '	left join artists on music.artist=artists.id'
				. '	left join authors on music.author=authors.id'
				. ' limit ' . $limit . ' offset ' . ($limit * $offset) . ';';
			echo '<p>sql: ', $sql, '</p>';
			$result = $dbconnection->query($sql);
			if ($result) {
				echo "<p>Returned rows are: " . $result->num_rows . '</p>';
				echo '<ul>';
				while ($row = $result->fetch_assoc()) {
					echo "<li><a href='loader.html?url=https://mzxbox.ru/midi/midiru-archive-2022-02-25/music_files/" . $row["filename"] . ".mid&title="
						. str_replace('\'', '"', $row["title"]) . "'>"
						. $row["filename"] . ': ' . $row["title"] . ', ' . $row["artist"] . ' / ' . $row["author"]
						. "</a></li>";
				}
				echo '</ul>';
				// Free result set
				$result->free_result();
			} else {
				echo '<p>no rows returned</p>';
			}
			$dbconnection->close();
		}
	} catch (Exception $e) {
		echo '<p>Caught exception: ',  $e, '</p>';
	}
	?>

	<p>


<?php echo ' <a href="find.php?page=' . $pre1000 . '">&lt;1000</a>'; ?>
		<?php echo ' <a href="find.php?page=' . $pre100 . '">&lt;100</a>'; ?>
		<?php echo ' <a href="find.php?page=' . $pre10 . '">&lt;10</a>'; ?>
		<?php echo ' <a href="find.php?page=' . $pre1 . '">&lt;1</a>'; ?>
		<?php echo ' ', $offset; ?>
		<?php echo ' <a href="find.php?page=' . $next1 . '">1&gt;</a>'; ?>
		<?php echo ' <a href="find.php?page=' . $next10 . '">10&gt;</a>'; ?>
		<?php echo ' <a href="find.php?page=' . $next100 . '">100&gt;</a>'; ?>
<?php echo ' <a href="find.php?page=' . $next1000 . '">1000&gt;</a>'; ?>
	</p>
</body>

</html>