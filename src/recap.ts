const myName = 'Nicolas';
const myAge = 12;
const suma = (a: number, b: number) => {
  return a + b;
};
suma(1, 13);

class Persona {
  constructor(private age: number, private name: string) {
    this.age = age;
    this.name = name;
  }

  getSummary() {
    return `my name is ${this.name}`;
  }
}

const nicolas = new Persona(15, 'nicolas');
nicolas.getSummary();
