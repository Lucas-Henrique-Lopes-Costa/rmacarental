/* ============================================================
   RMA Car Rental — Data Layer (localStorage)
   ============================================================ */

const DB = {
  CARS_KEY: 'rma_cars',
  RESERVATIONS_KEY: 'rma_reservations',

  seed() {
    if (!localStorage.getItem(this.CARS_KEY)) {
      localStorage.setItem(this.CARS_KEY, JSON.stringify(SEED_CARS));
    }
    if (!localStorage.getItem(this.RESERVATIONS_KEY)) {
      localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(SEED_RESERVATIONS));
    }
  },

  getCars() {
    return JSON.parse(localStorage.getItem(this.CARS_KEY) || '[]');
  },

  getCarById(id) {
    return this.getCars().find(c => c.id === id) || null;
  },

  saveCar(car) {
    const cars = this.getCars();
    const idx = cars.findIndex(c => c.id === car.id);
    if (idx > -1) {
      cars[idx] = car;
    } else {
      car.id = 'car_' + Date.now();
      cars.push(car);
    }
    localStorage.setItem(this.CARS_KEY, JSON.stringify(cars));
    return car;
  },

  deleteCar(id) {
    const cars = this.getCars().filter(c => c.id !== id);
    localStorage.setItem(this.CARS_KEY, JSON.stringify(cars));
  },

  getReservations() {
    return JSON.parse(localStorage.getItem(this.RESERVATIONS_KEY) || '[]');
  },

  getReservationById(id) {
    return this.getReservations().find(r => r.id === id) || null;
  },

  saveReservation(res) {
    const list = this.getReservations();
    const idx = list.findIndex(r => r.id === res.id);
    if (idx > -1) {
      list[idx] = res;
    } else {
      res.id = 'res_' + Date.now();
      res.createdAt = new Date().toISOString();
      list.unshift(res);
    }
    localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(list));
    return res;
  },

  updateReservationStatus(id, status) {
    const list = this.getReservations();
    const idx = list.findIndex(r => r.id === id);
    if (idx > -1) {
      list[idx].status = status;
      list[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteReservation(id) {
    const list = this.getReservations().filter(r => r.id !== id);
    localStorage.setItem(this.RESERVATIONS_KEY, JSON.stringify(list));
  },

  getStats() {
    const reservations = this.getReservations();
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === 'pendente').length,
      confirmed: reservations.filter(r => r.status === 'confirmada').length,
      cancelled: reservations.filter(r => r.status === 'cancelada').length,
      totalCars: this.getCars().length,
      availableCars: this.getCars().filter(c => c.available).length,
    };
  }
};

/* ---- Seed Data -------------------------------------------- */
const SEED_CARS = [
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
    dailyRate: 350,
    engine: '2.2 CRDi 200 cv',
    consumption: '10,5 km/L',
    trunkL: 627,
    features: ['Ar-condicionado de 3 zonas', 'Tela 12,3"', 'Som Bose 12 alto-falantes', 'Câmera 360°', 'Pilot. automático adaptativo', 'Bancos de couro'],
    description: 'O Kia Carnival 2026 é a minivan perfeita para viagens em família. Com capacidade para 8 passageiros, motor diesel potente e tecnologia de ponta, oferece conforto e praticidade incomparáveis em cada quilômetro.',
    images: [
      'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38.jpeg',
      'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (1).jpeg',
      'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (2).jpeg',
      'briefing/carros/Kia Carnival 2026/WhatsApp Image 2026-04-16 at 14.29.38 (3).jpeg',
    ],
    available: true,
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
    dailyRate: 250,
    engine: '2.0 GDi 149 cv',
    consumption: '11,8 km/L',
    trunkL: 503,
    features: ['Teto solar panorâmico', 'Tela touchscreen 10,25"', 'Apple CarPlay / Android Auto', 'Câmera de ré', 'Controle de estabilidade', 'Airbags dianteiros e laterais'],
    description: 'O Kia Sportage 2023 combina design arrojado com tecnologia moderna. SUV compacto e versátil com excelente espaço interno, motor flex eficiente e recursos de conectividade para o seu dia a dia.',
    images: [
      'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42.jpeg',
      'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (1).jpeg',
      'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (2).jpeg',
      'briefing/carros/Kia Soortage 2023/WhatsApp Image 2026-04-16 at 14.31.42 (3).jpeg',
    ],
    available: true,
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
    dailyRate: 320,
    engine: '2.2 CRDi 202 cv',
    consumption: '11,2 km/L',
    trunkL: 616,
    features: ['7 lugares', 'Tela 12,3" dual display', 'Sistema de navegação', 'Câmera 360° com visão de ponto cego', 'Assistente de estacionamento', 'Controle de cruzeiro inteligente'],
    description: 'O Kia Sorento 2026 é o SUV grande ideal para quem precisa de espaço sem abrir mão de luxo. Com 7 lugares, motor diesel robusto e interior premium, é a escolha certa para viagens longas e confortáveis.',
    images: [
      'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.26.07.jpeg',
      'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.32.jpeg',
      'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.32 (1).jpeg',
      'briefing/carros/Kia Sorrento 2026/WhatsApp Image 2026-04-16 at 14.27.33.jpeg',
    ],
    available: true,
  }
];

const SEED_RESERVATIONS = [
  {
    id: 'res_001',
    carId: 'car_carnival_2026',
    carName: 'Kia Carnival 2026',
    clientName: 'João Silva',
    clientPhone: '(11) 99999-1234',
    clientEmail: 'joao.silva@email.com',
    pickupDate: '2026-05-10',
    returnDate: '2026-05-13',
    pickupTime: '09:00',
    observations: 'Preciso da vistoria antes da retirada.',
    status: 'confirmada',
    totalDays: 3,
    totalValue: 1050,
    createdAt: '2026-04-28T14:30:00Z',
  },
  {
    id: 'res_002',
    carId: 'car_sportage_2023',
    carName: 'Kia Sportage 2023',
    clientName: 'Maria Oliveira',
    clientPhone: '(21) 98888-5678',
    clientEmail: 'maria.oliveira@email.com',
    pickupDate: '2026-05-12',
    returnDate: '2026-05-14',
    pickupTime: '10:00',
    observations: '',
    status: 'pendente',
    totalDays: 2,
    totalValue: 500,
    createdAt: '2026-04-29T09:15:00Z',
  },
  {
    id: 'res_003',
    carId: 'car_sorrento_2026',
    carName: 'Kia Sorento 2026',
    clientName: 'Carlos Mendes',
    clientPhone: '(31) 97777-9012',
    clientEmail: 'carlos.mendes@email.com',
    pickupDate: '2026-05-15',
    returnDate: '2026-05-20',
    pickupTime: '08:00',
    observations: 'Viagem longa, precisarei de assistência em estrada.',
    status: 'pendente',
    totalDays: 5,
    totalValue: 1600,
    createdAt: '2026-04-30T11:00:00Z',
  },
  {
    id: 'res_004',
    carId: 'car_carnival_2026',
    carName: 'Kia Carnival 2026',
    clientName: 'Ana Costa',
    clientPhone: '(41) 96666-3456',
    clientEmail: 'ana.costa@email.com',
    pickupDate: '2026-04-20',
    returnDate: '2026-04-23',
    pickupTime: '14:00',
    observations: '',
    status: 'cancelada',
    totalDays: 3,
    totalValue: 1050,
    createdAt: '2026-04-18T16:45:00Z',
  },
  {
    id: 'res_005',
    carId: 'car_sportage_2023',
    carName: 'Kia Sportage 2023',
    clientName: 'Pedro Santos',
    clientPhone: '(51) 95555-7890',
    clientEmail: 'pedro.santos@email.com',
    pickupDate: '2026-05-05',
    returnDate: '2026-05-07',
    pickupTime: '11:00',
    observations: 'Solicito cadeirinha infantil.',
    status: 'confirmada',
    totalDays: 2,
    totalValue: 500,
    createdAt: '2026-04-27T10:20:00Z',
  },
];

/* ---- Helpers --------------------------------------------- */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function calcDays(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function getStatusLabel(status) {
  const map = { pendente: 'Pendente', confirmada: 'Confirmada', cancelada: 'Cancelada' };
  return map[status] || status;
}

function getStatusBadgeClass(status) {
  const map = { pendente: 'badge-pending', confirmada: 'badge-confirmed', cancelada: 'badge-cancelled' };
  return map[status] || '';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]} ${type}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ---- Nav scroll behavior ---------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }
}

/* ---- AOS (simple scroll reveal) --------------------------- */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  DB.seed();
  initNav();
  initAOS();
});
