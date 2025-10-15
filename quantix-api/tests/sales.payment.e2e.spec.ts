import request from 'supertest';
const BASE = 'http://localhost:4000';
const API  = `${BASE}/api/v1`;

describe('Ventas por Cuenta Corriente requieren cliente', () => {
  let token: string;
  let productId: string;
  let customerId: string;

  beforeAll(async () => {
    await request(API).post('/auth/register').send({ email: 'admin@quantix.dev', password: 'admin123', role: 'ADMIN' });
    const login = await request(API).post('/auth/login').send({ email: 'admin@quantix.dev', password: 'admin123' });
    token = login.body.token;

    const pr = await request(API).post('/products').set('Authorization', `Bearer ${token}`).send({
      sku: `SKU-PAY-${Date.now()}`, name: 'Prod Pay', cost: 10, price: 30, minStock: 0
    });
    productId = pr.body.id;

    // stock
    await request(API).post('/purchases').set('Authorization', `Bearer ${token}`).send({
      supplier: 'Prov', items: [{ productId, quantity: 5, unitCost: 10 }]
    });

    // cliente
    const c = await request(API).post('/customers').set('Authorization', `Bearer ${token}`).send({
      name: 'Cliente CC', email: `cc${Date.now()}@mail.test`
    });
    customerId = c.body.id;
  });

  it('rechaza CTA_CTE sin customerId', async () => {
    const s = await request(API).post('/sales').set('Authorization', `Bearer ${token}`).send({
      payment: 'CTA_CTE',
      items: [{ productId, quantity: 1, unitPrice: 30 }]
    });
    expect(s.status).toBeGreaterThanOrEqual(400);
  });

  it('acepta CTA_CTE con customerId', async () => {
    const s = await request(API).post('/sales').set('Authorization', `Bearer ${token}`).send({
      payment: 'CTA_CTE',
      customerId,
      items: [{ productId, quantity: 1, unitPrice: 30 }]
    });
    expect([200, 201]).toContain(s.status);
  });

  it('acepta EFECTIVO sin customerId', async () => {
    const s = await request(API).post('/sales').set('Authorization', `Bearer ${token}`).send({
      payment: 'EFECTIVO',
      customer: 'Mostrador',
      items: [{ productId, quantity: 1, unitPrice: 30 }]
    });
    expect([200, 201]).toContain(s.status);
  });
});
