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
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

function setError(fieldEl, hasError){
  const wrapper = fieldEl.closest('.field');
  wrapper.classList.toggle('invalid', hasError);
}

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
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

  if (nombreValido && correoValido && asuntoValido) {
    successMsg.classList.add('show');
    form.reset();
    document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));

    // Oculta el mensaje de éxito después de unos segundos
    setTimeout(() => successMsg.classList.remove('show'), 6000);
  } else {
    successMsg.classList.remove('show');
  }
});

// Quita el error de un campo en cuanto el usuario empieza a corregirlo
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => setError(field, false));
});