<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/22
 * Time: 15:55
 */
namespace ms\obj;
header("content-type:text/html;charset=utf-8");

const flag = "truessssss";

function getFlag()
{
    return "falgs";
}

class Person
{
    function __construct()
    {
        print "person__constructing ...";
    }

    static function getIndex($num){
        print "static function getindex".$num."==".__NAMESPACE__;
    }
}


/*
echo flag;
echo "<br>";
echo getFlag();

echo "<br>";

$p = new Person();
echo "<br>==============分割线=================<br>";

echo \ms\obj\flag;
*/