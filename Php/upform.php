<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 11:12
 */
session_start();
$_SESSION["num"] = 1;
setcookie("user","DOXDOX",time()+60*60);
setcookie("upws","654789",time()+60*60);
echo "
<form name='upform' id='upform' action='upfile.php' method='post' enctype='multipart/form-data'>
file:<input type='file' name='mf' id='mf' value=''/>
<input type='submit' name='submit' id='submit' value='submit'/>
</form>
";