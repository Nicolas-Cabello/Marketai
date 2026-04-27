import React from 'react';
import { 
  User, 
  BarChart3, 
  Filter, 
  FileText, 
  Share2, 
  Zap,
  TrendingUp,
  Map as MapIcon,
  Clock,
  ChevronRight,
  Target,
  Gauge,
  Calculator,
  LayoutDashboard,
  Link as LinkIcon
} from 'lucide-react';

export interface Step {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: typeof User;
}

export const STEPS: Step[] = [
  {
    id: 1,
    slug: 'owner-id',
    title: 'Identificación Propietario',
    description: 'Define el perfil y datos del negocio.',
    icon: User
  },
  {
    id: 2,
    slug: 'competition',
    title: 'Análisis Competencia',
    description: 'Estudia el mercado y competidores.',
    icon: BarChart3
  },
  {
    id: 3,
    slug: 'filters',
    title: 'Filtros de Cliente',
    description: 'Segmentación por sector y localización.',
    icon: Filter
  },
  {
    id: 4,
    slug: 'assets',
    title: 'Generación de Activos',
    description: 'Crea folletos, newsletters y anuncios.',
    icon: FileText
  },
  {
    id: 5,
    slug: 'social',
    title: 'RSS & Social Media',
    description: 'Configura canales de distribución.',
    icon: Share2
  },
  {
    id: 6,
    slug: 'execution',
    title: 'Ejecución Final',
    description: 'Lanzamiento y automatización total.',
    icon: Zap
  },
  {
    id: 7,
    slug: 'prediction',
    title: 'Predicción de Resultado',
    description: 'Análisis de probabilidad de éxito (IA).',
    icon: Target
  },
  {
    id: 8,
    slug: 'roi-calc',
    title: 'Calculadora ROI',
    description: 'Cálculo interactivo de retorno.',
    icon: Calculator
  },
  {
    id: 9,
    slug: 'trackreport',
    title: 'Trackreport',
    description: 'Línea de tiempo de seguimiento detallado.',
    icon: Clock
  },
  {
    id: 10,
    slug: 'map-api',
    title: 'Map - Datos - API',
    description: 'Control de alcance y conexiones externas.',
    icon: MapIcon
  }
];