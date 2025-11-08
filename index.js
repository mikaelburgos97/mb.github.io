
let toggle = document.querySelector('.toggle')
let topbar = document.querySelector('.topbar')
let navigation = document.querySelector('.navigation')
let themeSwitch = document.querySelector('.themeSwitch')
let body = document.querySelector('body')
let main = document.querySelector('.main')
let scrollProgressContainer = document.querySelector('.scroll-progress-container')
let scrollProgressBar = document.querySelector('.scroll-progress-bar')

toggle.onclick = function(){
  toggle.classList.toggle('active')
  topbar.classList.toggle('active')
  navigation.classList.toggle('active')
  main.classList.toggle('active')
  scrollProgressContainer.classList.toggle('active')

  // Resize Three.js canvas after menu toggle
  setTimeout(() => {
    if (camera && renderer) {
      const banner = document.querySelector('.banner');
      camera.aspect = banner.offsetWidth / banner.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(banner.offsetWidth, banner.offsetHeight);
    }
  }, 500); // Wait for CSS transition to complete
}
// theme switch toggle

themeSwitch.onclick = function (){
  body.classList.toggle('dark')
}


// for mobile devices
function toggleMenu(){
  let navigation = document.querySelector('.navigation')
  let main = document.querySelector('.main')
  navigation.classList.remove('active')
  main.classList.remove('active')
}

// ========== THREE.JS SPHERE ==========
const technologies = [
  { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F7DF1E' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#3178C6' },
  { name: 'React', icon: 'devicon-react-original', color: '#61DAFB' },
  { name: 'Next.js', icon: 'devicon-nextjs-original', color: '#000000' },
  { name: 'HTML5', icon: 'devicon-html5-plain', color: '#E34F26' },
  { name: 'CSS3', icon: 'devicon-css3-plain', color: '#1572B6' },
  { name: 'Tailwind', icon: 'devicon-tailwindcss-plain', color: '#06B6D4' },
  { name: 'Bootstrap', icon: 'devicon-bootstrap-plain', color: '#7952B3' },
  { name: 'Python', icon: 'devicon-python-plain', color: '#3776AB' },
  { name: 'Java', icon: 'devicon-java-plain', color: '#007396' },
  { name: 'C#', icon: 'devicon-csharp-plain', color: '#239120' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain', color: '#5FA04E' },
  { name: 'Git', icon: 'devicon-git-plain', color: '#F05032' },
  { name: 'GitHub', icon: 'devicon-github-original', color: '#181717' },
  { name: 'MongoDB', icon: 'devicon-mongodb-plain', color: '#47A248' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', color: '#4169E1' },
  { name: 'MySQL', icon: 'devicon-mysql-plain', color: '#4479A1' },
  { name: 'Oracle', icon: 'devicon-oracle-original', color: '#F80000' },
  { name: 'Firebase', icon: 'devicon-firebase-plain', color: '#DD2C00' },
  { name: 'Docker', icon: 'devicon-docker-plain', color: '#2496ED' },
  { name: 'Azure', icon: 'devicon-azure-plain', color: '#0078D4' },
  { name: 'Google Cloud', icon: 'devicon-googlecloud-plain', color: '#4285F4' },
  { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark', color: '#FF9900' },
  { name: 'Salesforce', icon: 'devicon-salesforce-plain', color: '#00A1E0' },
  { name: 'NPM', icon: 'devicon-npm-original-wordmark', color: '#CB3837' },
  { name: 'Three.js', icon: 'devicon-threejs-original', color: '#000000' },
  { name: 'Selenium', icon: 'devicon-selenium-original', color: '#43B02A' },
  { name: 'jQuery', icon: 'devicon-jquery-plain', color: '#0769AD' }
];

let scene, camera, renderer, techObjects = [], lines = [];
let mouse = { x: 0, y: 0 };
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let scrollAccumulator = 0;
let maxScroll = 2000; // Maximum scroll before transitioning
let isTransitioning = false;

function initSphere() {
  const canvas = document.getElementById('sphereCanvas');
  const banner = document.querySelector('.banner');

  // Setup scene
  scene = new THREE.Scene();

  // Setup camera with responsive positioning
  const isMobile = window.innerWidth <= 992;
  camera = new THREE.PerspectiveCamera(
    75,
    banner.offsetWidth / banner.offsetHeight,
    0.1,
    1000
  );
  // Adjust camera distance based on device
  const cameraZ = isMobile ? 18 : 22;
  camera.position.set(0, 3, cameraZ);
  camera.lookAt(0, 3, 0);

  // Setup renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(banner.offsetWidth, banner.offsetHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.sortObjects = true; // Enable render order sorting

  // No sphere wireframe - only connection lines will be visible

  // Create profile photo sprite in 3D center
  const profileCanvas = document.createElement('canvas');
  const profileCtx = profileCanvas.getContext('2d');
  profileCanvas.width = 512;
  profileCanvas.height = 512;

  // Load profile image
  const profileImg = new Image();
  profileImg.src = './mike-pic.jpg';
  profileImg.onload = () => {
    // Draw circular background
    profileCtx.beginPath();
    profileCtx.arc(256, 256, 240, 0, Math.PI * 2);
    profileCtx.fillStyle = '#FFD700'; // Yellow background
    profileCtx.fill();

    // Create circular clipping path for image
    profileCtx.save();
    profileCtx.beginPath();
    profileCtx.arc(256, 256, 230, 0, Math.PI * 2);
    profileCtx.clip();

    // Draw profile image
    profileCtx.drawImage(profileImg, 0, 0, 512, 512);
    profileCtx.restore();

    // Draw blue border
    profileCtx.beginPath();
    profileCtx.arc(256, 256, 240, 0, Math.PI * 2);
    profileCtx.strokeStyle = '#4a9eff';
    profileCtx.lineWidth = 12;
    profileCtx.stroke();

    // Update texture
    profileTexture.needsUpdate = true;
  };

  const profileTexture = new THREE.CanvasTexture(profileCanvas);
  const profileMaterial = new THREE.SpriteMaterial({
    map: profileTexture,
    transparent: true,
    depthTest: true,
    depthWrite: true
  });
  const profileSprite = new THREE.Sprite(profileMaterial);
  profileSprite.position.set(0, 3, 0);
  const profileScale = isMobile ? 4 : 5;
  profileSprite.scale.set(profileScale, profileScale, 1);
  profileSprite.renderOrder = 10; // Render on top of lines
  scene.add(profileSprite);

  // Create technology icons with responsive radius
  const radius = isMobile ? 10 : 12;
  technologies.forEach((tech, index) => {
    // Distribute technologies evenly on sphere surface
    const phi = Math.acos(-1 + (2 * index) / technologies.length);
    const theta = Math.sqrt(technologies.length * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    // Create icon sprite using Devicon
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 180;
    canvas.height = 180;

    // Draw icon background circle
    context.beginPath();
    context.arc(90, 90, 55, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 255, 255, 0.95)';
    context.fill();
    context.strokeStyle = tech.color;
    context.lineWidth = 5;
    context.stroke();

    // Create temporary element to get Devicon character
    const tempIcon = document.createElement('i');
    tempIcon.className = tech.icon;
    tempIcon.style.position = 'absolute';
    tempIcon.style.left = '-9999px';
    document.body.appendChild(tempIcon);

    // Get the character from the pseudo-element
    setTimeout(() => {
      const iconChar = window.getComputedStyle(tempIcon, ':before').content.replace(/['"]/g, '');
      document.body.removeChild(tempIcon);

      // Draw Devicon icon
      context.fillStyle = tech.color;
      context.font = '50px "devicon"';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(iconChar, 90, 90);

      // Add tech name below with better visibility
      context.fillStyle = '#fff';
      context.font = 'Bold 16px Arial';
      context.strokeStyle = '#000';
      context.lineWidth = 3;
      context.strokeText(tech.name, 90, 155);
      context.fillText(tech.name, 90, 155);

      // Update texture
      texture.needsUpdate = true;
    }, 100);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    const iconScale = isMobile ? 1.6 : 2;
    sprite.scale.set(iconScale, iconScale, 1);
    sprite.renderOrder = 5; // Render on top of lines but below profile
    sprite.userData = {
      name: tech.name,
      color: tech.color,
      originalScale: { x: iconScale, y: iconScale, z: 1 },
      originalPosition: { x, y, z }
    };

    scene.add(sprite);
    techObjects.push(sprite);

    // Create line from center (where profile photo is) to icon
    const lineGeometry = new THREE.BufferGeometry();
    const centerY = 3; // Offset to match profile photo position visually
    const linePositions = new Float32Array([
      0, centerY, 0,  // center (profile photo position)
      x, y, z   // icon position
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: tech.color,
      transparent: true,
      opacity: 0.4,
      linewidth: 2,
      depthTest: true,
      depthWrite: false
    });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.renderOrder = -10; // Render behind everything
    scene.add(line);
    lines.push({ line, tech, originalPositions: linePositions });
  });

  // Animation loop
  animate();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  // Auto-rotate (very slow, barely noticeable) - only when not dragging or scrolling
  if (!isDragging && scrollAccumulator === 0) {
    rotation.y += 0.0001;
    targetRotation.y = rotation.y;
    targetRotation.x = rotation.x;
  } else if (!isDragging) {
    // Smooth interpolation to target rotation
    rotation.x += (targetRotation.x - rotation.x) * 0.1;
    rotation.y += (targetRotation.y - rotation.y) * 0.1;
  }

  // Apply rotation to icons
  techObjects.forEach((obj, index) => {
    const original = obj.userData.originalPosition;
    const pos = { x: original.x, y: original.y, z: original.z };

    // Rotate around Y axis
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const newX = pos.x * cosY - pos.z * sinY;
    const newZ = pos.x * sinY + pos.z * cosY;

    // Rotate around X axis
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const newY = pos.y * cosX - newZ * sinX;
    const finalZ = pos.y * sinX + newZ * cosX;

    obj.position.set(newX, newY, finalZ);

    // Update corresponding line
    if (lines[index]) {
      const linePositions = lines[index].line.geometry.attributes.position.array;
      // Keep center at profile photo position
      linePositions[0] = 0;
      linePositions[1] = 3; // Same centerY offset
      linePositions[2] = 0;
      // Update icon end position
      linePositions[3] = newX;
      linePositions[4] = newY;
      linePositions[5] = finalZ;
      lines[index].line.geometry.attributes.position.needsUpdate = true;
    }
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  const banner = document.querySelector('.banner');
  const isMobileNow = window.innerWidth <= 992;
  const cameraZ = isMobileNow ? 18 : 22;

  camera.aspect = banner.offsetWidth / banner.offsetHeight;
  camera.position.z = cameraZ;
  camera.updateProjectionMatrix();
  renderer.setSize(banner.offsetWidth, banner.offsetHeight);
}

// Mouse interaction
const canvas = document.getElementById('sphereCanvas');

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    rotation.y += deltaX * 0.003;
    rotation.x += deltaY * 0.003;
    targetRotation.y = rotation.y;
    targetRotation.x = rotation.x;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  } else {
    // Hover effect
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(techObjects);

    // Reset all scales
    techObjects.forEach(obj => {
      const original = obj.userData.originalScale;
      obj.scale.set(original.x, original.y, original.z);
    });

    // Scale up hovered icon
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      const original = hovered.userData.originalScale;
      hovered.scale.set(original.x * 1.2, original.y * 1.2, original.z * 1.2);
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'grab';
    }
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

// Touch events for mobile
let touchStartY = 0;
let lastTouchY = 0;

canvas.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  previousMousePosition = { x: touch.clientX, y: touch.clientY };
  touchStartY = touch.clientY;
  lastTouchY = touch.clientY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMousePosition.x;
    const deltaY = touch.clientY - previousMousePosition.y;

    rotation.y += deltaX * 0.003;
    rotation.x += deltaY * 0.003;
    targetRotation.y = rotation.y;
    targetRotation.x = rotation.x;

    // Update scroll accumulator for progress bar (only vertical movement)
    const touchDeltaY = lastTouchY - touch.clientY;
    lastTouchY = touch.clientY;

    // Only update progress if we're swiping down (positive delta)
    if (touchDeltaY > 0) {
      scrollAccumulator += touchDeltaY * 2;
      scrollAccumulator = Math.max(0, Math.min(scrollAccumulator, maxScroll));

      // Update progress bar
      const progress = (scrollAccumulator / maxScroll) * 100;
      scrollProgressBar.style.width = `${progress}%`;

      // Show progress bar
      scrollProgressContainer.classList.add('visible');

      // Transition to next section when reaching max scroll
      if (scrollAccumulator >= maxScroll && !isTransitioning) {
        isTransitioning = true;
        const aboutSection = document.querySelector('#about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });

        // Reset after transition
        setTimeout(() => {
          scrollAccumulator = 0;
          scrollProgressBar.style.width = '0%';
          isTransitioning = false;
          targetRotation.x = 0;
          targetRotation.y = 0;
          rotation.x = 0;
          rotation.y = 0;
        }, 1000);
      }
    }

    previousMousePosition = { x: touch.clientX, y: touch.clientY };
  }
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isDragging = false;
});

// Click detection on technologies
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(techObjects);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;

    // Visual effect: smooth pulse animation
    const originalScale = clicked.userData.originalScale;
    let pulseCount = 0;
    const pulseInterval = setInterval(() => {
      if (pulseCount % 2 === 0) {
        clicked.scale.set(
          originalScale.x * 1.4,
          originalScale.y * 1.4,
          originalScale.z * 1.4
        );
      } else {
        clicked.scale.set(originalScale.x, originalScale.y, originalScale.z);
      }
      pulseCount++;
      if (pulseCount >= 6) {
        clearInterval(pulseInterval);
        clicked.scale.set(originalScale.x, originalScale.y, originalScale.z);
      }
    }, 150);

    console.log(`Clicked on: ${clicked.userData.name}`);
  }
});

// Scroll handler for sphere rotation and section transition
window.addEventListener('wheel', (e) => {
  const banner = document.querySelector('.banner');
  const bannerRect = banner.getBoundingClientRect();

  // Only handle scroll when banner is visible and not transitioning
  if (bannerRect.top <= 0 && bannerRect.bottom > window.innerHeight / 2 && !isTransitioning) {
    e.preventDefault();

    // Accumulate scroll
    scrollAccumulator += e.deltaY;

    // Clamp scroll accumulator
    scrollAccumulator = Math.max(0, Math.min(scrollAccumulator, maxScroll));

    // Update target rotation based on scroll
    targetRotation.y = scrollAccumulator * 0.002;
    targetRotation.x = scrollAccumulator * 0.001;

    // Update progress bar
    const progress = (scrollAccumulator / maxScroll) * 100;
    scrollProgressBar.style.width = `${progress}%`;

    // Transition to next section when reaching max scroll
    if (scrollAccumulator >= maxScroll && !isTransitioning) {
      isTransitioning = true;
      const aboutSection = document.querySelector('#about');
      aboutSection.scrollIntoView({ behavior: 'smooth' });

      // Reset after transition
      setTimeout(() => {
        scrollAccumulator = 0;
        scrollProgressBar.style.width = '0%';
        isTransitioning = false;
        targetRotation.x = 0;
        targetRotation.y = 0;
        rotation.x = 0;
        rotation.y = 0;
      }, 1000);
    }
  }
}, { passive: false });

// Function to update progress bar visibility
function updateProgressBarVisibility() {
  const banner = document.querySelector('.banner');
  const bannerRect = banner.getBoundingClientRect();

  // Show/hide progress bar based on banner visibility
  if (bannerRect.top <= 0 && bannerRect.bottom > 0) {
    scrollProgressContainer.classList.add('visible');
  } else {
    scrollProgressContainer.classList.remove('visible');
  }

  // Reset completely if we've scrolled back to top
  if (bannerRect.top >= -100 && scrollAccumulator > 0) {
    scrollAccumulator = 0;
    scrollProgressBar.style.width = '0%';
    isTransitioning = false;
    // Reset rotations to initial state
    targetRotation.x = 0;
    targetRotation.y = 0;
    rotation.x = 0;
    rotation.y = 0;
  }
}

// Reset scroll accumulator when scrolling back to top
window.addEventListener('scroll', updateProgressBarVisibility);

// Initialize when page loads
window.addEventListener('load', () => {
  initSphere();
  // Check initial visibility
  setTimeout(updateProgressBarVisibility, 100);
});