<?php

header("Access-Control-Allow-Origin:*");
header("content-type:application/json;charset=utf-8");

$conn = new mysqli("localhost","root","root","test");

$result = $conn->query("select * from django_migrations");

$str = "";

while($rs = $result->fetch_array(MYSQLI_ASSOC)){
  $str .= '{"id":"'.$rs["id"].'","app":"'.$rs["app"].'","name":"'.$rs["name"].'","applied":"'.$rs["applied"].'"},';
}
$str = rtrim($str, ",");
$outputJSON = '{"infos": [ '.$str.' ]}';


echo $outputJSON;
?>