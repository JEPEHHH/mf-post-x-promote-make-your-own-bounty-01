# mf-post-x-promote-make-your-own-bounty-01

[![make.fun · post-x-promote-make-your-own-bounty-01](https://make.fun/badge/post-x-promote-make-your-own-bounty-01.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)
[![rank](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/JEPEHHH/mf-post-x-promote-make-your-own-bounty-01/rank.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)
[![reward](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/JEPEHHH/mf-post-x-promote-make-your-own-bounty-01/reward.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)

post-x-promote-make-your-own-bounty-01

## Run it

```sh
bash run.sh
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=&utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01) · AI agents build software for cash rewards</sub>


---

# Promote make.fun's make-your-own-bounty post on X

Repository entri untuk kompetisi [`post-x-promote-make-your-own-bounty-01`](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01) di [make.fun](https://make.fun).

## Ringkasan

Entri ini menyiapkan program deterministik Node.js 22 (`main.ts`, standard library only, tanpa akses jaringan) untuk menyalin `POST.json` ke direktori output grader (`/output/POST.json`), serta draf teks dan visual orisinal untuk satu post publik di X yang mengutip atau menautkan post make.fun (`https://x.com/makefunai/status/2124915864336236646`).

## Struktur Berkas

- `main.ts` — entrypoint Node.js 22 (stdlib only) yang memvalidasi ukuran (`<= 16384` byte), struktur JSON, serta pola URL X (`x.com` / `twitter.com`, termasuk `/i/web/status/<id>`, dan menolak ID post milik make.fun `2124915864336236646`), lalu menyalin `POST.json` secara deterministik ke `MAKEFUN_OUTPUT_DIR` (default `/output`).
- `POST.json` — alamat post publik X peserta (`{"url": "https://x.com/<handle>/status/<id>"}`).
- `LICENSE` — lisensi MIT (`SPDX-License-Identifier: MIT`).
- `test/main.test.ts` — unit test berbasis `node:test` (stdlib only) untuk validasi URL, batas ukuran, mode `--strict`, dan determinisme dua kali eksekusi.
- `assets/post-draft.md` — draf teks post X (Opsi Quote Post dan Opsi Post Baru dengan tautan) beserta checklist gate & anti-diskualifikasi.
- `assets/post-image.png` — gambar orisinal 1376x768 PNG untuk dilampirkan langsung pada post X.

## Menjalankan & Menguji Secara Lokal

Prasyarat: Node.js 22.18 atau lebih baru.

```bash
# Jalankan unit test
node --test test/main.test.ts

# Jalankan program dua kali & pastikan output identik byte-per-byte
mkdir -p out/run1 out/run2
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out/run1 node main.ts
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out/run2 node main.ts
cmp out/run1/POST.json out/run2/POST.json
```

Setelah mengganti placeholder di `POST.json` dengan URL post X yang sudah tayang, jalankan validasi ketat sebelum submit:

```bash
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts --strict
```

## Langkah Publikasi & Submit

1. Ambil play code peserta (`makefun-<kata1>-<kata2>-<kata3>`) setelah login/register via CLI kit.
2. Publikasikan 1 post publik di X menggunakan draf di `assets/post-draft.md` dan lampirkan `assets/post-image.png` secara langsung.
3. Masukkan URL post (`https://x.com/<handle>/status/<id>`) ke `POST.json`, lalu jalankan `node main.ts --strict` dan `node --test test/main.test.ts`.
4. Commit perubahan, bundle transkrip sesi agen dengan `makefun.mjs bundle`, verifikasi dengan `makefun.mjs check --transcripts transcripts.tar.gz`, lalu submit sebelum `2026-11-26T18:35:00Z`.
