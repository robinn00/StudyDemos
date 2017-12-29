<?php
/**
 * Created by PhpStorm.
 * User: admin
* Date: 2016/8/24
* Time: 14:46
*/
header("content-type:text/html;charset=utf-8");
$to = "3110056662@qq.com";
$from ="ozivizo@163.com";
$title = "A just..";
$txt = "is a text...";
$headers = "From:".$from."\r\n";
$headers .= "Bcc:2919417338@qq.com";
mail($to,$title,$txt,$headers);
echo "send success!";