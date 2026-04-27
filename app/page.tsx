'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Globe, 
  Rocket, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  ArrowUpRight,
  Brain,
  Search,
  FileText,
  Share2,
  Calculator,
  Map,
  Activity,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Target,
      title: 'Identificación del Propietario',
      description: 'Registra tu negocio y define tu propuesta de valor única',
      color: 'from-blue-500 to-cyan-500',
      step: 1
    },
    {
      icon: Search,
      title: 'Análisis de Competencia',
      description: 'Analiza a tus competidores y encuentra oportunidades únicas',
      color: 'from-purple-500 to-pink-500',
      step: 2
    },
    {
      icon: Users,
      title: 'Definición de Producto',
      description: 'Define tu cliente ideal y filtros de segmentación',
      color: 'from-green-500 to-emerald-500',
      step: 3
    },
    {
      icon: Globe,
      title: 'Búsqueda de Clientes',
      description: 'Genera leads calificados con scraping inteligente',
      color: 'from-orange-500 to-red-500',
      step: 4
    },
    {
      icon: Brain,
      title: 'Generación de Activos',
      description: 'Crea contenido de marketing con IA de Google Gemini',
      color: 'from-indigo-500 to-purple-500',
      step: 5
    },
    {
      icon: Share2,
      title: 'Estrategia Social',
      description: 'Configura RSS y estrategias de social media',
      color: 'from-cyan-500 to-blue-500',
      step: 6
    },
    {
      icon: TrendingUp,
      title: 'Predicción de Resultado',
      description: 'Analiza la probabilidad de éxito con IA predictiva',
      color: 'from-pink-500 to-rose-500',
      step: 7
    },
    {
      icon: Calculator,
      title: 'Calculadora ROI',
      description: 'Calcula métricas financieras y retorno de inversión',
      color: 'from-yellow-500 to-orange-500',
      step: 8
    },
    {
      icon: Activity,
      title: 'Trackreport & Historial',
      description: 'Dashboard completo de seguimiento y analytics',
      color: 'from-teal-500 to-cyan-500',
      step: 9
    },
    {
      icon: Map,
      title: 'Mapa Interactivo',
      description: 'Visualización geográfica de leads y API endpoints',
      color: 'from-emerald-500 to-green-500',
      step: 10
    }
  ];

  const stats = [
    { label: 'Pasos del Workflow', value: '10', icon: Target },
    { label: 'Integraciones IA', value: '2', icon: Brain },
    { label: 'Métricas en Tiempo Real', value: '∞', icon: BarChart3 },
    { label: 'APIs Configuradas', value: '5', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Marketai
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Plataforma de automatización de marketing con IA integrada. 
              Transforma tu estrategia de marketing en 10 pasos inteligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/workflow"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
              >
                <Play className="w-5 h-5 mr-2" />
                Comenzar Workflow
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
              >
                <User className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Workflow de 10 Pasos
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Completa cada paso para construir una estrategia de marketing completa y optimizada con IA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative"
              >
                <Link href={`/workflow?step=${feature.step}`}>
                  <div className="h-full p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800/70 hover:border-blue-500/50 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-400 font-medium">
                      <span>Paso {feature.step}</span>
                      <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-3xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para transformar tu marketing?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Comienza ahora y optimiza tu estrategia con la potencia de la IA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/workflow"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <User className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Marketai</h3>
            <p className="text-slate-400 mb-4">
              Marketing Automation con IA Integrada
            </p>
            <div className="flex justify-center space-x-6 text-sm text-slate-500">
              <span>v2.0</span>
              <span>•</span>
              <span>Next.js 14</span>
              <span>•</span>
              <span>Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}