<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 11:15
 */
session_start();
header("content-type:text/html;charset=utf-8");
$filename = $_FILES['mf']['name'];
$ext = array("jpg","jpeg","png","bmp","gif","txt");
$file_ext = explode('.',$filename);

if (in_array(end($file_ext),$ext) ){
    if ($_FILES['mf']['error']>0){
        echo "文件错误...".$_FILES['mf']['error'];
    }else{
        echo "文件名称: ".$_FILES['mf']['name']."<br>";
        echo "文件类型: ".$_FILES['mf']['type']."<br>";
        echo "文件大小: ".$_FILES['mf']['size']."kb<br>";
        echo "临时存放路径: ".$_FILES['mf']['tmp_name']."<br>";

        if (file_exists('upload/'.$filename)){
            echo "文件已经存在。。"."<br>";
        }else{
            move_uploaded_file($_FILES['mf']['tmp_name'],"upload/".$filename);
            echo "文件储存在:"."upload/".$filename;
        }

    }
}else{
    echo "格式错误...";
}

echo "<br>==============分割线=================<br>";

if (isset($_SESSION['num'])){
    $_SESSION['num'] = $_SESSION['num']+1;
}else{
    $_SESSION['num'] = 1;
}
echo "##".$_SESSION['num']."##<br>";

if (intval($_SESSION['num']) == 5){
    unset($_SESSION['num']);
}
echo "$$".$_SESSION['num']."$$";
session_destroy();

echo "<br>==============分割线=================<br>";

$d = time();
echo $d;
echo "<br>";
echo date('Y-m-d',$d);
echo "<br>==============分割线=================<br>";
setcookie("user","",time()-60*70);
if (isset($_COOKIE['user']) || isset($_COOKIE['upws'])){
    echo $_COOKIE['user']." == ".$_COOKIE['upws']."<br>";
}
echo "<br>==============######=================<br>";
foreach ($_COOKIE as $item){
    echo $item."<br>";
}
echo "<br>==============######=================<br>";
echo $_COOKIE;
