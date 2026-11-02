const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealSections = document.querySelectorAll('.section');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealSections.forEach((section) => section.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealSections.forEach((section) => revealObserver.observe(section));
}

const scienceWall = document.querySelector('.equation-wall');
const scienceItems = scienceWall
  ? [...scienceWall.querySelectorAll('.wall-formula, .wall-graph')]
  : [];
const pageSections = [...document.querySelectorAll('main > section')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (scienceWall && scienceItems.length && pageSections.length && !prefersReducedMotion) {
  const startingPoints = scienceItems.map((_, index) => ({
    x: 4 + ((index * 23) % 84),
    y: 8 + ((index * 19) % 77),
    rotation: (index % 2 ? 1 : -1) * (4 + (index % 5) * 2),
  }));
  let currentSection = -1;
  let positionFrame = null;

  const repositionScience = () => {
    positionFrame = null;
    const viewportCenter = window.innerHeight * 0.52;
    let activeSection = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    pageSections.forEach((section, index) => {
      const bounds = section.getBoundingClientRect();
      const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeSection = index;
      }
    });

    if (activeSection === currentSection) return;
    currentSection = activeSection;
    scienceWall.dataset.section = String(activeSection);

    scienceItems.forEach((item, index) => {
      const point = startingPoints[index];
      const sectionShift = activeSection * (index % 2 ? 29 : 37);
      const x = 3 + ((point.x + sectionShift + index * 7) % 91);
      const y = 4 + ((point.y + activeSection * (index % 3 ? 17 : 23)) % 88);
      const rotation = point.rotation + activeSection * (index % 2 ? -3 : 2);

      item.style.left = `${x}%`;
      item.style.top = `${y}%`;
      item.style.right = 'auto';
      item.style.bottom = 'auto';
      item.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    });
  };

  const scheduleScienceReposition = () => {
    if (positionFrame === null) positionFrame = requestAnimationFrame(repositionScience);
  };

  window.addEventListener('scroll', scheduleScienceReposition, { passive: true });
  window.addEventListener('resize', scheduleScienceReposition);
  scheduleScienceReposition();
}
