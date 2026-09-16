// ============================================================
// Nav — compact on scroll
// ============================================================
const nav = document.getElementById('nav');
const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScrollNav, { passive:true });
onScrollNav();

// ============================================================
// Mobile menu
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
function closeMenu(){
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
}
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); });

// ============================================================
// Scroll reveals
// ============================================================
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ============================================================
// Hero threshold object — mouse parallax + scroll transition
// ============================================================
const portal = document.getElementById('portal');
const scene = document.getElementById('scene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let mx = 0, my = 0, cx = 0, cy = 0, ticking = false;

window.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth  - 0.5);
  my = (e.clientY / window.innerHeight - 0.5);
}, { passive:true });

function raf(){
  if (reduceMotion) return;
  // smooth follow
  cx += (mx - cx) * 0.045;
  cy += (my - cy) * 0.045;
  // scroll influence: portal recedes as you cross the threshold
  const r = scene.getBoundingClientRect();
  const progress = Math.min(Math.max(-r.top / window.innerHeight, 0), 1);
  const rotateY = cx * 14;
  const rotateX = -cy * 10;
  const scale = 1 - progress * 0.18;
  const ty = progress * 90;
  const opacity = 1 - progress * 0.85;
  portal.style.transform =
    `translateY(${ty}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  portal.style.opacity = opacity;
  requestAnimationFrame(raf);
}
if (!reduceMotion) requestAnimationFrame(raf);

// ============================================================
// Custom cursor
// ============================================================
const cursor = document.getElementById('cursor');
if (window.matchMedia('(pointer:fine)').matches && !reduceMotion){
  window.addEventListener('mousemove', e => {
    cursor.classList.add('on');
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  }, { passive:true });
  document.addEventListener('mouseleave', () => cursor.classList.remove('on'));
  document.querySelectorAll('a, button, input, textarea, .service').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
  document.querySelectorAll('.case').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('view'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('view'));
  });
}

// ============================================================
// Contact form — Formspree
// ============================================================
const FORM_ENDPOINT = "https://formspree.io/f/mwlenlna";
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const submitBtn = form.querySelector('.submit-btn');

function setError(fieldEl, hasError){
  fieldEl.closest('.field').classList.toggle('invalid', hasError);
}
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function showFormError(msg){
  successMsg.textContent = msg;
  successMsg.style.color = '#ff8a8a';
  successMsg.classList.add('show');
}
function showFormSuccess(){
  successMsg.textContent = '¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.';
  successMsg.style.color = '';
  successMsg.classList.add('show');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const asunto = document.getElementById('asunto');

  const nombreValido = nombre.value.trim().length > 0;
  const correoValido = isValidEmail(correo.value.trim());
  const asuntoValido = asunto.value.trim().length > 0;

  setError(nombre, !nombreValido);
  setError(correo, !correoValido);
  setError(asunto, !asuntoValido);

  if (!(nombreValido && correoValido && asuntoValido)){
    successMsg.classList.remove('show');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.style.opacity = .6;
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok){
      showFormSuccess();
      form.reset();
      document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    } else {
      showFormError('No se pudo enviar el mensaje. Intenta de nuevo en un momento.');
    }
  } catch (err){
    showFormError('Error de conexión. Revisa tu internet e intenta de nuevo.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.style.opacity = 1;
    setTimeout(() => successMsg.classList.remove('show'), 7000);
  }
});

form.querySelectorAll('input, textarea').forEach(f =>
  f.addEventListener('input', () => setError(f, false))
);