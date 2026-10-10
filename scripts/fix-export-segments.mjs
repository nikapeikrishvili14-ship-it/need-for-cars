// Runs after `next build` (npm "postbuild").
//
// Works around a Windows-only bug in Next.js's static export: the per-segment
// prefetch files should be written as "__next.$d$locale.__PAGE__.txt", but on
// Windows the path separator is "\" instead of "/", so Next writes nested
// folders "__next.$d$locale/__PAGE__.txt" instead. The browser asks for the
// dotted name, gets a 404 and logs console errors on every page.
// (node_modules/next/dist/export/index.js → convertSegmentPathToStaticExportFilename)
//
// This moves each nested file to its dotted name. Builds made on Linux/macOS
// already have the right names, so there it changes nothing.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const outDir = "out";
let moved = 0;

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      await walk(path);
      continue;
    }
    // out/en/__next.$d$locale/cars/$d$slug/__PAGE__.txt → out/en/__next.$d$locale.cars.$d$slug.__PAGE__.txt
    for (const file of await files(path)) {
      const dotted = entry.name + "." + file.slice(path.length + 1).split(/[\\/]/).join(".");
      await rename(file, join(dir, dotted));
      moved++;
    }
    await rm(path, { recursive: true });
  }
}

if (await stat(outDir).catch(() => null)) {
  await walk(outDir);
  if (moved) console.log(`fix-export-segments: renamed ${moved} prefetch files (Windows build)`);
}
