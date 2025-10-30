import request from 'supertest';

const BASE = 'http://localhost:3000';
const API  = `${BASE}/api/v1`;

describe('Flujo productos/compras/ventas', () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    // Asegura usuario para el login
    await request(API).post('/auth/register').send({
      email: 'admin@quantix.dev',
      password: 'admin123',
      role: 'ADMIN',
    });

    const login = await request(API).post('/auth/login').send({
      email: 'admin@quantix.dev',
      password: 'admin123',
    });
    token = login.body.token;
    expect(token).toBeTruthy();
  });

  it('crea producto (stock 0)', async () => {
    const res = await request(API)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: `SKU-${Date.now()}`, name: 'Prod Test', cost: 10.5, price: 25, minStock: 2 });

    expect(res.status).toBe(201);
    expect(res.body.stock).toBe('0.00');
    productId = res.body.id;
  });

  it('venta sin stock -> debe fallar', async () => {
    const res = await request(API)
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer: 'Cliente X', items: [{ productId, quantity: 1, unitPrice: 25 }] });

    expect(res.status).toBeGreaterThanOrEqual(400); 
  });

  it('compra (IN) y luego venta (OUT) ok', async () => {
  const p = await request(API)
    .post('/purchases')
    .set('Authorization', `Bearer ${token}`)
    .send({ supplier: 'Prov', items: [{ productId, quantity: 5, unitCost: 10.5 }] });
  expect(p.status).toBe(201);

  const s = await request(API)
    .post('/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ customer: 'Cliente Y', items: [{ productId, quantity: 2, unitPrice: 25 }] });
  expect(s.status).toBe(201);
});

});
