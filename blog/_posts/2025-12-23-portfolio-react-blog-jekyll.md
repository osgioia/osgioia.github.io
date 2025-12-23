---
layout: post
title: "React Portfolio + Jekyll Blog: Linking Them with GitHub Actions"
date: 2025-12-23 15:00:00 -0300
categories: [dev, tutorial]
tags: [react, jekyll, github-actions, github-pages]
excerpt: "Learn how to set up a hybrid site with React for your landing page and Jekyll for your blog, all automatically deployed to a single GitHub Pages URL."
---

Maintaining a personal portfolio is often a dilemma: you want the flexibility of **React** to create an interactive and modern landing page, but for writing content, nothing beats the simplicity of a Markdown-based static site generator like **Jekyll**.

Why choose one when you can have both? In this post, I'll show you how I configured my site so that the portfolio lives at the root (`/`) and the blog in a sub-path (`/blog`), using **GitHub Actions** to make the magic happen on its own.

---

## The Project Structure

The biggest challenge was organizing the files so they wouldn't overlap. My structure looks like this:

```text
.
├── .github/workflows/   <-- Where the CI/CD configuration lives
├── blog/                <-- The entire Jekyll site
│   ├── _posts/
│   ├── _config.yml
│   └── index.md
├── src/                 <-- React source code (living at the root)
├── public/              <-- React static assets
├── package.json         <-- React dependencies
└── tailwind.config.js
```

---

## Configuring Jekyll for a Sub-path

For Jekyll to know it won't be at the root of the domain, we need to adjust the `_config.yml`. This is vital so that the generated file paths don't break:

```yaml
# blog/_config.yml
title: My Blog
baseurl: "/blog" # <--- Vital to serve from my-domain.com/blog
url: "https://osgioia.dev"
```

This ensures that all internal links and Jekyll CSS files are correctly served from `/blog/assets/...`.

---

## The Magic: GitHub Actions

This is where the real integration happens. We need a workflow that detects what changed and builds only what's necessary.

### 1. Smart Change Detection
We don't want to build React if we only wrote a Markdown post. We use a bash script in the workflow to detect affected directories:

```yaml
- name: Check for changes
  id: changes
  run: |
    DIFF_OUTPUT="$(git diff --name-only ${{ github.event.before }} ${{ github.sha }})"
    
    if echo "$DIFF_OUTPUT" | grep -E '^(src/|public/|package\.json)' > /dev/null; then
      echo "react_changed=true" >> "$GITHUB_OUTPUT"
    fi

    if echo "$DIFF_OUTPUT" | grep -E '^blog/' > /dev/null; then
      echo "blog_changed=true" >> "$GITHUB_OUTPUT"
    fi
```

### 2. Conditional Builds
Then, we use that output to run build steps only when needed:

```yaml
# React Build (only if frontend changed)
- name: Build React portfolio
  if: steps.changes.outputs.react_changed == 'true'
  run: |
    npm ci
    npm run build

# Jekyll Build (only if blog changed)
- name: Build Jekyll blog
  if: steps.changes.outputs.blog_changed == 'true'
  run: |
    cd blog
    bundle exec jekyll build --destination ../_site/blog
```

### 3. Merging the Sites
The final step is to merge both results into a single `_site` folder that GitHub Pages can serve:

```yaml
- name: Prepare deployment directory
  run: |
    mkdir -p _site
    
    # Copy React build (goes to the root /)
    if [ -d "build" ]; then
      cp -r build/* _site/
    fi

    # The Jekyll build was already done inside _site/blog/
    # so the final structure is perfect.
```

---

## Why This Solution?

- **React for UX**: My landing page uses animations and dynamic components.
- **Jekyll for SEO**: Blog posts are pure static HTML, perfect for indexing.
- **Zero Cost**: The best part is that **all of this is 100% free**. GitHub Pages hosts the site at no cost, and GitHub Actions gives us free execution minutes to build the code every time we push.

I hope this technical breakdown helps you set up your own "Frankenstein" of web technologies without spending a single cent!
