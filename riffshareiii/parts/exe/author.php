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
                            . '		authors.name as author'
                            . '		,authors.id as authorsid'
                            . '		,authors.city as acity'
                            . '		,authors.url as aurl'
                            . '		,authors.hw as ahw'
                            . '		,authors.desc as aesc'
                            . '		,authors.music_count as acnt'
                            . '		,statuses.status as astatus'
                            . ' from authors'
                            . '		left join statuses on authors.status=statuses.id'
                            . '		where authors.id=' . $author . ';';

                        $result = $dbconnection->query($sql);

                        if ($result) {
                            $row = $result->fetch_assoc();
                            $info = $row["aesc"];
                            $info = str_replace("\n", "<br/>", $info);
                            $info = str_replace("\r", "<br/>", $info);
                            $info = str_replace("<br/><br/>", "<br/>", $info);
                    ?>
                            <p>статус: <?php echo ($row["astatus"]); ?></p>
                            <h2><?php echo ($row["author"]); ?></h2>
                            <p>город: <?php echo ($row["acity"]); ?></p>
                            <p>URL: <?php echo ($row["aurl"]); ?></p>
                            <p>оборудование: <?php echo ($row["hw"]); ?></p>
                            <?php
                            if (intval($row["acnt"]) > 0) {
                            ?>
                                <p><a class='linkinfo' href='midiru.php?author=<?php echo ($author); ?>'>всего файлов: <?php echo ($row["acnt"]); ?></a></p>
                            <?php
                            } else {
                            ?>
                                <p>нет файлов</p>
                            <?php
                            }
                            ?>
                </div>
            </div>
            <div class="itemslist">
                <div class="itemscolumn">
                    <div class="itemsmallinfo"><?php echo ($info); ?><br />&nbsp;</div>
                </div>
            </div>
    <?php
                            $result->close();
                        }
                        $dbconnection->close();
                    } catch (Exception $e) {
                        echo '<p>Caught exception: ',  $e, '</p>';
                    }
    ?>
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