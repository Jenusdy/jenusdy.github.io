# Jenusdy's Portfolio & Blog (`jenusdy.github.io`)

[![Deploy Gatsby site to Pages](https://github.com/Jenusdy/jenusdy.github.io/actions/workflows/gatsby.yml/badge.svg)](https://github.com/Jenusdy/jenusdy.github.io/actions/workflows/gatsby.yml)
[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fjenusdy.github.io&up_message=online&label=Site%20Status&logo=github)](https://jenusdy.github.io/)
[![Gatsby](https://img.shields.io/badge/Gatsby-5.16-663399?style=flat&logo=gatsby&logoColor=white)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Comments: Giscus](https://img.shields.io/badge/Comments-Giscus-058a5e?style=flat&logo=github)](https://giscus.app)
[![License: 0BSD](https://img.shields.io/badge/License-0BSD-blue.svg)](LICENSE)

Personal portfolio and technical blog website for **Fawcet Jenusdy Makay**, showcasing projects, cybersecurity writeups, software engineering work, and technical articles. Built with [Gatsby v5](https://www.gatsbyjs.com/) and [`gatsby-theme-portfolio-minimal`](https://github.com/konstantinmuenster/gatsby-theme-portfolio-minimal).

- 🌐 **Live Website:** [https://jenusdy.github.io/](https://jenusdy.github.io/)
- 📖 **Comprehensive Developer Guide:** See [AGENTS.md](AGENTS.md) for detailed architecture, content schemas, and runbook.

---

## ✨ Features

- **Blazing Fast Static Site:** Powered by Gatsby v5 SSG with image optimization and offline caching.
- **Dark / Light Theme:** Native theme toggle with responsive styling.
- **Technical Blog & Writeups:** Markdown-driven articles with syntax highlighting, tag taxonomies, and rich previews.
- **GitHub-Powered Comments:** Real-time Discussion and Comments on every blog post powered by [Giscus](https://giscus.app/) with automated dark/light mode synchronization.
- **Automated CI/CD Pipeline:** Fully automated build, cache, and deployment to GitHub Pages on every push to `main` via GitHub Actions.
- **Containerized Development:** Pre-configured Docker & Docker Compose setup for consistent development and preview environments.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js:** `>= 18.0.0` (Recommended: Node 20 LTS)
- **Package Manager:** `npm` (bundled with Node.js)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Jenusdy/jenusdy.github.io.git
cd jenusdy.github.io

# 2. Install dependencies
npm install

# 3. Start local development server with hot-reload
npm run develop
```

- Site local preview: [http://localhost:8000](http://localhost:8000)
- GraphiQL explorer: [http://localhost:8000/___graphql](http://localhost:8000/___graphql)

### Docker Environment (Optional)

```bash
# Development container (port 8000)
docker compose up -d gatsby-dev

# Production preview container (port 9000)
docker compose up -d gatsby-prod

# Stop containers
docker compose down
```

### Production Build & Serve

```bash
# Build optimized static assets into public/
npm run build

# Serve the static build locally at http://localhost:9000
npm run serve

# Clear Gatsby cache if needed
npm run clean
```

---

## 📁 Project Structure

```text
.
├── .github/workflows/
│   └── gatsby.yml               # Automated CI/CD pipeline for GitHub Pages
├── content/                     # All content, metadata, and media
│   ├── articles/                # Blog posts & CTF writeups (.md)
│   ├── images/                  # Thumbnails, article images, project screenshots
│   ├── sections/                # Modular homepage sections (hero, about, projects, skills)
│   └── settings.json            # Global site metadata, navigation, and SEO settings
├── src/
│   ├── components/
│   │   └── CommentSection/      # Giscus & Utterances blog comment integration
│   ├── gatsby-theme-portfolio-minimal/ # Shadowed theme templates (Article)
│   └── pages/                   # Gatsby top-level pages
├── static/                      # Static public files (Resume / CV PDF)
├── AGENTS.md                    # In-depth architectural & developer guide
├── gatsby-config.js             # Gatsby plugins & theme configuration
└── package.json                 # Project dependencies & scripts
```

---

## 📝 Content Management

| Task | Location | Reference |
| :--- | :--- | :--- |
| **New Blog Article** | `content/articles/<slug>/index.md` | [AGENTS.md Section 5.A](AGENTS.md#a-menambahkan-artikel-blog-baru) |
| **Add / Edit Projects** | `content/sections/projects/projects.json` | [AGENTS.md Section 5.B](AGENTS.md#b-menambahkan--mengedit-proyek-di-beranda) |
| **Update Skills & Icons** | `content/sections/interests/interests.json` | [AGENTS.md Section 5.C](AGENTS.md#c-menambahkan--mengubah-skill--keahlian) |
| **Hero, Bio, Social Links**| `content/sections/hero/`, `content/settings.json` | [AGENTS.md Section 5.D](AGENTS.md#d-mengubah-profil-bio--social-media) |
| **Comments Configuration** | `src/components/CommentSection/config.js` | [AGENTS.md Section 5.F](AGENTS.md#f-mengonfigurasi--mengelola-fitur-komentar-blog) |

---

## 📄 License

This project is licensed under the [0BSD License](LICENSE).
