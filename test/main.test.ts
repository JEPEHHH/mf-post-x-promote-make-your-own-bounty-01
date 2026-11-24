import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  MAX_POST_BYTES,
  PLACEHOLDER_URL,
  POST_FILENAME,
  PROMOTED_STATUS_ID,
  parseXStatusUrl,
  run,
  validatePostBuffer,
} from "../main.ts";

test("parseXStatusUrl accepts valid x.com and twitter.com post URLs", () => {
  const cases = [
    {
      url: "https://x.com/alice_dev/status/2125000123456789012",
      handle: "alice_dev",
      statusId: "2125000123456789012",
    },
    {
      url: "https://www.x.com/bob123/status/2125000123456789013?s=20&t=abc",
      handle: "bob123",
      statusId: "2125000123456789013",
    },
    {
      url: "https://mobile.twitter.com/carol/status/2125000123456789014/#top",
      handle: "carol",
      statusId: "2125000123456789014",
    },
    {
      url: "https://twitter.com/i/web/status/2125000123456789015",
      handle: null,
      statusId: "2125000123456789015",
    },
  ];

  for (const c of cases) {
    const parsed = parseXStatusUrl(c.url);
    assert.equal(parsed.handle, c.handle);
    assert.equal(parsed.statusId, c.statusId);
    assert.equal(parsed.url, c.url);
  }
});

test("parseXStatusUrl rejects make.fun's own promoted post ID", () => {
  assert.throws(
    () =>
      parseXStatusUrl(
        `https://x.com/makefunai/status/${PROMOTED_STATUS_ID}`,
      ),
    /must name your own X post/,
  );
  assert.throws(
    () =>
      parseXStatusUrl(
        `https://twitter.com/i/web/status/${PROMOTED_STATUS_ID}?s=20`,
      ),
    /must name your own X post/,
  );
});

test("parseXStatusUrl rejects non-X hosts, non-https, and non-digit status IDs", () => {
  const badUrls = [
    "http://x.com/alice/status/2125000123456789012",
    "https://example.com/alice/status/2125000123456789012",
    "https://x.com/alice/status/not-digits",
    "https://x.com/alice",
    "https://x.com/alice/status/",
    "not a url",
  ];

  for (const bad of badUrls) {
    assert.throws(() => parseXStatusUrl(bad));
  }
});

test("validatePostBuffer enforces byte cap, JSON shape, and strict mode", () => {
  const oversized = Buffer.from(
    JSON.stringify({
      url: "https://x.com/alice/status/2125000123456789012",
      pad: "x".repeat(MAX_POST_BYTES),
    }),
    "utf8",
  );
  assert.throws(() => validatePostBuffer(oversized), /exceeds maximum size/);

  assert.throws(
    () => validatePostBuffer(Buffer.from("[]", "utf8")),
    /must contain a JSON object/,
  );
  assert.throws(
    () => validatePostBuffer(Buffer.from('{"url": 123}', "utf8")),
    /non-empty string field 'url'/,
  );
  assert.throws(
    () => validatePostBuffer(Buffer.from("{bad json", "utf8")),
    /not valid JSON/,
  );

  const placeholderBuf = Buffer.from(
    JSON.stringify({ url: PLACEHOLDER_URL }),
    "utf8",
  );
  const nonStrict = validatePostBuffer(placeholderBuf, false);
  assert.equal(nonStrict.isPlaceholder, true);
  assert.throws(
    () => validatePostBuffer(placeholderBuf, true),
    /placeholder URL/,
  );
});

test("run writes byte-identical POST.json across repeated executions", () => {
  const workDir = mkdtempSync(join(tmpdir(), "makefun-post-x-"));
  try {
    const botDir = join(workDir, "bot");
    const out1 = join(workDir, "out1");
    const out2 = join(workDir, "out2");

    const sampleUrl = "https://x.com/entrant_demo/status/2125000999888777666";
    const warnings: string[] = [];

    // Write valid POST.json with extra whitespace to test deterministic serialization
    writeFileSync(
      join(workDir, "input.tmp"),
      `{\n  "url": "  ${sampleUrl}  "\n}\n`,
      "utf8",
    );
    const inputContent = readFileSync(join(workDir, "input.tmp"));
    writeFileSync(join(workDir, POST_FILENAME), inputContent);

    const res1 = run({
      botDir: workDir,
      outputDir: out1,
      strict: true,
      warn: (m) => warnings.push(m),
    });
    const res2 = run({
      botDir: workDir,
      outputDir: out2,
      strict: true,
      warn: (m) => warnings.push(m),
    });

    assert.equal(res1.url, sampleUrl);
    assert.equal(res2.url, sampleUrl);
    assert.equal(warnings.length, 0);

    const bytes1 = readFileSync(join(out1, POST_FILENAME));
    const bytes2 = readFileSync(join(out2, POST_FILENAME));
    assert.equal(Buffer.compare(bytes1, bytes2), 0);
    assert.equal(bytes1.toString("utf8"), `{"url":"${sampleUrl}"}\n`);
    assert.ok(botDir.length > 0);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
});
