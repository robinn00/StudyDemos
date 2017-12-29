<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/22
 * Time: 16:05
 */
namespace dox\doxs;
header("content-type:text/html;charset=utf-8");
require "Person.php";

define("dox_dox","===112124==");

const sx = "doxming...";
function setInfos(){
    print "sssss";
}
echo \ms\obj\flag;
echo "<br>";
echo \ms\obj\getFlag();
echo "<br>";
\ms\obj\Person::getIndex(44);
echo "<br>";
echo __NAMESPACE__;
echo "<br>";
echo \dox\doxs\sx;
echo "<br>";
echo \dox\doxs\setInfos();
echo "<br>";
echo "<br>";
use \ms\obj as mo;
echo mo\flag;
echo "<br>";
echo mo\Person::getIndex(237823489);
echo "<br>";
use \ms\obj\Person as p;
echo p::getIndex(44444);
echo "<br>";
echo __LINE__;
echo "<br>";
echo __DIR__;
echo "<br>";
echo __FILE__;
echo "<br>";
echo __NAMESPACE__;
echo "<br>";
echo __FUNCTION__;
echo "<br>";
echo __CLASS__;
echo "<br>";
echo __TRAIT__;
echo "<br>";
echo dox_dox;

$strobj = "he,he.java.";
echo strlen($strobj);
echo "<br>";
echo strpos($strobj,"java");

$var1 = "11";
$var3 = "";
$var5 = 0;
$var4 = NULL;
echo "<Br>";
var_dump(empty($var1));
var_dump(is_null($var1));
unset($var1);
echo "<br>==============分割线=================<br>";
echo $GLOBALS['var5'];
echo "<br>";
echo $_SERVER['PHP_SELF'];
echo "<br>";
echo $_SERVER['HTTP_HOST'];
echo "<br>";
echo $_SERVER['HTTP_REFERER'];
echo "<br>";
echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>";
echo $_SERVER['SCRIPT_FILENAME'];
echo "<br>";
echo $_SERVER['SCRIPT_NAME'];
echo "<br>";
echo $_SERVER['SERVER_ADDR'];
echo "<br>";
echo $_SERVER['SERVER_PROTOCOL'];
echo "<br>";
echo $_SERVER['SERVER_PORT'];
echo "<br>";
echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>==============分割线=================<br>";
?>

<br>
<br>

<form  name="msform" id="msform" method="post" action="rs.php">
    UNAME:<input type="text" id="fname" name="fname" value=""><BR>
    UPWS: <input type="password" id="fpws" name="fpws" value=""><br>
    <input type="submit" value="submit"/>
    <input type="reset" value="reset"/>
</form>

<?php
echo $_ENV['JAVA_HOME'];
echo $_GET['idx'];

$p1file = file_get_contents("p1.php") or exit("no files");
echo "<br>==============分割线=================<br>";
echo $p1file;
echo "<br>==============分割线=================<br>";

$file = fopen("test.txt",'r') or exit("Unable to pen file!");
while (!feof($file)){
    echo fgets($file)."<br>";
}
fclose($file);

/*
$files_ = fopen("test.txt","r") or exit("no files");
while (!feof($files_)){
echo fgetc($files_)."<br>";
}
fclose($files_);
*/

echo "<br>==============分割线=================<br>";
$ar = array("uname"=>"dox1","upws"=>"12345478","usex"=>"1","uage"=>"89");
$jsonstr = json_encode($ar);
echo json_encode($ar);


echo "<br>==============分割线=================<br>";
require "Stu.php";
$stuobj_x = new \Stu("ROB","56","MALE");
$sx_ = json_encode($stuobj_x);
echo json_encode($stuobj_x);

echo "<br>==============分割线=================<br>";
$as = json_decode($jsonstr);
echo $as->uname."<br>";
echo $as->upws."<br>";
echo $as->usex."<br>";
echo $as->uage."<br>";
echo "<br>==============分割线=================<br>";

$strm = json_decode($sx_);
var_dump($strm);
echo "<br>==============分割线=================<br>";
foreach ($strm as $item)
{
    echo $item."<br>";
}
?>