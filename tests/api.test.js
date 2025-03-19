// tests/api.test.js
import request from 'supertest';
import express from 'express';
import { marked } from 'marked';

// --- setup express app for testing ---
const app = express();
app.use(express.json());

// our get endpoint for testing
app.get('/api/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const htmlContent = marked.parse(content, {
    mangle: false,
    headerIds: false,
  });
  res.json({
    title,
    html: htmlContent,
  });
});

// --- tests ---
describe('GET /api/', () => {
  it('should return 400 if title and content are missing', async () => {
    const res = await request(app)
      .get('/api/')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('title and content are required');
  });

  it('should convert markdown to html correctly', async () => {
    const mdContent = '# heading\n\nthis is a paragraph.';
    const res = await request(app)
      .get('/api/')
      .send({ title: 'test', content: mdContent });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('test');
    expect(res.body.html).toContain('<h1>heading</h1>');
    expect(res.body.html).toContain('<p>this is a paragraph.</p>');
  });
});

