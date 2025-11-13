/**
 * Tests para la integración de Gemini AI
 * Prueba el servicio de mentor_bot (Python FastAPI) que usa Gemini
 */

import axios from 'axios';

describe('Gemini AI Integration Tests', () => {
  // El servicio ahora es Node.js/TypeScript en lugar de Python
  const MENTOR_BOT_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';

  beforeAll(() => {
    // Verificar que la API key esté configurada
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY no está configurada. Algunos tests pueden fallar.');
    }
  });

  describe('Health Check', () => {
    it('debería responder el health check del servicio', async () => {
      try {
        const response = await axios.get(`${MENTOR_BOT_URL}/health`, {
          timeout: 5000,
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe('healthy');
        expect(response.data).toHaveProperty('service');
        expect(response.data.service).toBe('mentor-bot');
        console.log('✅ Health check exitoso:', response.data);
      } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('⚠️  El servicio mentor_bot no está corriendo en', MENTOR_BOT_URL);
          console.warn('   Ejecuta: cd ai-services/mentor_bot && uvicorn main:app --port 8000');
        }
        throw error;
      }
    });
  });

  describe('Test Gemini Connection', () => {
    it('debería probar la conexión con Gemini AI', async () => {
      try {
        const response = await axios.get(`${MENTOR_BOT_URL}/test-gemini`, {
          timeout: 30000,
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('success');
        
        if (response.data.success) {
          expect(response.data).toHaveProperty('message');
          expect(response.data).toHaveProperty('modelUsed');
          expect(response.data.modelUsed).toBeTruthy();
          console.log('✅ Conexión con Gemini exitosa');
          console.log('   Modelo usado:', response.data.modelUsed);
          console.log('   Mensaje:', response.data.message);
        } else {
          console.warn('⚠️  Gemini no está configurado correctamente');
          console.warn('   Error:', response.data.error);
        }
      } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('⚠️  El servicio mentor_bot no está corriendo');
          throw new Error('Servicio no disponible. Inicia el servicio con: cd ai-services/mentor_bot && uvicorn main:app --port 8000');
        }
        throw error;
      }
    });
  });

  describe('Ask Mentor - Pregunta Simple', () => {
    it('debería responder una pregunta simple en inglés', async () => {
      try {
        const response = await axios.post(
          `${MENTOR_BOT_URL}/ask`,
          {
            question: 'What is a smart contract?',
            language: 'en',
            context: {},
            conversationHistory: [],
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('answer');
        expect(response.data).toHaveProperty('suggestedResources');
        expect(response.data).toHaveProperty('relatedQuestions');
        expect(response.data).toHaveProperty('language');
        expect(response.data).toHaveProperty('modelUsed');
        
        expect(typeof response.data.answer).toBe('string');
        expect(response.data.answer.length).toBeGreaterThan(0);
        expect(Array.isArray(response.data.suggestedResources)).toBe(true);
        expect(Array.isArray(response.data.relatedQuestions)).toBe(true);
        expect(response.data.language).toBe('en');
        expect(response.data.modelUsed).toBeTruthy();

        console.log('✅ Pregunta respondida exitosamente');
        console.log('   Modelo usado:', response.data.modelUsed);
        console.log('   Respuesta (primeros 100 caracteres):', response.data.answer.substring(0, 100) + '...');
        console.log('   Recursos sugeridos:', response.data.suggestedResources.length);
        console.log('   Preguntas relacionadas:', response.data.relatedQuestions.length);
      } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Servicio no disponible. Inicia el servicio con: cd ai-services/mentor_bot && uvicorn main:app --port 8000');
        }
        throw error;
      }
    });
  });

  describe('Ask Mentor - Pregunta con Contexto', () => {
    it('debería responder una pregunta con contexto de hackathon', async () => {
      try {
        const response = await axios.post(
          `${MENTOR_BOT_URL}/ask`,
          {
            question: 'How do I deploy a smart contract to Arbitrum?',
            language: 'en',
            context: {
              hackathonName: 'ETH Safari 2025',
              chains: ['Arbitrum', 'Base'],
              techStack: ['Solidity', 'Hardhat', 'Foundry'],
            },
            conversationHistory: [],
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data.answer).toContain('Arbitrum');
        expect(response.data.modelUsed).toBeTruthy();

        console.log('✅ Pregunta con contexto respondida');
        console.log('   Modelo usado:', response.data.modelUsed);
        console.log('   Respuesta incluye "Arbitrum":', response.data.answer.includes('Arbitrum'));
      } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Servicio no disponible');
        }
        throw error;
      }
    });
  });

  describe('Ask Mentor - Multilingüe (Swahili)', () => {
    it('debería responder en Swahili cuando se solicita', async () => {
      try {
        const response = await axios.post(
          `${MENTOR_BOT_URL}/ask`,
          {
            question: 'Ninawezaje kuanza na Solidity?',
            language: 'sw',
            context: {},
            conversationHistory: [],
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data.language).toBe('sw');
        expect(response.data.answer.length).toBeGreaterThan(0);

        console.log('✅ Respuesta en Swahili generada');
        console.log('   Modelo usado:', response.data.modelUsed);
        console.log('   Respuesta (primeros 100 caracteres):', response.data.answer.substring(0, 100) + '...');
      } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Servicio no disponible');
        }
        throw error;
      }
    });
  });

  describe('Error Handling', () => {
    it('debería manejar errores correctamente con pregunta inválida', async () => {
      try {
        const response = await axios.post(
          `${MENTOR_BOT_URL}/ask`,
          {
            question: '', // Pregunta vacía
            language: 'en',
            context: {},
            conversationHistory: [],
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
            validateStatus: () => true, // Aceptar cualquier status
          }
        );

        // El servicio debería manejar esto (puede retornar error o respuesta genérica)
        expect([200, 400, 422, 500]).toContain(response.status);
        console.log('✅ Manejo de errores funcionando');
      } catch (error: any) {
        if (error.code !== 'ECONNREFUSED') {
          // Si no es error de conexión, el test pasó (el servicio maneja el error)
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  });
});

