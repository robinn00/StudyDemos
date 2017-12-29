<?php

/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/22
 * Time: 13:58
 */
class Stu
{
    var $username;
    var $userage;
    var $usersex;

    const pix = "1231873";
    public static $flag = "false";

    public static $info;

    function __construct($uname,$uage,$usex)
    {
        $this->username = $uname;
        $this->userage = $uage;
        $this->usersex = $usex;
        print "this is stu __construct ing....".__METHOD__."==".__FUNCTION__."==".__CLASS__."<br>";
    }


    function getPIX(){
       return self::pix;
    }

    function getFlags(){
        return Stu::$flag;
    }

    public static function getFocks(){
        return 'ddddkdddkdlkdkljjkl';
    }



    function setuserName($uname){
        $this->username = $uname;
    }

    function setuserAge($uage){
        $this->userage = $uage;
    }

    function setuserSex($sex){
        $this->usersex = $sex;
    }

    function getInfo(){
        return Stu::$info;
    }


    function getuserName(){
        return $this->username;
    }

    function getuserAge(){
        return $this->userage;
    }

    function getuserSex(){
        return $this->usersex;
    }


    function __destruct()
    {
        print "this is stu __destruct ing....";
    }


}