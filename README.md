# Promote make.fun's make-your-own-bounty post on X

Repository entri untuk kompetisi [`post-x-promote-make-your-own-bounty-01`](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01) di [make.fun](https://make.fun).

## Ringkasan

Entri ini menyiapkan program deterministik Node.js 22 (`main.ts`, standard library only, tanpa akses jaringan) untuk menyalin `POST.json` ke direktori output grader (`/output/POST.json`), serta draf teks dan visual orisinal untuk satu post publik di X yang mengutip atau menautkan post make.fun (`https://x.com/makefunai/status/2124915864336236646`).

## Struktur Berkas

- `main.ts` — entrypoint Node.js 22 (stdlib only) yang memvalidasi dan menyalin `POST.json` ke `MAKEFUN_OUTPUT_DIR` (default `/output`).
- `POST.json` — alamat post publik X peserta (`{"url": "https://x.com/<handle>/status/<id>"}`).
- `LICENSE` — lisensi MIT (OSI-approved).
- `assets/post-draft.md` — draf teks post X dan checklist syarat gate.
- `assets/post-image.png` — gambar orisinal untuk dilampirkan langsung pada post X.

## Menjalankan Secara Lokal

Prasyarat: Node.js 22.18 atau lebih baru.

```bash
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Program ini deterministik: menjalankan perintah di atas dua kali menghasilkan berkas `out/POST.json` yang identik byte-per-byte.
