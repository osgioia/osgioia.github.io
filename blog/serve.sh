#!/bin/bash

# Script para servir el blog Jekyll localmente

echo "🚀 Starting Jekyll blog server..."

# Verificar si bundle está instalado
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler not found. Installing..."
    gem install bundler
fi

# Configurar bundle para usar vendor/bundle
bundle config set path 'vendor/bundle'

# Instalar dependencias si no existen
if [ ! -d "vendor/bundle" ]; then
    echo "📦 Installing dependencies..."
    bundle install
fi

# Servir el sitio
echo "🌐 Serving blog at http://localhost:4000/blog"
bundle exec jekyll serve --baseurl /blog --port 4000 --livereload