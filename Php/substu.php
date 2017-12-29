<?php

/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/22
 * Time: 14:18
 */
require "Stu.php";
class substu extends Stu
{
    function __construct()
    {
        print "this is substu __construct ing...";
    }

    function setuserName($uname)
    {
        parent::setuserName($uname);
    }
}