<?php
/**
* Created by PhpStorm.
* User: admin
* Date: 2016/8/20
* Time: 15:53
*/
header("content-type:text/html;charset=utf-8;");
require "substu.php";
require "inter.php";
echo "<br>==============分割线=================<br>";
$stu_ = "Stu";
$stu_obj_ = new $stu_("11","22","33");

function getInfo_s(){
    return __METHOD__."==".__FUNCTION__;
}

$getinfos = "getInfo_s";
echo $getinfos();

echo "<br>==============分割线=================<br>";
define("age_","12",true);
define("name_","doxmoom");

echo constant("AGE_").constant("name_");
echo Stu::getFocks();
echo "<br>==============分割线=================<br>";
$stuobj = new Stu("Robot","23","male");
echo "<br>";
echo $stuobj->getuserName().PHP_EOL;
echo $stuobj->getuserAge().PHP_EOL;
echo $stuobj->getuserSex().PHP_EOL;

echo "<br>";
echo Stu::pix;
echo "<br>";
$stuobj->setuserName("##robots");
$stuobj->setuserAge("##456");
$stuobj->setuserSex("##female");
echo "<br>";
echo $stuobj->getuserName(),$stuobj->getuserAge(),$stuobj->getuserSex();


echo "<br>";
echo $stuobj->username,$stuobj->userage;
echo "<br>";
Stu::$info = "information....";
echo $stuobj->getInfo();

echo "<br>==============分割线=================<br>";


$substuobj = new substu();
$substuobj->setuserName("doxxxxxxxxxxxxxxxx....");
echo $substuobj->getuserName();


echo "<br>==============分割线=================<br>";

$isx = new intercls();
echo $isx->setCount(4748);
echo $isx->setIndex("457sdfafasdf");
echo "<br>==============分割线=================<br>";






























$num1 = 11;
$num2 = 22;

function t1(){
    static $xx = 456;
    global $num2;
    echo $num2;
    echo "<br>";
    echo $xx;
    $xx++;
}

function t2(){
    $dx = 10000;
    echo $dx;
}
t1();
echo "<br>";
t1();
echo "<br>";
echo $xx;
echo "<br>";
t2();
echo $dx;

echo "<br>";



echo "PHP";
$var1 = 10;
$var2 = 20;
$n = print "<br>";
echo $var1+$var2;
echo "<br>".$n;
echo "<br>","22","33","44";

echo "<br>";
print_r($var1);

printf("<br>this is a %s<br>",$var1);
var_dump($var2);


echo "<br>==============分割线=================<br>";
$array = array("one","two","thr");
print "this is a demo $num1<br>";
print "this is array {$array[2]}";
echo "<br>==============分割线=================<br>";

$str = "arrar_string";
$flag = true;
$intnum = 1000;
$floatnum = 12.154;
$arrays = array(1,2,3);
$nx = null;

print $str."<br>";
echo $flag."<br>";
var_dump($flag);
echo $nx;
foreach ($arrays as $dom){
    echo "<br>".$dom;
}


class person{
    var $uname;
    var $prams;
    function __construct()
    {
        $this->prams = func_get_args();
        print "<br>constructing.....<br>".PHP_EOL;
    }

    function setUname($u_names){
        $this->uname = $u_names;
    }
    function getUname(){
        return "dox:".$this->uname;
    }

    function getPrams(){
        return $this->prams;
    }

    function __destruct()
    {
        print "<br>person__destructing...".PHP_EOL;
    }
}


class subPerson extends person{

    function __construct()
    {
        parent::__construct();
        print "<br>this is subPerson __constructing...<br>";
    }


    function __construct1($n1,$n2,$n3)
    {
        print "<br>this is subPerson ____construct1...<br>";
    }



    function setUname($u_names)
    {
        $this->uname = "xxxxxxx".$u_names;
    }
    function __destruct()
    {
       print "<br>__destructing...";
    }
}




$p = new person("dd","xx");
$p->setUname("robinn");
echo "<br>name:".$p->getUname();

$pams = $p->getPrams();
foreach ($pams as $pam) {
    echo "<br>==".$pam."<br>==";
}
echo "<br>==============分割线=================<br>";


$sub = new subPerson();
$sub->setUname("doxdoxdox..");
echo "<br>".$sub->uname."<br>";

echo "<br>".count($arrays)."<br>";

$a_ = array("key1"=>"one1","key2"=>"two2","key3"=>"thr3");

for ($v=0;$v<count($array);$v++){
    echo "<br>".$array[$v];
}
echo "<br>";

$keynames = array_keys($a_);
for ($x=0;$x<count($keynames);$x++){
    echo "<br>".$a_[$keynames[$x]]."<br>";
}

foreach ($a_ as $ky=>$val) {
    echo "<br>key=".$ky." &nbsp;&nbsp;value=".$val."<br>";
}

echo "<br>";
print_r($a_);


$maarray = array(array("one","two","thr"),array(13,35,65),array("3","43"));
echo "<br>";
print_r($maarray);


