<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/26
* Time: 9:12
*/

$conn = odbc_connect("test","","");
$sql = "select * from projects";
$rs = odbc_exec($conn,$sql);

if ($rs){
    while (odbc_fetch_row($rs)){
        echo odbc_result($rs,"ID")." | ".odbc_result($rs,"p_name")." | ".odbc_result($rs,"p_zr");
        echo "<br>";
    }
    odbc_close($conn);
}