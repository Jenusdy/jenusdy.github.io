# Project Knowledge & Developer Guide: jenusdy.github.io

Dokumen ini berisi ringkasan arsitektur, struktur proyek, workflow, serta panduan operasional agar developer (manusia maupun AI agent) dapat langsung memahami dan mengelola codebase ini tanpa hambatan.

---

## 1. Ringkasan Proyek

- **Nama Proyek:** `jenusdy.github.io` (Portfolio & Technical Blog Fawcet Jenusdy Makay)
- **Live URL:** [https://jenusdy.github.io/](https://jenusdy.github.io/)
- **Core Framework:** [Gatsby v5](https://www.gatsbyjs.com/) (Node >= 18)
- **Theme:** [`gatsby-theme-portfolio-minimal`](https://github.com/konstantinmuenster/gatsby-theme-portfolio-minimal)
- **UI Library:** React 18
- **Tipe Aplikasi:** Static Site Generator (SSG) headless berbasis konten JSON dan Markdown. Tidak memiliki backend/database eksternal; semua data dikompilasi menjadi static HTML/JS di folder `public/`.
- **Deployment:** GitHub Pages via GitHub Actions (`.github/workflows/gatsby.yml`).

---

## 2. Struktur Direktori Utama

```text
.
├── content/                     # Data utama situs (konten, metadata, dan gambar)
│   ├── articles/                # Artikel blog dalam format Markdown (.md)
│   │   ├── cyberbreaker-season-3/
│   │   ├── first-commit/
│   │   ├── fortivpn-linux/
│   │   └── patriot-ctf-2025/
│   ├── images/                  # Aset gambar lokal
│   │   ├── articles/            # Banner & gambar pendukung tiap artikel
│   │   ├── icon-skill/          # Logo tech stack / keahlian
│   │   └── projects/            # Screenshot / mockup proyek
│   ├── sections/                # Modul konten untuk section halaman utama
│   │   ├── about/about.md       # Teks deskripsi "About Me"
│   │   ├── contact/contact.json # Konfigurasi section kontak
│   │   ├── hero/hero.json       # Banner perkenalan, foto, headline, dan bio
│   │   ├── interests/           # Daftar skill/interests dan icon
│   │   ├── legal/               # Privacy policy & Imprint (.md)
│   │   └── projects/            # Daftar portfolio proyek yang ditampilkan
│   └── settings.json            # Konfigurasi global situs, SEO, social link, navigasi, dark mode
│
├── src/
│   ├── components/
│   │   └── CommentSection/      # Komponen komentar blog (Giscus / Utterances)
│   ├── gatsby-theme-portfolio-minimal/ # Shadowed template & komponen tema
│   │   └── templates/Article/   # Template artikel yang di-extend untuk komentar
│   └── pages/                   # Template halaman Gatsby
│       ├── index.js             # Halaman beranda utama (menggabungkan komponen section)
│       ├── imprint.js           # Halaman Imprint / Legal Notice
│       └── privacy.js           # Halaman Privacy Policy
│
├── static/                      # File statis yang disalin langsung ke root build
│   └── Resume - Fawcet Jenusdy Makay.pdf
│
├── .github/workflows/gatsby.yml # CI/CD pipeline GitHub Actions untuk deploy ke GitHub Pages
├── Dockerfile & Dockerfile.dev  # Konfigurasi containerization (production & development)
├── docker-compose.yml           # Orchestration Docker
├── gatsby-config.js             # Konfigurasi plugin Gatsby & theme options
└── package.json                 # Daftar dependency dan npm scripts
```

---

## 3. Alur & Konfigurasi Gatsby (`gatsby-config.js`)

Tema dikonfigurasi melalui plugin `gatsby-theme-portfolio-minimal`:
- `siteUrl`: `https://jenusdy.github.io/`
- `contentDirectory`: `./content` (sumber seluruh data section dan artikel)
- `blogSettings`:
  - `path: "/blog"`: Halaman daftar artikel blog.
  - `usePathPrefixForArticles: false`: URL artikel blog langsung menggunakan slug artikel (contoh: `https://jenusdy.github.io/first-commit/` bukan `/blog/first-commit/`).

---

## 4. Panduan Menjalankan & Mengembangkan (Runbook)

### Prasyarat
- Node.js versi 18 atau lebih baru (direkomendasikan Node 20 LTS).
- Package manager `npm`.

### Perintah NPM
| Perintah | Deskripsi |
| :--- | :--- |
| `npm install` | Menginstal semua dependencies. |
| `npm run develop` | Menjalankan local development server di `http://localhost:8000` (GraphiQL di `http://localhost:8000/___graphql`). Mendukung Hot Module Replacement (HMR). |
| `npm run build` | Membuat build static produksi yang optimal ke direktori `public/`. |
| `npm run serve` | Menjalankan server lokal untuk mempratinjau hasil build produksi di `http://localhost:9000`. |
| `npm run clean` | Menghapus cache Gatsby (`.cache/` dan `public/`). **Wajib dijalankan jika terjadi inkonsistensi GraphQL schema, error gambar, atau perubahan config.** |

### Menjalankan dengan Docker
```bash
# Development (port 8000)
docker compose up -d gatsby-dev

# Production (port 9000)
docker compose up -d gatsby-prod

# Menghentikan container
docker compose down
```

---

## 5. Panduan Modifikasi & Penambahan Konten

### A. Menambahkan Artikel Blog Baru
1. Buat folder baru di `content/articles/<slug-artikel>/`.
2. Buat file `index.md` di dalamnya dengan frontmatter:
   ```markdown
   ---
   title: "Judul Artikel"
   description: "Deskripsi singkat artikel untuk SEO & preview."
   date: "YYYY-MM-DD"
   banner:
     src: "../../images/articles/<slug-artikel>/thumbnail.webp"
     alt: "Deskripsi Gambar"
   categories:
     - "Blog"
     - "Tutorial"
   keywords:
     - "Keyword1"
     - "Keyword2"
   ---

   Isi artikel dalam Markdown...
   ```
3. Simpan gambar thumbnail di `content/images/articles/<slug-artikel>/`.

### B. Menambahkan / Mengedit Proyek di Beranda
1. Buka file `content/sections/projects/projects.json`.
2. Tambahkan entri pada array `"projects"`:
   ```json
   {
     "visible": true,
     "category": "Web / Application / Security",
     "title": "Nama Proyek",
     "description": "Deskripsi proyek...",
     "tags": ["Vue 3", "TailwindCSS"],
     "image": {
       "src": "../../images/projects/nama-file.png",
       "alt": "Nama Proyek",
       "linkTo": "https://url-tujuan.com"
     },
     "links": [
       { "type": "github", "url": "https://github.com/..." },
       { "type": "external", "url": "https://..." }
     ]
   }
   ```
3. Simpan aset screenshot di `content/images/projects/`.

### C. Menambahkan / Mengubah Skill / Keahlian
1. Buka `content/sections/interests/interests.json`.
2. Tambahkan nama skill dan referensi gambar icon dari `content/images/icon-skill/`.

### D. Mengubah Profil, Bio, & Social Media
- **Foto & Hero Headline:** `content/sections/hero/hero.json`
- **Tentang Saya:** `content/sections/about/about.md`
- **Social Media & SEO:** `content/settings.json` (bagian `siteMetadata.social` dan `siteConfiguration`).

### E. Memperbarui File Resume (CV)
1. Letakkan file PDF baru di `static/` (misalnya `static/Resume - Fawcet Jenusdy Makay.pdf`).
2. Sesuaikan tautan pada tombol CTA di `content/settings.json` (`siteConfiguration.navigation.ctaButton.url`).

### F. Mengonfigurasi & Mengelola Fitur Komentar Blog
Fitur komentar disematkan di setiap halaman artikel blog menggunakan sistem komentar pihak ketiga berbasis GitHub (default: **Giscus** via GitHub Discussions, dengan opsi **Utterances** via GitHub Issues).

1. **File Konfigurasi:** [`src/components/CommentSection/config.js`](src/components/CommentSection/config.js)
   - `enabled`: `true` atau `false` untuk mengaktifkan/menonaktifkan komentar secara global.
   - `provider`: `'giscus'` atau `'utterances'`.
   - `giscus`: Konfigurasi repository (`repo`, `repoId`, `category`, `categoryId`, `mapping`, `reactionsEnabled`, dll).
   - `utterances`: Konfigurasi repository (`repo`, `issueTerm`, `label`).
2. **Sinkronisasi Tema Real-Time:** Komponen secara otomatis mendeteksi perubahan tema (Dark / Light) dari context theme (`useGlobalState`) dan mengirim event `postMessage` ke iframe Giscus tanpa reload halaman.
3. **Template Shadowing:** Komponen diintegrasikan melalui Gatsby Theme Component Shadowing pada template [`src/gatsby-theme-portfolio-minimal/templates/Article/index.tsx`](src/gatsby-theme-portfolio-minimal/templates/Article/index.tsx).
4. **Langkah Aktivasi di GitHub:**
   - Aktifkan GitHub Discussions: *GitHub Repository > Settings > Features > centang Discussions*.
   - Pasang Giscus GitHub App: [https://github.com/apps/giscus](https://github.com/apps/giscus) dan izinkan akses ke repo `jenusdy.github.io`.

---

## 6. Pipeline CI/CD & Deploy

- Branch default: `main`.
- Setiap push ke `main` secara otomatis memicu `.github/workflows/gatsby.yml`.
- Workflow akan meng-cache build, menjalankan `npm ci` dan `npm run build` dengan `PREFIX_PATHS: 'true'`, lalu mengunggah artifact ke **GitHub Pages**.

---

## 7. Catatan Teknis & Troubleshooting

1. **Warning Plugin Manifest (`gatsby-plugin-manifest`)**:
   - Peringatan *"Plugin gatsby-plugin-manifest is not compatible with your gatsby version 5.x"* berasal dari dependensi internal theme dan aman diabaikan (tidak memengaruhi build maupun jalannya aplikasi).
2. **Warning GraphQL Type `MarkdownRemark`**:
   - Muncul karena theme melakukan kustomisasi tipe skema; aman diabaikan.
3. **Cache Invalidation**:
   - Jika halaman tidak memuat perubahan Markdown/JSON atau terjadi error schema, jalankan:
     ```bash
     npm run clean && npm run develop
     ```
