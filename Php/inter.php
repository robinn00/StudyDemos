<?php

/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/22
 * Time: 14:25
 */
interface inter
{
    public function setIndex($num);
    public function setCount($num);
}

class intercls implements inter{
    public function setIndex($num)
    {
        // TODO: Implement setIndex() method.
        print_r("setIndex == :".$num.PHP_EOL);
    }

    public function setCount($num)
    {
        // TODO: Implement setCount() method.
        print_r("setCount == :".$num.PHP_EOL);
    }
}