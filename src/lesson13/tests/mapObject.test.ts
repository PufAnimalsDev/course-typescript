import { cars, mapObject, students } from "../start";

describe('mapObject', () => {
  const books = {
    book1: { title: "1984", author: "George Orwell", pages: 328 },
    book2: { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281 },
    book3: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180 },
    book4: { title: "Moby Dick", author: "Herman Melville", pages: 635 },
    book5: { title: "War and Peace", author: "Leo Tolstoy", pages: 1225 },
  };

  test('maps object values for cars', () => {
    const result = mapObject(cars, (value) => ({ ...value, price: value.price + 1000 }));
    expect(result).toEqual({
      modelS: { brand: "Tesla", color: "white", price: 80999 },
      corolla: { brand: "Toyota", color: "silver", price: 21000 },
      mustang: { brand: "Ford", color: "red", price: 46000 },
      civic: { brand: "Honda", color: "blue", price: 23000 },
      model3: { brand: "Tesla", color: "black", price: 40999 },
      beetle: { brand: "Volkswagen", color: "yellow", price: 19000 },
    });
  });

  test('maps object values for students', () => {
    const result = mapObject(students, (value) => ({ ...value, gpa: value.gpa + 1 }));
    expect(result).toEqual({
      alice: { age: 20, major: "Computer Science", gpa: 4.8 },
      bob: { age: 19, major: "Mathematics", gpa: 4.2 },
      charlie: { age: 21, major: "History", gpa: 4.5 },
      diana: { age: 22, major: "Biology", gpa: 4.9 },
      eric: { age: 20, major: "Psychology", gpa: 4.6 },
      fiona: { age: 19, major: "Literature", gpa: 4.4 },
    });
  });

  test('maps object values for books', () => {
    const result = mapObject(books, (value) => ({ ...value, pages: value.pages + 10 }));
    expect(result).toEqual({
      book1: { title: "1984", author: "George Orwell", pages: 338 },
      book2: { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 291 },
      book3: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 190 },
      book4: { title: "Moby Dick", author: "Herman Melville", pages: 645 },
      book5: { title: "War and Peace", author: "Leo Tolstoy", pages: 1235 },
    });
  });
});