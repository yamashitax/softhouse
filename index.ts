import { XMLConstructor } from "./xml_constructor";

const path = Bun.argv[2];

const file = Bun.file('./' + path);

const exists = await file.exists();

if (! exists) {
  console.error('Please provide the path to a file');
  console.error('E.g. bun run index.ts ./myfile');
} else {
  const fileText = await file.text();
  const xmlConstructor = new XMLConstructor(fileText.split('\n'));
  const parsedOutput = xmlConstructor.parse();

  console.log(parsedOutput);
}
