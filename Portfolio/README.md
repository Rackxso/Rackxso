# Portfolio — Óscar Ureña Salvador

Portfolio personal con interfaz inspirada en VS Code. Barra lateral con secciones como archivos `.md`, pestañas con drag & drop y enrutado entre vistas como si fueran documentos abiertos en un editor.

## Stack

- **Angular 21** — standalone components, sin NgModules
- **Angular SSR** — usado en build para prerrenderizado estático
- **Vitest** — tests unitarios
- **CSS puro** — custom properties, nesting nativo, sin frameworks
- **TypeScript 5.9** — modo strict
- **Font Awesome 7** — iconos vía CDN
- **Inter** — fuente vía Google Fonts

## Desarrollo local

```bash
npm install
npm start          # localhost:4200
```

## Build

```bash
npm run build      # genera dist/Portfolio/browser/
```

El build prerenderiza todas las rutas a HTML estático (`outputMode: static`).

## Tests

```bash
npm test
```

## Despliegue — Cloudflare Pages

| Ajuste | Valor |
|---|---|
| Root directory | `Portfolio` |
| Build command | `npm run build` |
| Build output directory | `dist/Portfolio/browser` |
| Node.js version | 18 o superior |

El fichero `public/_redirects` ya está incluido como fallback para el enrutado client-side.
