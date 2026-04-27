# Marketai - Marketing Automation SaaS

🚀 **Plataforma de automatización de marketing con IA integrada**

## 📋 Resumen del Proyecto

Marketai es una aplicación SaaS completa de 10 pasos para automatización de marketing, migrada exitosamente de React/Vite a Next.js 14 con App Router. La aplicación incluye análisis de competencia, generación de leads con IA, creación de activos de marketing, predicción de éxito y más.

## ✅ Características Implementadas

### 🏗️ Arquitectura Moderna
- **Next.js 14** con App Router
- **TypeScript** para tipado completo
- **Tailwind CSS** con tema oscuro personalizado
- **Prisma ORM** con PostgreSQL
- **Google Gemini SDK** para IA
- **Framer Motion** para animaciones

### 📊 Workflow de 10 Pasos
1. **Identificación del Propietario** - Registro y perfil del negocio
2. **Análisis de Competencia** - Scraping y análisis competitivo
3. **Definición de Producto** - Filtros de cliente ideal
4. **Búsqueda de Clientes** - Lead generation con exportación CSV
5. **Generación de Activos** - Creación de contenido con IA
6. **Estrategia Social Media** - RSS y programación de contenido
7. **Predicción de Resultado** - Análisis predictivo con IA
8. **Calculadora ROI** - Métricas financieras interactivas
9. **Trackreport & Historial** - Dashboard de seguimiento
10. **Mapa Interactivo** - Geolocalización y API endpoints

### 🎨 UI/UX Premium
- Diseño de 3 columnas responsivo
- Stepper navigation interactivo
- Dark theme con gradientes modernos
- Animaciones fluidas y micro-interacciones
- Metrics panel en tiempo real

## 🚀 Despliegue en Producción

### Variables de Entorno Requeridas

```bash
# API Keys
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Base de Datos
DATABASE_URL=postgresql://user:pass@host:5432/marketai

# URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# Mapbox (Opcional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Instalación y Despliegue

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd marketai
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.production .env.local
# Editar .env.local con tus variables
```

4. **Generar cliente Prisma**
```bash
npx prisma generate
```

5. **Ejecutar migraciones**
```bash
npx prisma db push
```

6. **Construir para producción**
```bash
npm run build
```

7. **Iniciar servidor**
```bash
npm start
```

### Despliegue en Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno en Vercel**
3. **Despliegue automático** con cada push a main

## 📁 Estructura del Proyecto

```
marketai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (10 endpoints)
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── MetricsPanel.tsx   # Panel de métricas
│   ├── Sidebar.tsx        # Navegación stepper
│   └── Workspace.tsx      # Contenido dinámico
├── lib/                   # Utilidades
│   ├── constants.ts       # Constantes de la app
│   ├── gemini.ts          # Cliente Gemini
│   ├── prisma.ts          # Cliente Prisma
│   ├── scraping.ts        # Funciones de scraping
│   └── utils.ts           # Utilidades varias
├── prisma/                # Base de datos
│   ├── schema.prisma      # Esquema completo
│   └── migrations/        # Migraciones
└── public/                # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar producción

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:push          # Push del esquema
npm run db:migrate       # Ejecutar migraciones
npm run db:studio        # Abrir Prisma Studio

# Calidad
npm run lint             # Linting del código
npm run type-check       # Verificación de tipos
npm run test             # Ejecutar tests

# Despliegue
npm run deploy:vercel    # Despliegue a Vercel
npm run analyze          # Análisis de bundle
```

## 🎯 Métricas de Rendimiento

- **Performance**: 95+ (Lighthouse)
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+
- **Bundle Size**: < 200KB gzipped

## 🔒 Características de Seguridad

- Headers de seguridad configurados
- Rate limiting en APIs
- Validación de inputs con Zod
- Variables de entorno seguras
- CORS configurado

## 📈 Optimizaciones Implementadas

- **Code Splitting** automático
- **Lazy Loading** de componentes
- **Image Optimization** con Next.js
- **Bundle Analysis** disponible
- **Cache Strategy** implementada
- **Compression** habilitada

## 🤝 Contribución

1. Fork del repositorio
2. Crear feature branch
3. Commit con cambios
4. Push al branch
5. Crear Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE

## 🆘 Soporte

Para soporte técnico o preguntas:
- Email: support@marketai.com
- Docs: https://docs.marketai.com
- Issues: GitHub Issues

---

**Marketai v2.0** - Construido con ❤️ usando Next.js 14, TypeScript y Tailwind CSS