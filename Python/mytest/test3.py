#! /usr/bin/python
# _*_ coding:utf-8 _*_


def main():#列表
    print("[list]")
    list1 = [123, 'afc', 'tye', 899, 'dox']
    list2 = ['dof', 455]

    print(list1[2:3])
    print(list2[1])

    list_5 = [1, 23, 5] + ['44', '66', 89]
    list6 = list_5 * 3

    print(list_5)
    print(list6)

    print("=============================")
    print(len(list6))
    print("=============================")

    if "doxx" in list1:
        print("dox true")
    else:
        print("false")

    print("###############################")
    for var1 in list_5:
        print(var1)
    print("###############################")

    print(list_5[-2])
    list3 = list1 + list2
    print(list1)
    print(list2)
    print(list3)

    list1[2] = 43333
    print(list1)
    # list1.remove(899)
    del list2[0]
    print(list1)
    print(list2)


#元组
def main1():
    print('(list)')
    v_list1 = ('222', "2x", 33, "ddx")
    v_list2 = ('dd', '3333')
    v_list3 = (1,)

    print(v_list1)
    print(v_list2)
    print(v_list3)

    v_list4 = v_list1 + v_list2
    print(v_list4)

    v_list5 = '45', 1, '8989', 'ddddd', '333'
    print("4445", 33, 'dd%d', "%sddd")
    print("ddsl%sdd%dll" % ('xxx', 4))

    vl_1 = (1, 3, '44') + (45, "333", 'xx')
    print(vl_1)

    del v_list5
    # print(v_list5)


#字典
def main3():
    print("{list}")
    d_list1 = {'name':'robinn','sex':'32','address':'四川成都','tel':'125454'}
    d_list2 = {'isnull':'true','wordkeys':'ddd'}
    d_list3 = (12,33,22)

    print("######################################")
    print(d_list1)
    print(d_list2)
    print(d_list3)
    print("######################################")


    print(d_list1["name"])
    print(d_list1["name"]=="robinn")

    d_list1["name"] = "doxxxxx"
    print(d_list1["name"])


    del d_list1["name"]
    print(d_list1)


    d_list1.clear()
    print(d_list1)

    del d_list1
    #print(d_list1)


    d_listx = {123:'sss',"xxx":1212,('dom','x1'):'4xxx44ddd'}
    print(d_listx)

    print(d_listx[123])
    print(d_listx["xxx"])
    print(d_listx[('dom','x1')])

    #var1 = cmp(d_list2,d_list3)

    print("string: %s" % str(d_list3))

    #d_listx = ['xx','dd',112]
    #d_listx = (3,)
    print(type(d_listx))


if __name__ == "__main__":
    # main()
    # main1()
    main3()
