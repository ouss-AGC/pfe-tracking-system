const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    let dataBuffer = fs.readFileSync('C:\\Users\\Admin\\Documents\\OUSS\\PFE 1 GC 2025-2026.pdf');
    const data = await pdf(dataBuffer);
    console.log(data.text);
}

extract().catch(err => console.error(err));
