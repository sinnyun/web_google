import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS = [
    { id: 'neon-void', startId: 10, count: 12 },
    { id: 'urban-echo', startId: 26, count: 14 },
    { id: 'organic-flow', startId: 42, count: 10 },
    { id: 'silent-noise', startId: 56, count: 15 },
    { id: 'chromatic-abyss', startId: 80, count: 12 },
    { id: 'paper-dreams', startId: 100, count: 11 },
    { id: 'kinetic-type', startId: 120, count: 13 },
    { id: 'glass-house', startId: 140, count: 10 },
    { id: 'analog-glitch', startId: 160, count: 15 },
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            const stream = fs.createWriteStream(filepath);
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close();
                resolve();
            });
            stream.on('error', reject);
        }).on('error', reject);
    });
};

const main = async () => {
    const publicDir = path.join(__dirname, 'public', 'images');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    for (const project of PROJECTS) {
        const projectDir = path.join(publicDir, project.id);
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }

        console.log(`Downloading images for ${project.id}...`);

        // Download Cover
        const coverUrl = `https://picsum.photos/id/${project.startId}/1920/1080`;
        await downloadImage(coverUrl, path.join(projectDir, 'cover.jpg'));

        // Download Details
        for (let i = 0; i < project.count; i++) {
            const imgId = project.startId + 1 + i;
            const detailUrl = `https://picsum.photos/id/${imgId}/1200/1600`;
            await downloadImage(detailUrl, path.join(projectDir, `detail-${i + 1}.jpg`));
        }
    }
    console.log('All downloads complete!');
};

main();
