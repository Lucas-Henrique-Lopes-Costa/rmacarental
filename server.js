const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* Static files */
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* API routes */
app.use('/api/cars', require('./routes/cars'));
app.use('/api/reservations', require('./routes/reservations'));

/* Health check */
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

/* SPA fallback — serve index.html for any non-API, non-asset route */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif)$/)) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`\n🚗 RMA Car Rental rodando em http://localhost:${PORT}`);
      console.log(`📊 Admin: http://localhost:${PORT}/admin/index.html`);
      console.log(`🗄️  API: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('Erro ao iniciar:', err);
    process.exit(1);
  }
}

start();
