const request = require('supertest');
const express = require('express');

describe('Health Check Endpoint', () => {
  let app;

  beforeAll(() => {
    // Create a minimal express app for testing
    app = express();

    // Mock health endpoint
    app.get('/health', async (req, res) => {
      res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'test',
        services: {
          api: 'operational'
        }
      });
    });

    app.get('/api/v1/health', async (req, res) => {
      res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'test',
        services: {
          api: 'operational',
          mongodb: 'connected',
          sqlite: 'connected'
        }
      });
    });
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment', 'test');
    });

    it('should include services status', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('api');
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return detailed health check', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body.services).toHaveProperty('api');
      expect(response.body.services).toHaveProperty('mongodb');
      expect(response.body.services).toHaveProperty('sqlite');
    });
  });
});
