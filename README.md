# Nexus AI - Inteligencia Artificial para tu negocio

Sitio web moderno de Nexus AI: agencia especializada en soluciones de IA y automatización empresarial.

## 📋 Requerimientos

- Node.js ≥ 16
- npm o yarn

## 🚀 Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Crear build para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del proyecto

```
nex/
├── index.html           # Punto de entrada HTML
├── src/
│   ├── main.jsx        # Punto de entrada React
│   ├── App.jsx         # Componente principal
│   └── index.css       # Estilos globales (Tailwind)
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind CSS
└── postcss.config.js   # Configuración de PostCSS
```

## 🛠️ Tecnologías

- **React 18** - Librería de UI
- **Vite** - Bundler y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos

## 🔧 Comandos principales

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo (puerto 3000) |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza el build de producción localmente |

## 📦 Deploy

El proyecto genera archivos estáticos en `dist/`. Puedes desplegar en:

- **Vercel**: Conecta tu repo y permite deploy automático
- **Netlify**: Drop-in deploy o CI/CD
- **GitHub Pages**: Push a rama `gh-pages` o `main`
- **Servidor propio**: `npm run build` y sube la carpeta `dist/` a tu hosting

### Ejemplo: Deploy en Vercel

```bash
npm install -g vercel
vercel
```

## 📝 Notas

- El formulario de contacto es funcional en el frontend (valida campos y muestra confirmación)
- El enlace de WhatsApp (`+573212257107`) es directo y funcional
- Tailwind CSS genera automáticamente solo los estilos utilizados
- El proyecto usa ES modules y JSX moderno

## 📊 Performance

- Build optimizado ~150KB (gzipped ~50KB)
- Lazy loading de componentes React
- Animaciones nativas con CSS
- Canvas optimizado para redes animadas

## 📄 Licencia

© 2025 Nexus AI. Todos los derechos reservados.