import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export async function generateMarketingContent(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content');
  }
}

export async function analyzeCompetitors(competitors: string[]) {
  const prompt = `
    Analiza los siguientes competidores y proporciona insights detallados:
    Competidores: ${competitors.join(', ')}
    
    Por favor, proporciona:
    1. Análisis de fortalezas y debilitidades
    2. Oportunidades de mercado (gap analysis)
    3. Estrategias recomendadas
    4. Score competitivo (0-100)
    
    Responde en formato JSON estructurado.
  `;
  
  return generateMarketingContent(prompt);
}

export async function generateMarketingAssets(businessDescription: string) {
  const prompt = `
    Basado en la siguiente descripción de negocio, genera activos de marketing:
    Descripción: ${businessDescription}
    
    Genera:
    1. Ideas de mercado innovadoras
    2. Eslogan memorable
    3. Concepto de logo
    4. Estructura de folleto
    5. Template de newsletter
    6. Ideas para banner publicitario
    
    Responde en formato JSON con cada sección claramente definida.
  `;
  
  return generateMarketingContent(prompt);
}

export async function predictSuccessRate(businessData: any) {
  const prompt = `
    Analiza los siguientes datos de negocio y predice la probabilidad de éxito:
    Datos: ${JSON.stringify(businessData)}
    
    Considera:
    1. Análisis de mercado
    2. Competencia
    3. Propuesta de valor
    4. Estrategia de marketing
    5. Viabilidad técnica
    
    Proporciona un score de éxito (0-100) y justificación detallada.
    Responde en formato JSON.
  `;
  
  return generateMarketingContent(prompt);
}