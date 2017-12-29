#!/usr/bin/python

class Vector:
    __num = -3
    def __init__(self, a, b):
        self.a = a
        self.b = b
        print(self.__num)
        self.__setnum(12)
        print(self.__num)

    def __str__(self):
        return 'Vector (%d, %d)' % (self.a, self.b)

    def __add__(self, other):
        return Vector(self.a + other.a, self.b + other.b)

    def __setnum(self, n):
        self.__num = n

if __name__ == "__main__":
    v1 = Vector(4,10)
    v2 = Vector(2,5)

    print(v2+v1)

    print(v1._Vector__num)
    v1._Vector__setnum(78)
    print(v1._Vector__num)