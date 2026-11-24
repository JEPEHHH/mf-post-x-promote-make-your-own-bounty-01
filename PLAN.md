# Rencana Kerja: post-x-promote-make-your-own-bounty-01

Target: 1 post publik di X yang mengutip/menautkan post make.fun (`https://x.com/makefunai/status/2124915864336236646`), melampirkan foto sendiri, memuat `make.fun`/`@makefunai` serta play code peserta, lalu menyerahkan URL post melalui `POST.json` dan `main.ts`.

## Tahapan Kerja
1. **Verifikasi prasyarat**: cek Node.js >= 22.18, konfirmasi akun X publik (tidak diproteksi), dan ambil play code peserta (`makefun-<kata1>-<kata2>-<kata3>`).
2. **Draf teks & visual post**: tulis teks asli (bukan template) yang memuat ajakan membuat bounty di `@makefunai` (`https://make.fun/sponsor/new`), tautan/quote post make.fun, dan play code; buat foto orisinal (jika memakai mark/warna make.fun, ambil utuh dari `https://make.fun/press/manifest.json`).
3. **Publikasi post di X**: unggah 1 post publik beserta foto dalam jendela kompetisi, pastikan tetap publik hingga hasil keluar, lalu catat URL `https://x.com/<handle>/status/<id>`.
4. **Implementasi repo (commit tiap milestone)**:
   - Tulis `LICENSE` (MIT), `README.md`, `POST.json`, dan `main.ts` langsung dengan file tool di sesi ini (bukan menyalin starter) agar lolos `thinking_reproduces`.
   - Lakukan revisi pada `main.ts` (validasi bentuk URL & batas ukuran `POST.json` <= 16384 byte, deterministik tanpa jaringan/clock) agar lolos `thinking_revised`.
5. **Uji lokal & verifikasi kit**:
   - Jalankan `mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts` dan pastikan `out/POST.json` identik pada 2 kali run.
   - Jalankan `node cli/makefun.mjs check` dan siapkan submission beserta bundle transkrip sesi.

## Daftar Berkas yang Akan Dibuat
- `main.ts` — entrypoint Node 22 (stdlib only) untuk menyalin `POST.json` ke `/output/POST.json`.
- `POST.json` — objek JSON berisi `{"url": "https://x.com/<handle>/status/<id>"}`.
- `LICENSE` — lisensi OSI-approved (MIT) di root repo.
- `README.md` — dokumentasi singkat entri dan cara menjalankan `main.ts`.
- `assets/post-draft.md` — draf teks post X beserta checklist syarat gate.
- `assets/post-image.png` — gambar orisinal untuk dilampirkan pada post X.
- `.makefun/owner.json` — (opsional) klaim kepemilikan wallet Solana jika repo tidak memakai akun GitHub yang login.

## Aturan Kunci yang Dijaga
- Tidak menyalin kode starter/eksternal; semua berkas ditulis langsung dengan file tool.
- Post bukan reply/repost polos, wajib melampirkan foto sendiri, dan bebas engagement palsu/bot/akun sendiri.
- Commit setiap milestone; tidak mengubah berkas `starter/`, `harness/`, atau `RULES.txt`.
