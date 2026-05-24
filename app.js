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

// ========================
// CARROSEL FEEDBACKS
// ========================
let currentSlide = 0;
let totalSlides = 0;
let feedbacksData = [];

// Carregar feedbacks do JSON
async function loadFeedbacks() {
  try {
    const response = await fetch('feedbacks.json');
    const data = await response.json();
    feedbacksData = data.feedbacks;
    totalSlides = feedbacksData.length;
    renderCarousel();
    setupCarouselListeners();
    startAutoPlay();
  } catch (error) {
    console.error('Erro ao carregar feedbacks:', error);
  }
}

// Renderizar os cards de feedbacks
function renderCarousel() {
  const carouselWrapper = document.getElementById('carouselWrapper');
  const carouselDots = document.getElementById('carouselDots');
  
  // Limpar conteúdo anterior
  carouselWrapper.innerHTML = '';
  carouselDots.innerHTML = '';
  
  // Criar cards de feedbacks
  feedbacksData.forEach((feedback) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // Extrair primeira letra do nome para o avatar
    const avatarLetter = feedback.nome.charAt(0).toUpperCase();
    
    // Montar informações de localização
    const localization = feedback.idade ? `${feedback.idade} ${feedback.cidade}` : feedback.cidade;
    
    card.innerHTML = `
      <p>"${feedback.texto}"</p>
      <div class="testimonial-author">
        <div class="avatar">${avatarLetter}</div>
        <div>
          <strong>${feedback.nome}</strong>
          <small>${localization}</small>
        </div>
      </div>
    `;
    
    carouselWrapper.appendChild(card);
  });
  
  // Criar dots de navegação
  feedbacksData.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.dataset.slide = index;
    dot.addEventListener('click', () => goToSlide(index));
    carouselDots.appendChild(dot);
  });
}

function updateCarousel() {
  const carouselWrapper = document.getElementById('carouselWrapper');
  if (carouselWrapper) {
    carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Atualiza os dots
    const dots = document.querySelectorAll('#carouselDots .dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
  resetAutoPlay();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
  resetAutoPlay();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoPlay();
}

function setupCarouselListeners() {
  const carouselPrevBtn = document.querySelector('.carousel-prev');
  const carouselNextBtn = document.querySelector('.carousel-next');
  const carouselWrapper = document.getElementById('carouselWrapper');

  // Botões de navegação
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', prevSlide);
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', nextSlide);
  }

  // Pausa ao passar o mouse
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);
  }
}

// Carrosel automático
let autoPlayInterval;

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Muda a cada 5 segundos
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// Iniciar carrosel quando a página carregar
document.addEventListener('DOMContentLoaded', loadFeedbacks);