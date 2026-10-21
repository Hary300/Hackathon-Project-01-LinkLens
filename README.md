# LinkLens

LinkLens membantu memeriksa indikator risiko pada sebuah URL sebelum pengguna membukanya. Aplikasi menyediakan pemeriksaan struktur URL secara lokal dan pemeriksaan reputasi eksternal melalui Google Safe Browsing serta RDAP.

> Hasil pemeriksaan adalah petunjuk, bukan jaminan. URL yang tidak terdeteksi tetap bisa berbahaya, dan satu indikator saja tidak selalu berarti penipuan.

## Fitur

### Pemeriksaan lokal

Menganalisis struktur URL tanpa mengirimnya ke layanan eksternal, antara lain:

- Hostname berupa alamat IP.
- Informasi sebelum karakter `@`.
- Subdomain bertingkat atau panjang dan hostname yang sangat panjang.
- Banyak tanda hubung atau angka.
- Domain Punycode.
- Nama domain yang ditempel sebagai subdomain atau menyerupai brand yang dikenal.
- Penggunaan HTTP dan port yang tidak umum.
- Kata tertentu pada path/query, banyak parameter, URL panjang, dan karakter encoding.
- Path yang berakhir dengan ekstensi file yang dapat dijalankan.
- Domain shortener, parameter redirect, dan tujuan eksternal yang dicantumkan pada parameter tersebut.

Pemeriksaan lokal hanya melihat alamat URL. Pemeriksaan ini tidak membuka halaman, mengikuti redirect, memindai file, atau memastikan isi situs.

### Pemeriksaan reputasi eksternal

Mengirim URL ke Google Safe Browsing untuk memeriksa kecocokan phishing/malware dan meminta data pendaftaran domain melalui RDAP. Hasilnya menunjukkan status **Terdeteksi**, **Tidak ditemukan**, atau **Tidak dapat diperiksa** untuk tiap indikator.

- Kecocokan daftar ancaman Google bukan skor reputasi menyeluruh untuk seluruh domain.
- Usia domain yang baru terdaftar adalah sinyal tambahan, bukan bukti penipuan.
- RDAP mungkin tidak menyediakan data untuk sebagian domain.
- Saat memilih pemeriksaan eksternal, URL dikirim ke Google Safe Browsing dan domain yang didaftarkan ditanyakan ke RDAP.

## Persyaratan

- Node.js dan npm.
- Untuk pemeriksaan lokal: tidak memerlukan API key.
- Untuk pemeriksaan eksternal: API key Google Cloud dengan **Safe Browsing API** yang diaktifkan, serta koneksi internet.

## Menjalankan secara lokal

1. Pasang dependensi:

   ```bash
   npm install
   ```

2. Buat file `.env.local` di direktori utama proyek untuk mengaktifkan pemeriksaan eksternal:

   ```text
   SAFE_BROWSING_API_KEY=isi-dengan-api-key-anda
   SAFE_BROWSING_API_URL=https://safebrowsing.googleapis.com/v4/threatMatches:find
   ```

   API key hanya digunakan oleh server. Jangan menambahkan awalan `NEXT_PUBLIC_` dan jangan membagikan atau memasukkan `.env.local` ke Git.

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

4. Buka alamat yang ditampilkan di terminal, biasanya `http://localhost:3000`.

Tanpa API key, pemeriksaan lokal tetap dapat digunakan. Pemeriksaan eksternal akan menandai pemeriksaan Google sebagai **Tidak dapat diperiksa** jika konfigurasinya belum tersedia.

## Perintah proyek

```bash
npm run dev    # Menjalankan server pengembangan
npm run lint   # Menjalankan ESLint
npm test       # Menjalankan test dengan Vitest
npm run build  # Membuat build produksi
npm start      # Menjalankan build produksi
```

## Privasi dan penggunaan

- Mode lokal tidak mengirim URL ke Google atau RDAP.
- Mode eksternal mengirim URL ke Google Safe Browsing dan melakukan pencarian domain melalui RDAP.
- Jangan memasukkan URL pribadi yang memuat token, kode akses, atau informasi rahasia, terutama saat menggunakan pemeriksaan eksternal.
- Safe Browsing API ditujukan untuk penggunaan nonkomersial. Untuk deteksi URL berbahaya dalam produk komersial, tinjau Google Web Risk dan ketentuan layanan terkait.

## Batasan

- HTTPS hanya mengenkripsi koneksi; HTTPS tidak membuktikan bahwa pemilik situs tepercaya.
- HTTP, port nonstandar, domain baru, URL panjang, kata seperti `login`, atau penggunaan URL shortener bukan bukti penipuan jika berdiri sendiri.
- Daftar brand dan pola yang digunakan pemeriksaan lokal terbatas dan dapat menghasilkan peringatan yang keliru atau melewatkan ancaman.
- Hasil negatif dari layanan reputasi bukan jaminan bahwa URL aman.
- LinkLens tidak mengunjungi URL yang diperiksa secara otomatis.
