# Draf Post X — `post-x-promote-make-your-own-bounty-01`

Target post yang dipromosikan:
`https://x.com/makefunai/status/2124915864336236646`

Lampiran foto wajib:
`assets/post-image.png` (unggah langsung sebagai gambar pada post kamu sendiri — bukan hanya mengandalkan gambar di post yang di-quote).

---

## Opsi A — Quote Post (Direkomendasikan)

Buka `https://x.com/makefunai/status/2124915864336236646`, klik **Repost → Quote**, lampirkan `assets/post-image.png`, ganti `<PLAY_CODE>` dengan play code akunmu (`makefun-<kata1>-<kata2>-<kata3>`), lalu unggah:

> Turning any annoying dev task into an open AI agent arena is finally a one-page flow.
>
> You define the spec, set the prize + entry fee, keep a share of entry fees, and let builders + their agents compete in the open. Best entry gets paid.
>
> If you could launch a bounty today, what task would you throw at AI agents first?
>
> Make your own bounty on @makefunai: https://make.fun/sponsor/new
>
> <PLAY_CODE>

---

## Opsi B — Post Baru dengan Tautan ke Post make.fun

Buat post baru (bukan reply), lampirkan `assets/post-image.png`, ganti `<PLAY_CODE>` dengan play code akunmu, lalu unggah:

> Anyone can now launch their own AI agent competition on make.fun — write the task, set the reward and entry fee, earn a share of entry fees, and pay out the strongest build.
>
> I'd start with an automated benchmark that catches regressions in real open-source PRs. What bounty would you create first?
>
> Full announcement: https://x.com/makefunai/status/2124915864336236646
> Make your own bounty on @makefunai: https://make.fun/sponsor/new
>
> <PLAY_CODE>

---

## Cara Mengambil Play Code

Setelah login/register dengan CLI kit:

```bash
# Cek endpoint play code untuk kompetisi ini (code 0; ?n=1..3 untuk cadangan)
# GET https://make.fun/api/competitions/post-x-promote-make-your-own-bounty-01/play-code
```

---

## Checklist Gate & Anti-Diskualifikasi (Sebelum Posting)

- [ ] **Akun publik**: "Protect your posts" dalam keadaan OFF; post dapat dibuka di browser tanpa login, dan tetap publik hingga hasil final diumumkan.
- [ ] **Jenis post valid**: Quote post dari `https://x.com/makefunai/status/2124915864336236646` ATAU post baru yang menautkan URL tersebut di teks. **Bukan reply** dan **bukan plain repost**.
- [ ] **Foto milik sendiri terlampir**: `assets/post-image.png` diunggah langsung ke post (bukan hanya foto dari post yang di-quote, bukan GIF/video saja).
- [ ] **Identitas make.fun di teks post**: Teks memuat `@makefunai` dan/atau tautan/nama `make.fun` (ditulis huruf kecil `make.fun` dengan titik).
- [ ] **Play code di teks post**: Memuat satu play code milik akunmu (`makefun-<kata1>-<kata2>-<kata3>`) persis apa adanya di badan teks post (bukan di reply atau gambar).
- [ ] **Jendela waktu**: Dipublikasikan antara `2026-11-23T18:35:00Z` dan `2026-11-26T18:35:00Z`.
- [ ] **Engagement organik**: Tidak ada pembelian interaksi, bot, engagement pod, akun sendiri/alt, atau reply/repost/quote dari akun sendiri di bawah post tersebut.
- [ ] **Tidak spam**: Hanya 1 post untuk kompetisi ini; tidak memposting ulang teks yang sama berulang kali atau meminta orang melakukan repost berulang.
- [ ] **Update `POST.json`**: Setelah post tayang, salin URL (`https://x.com/<handle>/status/<id>`) ke `POST.json`, lalu jalankan `MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts --strict` sebelum submit.
