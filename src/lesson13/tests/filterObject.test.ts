import { filterObject, cars, students } from "../start";

describe('filterObject', () => {
  const books = {
    book1: { title: "1984", author: "George Orwell", pages: 328 },
    book2: { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281 },
    book3: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180 },
    book4: { title: "Moby Dick", author: "Herman Melville", pages: 635 },
    book5: { title: "War and Peace", author: "Leo Tolstoy", pages: 1225 },
  };

  test('filters object values for cars', () => {
    const result = filterObject(cars, (value) => value.price > 40000);
    expect(result).toEqual({
      modelS: { brand: "Tesla", color: "white", price: 79999 },
      mustang: { brand: "Ford", color: "red", price: 45000 },
    });
  });

  test('filters object values for students', () => {
    const result = filterObject(students, (value) => value.gpa > 3.5);
    expect(result).toEqual({
      alice: { age: 20, major: "Computer Science", gpa: 3.8 },
      diana: { age: 22, major: "Biology", gpa: 3.9 },
      eric: { age: 20, major: "Psychology", gpa: 3.6 },
    });
  });

  test('filters object values for books', () => {
    const result = filterObject(books, (value) => value.pages > 300);
    expect(result).toEqual({
      book1: { title: "1984", author: "George Orwell", pages: 328 },
      book4: { title: "Moby Dick", author: "Herman Melville", pages: 635 },
      book5: { title: "War and Peace", author: "Leo Tolstoy", pages: 1225 },
    });
  });
});
