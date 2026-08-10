/* ============================================
   Chandra Sekhar Gunda — Portfolio interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const themeIcon = document.getElementById('themeIcon');

  const sunPath = '<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/><circle cx="12" cy="12" r="4"/>';
  const moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>';

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    if(themeLabel) themeLabel.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
    if(themeIcon) themeIcon.innerHTML = theme === 'dark' ? moonPath : sunPath;
    try{ localStorage.setItem('portfolio-theme', theme); }catch(e){}
  }

  let savedTheme = 'dark';
  try{ savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; }catch(e){}
  applyTheme(savedTheme);

  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Mobile sidebar ---------- */
  const sidebar = document.getElementById('sidebar');
  const navTrigger = document.getElementById('navTrigger');
  const backdrop = document.getElementById('backdrop');

  function openNav(){
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  }
  function closeNav(){
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }
  if(navTrigger) navTrigger.addEventListener('click', openNav);
  if(backdrop) backdrop.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Rotating role text (typewriter) ---------- */
  const roles = ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Data Analyst'];
  const roleEl = document.getElementById('roleText');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    if(!roleEl) return;
    const current = roles[roleIndex];

    if(!deleting){
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  }
  typeLoop();

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if(active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => navObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- File input label ---------- */
  const fileInput = document.getElementById('file');
  const fileNameEl = document.getElementById('fileName');
  const fileDropLabel = document.getElementById('fileDropLabel');
  if(fileInput){
    fileInput.addEventListener('change', () => {
      if(fileInput.files.length){
        fileNameEl.textContent = fileInput.files[0].name;
        fileDropLabel.textContent = 'File selected — click to change';
      } else {
        fileNameEl.textContent = '';
        fileDropLabel.textContent = 'Click to choose a file';
      }
    });
  }

  /* ---------- Contact form submit (Formspree) ---------- */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if(form.action.includes('YOUR_FORM_ID')){
        formMsg.textContent = 'Contact form is not connected yet — add your Formspree endpoint in index.html.';
        formMsg.className = 'form-msg err';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formMsg.textContent = '';
      formMsg.className = 'form-msg';

      try{
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if(res.ok){
          formMsg.textContent = 'Message sent — thanks for reaching out! I\'ll reply soon.';
          formMsg.className = 'form-msg ok';
          form.reset();
          if(fileNameEl) fileNameEl.textContent = '';
          if(fileDropLabel) fileDropLabel.textContent = 'Click to choose a file';
        } else {
          formMsg.textContent = 'Something went wrong — please try again or email me directly.';
          formMsg.className = 'form-msg err';
        }
      } catch(err){
        formMsg.textContent = 'Network error — please try again or email me directly.';
        formMsg.className = 'form-msg err';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

});
