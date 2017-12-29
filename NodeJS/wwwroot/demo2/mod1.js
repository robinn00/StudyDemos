/**
 * Created by admin on 2016/9/7.
 */
function Person() {
    var name;
    var sex;

    this.setName = function (name_) {
        this.name = name_;
    }
    this.setSex = function (sex_) {
        this.sex = sex_;
    }
    
    this.getName = function () {
        return this.name;
    }
    console.log("person....");
}

module.exports = Person;

