// ========================
// MENU MOBILE
// ========================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Fecha menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

// ========================
// NAVBAR SCROLL
// ========================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 24px rgba(122,32,53,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ========================
// STAR RATING
// ========================
let selectedRating = 0;
const stars = document.querySelectorAll('.star');

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const val = parseInt(star.dataset.value);
    highlightStars(val);
  });

  star.addEventListener('mouseleave', () => {
    highlightStars(selectedRating);
  });

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    highlightStars(selectedRating);
  });
});

function highlightStars(count) {
  stars.forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.value) <= count);
  });
}

// ========================
// FORM - LISTA DE ESPERA
// ========================
function handleWaitlist(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const email = input.value.trim();
  if (!email) return;

  alert(`✅ Ótimo! ${email} foi adicionado à lista de espera do Destrava30. Avisaremos em breve!`);
  input.value = '';
}

// ========================
// FORM - DEPOIMENTO
// ========================
function handleFeedback(e) {
  e.preventDefault();
  const name = e.target.querySelector('input[type="text"]').value.trim();
  const text = e.target.querySelector('textarea').value.trim();

  if (!name || !text) {
    alert('Por favor, preencha seu nome e depoimento.');
    return;
  }

  if (selectedRating === 0) {
    alert('Por favor, selecione uma avaliação com as estrelas.');
    return;
  }

  alert(`💖 Obrigada, ${name}! Seu depoimento foi enviado e será analisado em breve.`);
  e.target.reset();
  selectedRating = 0;
  highlightStars(0);
}

// ========================
// SCROLL SUAVE
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========================
// ANIMAÇÃO DE ENTRADA (FADE IN)
// ========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .testimonial-card, .problem-block, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});