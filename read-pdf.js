import pdf from 'pdf-parse';
import fs from 'fs/promises';

const data = await pdf(await fs.readFile('/tmp/wsprice.pdf'));
console.log(data.text);