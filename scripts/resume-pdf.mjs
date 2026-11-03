// Renders /resume/ to public/resume.pdf with headless Chrome. No extra dependencies.
// Run after a build: npm run resume:pdf
// Set CHROME_PATH if Chrome isn't in the default macOS location.
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PORT = 4330;
const PAGE = `http://127.0.0.1:${PORT}/resume/`;
const OUT = fileURLToPath(new URL('../public/resume.pdf', import.meta.url));
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Own process group, so stopping it also stops the astro server npx starts.
const preview = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
	stdio: 'ignore',
	detached: true,
});

async function waitForServer(timeoutMs = 20000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const res = await fetch(PAGE);
			if (res.ok) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 300));
	}
	throw new Error(`Preview server did not start on ${PAGE}`);
}

try {
	await waitForServer();
	execFileSync(CHROME, [
		'--headless=new',
		'--disable-gpu',
		'--no-pdf-header-footer',
		// Gives web fonts time to load before printing.
		'--virtual-time-budget=5000',
		`--print-to-pdf=${OUT}`,
		PAGE,
	], { stdio: 'inherit' });
	console.log(`Wrote ${OUT}`);
} finally {
	process.kill(-preview.pid);
}
