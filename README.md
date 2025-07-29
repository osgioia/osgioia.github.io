# Osvaldo Gioia - Portfolio & Blog

This repository contains both my personal portfolio (React) and blog (Jekyll).

## 🏠 Portfolio (React)

The main portfolio is built with React and showcases my projects, skills, and background.

### Development
```bash
npm install
npm start
```

The portfolio will be available at `http://localhost:3000`

### Build
```bash
npm run build
```

## 📝 Blog (Jekyll)

The blog is built with Jekyll and contains technical articles about software development, cloud technologies, and best practices.

### Development
```bash
cd blog
./serve.sh
```

The blog will be available at `http://localhost:4000/blog`

### Manual Setup (if serve.sh doesn't work)
```bash
cd blog
bundle install
bundle exec jekyll serve --baseurl /blog --port 4000
```

## 🚀 Deployment

Este proyecto se despliega automáticamente en GitHub Pages usando GitHub Actions.

### Configuración de GitHub Pages

1. **Configurar el repositorio**:
   - Ve a Settings → Pages
   - Source: GitHub Actions
   - Custom domain: `osgioia.dev`

2. **El workflow automático**:
   - Se ejecuta en cada push a `main`
   - Construye el portfolio React → `/`
   - Construye el blog Jekyll → `/blog`
   - Despliega todo junto en GitHub Pages

### URLs finales:
- **Portfolio**: `https://osgioia.dev` (React)
- **Blog**: `https://osgioia.dev/blog` (Jekyll)

### Proceso de deployment:
1. Push a la rama `main`
2. GitHub Actions ejecuta `.github/workflows/deploy.yml`
3. Construye ambas aplicaciones
4. Las combina en una sola estructura
5. Despliega en GitHub Pages

## 📁 Project Structure

```
├── src/                    # React portfolio source
│   ├── partials/          # React components
│   ├── assets/            # Data and styles
│   └── ...
├── blog/                  # Jekyll blog
│   ├── _posts/           # Blog posts
│   ├── _layouts/         # Jekyll layouts
│   ├── assets/           # Blog styles
│   └── _config.yml       # Jekyll configuration
├── public/               # React public files
└── package.json          # React dependencies
```

## 🛠 Technologies

### Portfolio
- React 16
- Tailwind CSS
- AOS (Animate On Scroll)

### Blog
- Jekyll 4.3
- Sass/SCSS
- Minima theme (customized)

## 📝 Adding Blog Posts

Create new posts in `blog/_posts/` with the format:
```
YYYY-MM-DD-title-slug.md
```

Example frontmatter:
```yaml
---
layout: post
title: "Your Post Title"
date: 2025-01-15 10:00:00 -0300
categories: [category1, category2]
tags: [tag1, tag2, tag3]
excerpt: "Brief description of your post"
---
```

## 🔗 Links

- Portfolio: [osgioia.dev](https://osgioia.dev)
- Blog: [osgioia.dev/blog](https://osgioia.dev/blog)
- GitHub: [github.com/osgioia](https://github.com/osgioia)
- LinkedIn: [linkedin.com/in/osvaldogioia](https://www.linkedin.com/in/osvaldogioia/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).