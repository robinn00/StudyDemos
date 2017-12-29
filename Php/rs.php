<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 9:42
 */
header("content-type:text/html;charset=utf-8");
$fname = $_REQUEST['fname'];
$fpws = $_REQUEST['fpws'];

echo 'UNAME: '.$fname;
echo "<br>";
echo 'UPWS: '.$fpws;
?>