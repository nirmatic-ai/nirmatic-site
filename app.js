// Menú responsive
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav ul');
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
  toggle.setAttribute('aria-expanded', !expanded);
  nav.style.display = !expanded ? 'flex' : 'none';
});

// Form submit (simulación)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', e=>{
  e.preventDefault();
  status.textContent = "Enviando mensaje...";
  setTimeout(()=>{status.textContent="¡Mensaje enviado con éxito!";form.reset();},1000);
});