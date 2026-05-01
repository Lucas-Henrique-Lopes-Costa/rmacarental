const express = require('express');
const { db, uuidv4, parseReservation } = require('../database/db');

const router = express.Router();

/* GET /api/reservations */
router.get('/', async (req, res) => {
  try {
    const { status, carId, search, page = 1, limit = 50 } = req.query;
    let sql = 'SELECT * FROM reservations WHERE 1=1';
    const args = [];

    if (status) { sql += ' AND status = ?'; args.push(status); }
    if (carId) { sql += ' AND car_id = ?'; args.push(carId); }
    if (search) {
      sql += ' AND (client_name LIKE ? OR client_phone LIKE ? OR client_email LIKE ? OR car_name LIKE ? OR id LIKE ?)';
      const s = `%${search}%`;
      args.push(s, s, s, s, s);
    }

    sql += ' ORDER BY created_at DESC';

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { rows: countRows } = await db.execute({ sql: countSql, args });
    const total = Number(countRows[0].total);

    sql += ` LIMIT ? OFFSET ?`;
    args.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const { rows } = await db.execute({ sql, args });
    res.json({
      data: rows.map(parseReservation),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/reservations/stats */
router.get('/stats', async (req, res) => {
  try {
    const [total, pending, confirmed, cancelled, cars, availCars] = await Promise.all([
      db.execute('SELECT COUNT(*) as c FROM reservations'),
      db.execute("SELECT COUNT(*) as c FROM reservations WHERE status='pending'"),
      db.execute("SELECT COUNT(*) as c FROM reservations WHERE status='confirmed'"),
      db.execute("SELECT COUNT(*) as c FROM reservations WHERE status='cancelled'"),
      db.execute('SELECT COUNT(*) as c FROM cars'),
      db.execute('SELECT COUNT(*) as c FROM cars WHERE available=1'),
    ]);

    const revenueResult = await db.execute("SELECT COALESCE(SUM(total_value),0) as total FROM reservations WHERE status='confirmed'");

    res.json({
      total: Number(total.rows[0].c),
      pending: Number(pending.rows[0].c),
      confirmed: Number(confirmed.rows[0].c),
      cancelled: Number(cancelled.rows[0].c),
      totalCars: Number(cars.rows[0].c),
      availableCars: Number(availCars.rows[0].c),
      totalRevenue: Number(revenueResult.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/reservations/:id */
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM reservations WHERE id = ?', args: [req.params.id] });
    if (!rows.length) return res.status(404).json({ error: 'Reservation not found.' });
    res.json(parseReservation(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/reservations — create */
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = `res_${uuidv4().split('-')[0]}`;

    const days = body.totalDays || Math.ceil((new Date(body.returnDate) - new Date(body.pickupDate)) / 86400000);

    await db.execute({
      sql: `INSERT INTO reservations (id,car_id,car_name,client_name,client_phone,client_email,pickup_date,return_date,pickup_time,observations,status,total_days,total_value)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        id, body.carId, body.carName,
        body.clientName, body.clientPhone, body.clientEmail,
        body.pickupDate, body.returnDate, body.pickupTime,
        body.observations || '', 'pendente',
        Number(days), Number(body.totalValue),
      ],
    });

    const { rows } = await db.execute({ sql: 'SELECT * FROM reservations WHERE id = ?', args: [id] });
    res.status(201).json(parseReservation(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PATCH /api/reservations/:id/status */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

    await db.execute({
      sql: "UPDATE reservations SET status=?, updated_at=datetime('now') WHERE id=?",
      args: [status, req.params.id],
    });

    const { rows } = await db.execute({ sql: 'SELECT * FROM reservations WHERE id = ?', args: [req.params.id] });
    if (!rows.length) return res.status(404).json({ error: 'Reservation not found.' });
    res.json(parseReservation(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT /api/reservations/:id — full update */
router.put('/:id', async (req, res) => {
  try {
    const body = req.body;
    await db.execute({
      sql: `UPDATE reservations SET car_id=?,car_name=?,client_name=?,client_phone=?,client_email=?,pickup_date=?,return_date=?,pickup_time=?,observations=?,status=?,total_days=?,total_value=?,updated_at=datetime('now')
            WHERE id=?`,
      args: [
        body.carId, body.carName, body.clientName, body.clientPhone, body.clientEmail,
        body.pickupDate, body.returnDate, body.pickupTime, body.observations || '',
        body.status, Number(body.totalDays), Number(body.totalValue), req.params.id,
      ],
    });
    const { rows } = await db.execute({ sql: 'SELECT * FROM reservations WHERE id = ?', args: [req.params.id] });
    if (!rows.length) return res.status(404).json({ error: 'Reservation not found.' });
    res.json(parseReservation(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/reservations/:id */
router.delete('/:id', async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM reservations WHERE id = ?', args: [req.params.id] });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
