/**
 * Configuración global para tests
 */

// Configurar variables de entorno para tests si no están definidas
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '4000';

// Aumentar timeout para tests de integración
jest.setTimeout(30000);

