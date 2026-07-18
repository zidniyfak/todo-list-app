# RiserTask – Modern Minimalist To-Do List App

RiserTask adalah aplikasi pengelola tugas harian yang modern, elegan, dan dirancang dengan pendekatan **Mobile-First** serta berorientasi pada kemudahan aksesibilitas (accessibility). Proyek ini dibangun sebagai bagian dari Course Project di Harisenin.

---

## ✨ Fitur Utama

- **Pendekatan Mobile-First & Desain Premium**: Tata letak yang adaptif sepenuhnya dari ponsel hingga tampilan dasbor kartu ganda (2-kolom) terpusat pada desktop.
- **Kategori Navigasi Tugas**:
  - 📝 **To Do**: Daftar semua tugas aktif yang belum selesai.
  - ✅ **Done**: Daftar semua tugas yang berhasil diselesaikan dengan transisi perpindahan mulus.
  - ⏰ **Overdue**: Daftar tugas yang telah melewati tenggat hari ini (namun tetap tampil di tab "To Do" untuk visibilitas optimal).
- **Semantik & Aksesibilitas Tinggi**:
  - Menggunakan elemen `<select>` dan `<option>` native overlay untuk dialog pemilihan prioritas yang handal di mobile, namun mempertahankan keindahan desain kustom visual di belakangnya.
  - Atribut ARIA lengkap (`aria-pressed`, `aria-label`, `aria-hidden`) yang ramah pembaca layar (_screen reader_).
  - Skala ukuran huruf minimal `14px` untuk menjamin kenyamanan baca.
- **Penyimpanan Lokal (Local Storage)**: Menyimpan daftar tugas secara otomatis di browser sehingga data Anda tetap aman dan tidak hilang saat halaman dimuat ulang (refresh).
- **Konfirmasi Modal & Pemberitahuan Toast**:
  - Dialog modal konfirmasi kustom dengan efek _glassmorphism blur_ yang mewah saat menghapus satu/semua tugas.
  - Notifikasi _toast_ interaktif dengan animasi masuk (_slide-in_) yang responsif.
- **Custom WebKit Scrollbar**: Scrollbar ramping dan minimalis khusus untuk perangkat desktop.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Markup semantik dan terstruktur.
- **CSS3 (Vanilla)**: Menggunakan metodologi penamaan **BEM (Block Element Modifier)** yang konsisten untuk kemudahan pemeliharaan kode jangka panjang.
- **JavaScript (Vanilla)**: Manipulasi DOM murni tanpa pustaka (_libraries_) pihak ketiga guna memastikan performa maksimal dan kemudahan pembelajaran bagi developer junior.

---

## 📂 Struktur Direktori

```text
todo-list-app/
├── assets/
│   ├── brands/          # Logo Aplikasi
│   ├── icons/           # Ikon SVG/Media
│   └── img/
│       └── avatar.jpg   # Gambar Profil Pengguna
├── css/
│   ├── global.css       # Variabel CSS & CSS Resets
│   └── style.css        # Gaya Tampilan Komponen & Media Queries
├── js/
│   └── script.js        # Logika Fungsional Aplikasi (Vanilla JS)
├── index.html           # File Utama Aplikasi
└── README.md            # Dokumentasi Proyek
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini tidak memerlukan instalasi peladen (_server_) atau dependensi Node.js. Anda cukup:

1. Unduh atau salin seluruh repositori ini.
2. Buka berkas `index.html` langsung di browser favorit Anda (Google Chrome, Firefox, Safari, Microsoft Edge).
3. Anda siap mengelola tugas Anda dengan FocusTask!

---

## ✍️ Kontributor

- **Zidniy Farih A.K.** – _Fullstack Web Developer_
