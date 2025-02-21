// listToDict
// map
// filter
// reduce

// Example for cars
export const cars = {
  modelS: { brand: "Tesla", color: "white", price: 79999 },
  corolla: { brand: "Toyota", color: "silver", price: 20000 },
  mustang: { brand: "Ford", color: "red", price: 45000 },
  civic: { brand: "Honda", color: "blue", price: 22000 },
  model3: { brand: "Tesla", color: "black", price: 39999 },
  beetle: { brand: "Volkswagen", color: "yellow", price: 18000 },
};

// Example for students
export const students = {
  alice: { age: 20, major: "Computer Science", gpa: 3.8 },
  bob: { age: 19, major: "Mathematics", gpa: 3.2 },
  charlie: { age: 21, major: "History", gpa: 3.5 },
  diana: { age: 22, major: "Biology", gpa: 3.9 },
  eric: { age: 20, major: "Psychology", gpa: 3.6 },
  fiona: { age: 19, major: "Literature", gpa: 3.4 },
};

interface Dict<T> {
  [k: string]: T;
}

/*
####################################################################################
#1 if I can use array.map and I can use Object.entries to get the key and value
#2 If I can't use array.map and I can't use Object.entries to get the key and value
####################################################################################
*/

// Array.prototype.map, but for Dict
// # 1
export function mapDict<T, U>(dict: Dict<T>, transform: (value: T, key: string) => U): Dict<U> {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, transform(value, key)])
  );
}

//#2
export function mapObject<T, U>(dict: Dict<T>, transform: (value: T, key: string) => U): Dict<U> {
  const result: Dict<U> = {};
    for (const key in dict) {
        if (dict.hasOwnProperty(key)) {
            result[key] = transform(dict[key], key);
        }
    }
    return result;
}
// Array.prototype.filter, but for Dict 
// #1 
export function filterDict<T>(dict: Dict<T>, predicate: (value: T, key: string) => boolean): Dict<T> {
  return Object.fromEntries(
    Object.entries(dict).filter(([key, value]) => predicate(value, key))
  );
}

//#2 
export function filterObject<T>(dict: Dict<T>, predicate: (value: T, key: string) => boolean): Dict<T> {
  const result: Dict<T> = {};
  for (const key in dict) {
      if (dict.hasOwnProperty(key) && predicate(dict[key], key)) {
          result[key] = dict[key];
      }
  }
  return result;
}
// Array.prototype.reduce, but for Dict
export function reduceDict(...args: any[]): any {}
