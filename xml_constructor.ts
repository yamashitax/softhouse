import { Stack } from './stack';
import { type Address, type Family, type Person, type Phone, type Type, typeHashMap } from './types';

export class XMLConstructor
{
  stack: Stack<string>;
  lines: Array<string>;

  constructor(lines: Array<string>) {
    this.stack = new Stack<string>();
    this.lines = lines;
  }

  public parse(): string {
    let xml: string = '';

    if (this.lines[0][0] !== 'P') {
      console.warn('first line must be a person');
      return '';
    }
    
    for (var i: number = 0; i < this.lines.length; i++) {
      if (this.lines[i] === '') continue;

      const currentType: string = this.lines[i][0];

      if (currentType === 'P' && i !== 0) {
        const stackLength: number = this.stack.length();

        for (var j: number = 0; j < stackLength; j++) {
          xml += this.stack.pop() === 'P' ? '</person>' : '</family>';
        }
      } else if (currentType === 'F' && i !== 0) {
        if (this.stack.peek() === 'F') {
          this.stack.pop();

          xml += '</family>'; 
        }
      }

      const type: Type | undefined = this.parseLine(this.lines[i]);

      if (type === undefined) {
        console.warn('unknown type');
        continue;
      }

      this.stack.push(currentType);

      const typeProps: [string, string | number][] = Object.entries(type);

      const propXml: string = typeProps.map((prop: [string, string | number]): string =>
        `<${prop[0]}>${prop[1]}</${prop[0]}>`
      ).join('');

      if (['P', 'F'].includes(currentType)) {
        xml += currentType === 'P' ? `<person>${propXml}` : `<family>${propXml}`;
        
        continue;
      }

      const poppedType: string = this.stack.pop() || 'unknown';

      if (poppedType === 'unknown') {
        console.warn('unknown type');
        continue;
      }

      const tagName: string = typeHashMap[poppedType];

      xml += `<${tagName}>${propXml}</${tagName}>`
    }

    for (var i: number = 0; i < this.stack.length(); i++) {
      const poppedType: string | undefined = this.stack.pop();

      xml += poppedType === 'P' ? '</person>' : '</family>';
    }

    return `<people>${xml}</people>`;
  }

  private parseLine(line: string): Type | undefined {
    const parts: string[] = line.split('|');

    switch (line[0]) {
      case 'P':
        {
          const [_, firstName, lastName] = parts;

          const person: Person = {
            firstname: firstName,
            lastname: lastName
          };

          return person;
        }
      case 'A':
        {
          const [_, street, city, postalCode] = parts;

          const address: Address = {
            street,
            city,
          };

          if (postalCode) address.postal_code = Number(postalCode);

          return address;
        }
      case 'T':
        {
          const [_, mobile, landline] = parts;

          const telephone: Phone = {
            mobile,
            landline
          };

          return telephone;
        }
      case 'F':
        {
          const [_, name, born] = parts;

          const family: Family = {
            name,
            born: Number(born)
          };

          return family;
        }
    }
  }
}


