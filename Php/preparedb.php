<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/25
 * Time: 20:43
 */
header("content-type:text/html;charset:utf-8");
require "db.php";
$conn_ = getConn();
$stmt = $conn_->prepare("insert into userinfo(id,uname,upws,uinfo) VALUES (?,?,?,?);");
$stmt->bind_param("isss",$id,$uname,$upws,$uinfo);
$id = 787;
$uname = "xxboinn";
$upws = "xx4655";
$uinfo = "xxasdfafksajf;klasdjf";
if ($stmt->execute()){
    echo "insert success!....";
}else{
    echo "失败！";
}

$stmt->close();
$conn_->close();
