<?php
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    $date = date("r");
    echo "test...";
    flush();
?>