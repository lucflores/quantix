import request from "supertest";

const BASE = 'http://localhost:4000';
const API  = `${BASE}/api/v1`;

describe('Quantix básico', () => {
  beforeAll(async () => {
    // intenta registrar; si ya existe, ignoramos el error 400/409
    await request(API).post('/auth/register').send({
      email: 'admin@quantix.dev',
      password: 'admin123',
      role: 'ADMIN',
    });
  });

  it('health responde ok', async () => {
    const res = await request(BASE).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('login devuelve token', async () => {
    const res = await request(API)
      .post('/auth/login')
      .send({ email: 'admin@quantix.dev', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});
