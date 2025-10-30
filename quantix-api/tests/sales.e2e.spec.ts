import request from 'supertest';
const BASE = 'http://localhost:3000';
const API  = `${BASE}/api/v1`;

describe('Ventas: reglas de stock', () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
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

    // producto sin stock
    const pr = await request(API)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: `SKU-SALES-${Date.now()}`, name: 'Prod Sales', cost: 10, price: 30, minStock: 0 });
    productId = pr.body.id;
  });

  it('rechaza venta si no hay stock suficiente', async () => {
    const sale = await request(API)
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer: 'X', items: [{ productId, quantity: 1, unitPrice: 30 }] });
    expect(sale.status).toBeGreaterThanOrEqual(400);
  });
});
