// ---------- Menú móvil ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function closeMenu(){
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Cierra el menú al elegir un enlace (mejora la navegación en móvil)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Cierra el menú si la ventana crece de nuevo a escritorio
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

// ---------- Formulario de contacto ----------
// Reemplaza esta URL por tu propio endpoint de Formspree (formspree.io -> New Form)
const FORM_ENDPOINT = "https://formspree.io/f/mwlenlna";

const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const submitBtn = form.querySelector('.submit-btn');

function setError(fieldEl, hasError){
  const wrapper = fieldEl.closest('.field');
  wrapper.classList.toggle('invalid', hasError);
}

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showFormError(message){
  successMsg.textContent = message;
  successMsg.style.color = '#ff8a8a';
  successMsg.classList.add('show');
}

function showFormSuccess(){
  successMsg.textContent = '¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.';
  successMsg.style.color = '';
  successMsg.classList.add('show');
}

form.addEventListener('submit', async (e) => {
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

  if (!(nombreValido && correoValido && asuntoValido)) {
    successMsg.classList.remove('show');
    return;
  }

  if (FORM_ENDPOINT.includes('TU_ENDPOINT_AQUI')) {
    showFormError('Falta configurar el endpoint de Formspree en script.js.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showFormSuccess();
      form.reset();
      document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    } else {
      showFormError('No se pudo enviar el mensaje. Intenta de nuevo en un momento.');
    }
  } catch (err) {
    showFormError('Error de conexión. Revisa tu internet e intenta de nuevo.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensaje →';
    setTimeout(() => successMsg.classList.remove('show'), 7000);
  }
});

// Quita el error de un campo en cuanto el usuario empieza a corregirlo
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => setError(field, false));
});