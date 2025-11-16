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
            $sql = 'select filename as filename from parsedfile limit 10 offset 12345;'; //' 'select count(*) from parsedfile123;';
            $result = $dbconnection->query($sql);
            if ($result) {
                echo "<p>Returned rows are: " . $result->num_rows . '</p>';
                echo '<ul>';
                while ($row = $result->fetch_assoc()) {
                    echo "<li>file: " . $row["filename"] . "</li>";
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
        <?php echo ('done2'); ?>
    </p>
</body>

</html>
