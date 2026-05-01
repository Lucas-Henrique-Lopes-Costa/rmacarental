const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db, uuidv4, parseCar } = require('../database/db');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed.'));
    cb(null, true);
  },
});

/* GET /api/cars */
router.get('/', async (req, res) => {
  try {
    const { category, available, search } = req.query;
    let sql = 'SELECT * FROM cars WHERE 1=1';
    const args = [];

    if (category) { sql += ' AND category = ?'; args.push(category); }
    if (available !== undefined) { sql += ' AND available = ?'; args.push(available === 'true' ? 1 : 0); }
    if (search) { sql += ' AND (name LIKE ? OR brand LIKE ? OR category LIKE ?)'; args.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    sql += ' ORDER BY created_at DESC';
    const { rows } = await db.execute({ sql, args });
    res.json({ data: rows.map(parseCar) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/cars/:id */
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM cars WHERE id = ?', args: [req.params.id] });
    if (!rows.length) return res.status(404).json({ error: 'Car not found.' });
    res.json(parseCar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/cars — create */
router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || `car_${uuidv4().split('-')[0]}`;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `uploads/${f.filename}`);
    } else if (body.images) {
      images = Array.isArray(body.images)
        ? body.images
        : body.images.split('\n').map(l => l.trim()).filter(Boolean);
    }

    const features = body.features
      ? (Array.isArray(body.features) ? body.features : body.features.split('\n').map(l => l.trim()).filter(Boolean))
      : [];

    await db.execute({
      sql: `INSERT INTO cars (id,name,brand,model,year,category,transmission,fuel,seats,daily_rate,engine,consumption,trunk_l,description,features,images,available)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        id, body.name, body.brand, body.model || body.name,
        parseInt(body.year), body.category, body.transmission, body.fuel,
        parseInt(body.seats), parseFloat(body.dailyRate),
        body.engine || '', body.consumption || '', parseInt(body.trunkL) || 0,
        body.description || '', JSON.stringify(features), JSON.stringify(images),
        body.available === 'false' || body.available === false ? 0 : 1,
      ],
    });

    const { rows } = await db.execute({ sql: 'SELECT * FROM cars WHERE id = ?', args: [id] });
    res.status(201).json(parseCar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT /api/cars/:id — update */
router.put('/:id', upload.array('photos', 10), async (req, res) => {
  try {
    const { rows: existing } = await db.execute({ sql: 'SELECT * FROM cars WHERE id = ?', args: [req.params.id] });
    if (!existing.length) return res.status(404).json({ error: 'Veículo não encontrado.' });

    const body = req.body;
    let images;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `uploads/${f.filename}`);
      const oldImages = JSON.parse(existing[0].images || '[]');
      images = [...oldImages, ...newImages];
    } else if (body.images !== undefined) {
      images = Array.isArray(body.images)
        ? body.images
        : body.images.split('\n').map(l => l.trim()).filter(Boolean);
    } else {
      images = JSON.parse(existing[0].images || '[]');
    }

    const features = body.features !== undefined
      ? (Array.isArray(body.features) ? body.features : body.features.split('\n').map(l => l.trim()).filter(Boolean))
      : JSON.parse(existing[0].features || '[]');

    await db.execute({
      sql: `UPDATE cars SET name=?,brand=?,model=?,year=?,category=?,transmission=?,fuel=?,seats=?,daily_rate=?,engine=?,consumption=?,trunk_l=?,description=?,features=?,images=?,available=?
            WHERE id=?`,
      args: [
        body.name || existing[0].name,
        body.brand || existing[0].brand,
        body.model || body.name || existing[0].model,
        parseInt(body.year) || existing[0].year,
        body.category || existing[0].category,
        body.transmission || existing[0].transmission,
        body.fuel || existing[0].fuel,
        parseInt(body.seats) || existing[0].seats,
        parseFloat(body.dailyRate) || existing[0].daily_rate,
        body.engine ?? existing[0].engine,
        body.consumption ?? existing[0].consumption,
        parseInt(body.trunkL) || existing[0].trunk_l,
        body.description ?? existing[0].description,
        JSON.stringify(features),
        JSON.stringify(images),
        body.available === 'false' || body.available === false ? 0 : (body.available === 'true' || body.available === true ? 1 : existing[0].available),
        req.params.id,
      ],
    });

    const { rows } = await db.execute({ sql: 'SELECT * FROM cars WHERE id = ?', args: [req.params.id] });
    res.json(parseCar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PATCH /api/cars/:id/availability */
router.patch('/:id/availability', async (req, res) => {
  try {
    const { available } = req.body;
    await db.execute({
      sql: 'UPDATE cars SET available = ? WHERE id = ?',
      args: [available ? 1 : 0, req.params.id],
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/cars/:id */
router.delete('/:id', async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM cars WHERE id = ?', args: [req.params.id] });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/cars/:id/images/:filename — remove specific image */
router.delete('/:id/images/:filename', async (req, res) => {
  try {
    const { rows } = await db.execute({ sql: 'SELECT images FROM cars WHERE id = ?', args: [req.params.id] });
    if (!rows.length) return res.status(404).json({ error: 'Car not found.' });
    const images = JSON.parse(rows[0].images || '[]').filter(img => !img.endsWith(req.params.filename));
    await db.execute({ sql: 'UPDATE cars SET images = ? WHERE id = ?', args: [JSON.stringify(images), req.params.id] });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
