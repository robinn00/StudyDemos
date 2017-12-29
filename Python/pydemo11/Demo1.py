import wget
from colorama import Fore
import uuid
#str = wget.download("http://www.baidu.com")

s = open("download.wget","r")
str  = s.readlines()
print(str)


print(Fore.RED + "RED IN")
print Fore.GREEN + "GREEN IN..."
print(uuid.uuid4())