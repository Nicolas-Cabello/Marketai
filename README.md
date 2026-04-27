# Marketai - Marketing Automation SaaS

Una aplicación completa de automatización de marketing con flujo de trabajo de 10 pasos.

## 🚀 Características

- **Flujo de trabajo completo**: 10 pasos para automatización de marketing
- **Base de datos en memoria**: Implementación optimizada para rendimiento
- **UI interactiva**: Diseño moderno con Tailwind CSS y Framer Motion
- **API endpoints**: Endpoints completos para todos los pasos del workflow
- **Layout responsivo**: Navegación con sidebar y diseño adaptable
- **Procesamiento en tiempo real**: Visualización y procesamiento de datos

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL con Prisma (configurado para producción)
- **Icons**: Lucide React
- **Charts**: Recharts

## 📋 Pasos del Workflow

1. **Información del Negocio** - Datos básicos de la empresa
2. **Análisis de Competencia** - Investigación competitiva
3. **Filtros de Leads** - Configuración de criterios
4. **Generación de Leads** - Creación de prospectos
5. **Análisis de Activos** - Evaluación de recursos
6. **Estrategia Social Media** - Planificación de redes sociales
7. **Predicción de Mercado** - Análisis predictivo
8. **Calculadora ROI** - Métricas de retorno
9. **Trackreport & Historial** - Seguimiento y reportes
10. **API Endpoints & Configuración** - Gestión de APIs y datos geolocalizados

## 🚀 Despliegue en Vercel

### 1. Variables de Entorno

Configura estas variables en tu dashboard de Vercel:

```
DATABASE_URL="postgres://4d8f7dc7576c9a301ba32aaa1ccb8cee1f1ab8e0840faee1abd92ec1ac1e5573:sk_Ra24u9K8B1RpUQJbyJH1Q@db.prisma.io:5432/postgres?sslmode=require"
POSTGRES_URL="postgres://4d8f7dc7576c9a301ba32aaa1ccb8cee1f1ab8e0840faee1abd92ec1ac1e5573:sk_Ra24u9K8B1RpUQJbyJH1Q@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="postgres://4d8f7dc7576c9a301ba32aaa1ccb8cee1f1ab8e0840faee1abd92ec1ac1e5573:sk_Ra24u9K8B1RpUQJbyJH1Q@db.prisma.io:5432/postgres?sslmode=require"
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="tu-secreto-nextauth-aqui"
```

### 2. Pasos para Desplegar

1. **Conecta tu repositorio GitHub a Vercel**
2. **Importa el proyecto Marketai**
3. **Configura las variables de entorno** en Settings > Environment Variables
4. **Agrega los dominios personalizados** si es necesario
5. **Haz deploy** - Vercel construirá y desplegará automáticamente

### 3. Configuración Post-Despliegue

- Actualiza `NEXTAUTH_URL` con tu dominio real de Vercel
- Genera un `NEXTAUTH_SECRET` seguro: `openssl rand -base64 32`
- Configura cualquier API key adicional que necesites

## 📦 Instalación Local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/Marketai.git
cd Marketai

# Instala dependencias
npm install

# Configura variables de entorno
cp .env.example .env.local

# Ejecuta la base de datos (opcional - usa in-memory DB por defecto)
npx prisma generate

# Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3005`

## 🎯 Uso

1. **Regístrate** o **inicia sesión** en la aplicación
2. **Completa el flujo de 10 pasos** para configurar tu automatización
3. **Monitorea tus resultados** en el dashboard
4. **Exporta datos** y configura integraciones API

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte, email a nicolasmorales@example.com o crea un issue en el repositorio.