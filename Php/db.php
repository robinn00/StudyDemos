<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 16:56
 */
$server = "localhost";
$username = "root";
$userpws = "root";
$dbname = "phpcmsv9";
$conn = new mysqli($server,$username,$userpws,$dbname);
if ($conn->connect_error){
    die("链接出错...".$conn->connect_error);
}

function getConn(){
    global $conn;
    return $conn;
}

function closeConn(){
    global $conn;
    $conn->close();
}