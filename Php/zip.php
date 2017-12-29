<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/26
 * Time: 11:11
 */
header("content-type:text/html;charset=utf-8");
var_dump(gd_info());

$ar = gd_info();
foreach ($ar as $item){
    echo $item."<br>";
}

echo "<br>==============分割线=================<br>";

$zipobj = zip_open("xml.zip");
if ($zipobj){
    while ($zip_entry = zip_read($zipobj)){
        echo "FILE NAME:".zip_entry_name($zip_entry)."<br>";
        if(zip_entry_open($zipobj,$zip_entry)){
            $content = zip_entry_read($zip_entry);
            echo "CONTENT:".$content."<br>";
            zip_entry_close($zip_entry);
        }
        echo "<hr>";
    }
}
zip_close($zipobj);