"use strict";
// listToDict
// map
// filter
// reduce
Object.defineProperty(exports, "__esModule", { value: true });
exports.students = exports.cars = void 0;
exports.mapDict = mapDict;
exports.mapObject = mapObject;
exports.filterDict = filterDict;
exports.reduceDict = reduceDict;
// Example for cars
exports.cars = {
    modelS: { brand: "Tesla", color: "white", price: 79999 },
    corolla: { brand: "Toyota", color: "silver", price: 20000 },
    mustang: { brand: "Ford", color: "red", price: 45000 },
    civic: { brand: "Honda", color: "blue", price: 22000 },
    model3: { brand: "Tesla", color: "black", price: 39999 },
    beetle: { brand: "Volkswagen", color: "yellow", price: 18000 },
};
// Example for students
exports.students = {
    alice: { age: 20, major: "Computer Science", gpa: 3.8 },
    bob: { age: 19, major: "Mathematics", gpa: 3.2 },
    charlie: { age: 21, major: "History", gpa: 3.5 },
    diana: { age: 22, major: "Biology", gpa: 3.9 },
    eric: { age: 20, major: "Psychology", gpa: 3.6 },
    fiona: { age: 19, major: "Literature", gpa: 3.4 },
};
console.log(exports.students.charlie.gpa);
// Array.prototype.map, but for Dict
// #1 if I can use array.map and I can use Object.entries to get the key and value
function mapDict(dict, transform) {
    return Object.fromEntries(Object.entries(dict).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, transform(value, key)];
    }));
}
// #2 If I can't use array.map 
function mapObject(dict, transform) {
    var result = {};
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            result[key] = transform(dict[key], key);
        }
    }
    return result;
}
// Array.prototype.filter, but for Dict
function filterDict(dict, predicate) {
    return Object.fromEntries(Object.entries(dict).filter(function (_a) {
        var key = _a[0], value = _a[1];
        return predicate(value, key);
    }));
}
function filterObject(dict, predicate) {
    return Object.fromEntries(Object.entries(dict).filter(function (_a) {
        var key = _a[0], value = _a[1];
        return predicate(value, key);
    }));
}
// Array.prototype.reduce, but for Dict
function reduceDict() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
}
