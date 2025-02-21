// type checking
// x = y, is y within x, does it fit?

// let x: number
// const y = "10"

// x = y

// function hello(x) {
//     //
// }

// hello(value)

// or

// a = b

// static vs dynamic type checking
// C#, C++, Typescript, Scala, mypy

// dynamic
// JavaScript, Python, PHP

// nominal vs structural

// Java - nominal
// public class Car {
//   String make;
//   String model;
//   int make;
// }
// public class CarChecker {
//   // takes a `Car` argument, returns a `String`
//   public static String checkCar(Car car) {  }
// }
// Car myCar = new Car();
// // TYPE CHECKING
// // -------------
// // Is `myCar` type-equivalent to
// //     what `checkCar` wants as an argument?
// CarChecker.checkCar(myCar);

// TS - structural
// „duck typing” (z ang. „jeśli coś wygląda jak kaczka, pływa jak kaczka i kwacze jak kaczka – to znaczy, że jest kaczką”)

class Car {
  make: string;
  model: string;
  year: number;
  isElectric: boolean;
}

class Truck {
  make: string;
  model: string;
  year: number;
  towingCapacity: number;
}

const vehicle = {
  make: "Honda",
  model: "Accord",
  year: 2017,
};

function printCar(car: { make: string; model: string; year: number }) {
  console.log(`${car.make} ${car.model} (${car.year})`);
}

const car = new Car();
const truck = new Truck();
console.log(typeof car);
console.log(typeof truck);
console.log(typeof vehicle);

// printCar(car) // Fine
// printCar(truck) // Fine
// printCar(vehicle) // Fine

interface HasName {
  name: string;
}

// class Person {
//   name: string;
//   age: number;
//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }
// }

// let p: HasName = new Person("Jan", 30);
// // OK, Person posiada pole "name" typu string,
// // więc strukturalnie pasuje do interfejsu HasName

// // Inny przykład:
// let x = { name: "Ala", city: "Kraków" };
// let y: HasName = x;
// // Też OK, bo obiekt "x" ma pole "name" typu string,
// // czyli spełnia "kształt" interfejsu HasName
