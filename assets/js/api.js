/* ============================================================
   RMA Car Rental — API Client
   Comunicação com o backend Express / SQLite
   ============================================================ */

const API_BASE = '/api';

const API = {
  async request(method, path, body) {
    const opts = {
      method,
      headers: {},
    };
    if (body instanceof FormData) {
      opts.body = body;
    } else if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(API_BASE + path, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido.' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  /* Cars */
  getCars: (params = {}) => API.request('GET', '/cars?' + new URLSearchParams(params)),
  getCarById: (id) => API.request('GET', `/cars/${id}`),
  createCar: (data) => API.request('POST', '/cars', data),
  updateCar: (id, data) => API.request('PUT', `/cars/${id}`, data),
  updateCarAvailability: (id, available) => API.request('PATCH', `/cars/${id}/availability`, { available }),
  deleteCar: (id) => API.request('DELETE', `/cars/${id}`),

  /* Reservations */
  getReservations: (params = {}) => API.request('GET', '/reservations?' + new URLSearchParams(params)),
  getStats: () => API.request('GET', '/reservations/stats'),
  getReservationById: (id) => API.request('GET', `/reservations/${id}`),
  createReservation: (data) => API.request('POST', '/reservations', data),
  updateReservationStatus: (id, status) => API.request('PATCH', `/reservations/${id}/status`, { status }),
  deleteReservation: (id) => API.request('DELETE', `/reservations/${id}`),

  /* Multipart car form (com upload de foto) */
  async saveCarForm(formData, id) {
    const res = await fetch(API_BASE + (id ? `/cars/${id}` : '/cars'), {
      method: id ? 'PUT' : 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido.' }));
      throw new Error(err.error);
    }
    return res.json();
  },
};

/* ---- Helpers ---------------------------------------------- */
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
  const a = new Date(start + 'T00:00:00');
  const b = new Date(end + 'T00:00:00');
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function getStatusLabel(status) {
  const map = { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled' };
  return map[status] || status;
}

function getStatusBadgeClass(status) {
  const map = { pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled' };
  return map[status] || '';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info} ${type}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function showLoading(containerId, msg = 'Carregando...') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--neutral);"><i class="fas fa-circle-notch fa-spin" style="font-size:1.5rem;margin-bottom:0.75rem;display:block;color:var(--blue);"></i>${msg}</div>`;
}

function showError(containerId, msg = 'Erro ao carregar dados.') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle" style="color:#ef4444;"></i><p>${msg}</p></div>`;
}

/* ---- Nav -------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
  }
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }
}

/* ---- AOS scroll reveal ------------------------------------ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.aosDelay) || 0;
        setTimeout(() => e.target.classList.add('aos-animate'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAOS();
});
