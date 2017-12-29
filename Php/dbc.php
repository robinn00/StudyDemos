<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 16:59
 */
header("content-type:text/html;charset:utf-8");
require "db.php";
$conn_ = getConn();
$sql_insert = "insert into userinfo(id,uname,upws,uinfo) values(1,'doxdox','545415','atext...');";
$sql_insert .= "insert into userinfo(id,uname,upws,uinfo) values(2,'abc','aaa','sdfasds...');";
$sql_insert .= "insert into userinfo(id,uname,upws,uinfo) values(3,'tetete','sadfasdf','zzz...');";
//$flag = $conn_->query($sql_insert);
$flag = $conn_->multi_query($sql_insert);
if ($flag){
    echo "insert success!";
}else{
    echo "insert fail...";
}
$conn_->close();
/*
$sql_create = "create database testdemo";

if ($conn_->query($sql_create)){
    echo "Create Success!...";
}


$sql_createtable = "create table userinfo(
id INT NOT NULL,
uname VARCHAR(255),
upws VARCHAR(255),
uinfo VARCHAR(255)
);";

if ($conn_->query($sql_createtable) === true){
    echo "create table success!...";
}
*/



/*
$sql_rs = "select * from v9_admin_role";
$rs_ = $conn_->query($sql_rs);
//$arrays = $rs_->fetch_all();
while ($row = $rs_->fetch_assoc()){
    echo $row['roleid']." | ".$row['rolename']." | ".$row['description']." | ".$row['listorder']." | ".$row['disabled']."<br>";
}
$conn_->close();
*/


/*
foreach ($arrays as $item){
    echo  $item[0]." | ".$item[1].' | '.$item[2].' | '.$item[3].' | '.$item[4].' | '.$item[5]."<br>";
}
echo "<hr>";


echo $arrays;
foreach ($arrays as $row_){
    echo $row_['roleid']." || ".$row_['rolename']." || ".$row_['description']." || ".$row_['listorder']." || ".$row_['disabled']."<br>";
}
echo $rs_->num_rows;
*/

