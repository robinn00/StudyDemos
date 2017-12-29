#!/usr/bin/python
import sys;
import time;
print(sys.version);
print("hello "+"words");
numbers = "string test"
print(numbers);
print(numbers[0]);
print(numbers *2);
print(numbers[1:3]);
print(numbers[3:])
print("sss"+numbers[5:7]+"str");
print(__name__ == "__main__");
if __name__ == "__main__":
    fileobj = open("wp-config.php","rU");
    txtstr  =  fileobj.read();
    print(txtstr);
print("==========================================");
print(time.time());

def printstr(pram):
    '''print string'''
    print("this is string:"+pram);
print("==========================================");
printstr("haoliyou");