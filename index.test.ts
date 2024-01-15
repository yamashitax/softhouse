import { describe, expect, test, beforeAll, beforeEach } from 'bun:test';
import { XMLConstructor } from './xml_constructor';

import { Stack } from './stack';

beforeAll((): () => void => 
  console.warn = (...data: any[]): void => { warnings = data; } 
);

beforeEach((): void => {
  warnings = [];
});

const TEST_DATA = `P|Victoria|Bernadotte
T|070-0101010|0459-123456
A|Haga Slott|Stockholm|101
F|Estelle|2012
A|Solliden|Öland|10002
F|Oscar|2016
T|0702-020202|02-202020
P|Joe|Biden
A|White House|Washington, D.C`;

var warnings: string[];

describe('it constructs xml based on item in queue', () => {
  test('it properly pushes and pops the stack', () => {
    const stack = new Stack<string>;

    stack.push('P');
    stack.push('F');

    expect(stack.pop()).toEqual('F');
  });
  test('person, address', () => {
    const input: string = `P|Victoria|Bernadotte
A|Solna|Stockholm`;

    const xmlConstructor = new XMLConstructor(input.split('\n'));

    const actual = xmlConstructor.parse()
    const expected: string = `<people><person><firstname>Victoria</firstname><lastname>Bernadotte</lastname><address><street>Solna</street><city>Stockholm</city></address></person></people>`;

    expect(actual).toEqual(expected);
  });
  test('person, address, family, person, telephone', () => {
    const input: string = `P|Victoria|Bernadotte
A|Solna|Stockholm
F|Oscar|2016
A|Solna|Stockholm
P|Joe|Biden
T|070-0101010|0459-123456`;
    const xmlConstructor = new XMLConstructor(input.split('\n'));

    const actual = xmlConstructor.parse()
    const expected: string = `<people><person><firstname>Victoria</firstname><lastname>Bernadotte</lastname><address><street>Solna</street><city>Stockholm</city></address><family><name>Oscar</name><born>2016</born><address><street>Solna</street><city>Stockholm</city></address></family></person><person><firstname>Joe</firstname><lastname>Biden</lastname><telephone><mobile>070-0101010</mobile><landline>0459-123456</landline></telephone></person></people>`;

    expect(actual).toEqual(expected);
  });
  test('it parses multiple family members correctly', (): void => {
    const input: string = `P|Victoria|Bernadotte
A|Solna|Stockholm
F|Oscar|2016
A|Solna|Stockholm
F|Estelle|2012
A|Solna|Stockholm
P|Joe|Biden
T|070-0101010|0459-123456`;
    
    const xmlConstructor = new XMLConstructor(input.split('\n'));

    const actual = xmlConstructor.parse();

    expect(actual).toEqual('<people><person><firstname>Victoria</firstname><lastname>Bernadotte</lastname><address><street>Solna</street><city>Stockholm</city></address><family><name>Oscar</name><born>2016</born><address><street>Solna</street><city>Stockholm</city></address></family><family><name>Estelle</name><born>2012</born><address><street>Solna</street><city>Stockholm</city></address></family></person><person><firstname>Joe</firstname><lastname>Biden</lastname><telephone><mobile>070-0101010</mobile><landline>0459-123456</landline></telephone></person></people>');
  });
  test('it properly parses and converts the test data', (): void => {
    const xmlConstructor = new XMLConstructor(TEST_DATA.split('\n'));

    const actual = xmlConstructor.parse();
    const expected: string = `<people><person><firstname>Victoria</firstname><lastname>Bernadotte</lastname><telephone><mobile>070-0101010</mobile><landline>0459-123456</landline></telephone><address><street>Haga Slott</street><city>Stockholm</city><postal_code>101</postal_code></address><family><name>Estelle</name><born>2012</born><address><street>Solliden</street><city>Öland</city><postal_code>10002</postal_code></address></family><family><name>Oscar</name><born>2016</born><telephone><mobile>0702-020202</mobile><landline>02-202020</landline></telephone></family></person><person><firstname>Joe</firstname><lastname>Biden</lastname><address><street>White House</street><city>Washington, D.C</city></address></person></people>`;

    expect(actual).toEqual(expected);
  });
  test.only('it throws a warning when the type is unknown', () => {
    const input: string = `P|Victoria|Bernadotte
S|Solna|Stockholm`;

    const xmlConstructor = new XMLConstructor(input.split('\n'));

    expect(warnings).toBeEmpty();

    xmlConstructor.parse();

    expect(warnings).toEqual(['unknown type']);
  });
  test('it throws a warning when the first line is not a person', () => {
    const xmlConstructor = new XMLConstructor('F|Estelle|2012'.split('\n'));

    expect(warnings).toBeEmpty();

    xmlConstructor.parse();

    expect(warnings).toEqual(['first line must be a person']);
  });
});
