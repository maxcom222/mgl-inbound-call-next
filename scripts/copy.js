const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    await fs.copy(path.join(__dirname, '../src/public'), './public');
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

copyFiles();
