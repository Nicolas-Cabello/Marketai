# Optimización para Vercel - Guía de Despliegue

## 🚀 Configuración Rápida para Vercel

### 1. Variables de Entorno en Vercel
Configura estas variables en el dashboard de Vercel:

```bash
GEMINI_API_KEY=AIzaSyB9o4r0WJ1LJXmVrZl-bXHmf3TrERQMXiw
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB9o4r0WJ1LJXmVrZl-bXHmf3TrERQMXiw
DATABASE_URL=postgresql://user:pass@host:5432/marketai_prod
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 2. Configuración de Build
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Dominio Personalizado (Opcional)
1. Ve a Settings > Domains en Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

### 4. Base de Datos PostgreSQL
Recomendaciones para producción:
- **Vercel Postgres**: Más fácil de configurar
- **Supabase**: Alternativa con funciones edge
- **Railway**: Opción económica
- **Neon**: PostgreSQL serverless

### 5. Optimizaciones Habilitadas
✅ Edge Functions para APIs
✅ ISR para contenido estático
✅ Image Optimization automática
✅ Bundle splitting inteligente
✅ Cache headers configurados
✅ Compression habilitada

### 6. Monitoreo y Analytics
Configura en Vercel Analytics:
- Web Vitals
- Tráfico y usuarios
- Rendimiento por página
- Error tracking

## 📊 Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Troubleshooting Común

### Error: "Database connection failed"
```bash
# Verificar DATABASE_URL
# Asegurar que la DB acepte conexiones de Vercel
# Revisar SSL configuration
```

### Error: "Gemini API quota exceeded"
```bash
# Verificar límites de API key
# Considerar upgrade a Gemini Pro
# Implementar cache para respuestas
```

### Build lento
```bash
# Usar cache de dependencias
# Optimizar imports dinámicos
# Revisar bundle size con npm run analyze
```

## 🎯 Próximos Pasos Post-Despliegue

1. **Configurar dominio personalizado**
2. **Setear analytics y monitoring**
3. **Configurar backup automático de DB**
4. **Setear CI/CD para pruebas automáticas**
5. **Configurar CDN para assets**
6. **Implementar estrategia de cache avanzada**

## 📈 Escalabilidad

### Para alto tráfico:
- Habilitar Edge Functions
- Configurar CDN global
- Implementar rate limiting
- Usar Redis para cache
- Considerar serverless scaling

### Para grandes volúmenes de datos:
- Partitioning de tablas
- Indexing optimizado
- Read replicas
- Archiving de datos antiguos