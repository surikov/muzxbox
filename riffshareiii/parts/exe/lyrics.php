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
                <div class="fileinforows">
                    <?php
                    try {
                        $sql = 'select'
                            . '		parsedfile.filename as filename'
                           
                            . '		,music.title as title'
                            
                            . '		,music.lyrics as lyrics'
                            
                            . ' from parsedfile'
                            . '		left join music on music.id=parsedfile.filename'
                            . '		where parsedfile.filename="' . $file . '";';
                        $result = $dbconnection->query($sql);

                        if ($result) {
                            $row = $result->fetch_assoc();
                    ?>
                         
                            <h2><?php echo ($row["title"]); ?></h2>
                            <pre><?php echo ($row["lyrics"]); ?></pre>



                    <?php
                            $result->close();
                            $dbconnection->close();
                        }
                    } catch (Exception $e) {
                        echo '<p>Caught exception: ',  $e, '</p>';
                    }
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