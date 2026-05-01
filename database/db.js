const { createClient } = require('@libsql/client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const db = createClient({
  url: `file:${path.join(__dirname, '..', 'database', 'rmacarental.db')}`,
});

async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT,
      year INTEGER NOT NULL,
      category TEXT NOT NULL,
      transmission TEXT NOT NULL,
      fuel TEXT NOT NULL,
      seats INTEGER NOT NULL,
      daily_rate REAL NOT NULL,
      engine TEXT,
      consumption TEXT,
      trunk_l INTEGER DEFAULT 0,
      description TEXT,
      features TEXT DEFAULT '[]',
      images TEXT DEFAULT '[]',
      available INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      car_id TEXT NOT NULL,
      car_name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      observations TEXT DEFAULT '',
      status TEXT DEFAULT 'pendente',
      total_days INTEGER NOT NULL,
      total_value REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT
    );
  `);

  const { rows } = await db.execute('SELECT COUNT(*) as c FROM cars');
  if (rows[0].c === 0) {
    await seedData();
  }
}

async function seedData() {
  const cars = [
    {
      id: 'car_carnival_2026',
      name: 'Kia Carnival',
      brand: 'Kia',
      model: 'Carnival',
      year: 2026,
      category: 'Minivan',
      transmission: 'Automático',
      fuel: 'Diesel',
      seats: 8,
      daily_rate: 350,
      engine: '2.2 CRDi 200 hp',
      consumption: '10.5 km/L',
      trunk_l: 627,
      description: 'The Kia Carnival 2026 is the perfect minivan for family trips. Seating 8 passengers with a powerful diesel engine and cutting-edge technology, it delivers unmatched comfort and practicality on every journey.',
      features: JSON.stringify(['Triple-zone A/C', '12.3" Touchscreen', 'Bose 12-speaker audio', '360° Camera', 'Adaptive Cruise Control', 'Leather Seats']),
      images: JSON.stringify([
        'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38.jpeg',
        'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (1).jpeg',
        'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (2).jpeg',
        'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (3).jpeg',
      ]),
      available: 1,
    },
    {
      id: 'car_sportage_2023',
      name: 'Kia Sportage',
      brand: 'Kia',
      model: 'Sportage',
      year: 2023,
      category: 'SUV',
      transmission: 'Automático',
      fuel: 'Flex',
      seats: 5,
      daily_rate: 250,
      engine: '2.0 GDi 149 hp',
      consumption: '11.8 km/L',
      trunk_l: 503,
      description: 'The Kia Sportage 2023 blends bold design with modern technology. A compact yet versatile SUV with an excellent cabin, efficient flex engine and connectivity features for your everyday needs.',
      features: JSON.stringify(['Panoramic Sunroof', '10.25" Touchscreen', 'Apple CarPlay / Android Auto', 'Rearview Camera', 'Stability Control', 'Front & Side Airbags']),
      images: JSON.stringify([
        'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42.jpeg',
        'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (1).jpeg',
        'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (2).jpeg',
        'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (3).jpeg',
      ]),
      available: 1,
    },
    {
      id: 'car_sorrento_2026',
      name: 'Kia Sorento',
      brand: 'Kia',
      model: 'Sorento',
      year: 2026,
      category: 'SUV',
      transmission: 'Automático',
      fuel: 'Diesel',
      seats: 7,
      daily_rate: 320,
      engine: '2.2 CRDi 202 hp',
      consumption: '11.2 km/L',
      trunk_l: 616,
      description: 'The Kia Sorento 2026 is the ideal large SUV for those who need space without sacrificing luxury. With 7 seats, a robust diesel engine and a premium interior, it\'s the perfect choice for long, comfortable road trips.',
      features: JSON.stringify(['7 Seats', '12.3" Dual Display', 'Navigation System', '360° Camera', 'Parking Assist', 'Intelligent Cruise Control']),
      images: JSON.stringify([
        'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.26.07.jpeg',
        'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.32.jpeg',
        'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.32 (1).jpeg',
        'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.33.jpeg',
      ]),
      available: 1,
    },
  ];

  for (const car of cars) {
    await db.execute({
      sql: `INSERT INTO cars (id,name,brand,model,year,category,transmission,fuel,seats,daily_rate,engine,consumption,trunk_l,description,features,images,available)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [car.id, car.name, car.brand, car.model, car.year, car.category, car.transmission, car.fuel, car.seats, car.daily_rate, car.engine, car.consumption, car.trunk_l, car.description, car.features, car.images, car.available],
    });
  }

  const reservations = [
    { id: 'res_001', car_id: 'car_carnival_2026', car_name: 'Kia Carnival 2026', client_name: 'John Smith', client_phone: '(11) 99999-1234', client_email: 'john.smith@email.com', pickup_date: '2026-05-10', return_date: '2026-05-13', pickup_time: '09:00', observations: 'Please inspect the car before pickup.', status: 'confirmed', total_days: 3, total_value: 1050 },
    { id: 'res_002', car_id: 'car_sportage_2023', car_name: 'Kia Sportage 2023', client_name: 'Mary Johnson', client_phone: '(21) 98888-5678', client_email: 'mary.johnson@email.com', pickup_date: '2026-05-12', return_date: '2026-05-14', pickup_time: '10:00', observations: '', status: 'pending', total_days: 2, total_value: 500 },
    { id: 'res_003', car_id: 'car_sorrento_2026', car_name: 'Kia Sorento 2026', client_name: 'Carlos Mendes', client_phone: '(31) 97777-9012', client_email: 'carlos.mendes@email.com', pickup_date: '2026-05-15', return_date: '2026-05-20', pickup_time: '08:00', observations: 'Long trip, may need roadside assistance.', status: 'pending', total_days: 5, total_value: 1600 },
    { id: 'res_004', car_id: 'car_carnival_2026', car_name: 'Kia Carnival 2026', client_name: 'Anna Costa', client_phone: '(41) 96666-3456', client_email: 'anna.costa@email.com', pickup_date: '2026-04-20', return_date: '2026-04-23', pickup_time: '14:00', observations: '', status: 'cancelled', total_days: 3, total_value: 1050 },
    { id: 'res_005', car_id: 'car_sportage_2023', car_name: 'Kia Sportage 2023', client_name: 'Peter Santos', client_phone: '(51) 95555-7890', client_email: 'peter.santos@email.com', pickup_date: '2026-05-05', return_date: '2026-05-07', pickup_time: '11:00', observations: 'Requesting a child car seat.', status: 'confirmed', total_days: 2, total_value: 500 },
  ];

  for (const r of reservations) {
    await db.execute({
      sql: `INSERT INTO reservations (id,car_id,car_name,client_name,client_phone,client_email,pickup_date,return_date,pickup_time,observations,status,total_days,total_value)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [r.id, r.car_id, r.car_name, r.client_name, r.client_phone, r.client_email, r.pickup_date, r.return_date, r.pickup_time, r.observations, r.status, r.total_days, r.total_value],
    });
  }

  console.log('✅ Database seeded with initial data.');
}

function parseCar(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    model: row.model,
    year: Number(row.year),
    category: row.category,
    transmission: row.transmission,
    fuel: row.fuel,
    seats: Number(row.seats),
    dailyRate: Number(row.daily_rate),
    engine: row.engine,
    consumption: row.consumption,
    trunkL: Number(row.trunk_l),
    description: row.description,
    features: JSON.parse(row.features || '[]'),
    images: JSON.parse(row.images || '[]'),
    available: Boolean(row.available),
    createdAt: row.created_at,
  };
}

function parseReservation(row) {
  if (!row) return null;
  return {
    id: row.id,
    carId: row.car_id,
    carName: row.car_name,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    pickupTime: row.pickup_time,
    observations: row.observations,
    status: row.status,
    totalDays: Number(row.total_days),
    totalValue: Number(row.total_value),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = { db, initDB, uuidv4, parseCar, parseReservation };
