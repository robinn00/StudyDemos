<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/24
 * Time: 15:10
 */
$from = "ozivizo@163.com";
$to = "3110056662@qq.com";
$title = "HTML测验";
$txt = "
<html>
    <head>
        <title>HTML测验</title>
    </head>
    <body>
        <style type='text/css'>
        div.divcls{
            color:red;borer:2px solid #05c7ff;width:300px;height:300px;font-size:12pt;font-weight:bold;font-family:'微软雅黑'
        }
        </style>
        <HR>
        <DIV class='divcls'>
        测验题库。。。。
        </DIV>
    </body>
</html>
";
$headers = "MIME-版本:1.0"."\r\n";
$headers .= "content-type:text/html;charset=iso-8859-1"."\r\n";
$headers .= "From:".$from;
mail($to,$title,$txt,$headers);
echo "send success!....";