<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/26
 * Time: 14:22
 */
header("Content-type: image/png");
$im = imagecreate(300,300);
$str = "this is a test";
$bg = imagecolorallocate($im,255,0,0);
$qg = imagecolorallocate($im,0,255,0);
imagestring($im,10,20,10,$str,$qg);
imagepng($im);
imagedestroy($im);