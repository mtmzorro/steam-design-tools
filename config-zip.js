const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// manifest.json
const manifestPath = path.join(__dirname, 'public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath));

// Path
const inPath = path.join(__dirname, 'build');
const outDir = 'publish';
const outPath = path.join(
    __dirname,
    outDir,
    `${manifest.name}-${manifest.version}.zip`
);

if (!fs.existsSync(path.join(__dirname, outDir))) {
    fs.mkdirSync(outDir);
}

// Create name-version.zip
const outputStream = fs.createWriteStream(outPath);
const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
});
archive.on('error', function (err) {
    throw err;
});
archive.directory(inPath, false);
archive.pipe(outputStream);
archive.finalize();