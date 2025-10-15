import request from 'supertest';
const BASE = 'http://localhost:4000';
const API  = `${BASE}/api/v1`;

describe('Clientes + Cuenta Corriente', () => {
  let token: string;
  let productId: string;
  let customerId: string;

  beforeAll(async () => {
    await request(API).post('/auth/register').send({ email: 'ar@quantix.dev', password: 'admin123', role: 'ADMIN' });
    const login = await request(API).post('/auth/login').send({ email: 'ar@quantix.dev', password: 'admin123' });
    token = login.body.token;

    const pr = await request(API)
      .post('/products').set('Authorization', `Bearer ${token}`)
      .send({ sku: `SKU-AR-${Date.now()}`, name: 'Prod AR', cost: 10, price: 30, minStock: 0 });
    productId = pr.body.id;

    await request(API)
      .post('/purchases').set('Authorization', `Bearer ${token}`)
      .send({ supplier: 'Prov', items: [{ productId, quantity: 10, unitCost: 10 }] });

    const c = await request(API)
      .post('/customers').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cliente AR', email: `ar${Date.now()}@mail.test` });
    customerId = c.body.id;
  });

  it('venta CTA_CTE aumenta saldo y pago lo reduce', async () => {
    // Venta a cuenta
    const s = await request(API)
      .post('/sales').set('Authorization', `Bearer ${token}`)
      .send({ payment: 'CTA_CTE', customerId, items: [{ productId, quantity: 2, unitPrice: 30 }] });
    expect([200, 201]).toContain(s.status);

    // Balance (60.00)
    const b1 = await request(API)
      .get(`/customers/${customerId}/balance`).set('Authorization', `Bearer ${token}`);
    expect(b1.status).toBe(200);
    expect(b1.body.balance).toBe('60.00');

    // Registrar pago (20.00)
    const p = await request(API)
      .post(`/customers/${customerId}/payments`).set('Authorization', `Bearer ${token}`)
      .send({ amount: 20, method: 'EFECTIVO', reference: 'REC-1' });
    expect(p.status).toBe(201);

    // Balance (40.00)
    const b2 = await request(API)
      .get(`/customers/${customerId}/balance`).set('Authorization', `Bearer ${token}`);
    expect(b2.status).toBe(200);
    expect(b2.body.balance).toBe('40.00');
  });
});
