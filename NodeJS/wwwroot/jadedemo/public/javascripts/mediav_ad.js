/**
 * Created by admin on 2016/9/9.
 */
var mediav_ad_pub = 'ccA7NV_1342768';
var mediav_ad_width = '640';
var mediav_ad_height = '90';

var ck_art_ad = function (pubid_,width_,height_) {
    mediav_ad_pub = pubid_;
    mediav_ad_width = width_;
    mediav_ad_height = height_;
    if (navigator.userAgent.indexOf('Windows NT 5.1') > -1){
        document.writeln("<script type='text/javascript' language='JavaScript' src='http://static.mediav.com/js/mvf_g2.js'><\/script>");
    }else{
        document.writeln("<script type='text/javascript' language='JavaScript' src='https://static-ssl.mediav.com/js/mvf_g2.js'><\/script>");
    }
}

var sc=document.getElementsByTagName('script');
if (undefined != sc[sc.length-1].src.split('?')[1]){
    var paramsArr=sc[sc.length-1].src.split('?')[1].split('&');
    var pid_paramsArr = paramsArr[0].split("=");
    var pid = pid_paramsArr[1];
    var w_paramsArr = paramsArr[1].split("=");
    var w = w_paramsArr[1];
    var h_paramsArr = paramsArr[2].split("=");
    var h = h_paramsArr[1];
    ck_art_ad(pid,w,h);
}