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
      id: 'car_sportage_2026',
      name: 'Kia Sportage',
      brand: 'Kia',
      model: 'Sportage',
      year: 2026,
      category: 'SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 5,
      daily_rate: 250,
      engine: '2.5L GDI 187 hp',
      consumption: '11.8 km/L',
      trunk_l: 503,
      description: 'The 2026 Kia Sportage in Gray pairs a bold redesigned front end with refined comfort. A versatile compact SUV with the latest connectivity, advanced driver-assistance and a spacious cabin — ready for the city or your next weekend escape.',
      features: JSON.stringify(['Panoramic Sunroof', '12.3" Dual Display', 'Apple CarPlay / Android Auto', '360° Camera', 'Heated Leather Seats', 'Adaptive Cruise Control']),
      images: JSON.stringify([
        'uploads/sportage-gray-1.jpg',
        'uploads/sportage-gray-2.jpg',
      ]),
      available: 1,
    },
    {
      id: 'car_sorento_black_2026',
      name: 'Kia Sorento Black',
      brand: 'Kia',
      model: 'Sorento',
      year: 2026,
      category: 'SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 7,
      daily_rate: 320,
      engine: '2.5L GDI 191 hp',
      consumption: '11.2 km/L',
      trunk_l: 616,
      description: 'The 2026 Kia Sorento in Aurora Black Pearl is the ideal large SUV for those who need space without sacrificing luxury. With 7 seats, a refined cabin and a stealthy black exterior, it is the perfect choice for elegant, comfortable road trips.',
      features: JSON.stringify(['7 Seats', '12.3" Dual Display', 'Navigation System', '360° Camera', 'Parking Assist', 'Intelligent Cruise Control']),
      images: JSON.stringify([
        'uploads/sorento-black-1.jpg',
      ]),
      available: 1,
    },
    {
      id: 'car_sorento_silver_2026',
      name: 'Kia Sorento Silver',
      brand: 'Kia',
      model: 'Sorento',
      year: 2026,
      category: 'SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 7,
      daily_rate: 320,
      engine: '2.5L GDI 191 hp',
      consumption: '11.2 km/L',
      trunk_l: 616,
      description: 'The 2026 Kia Sorento in Silver offers the same premium 7-seater experience with a bright, modern exterior. Generous space, the latest tech and refined comfort for long, hassle-free journeys with the whole family.',
      features: JSON.stringify(['7 Seats', '12.3" Dual Display', 'Navigation System', '360° Camera', 'Parking Assist', 'Intelligent Cruise Control']),
      images: JSON.stringify([
        'uploads/sorento-1.jpg',
        'uploads/sorento-2.jpg',
        'uploads/sorento-3.jpg',
        'uploads/sorento-4.jpg',
      ]),
      available: 1,
    },
    {
      id: 'car_carnival_2026',
      name: 'Kia Carnival',
      brand: 'Kia',
      model: 'Carnival',
      year: 2026,
      category: 'Minivan',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 8,
      daily_rate: 350,
      engine: '3.5L V6 290 hp',
      consumption: '8.5 km/L',
      trunk_l: 1140,
      description: 'The 2026 Kia Carnival in Silky Silver is the perfect minivan for family trips and group travel. Seating 8 passengers with a powerful V6 engine, sliding doors and a premium cabin — every journey becomes a first-class experience.',
      features: JSON.stringify(['Triple-zone A/C', '12.3" Touchscreen', 'Bose 12-speaker Audio', '360° Camera', 'Adaptive Cruise Control', 'Power Sliding Doors']),
      images: JSON.stringify([
        'uploads/carnival-gray-1.jpg',
        'uploads/carnival-gray-3.jpg',
        'uploads/carnival-gray-2.jpg',
      ]),
      available: 1,
    },
    {
      id: 'car_ford_edge_2017',
      name: 'Ford Edge Titanium',
      brand: 'Ford',
      model: 'Edge Titanium',
      year: 2017,
      category: 'SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 5,
      daily_rate: 280,
      engine: '2.0L EcoBoost Turbo 245 hp',
      consumption: '10.0 km/L',
      trunk_l: 1110,
      description: 'The 2017 Ford Edge Titanium is a premium mid-size SUV with a turbocharged 2.0L EcoBoost engine, leather interior and an impressive list of luxury features. Strong performance, refined ride and a roomy cabin for 5 — ideal for both city and highway driving.',
      features: JSON.stringify(['2.0L EcoBoost Turbo', 'Leather Interior', 'Heated Seats', 'Panoramic Roof', 'Adaptive Cruise Control', 'Lane Keeping Assist']),
      images: JSON.stringify([
        'uploads/edge-3.jpg',
        'uploads/edge-1.jpg',
        'uploads/edge-2.jpg',
        'uploads/edge-4.jpg',
      ]),
      available: 1,
    },
    {
      id: 'car_cybertruck_2024',
      name: 'Tesla Cybertruck',
      brand: 'Tesla',
      model: 'Cybertruck AWD',
      year: 2024,
      category: 'Pickup',
      transmission: 'Single-speed',
      fuel: 'Electric',
      seats: 5,
      daily_rate: 800,
      engine: 'Dual Motor AWD 600 hp',
      consumption: '340 mi range',
      trunk_l: 1900,
      description: 'The Tesla Cybertruck Dual Motor AWD is the most distinctive electric pickup ever made. 600 hp, 0–60 mph in 4.1 seconds and up to 340 miles of range on a single charge. Stainless steel exoskeleton, armor glass and futuristic interior — an experience like no other.',
      features: JSON.stringify(['Dual Motor AWD', '0-100 km/h in 4.1s', '340 mi (550 km) Range', 'Stainless Steel Body', 'Autopilot Included', 'Adaptive Air Suspension']),
      images: JSON.stringify([
        'uploads/cybertruck-1.jpg',
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
    { id: 'res_001', car_id: 'car_carnival_2026', car_name: 'Kia Carnival 2026', client_name: 'John Smith', client_phone: '(11) 99999-1234', client_email: 'john.smith@email.com', pickup_date: '2026-05-20', return_date: '2026-05-23', pickup_time: '09:00', observations: 'Please inspect the car before pickup.', status: 'confirmed', total_days: 3, total_value: 1050 },
    { id: 'res_002', car_id: 'car_sportage_2026', car_name: 'Kia Sportage 2026', client_name: 'Mary Johnson', client_phone: '(21) 98888-5678', client_email: 'mary.johnson@email.com', pickup_date: '2026-05-22', return_date: '2026-05-24', pickup_time: '10:00', observations: '', status: 'pending', total_days: 2, total_value: 500 },
    { id: 'res_003', car_id: 'car_sorento_black_2026', car_name: 'Kia Sorento Black 2026', client_name: 'Carlos Mendes', client_phone: '(31) 97777-9012', client_email: 'carlos.mendes@email.com', pickup_date: '2026-05-25', return_date: '2026-05-30', pickup_time: '08:00', observations: 'Long trip, may need roadside assistance.', status: 'pending', total_days: 5, total_value: 1600 },
    { id: 'res_004', car_id: 'car_cybertruck_2024', car_name: 'Tesla Cybertruck 2024', client_name: 'Anna Costa', client_phone: '(41) 96666-3456', client_email: 'anna.costa@email.com', pickup_date: '2026-06-01', return_date: '2026-06-03', pickup_time: '14:00', observations: 'Special VIP delivery requested.', status: 'confirmed', total_days: 2, total_value: 1600 },
    { id: 'res_005', car_id: 'car_ford_edge_2017', car_name: 'Ford Edge Titanium 2017', client_name: 'Peter Santos', client_phone: '(51) 95555-7890', client_email: 'peter.santos@email.com', pickup_date: '2026-05-15', return_date: '2026-05-17', pickup_time: '11:00', observations: 'Requesting a child car seat.', status: 'confirmed', total_days: 2, total_value: 560 },
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
