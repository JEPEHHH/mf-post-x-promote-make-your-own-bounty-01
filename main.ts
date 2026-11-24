import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const POST_FILENAME = "POST.json";
export const MAX_POST_BYTES = 16384;
export const MAX_URL_LENGTH = 2048;
export const PROMOTED_STATUS_ID = "2124915864336236646";
export const PLACEHOLDER_URL = "https://x.com/<handle>/status/<id>";

const ALLOWED_X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
]);

const HANDLE_STATUS_RE = /^\/([A-Za-z0-9_]{1,15})\/status\/(\d{1,30})\/?$/;
const WEB_STATUS_RE = /^\/i\/web\/status\/(\d{1,30})\/?$/;

export interface ParsedXPost {
  host: string;
  handle: string | null;
  statusId: string;
  url: string;
}

export interface ValidatedPost {
  url: string;
  isPlaceholder: boolean;
  parsed: ParsedXPost | null;
}

export interface RunOptions {
  botDir?: string;
  outputDir?: string;
  strict?: boolean;
  warn?: (message: string) => void;
}

export function isPlaceholderUrl(value: string): boolean {
  return value.trim() === PLACEHOLDER_URL;
}

export function parseXStatusUrl(rawUrl: string): ParsedXPost {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    throw new Error("POST.json url must be a non-empty string");
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    throw new Error(
      `POST.json url exceeds maximum length of ${MAX_URL_LENGTH} characters`,
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`POST.json url is not a valid URL: ${trimmed}`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error("POST.json url must use https://");
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_X_HOSTS.has(host)) {
    throw new Error(
      `POST.json url host must be x.com or twitter.com (got ${host})`,
    );
  }

  let handle: string | null = null;
  let statusId: string | null = null;

  const handleMatch = HANDLE_STATUS_RE.exec(parsed.pathname);
  if (handleMatch) {
    handle = handleMatch[1];
    statusId = handleMatch[2];
  } else {
    const webMatch = WEB_STATUS_RE.exec(parsed.pathname);
    if (webMatch) {
      statusId = webMatch[1];
    }
  }

  if (!statusId) {
    throw new Error(
      "POST.json url must match https://x.com/<handle>/status/<id> or /i/web/status/<id> with digits-only id",
    );
  }

  if (statusId === PROMOTED_STATUS_ID) {
    throw new Error(
      `POST.json must name your own X post, not make.fun's post (${PROMOTED_STATUS_ID})`,
    );
  }

  return { host, handle, statusId, url: trimmed };
}

export function validatePostBuffer(
  rawBytes: Buffer,
  strict = false,
): ValidatedPost {
  if (rawBytes.byteLength === 0) {
    throw new Error("POST.json must not be empty");
  }
  if (rawBytes.byteLength > MAX_POST_BYTES) {
    throw new Error(
      `POST.json exceeds maximum size of ${MAX_POST_BYTES} bytes (got ${rawBytes.byteLength})`,
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBytes.toString("utf8"));
  } catch {
    throw new Error("POST.json is not valid JSON");
  }

  if (
    typeof parsedJson !== "object" ||
    parsedJson === null ||
    Array.isArray(parsedJson)
  ) {
    throw new Error("POST.json must contain a JSON object");
  }

  const urlValue = (parsedJson as Record<string, unknown>).url;
  if (typeof urlValue !== "string" || urlValue.trim().length === 0) {
    throw new Error("POST.json must include a non-empty string field 'url'");
  }

  const url = urlValue.trim();
  if (isPlaceholderUrl(url)) {
    if (strict) {
      throw new Error(
        "POST.json still contains the placeholder URL; replace it with your published X post URL before submitting",
      );
    }
    return { url, isPlaceholder: true, parsed: null };
  }

  const parsed = parseXStatusUrl(url);
  return { url: parsed.url, isPlaceholder: false, parsed };
}

export function serializePostPayload(url: string): Buffer {
  const payload = Buffer.from(`${JSON.stringify({ url })}\n`, "utf8");
  if (payload.byteLength > MAX_POST_BYTES) {
    throw new Error(
      `Serialized POST.json exceeds maximum size of ${MAX_POST_BYTES} bytes`,
    );
  }
  return payload;
}

export function run(options: RunOptions = {}): ValidatedPost {
  const botDir = resolve(options.botDir ?? process.env.MAKEFUN_BOT_DIR ?? ".");
  const outputDir = resolve(
    options.outputDir ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
  );
  const strict = options.strict ?? process.argv.includes("--strict");
  const warn =
    options.warn ?? ((message: string) => process.stderr.write(`${message}\n`));

  const inputPath = join(botDir, POST_FILENAME);
  const rawBytes = readFileSync(inputPath);
  const validated = validatePostBuffer(rawBytes, strict);

  if (validated.isPlaceholder) {
    warn(
      "Warning: POST.json still holds the placeholder URL. Replace it with your published X post URL before submitting.",
    );
  }

  const outputPayload = serializePostPayload(validated.url);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, POST_FILENAME), outputPayload);

  return validated;
}

const isDirectExecution =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  run();
}
