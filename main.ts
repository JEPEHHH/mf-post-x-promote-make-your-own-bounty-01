import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const POST_FILENAME = "POST.json";

function main(): void {
  const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
  const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

  const inputPath = join(botDir, POST_FILENAME);
  const raw = readFileSync(inputPath, "utf8");
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("POST.json must contain a JSON object");
  }

  if (typeof parsed.url !== "string" || parsed.url.trim().length === 0) {
    throw new Error("POST.json must include a non-empty string field 'url'");
  }

  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, POST_FILENAME);
  const serialized = `${JSON.stringify({ url: parsed.url.trim() })}\n`;
  writeFileSync(outputPath, serialized, "utf8");
}

main();
