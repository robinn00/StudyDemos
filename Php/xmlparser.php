<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/8/26
 * Time: 9:47
 */
header("content-type:text/html;charset=utf-8");
$xml = new DOMDocument();
$xml->load("note.xml");
$xmlstr = $xml->saveXML();
$xmlhtmlstr = $xml->saveHTML();


echo $xmlstr;
echo "<br>";
echo $xmlhtmlstr;
echo "<br>==============分割线=================<br>";


$xmldom = $xml->documentElement;
foreach ($xmldom->childNodes as $item){
    echo $item->nodeName;
    echo $item->nodeValue;
    echo "<br>";
}

echo "<br>==============分割线=================<br>";

$xml = simplexml_load_file("note.xml");
echo $xml->getName();
echo "<br>";
echo $xml->count();
echo "<br>";
$xml->addChild("doxdox","rlbnsdaffa");
$xml->saveXML("dd.xml");

echo $xml->count()."<BR>";;
echo $xml->to."<BR>";
echo $xml->from."<BR>";;
echo $xml->heading."<BR>";;
echo $xml->body."<BR>";;
echo $xml->doxdox."<BR>";

print_r($xml);
echo "<BR>";
foreach ($xml->children() as $item){
    echo $item->getName()." | ".$item ."<BR>";
}
