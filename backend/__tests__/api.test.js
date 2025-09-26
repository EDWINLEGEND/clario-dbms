// __tests__/api.test.js
const request = require('supertest');

// NOTE: Your backend server must be running for these tests to work
const app = 'http://localhost:4000';

// Replace this with a valid JWT token for testing
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdC11c2VyQGplc3QtdGVzdHMuY29tIiwibHQiOm51bGwsImlhdCI6MTc1ODg2MTUxNywiZXhwIjoxNzU4ODYyNDE3fQ.nZyqDDazrm4ix7LjugBghZXNm0vP9w_7JoewLbmzqBk';

let projectId;

describe('Authentication Middleware', () => {
  it('should return 401 Unauthorized for unauthenticated requests to GET /projects', async () => {
    const response = await request(app).get('/projects');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Unauthorized for unauthenticated requests to POST /projects', async () => {
    const response = await request(app)
      .post('/projects')
      .send({
        title: 'Test Project',
        description: 'This should fail without auth'
      });
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Unauthorized for unauthenticated requests to GET /projects/:id', async () => {
    const response = await request(app).get('/projects/1');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Unauthorized for unauthenticated requests to PATCH /projects/:id', async () => {
    const response = await request(app)
      .patch('/projects/1')
      .send({ title: 'Updated Title' });
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Unauthorized for unauthenticated requests to DELETE /projects/:id', async () => {
    const response = await request(app).delete('/projects/1');
    expect(response.statusCode).toBe(401);
  });
});

describe('Projects API - CRUD Operations', () => {
  it('should allow an authenticated user to create a new project', async () => {
    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project from Jest',
        description: 'This is a test description.'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Project from Jest');
    expect(response.body.description).toBe('This is a test description.');

    // Save the ID for the next tests
    projectId = response.body.id;
  });

  it('should fetch all projects for an authenticated user', async () => {
    const response = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single project for an authenticated user', async () => {
    const response = await request(app)
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body.title).toBe('Test Project from Jest');
  });

  it('should return 404 for non-existent project', async () => {
    const response = await request(app)
      .get('/projects/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });

  it('should allow the user to update the created project', async () => {
    const response = await request(app)
      .patch(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Project',
        description: 'Updated description'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Updated Test Project');
    expect(response.body.description).toBe('Updated description');
  });

  it('should return 404 when trying to update non-existent project', async () => {
    const response = await request(app)
      .patch('/projects/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Should not work' });

    expect(response.statusCode).toBe(404);
  });

  it('should allow the user to delete the created project', async () => {
    const response = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });

  it('should return 404 when trying to delete non-existent project', async () => {
    const response = await request(app)
      .delete('/projects/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });
});

describe('Projects API - Edge Cases and Security', () => {
  it('should return 400 for missing title when creating project', async () => {
    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Project without title'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid project ID format', async () => {
    const response = await request(app)
      .get('/projects/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });

  it('should handle very long project titles gracefully', async () => {
    const longTitle = 'A'.repeat(300); // Exceeds VarChar(255) limit
    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: longTitle,
        description: 'Testing long title'
      });

    // Should return 500 due to database constraint violation
    expect(response.statusCode).toBe(500);
  });
});