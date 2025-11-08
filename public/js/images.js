const section = document.querySelector('.rotating-pictures');
const container = document.createElement('div');
container.classList.add('image-container');
section.appendChild(container);

let images = [];
let index = 0; // 0 = initial centered image

// 🪄 Inject modal dynamically
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.classList.add('modal');
modal.innerHTML = `
  <span class="close">&times;</span>
  <img class="modal-content" id="modalImg">
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector('#modalImg');
const closeBtn = modal.querySelector('.close');

// 🖼️ Load images from JSON
fetch('../reportImages/images.json')
  .then(res => res.json())
  .then(data => {
    images = data.images;

    images.forEach(src => {
      const img = document.createElement('img');
      img.src = `../reportImages/${src}`;

      // Double-click → open modal
      img.addEventListener('dblclick', () => openModal(`../reportImages/${src}`));
      container.appendChild(img);
    });

    setupSlider(images.length);
  })
  .catch(err => console.error("Error loading images.json:", err));

// 🧭 Setup navigation
function setupSlider(total) {
  const leftArrow = document.createElement('button');
  leftArrow.classList.add('arrow', 'left');
  leftArrow.innerHTML = '&#10094;';

  const rightArrow = document.createElement('button');
  rightArrow.classList.add('arrow', 'right');
  rightArrow.innerHTML = '&#10095;';

  document.body.appendChild(leftArrow);
  document.body.appendChild(rightArrow);

  // Hover: show two images
  section.addEventListener('mouseenter', () => section.classList.add('hovered'));
  section.addEventListener('mouseleave', () => section.classList.remove('hovered'));

  leftArrow.addEventListener('click', () => {
    index--;
    if (index < 0) index = 0;
    updateSlider(total, leftArrow, rightArrow);
  });

  rightArrow.addEventListener('click', () => {
    index++;
    if (index >= total) index = total - 1;
    updateSlider(total, leftArrow, rightArrow);
  });

  updateSlider(total, leftArrow, rightArrow);
}

function updateSlider(total, leftArrow, rightArrow) {
  // 🖼️ Case 1: On initial image (index === 0)
  if (index === 0) {
    section.classList.remove('hovered');
    leftArrow.style.display = 'none';   // hide left arrow
    rightArrow.style.display = 'block'; // show right arrow only

    // center image horizontally
    container.style.justifyContent = 'center';
    container.style.transform = 'translateX(0)';
  } 
  // 🖼️ Case 2: On other images
  else {
    section.classList.add('hovered');
    leftArrow.style.display = 'block';
    rightArrow.style.display = 'block';
    container.style.justifyContent = 'flex-start';
    container.style.transform = `translateX(-${index * 100}%)`;
  }

  // 🖼️ Case 3: When last image reached → loop back to initial
  if (index === total - 1) {
    setTimeout(() => {
      index = 0;
      updateSlider(total, leftArrow, rightArrow);
    }, 2000); // wait 2s before resetting to initial
  }
}

/* --- Modal Logic --- */
function openModal(src) {
  modal.style.display = 'flex';
  modalImg.src = src;
}

closeBtn.onclick = () => { modal.style.display = 'none'; };

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};
