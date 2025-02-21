import { cars, reduceDict, reduceObject, students } from "../start";

describe('reduceDict', () => {
    const books = {
      book1: { title: "1984", author: "George Orwell", pages: 328 },
      book2: { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281 },
      book3: { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180 },
      book4: { title: "Moby Dick", author: "Herman Melville", pages: 635 },
      book5: { title: "War and Peace", author: "Leo Tolstoy", pages: 1225 },
    };
  
    test('reduces object values for cars', () => {
      const result = reduceDict(cars, (acc, value) => acc + value.price, 0);
      const loopResult = reduceObject(cars, (acc, value) => acc + value.price, 0);

      expect(result).toBe(224998);
      expect(loopResult).toBe(224998);
    });
  
    test('reduces object values for students', () => {
      const result = reduceDict(students, (acc, value) => acc + value.gpa, 0);
      const loopResult = reduceObject(students, (acc, value) => acc + value.gpa, 0);

      expect(result).toBe(21.4);
      expect(loopResult).toBe(21.4);
    });
  
    test('reduces object values for books', () => {
      const result = reduceDict(books, (acc, value) => acc + value.pages, 0);
      const loopResult = reduceObject(books, (acc, value) => acc + value.pages, 0);

      expect(result).toBe(2649);
      expect(loopResult).toBe(2649);
    });
  });



