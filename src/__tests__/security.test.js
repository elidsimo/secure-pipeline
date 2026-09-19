const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const db = require('../db/init');

describe('Security test suite', () => {
  let agentA, agentB, orderIdA;

  beforeAll(() => {
    db.exec('DELETE FROM orders; DELETE FROM users;');

    const hashA = bcrypt.hashSync('PasswordA123', 12); // pragma: allowlist secret
    const hashB = bcrypt.hashSync('PasswordB123', 12); // pragma: allowlist secret
    const userA = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run('a@test.com', hashA);
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run('b@test.com', hashB);

    const order = db.prepare('INSERT INTO orders (user_id, item, amount) VALUES (?, ?, ?)')
      .run(userA.lastInsertRowid, 'Casque audio', 49.99);
    orderIdA = order.lastInsertRowid;

    agentA = request.agent(app);
    agentB = request.agent(app);
  });

  test('le serveur repond sur /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  test('IDOR (AC-001) : impossible d acceder a la commande d un autre utilisateur', async () => {
    await agentB.post('/auth/login').send({ email: 'b@test.com', password: 'PasswordB123' }); // pragma: allowlist secret
    const res = await agentB.get(`/orders/${orderIdA}`);
    expect(res.status).toBe(403);
  });

  test('le proprietaire legitime peut consulter sa propre commande', async () => {
    await agentA.post('/auth/login').send({ email: 'a@test.com', password: 'PasswordA123' }); // pragma: allowlist secret
    const res = await agentA.get(`/orders/${orderIdA}`);
    expect(res.status).toBe(200);
    expect(res.body.item).toBe('Casque audio');
  });

  test('injection SQL (AC-002) : requete parametree, jamais executee comme code', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: "' OR '1'='1", password: 'x' });
    // Rejete par la validation d'email (donnees invalides), pas par un crash serveur
    expect(res.status).toBe(400);
  });

  test('rate limiting : bloque apres plusieurs echecs de connexion', async () => {
    let lastRes;
    for (let i = 0; i < 6; i++) {
      lastRes = await request(app)
        .post('/auth/login')
        .send({ email: 'a@test.com', password: 'mauvais-mot-de-passe' }); // pragma: allowlist secret
    }
    expect(lastRes.status).toBe(429);
  });
});
