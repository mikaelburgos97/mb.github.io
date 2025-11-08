
let toggle = document.querySelector('.toggle')
let topbar = document.querySelector('.topbar')
let navigation = document.querySelector('.navigation')
let themeSwitch = document.querySelector('.themeSwitch')
let body = document.querySelector('body')
let main = document.querySelector('.main')

toggle.onclick = function(){
  toggle.classList.toggle('active')
  topbar.classList.toggle('active')
  navigation.classList.toggle('active')
  main.classList.toggle('active')

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
  { name: 'Git', icon: 'fa-brands fa-git-alt', color: '#F05032' },
  { name: 'GitHub', icon: 'fa-brands fa-github', color: '#181717' },
  { name: 'Azure', icon: 'fa-brands fa-microsoft', color: '#0078D4' },
  { name: 'React', icon: 'fa-brands fa-react', color: '#61DAFB' },
  { name: 'JavaScript', icon: 'fa-brands fa-js', color: '#F7DF1E' },
  { name: 'CSS', icon: 'fa-brands fa-css3-alt', color: '#1572B6' },
  { name: 'HTML5', icon: 'fa-brands fa-html5', color: '#E34F26' },
  { name: 'Python', icon: 'fa-brands fa-python', color: '#3776AB' },
  { name: 'Salesforce', icon: 'fa-brands fa-salesforce', color: '#00A1E0' },
  { name: 'Bootstrap', icon: 'fa-brands fa-bootstrap', color: '#7952B3' },
  { name: 'Java', icon: 'fa-brands fa-java', color: '#007396' },
  { name: 'Firebase', icon: 'fa-solid fa-fire', color: '#FFCA28' },
  { name: 'Google Cloud', icon: 'fa-brands fa-google', color: '#4285F4' },
  { name: 'MongoDB', icon: 'fa-solid fa-database', color: '#47A248' },
  { name: 'Node.js', icon: 'fa-brands fa-node-js', color: '#339933' },
  { name: 'NPM', icon: 'fa-brands fa-npm', color: '#CB3837' },
  { name: 'Docker', icon: 'fa-brands fa-docker', color: '#2496ED' },
  { name: 'AWS', icon: 'fa-brands fa-aws', color: '#FF9900' },
  { name: 'SQL', icon: 'fa-solid fa-database', color: '#4479A1' },
  { name: 'PostgreSQL', icon: 'fa-solid fa-database', color: '#336791' },
  { name: 'SharePoint', icon: 'fa-brands fa-microsoft', color: '#0078D4' },
  { name: 'Excel', icon: 'fa-solid fa-file-excel', color: '#217346' },
  { name: 'TypeScript', icon: 'fa-solid fa-code', color: '#3178C6' },
  { name: 'Next.js', icon: 'fa-solid fa-n', color: '#000000' },
  { name: 'Tailwind', icon: 'fa-solid fa-wind', color: '#06B6D4' },
  { name: 'Selenium', icon: 'fa-solid fa-robot', color: '#43B02A' },
  { name: 'jQuery', icon: 'fa-solid fa-code', color: '#0769AD' },
  { name: 'C# ASP.NET', icon: 'fa-solid fa-code', color: '#512BD4' },
  { name: 'Supabase', icon: 'fa-solid fa-database', color: '#3ECF8E' },
  { name: 'Oracle', icon: 'fa-solid fa-database', color: '#F80000' },
  { name: 'Google Maps', icon: 'fa-solid fa-map-location-dot', color: '#4285F4' },
  { name: 'Power Automate', icon: 'fa-solid fa-bolt', color: '#0066FF' },
  { name: 'Expo', icon: 'fa-brands fa-react', color: '#000020' },
  { name: 'Redux', icon: 'fa-solid fa-atom', color: '#764ABC' },
  { name: 'Three.js', icon: 'fa-solid fa-cube', color: '#000000' },
  { name: 'Chart.js', icon: 'fa-solid fa-chart-line', color: '#FF6384' }
];

let scene, camera, renderer, techObjects = [], lines = [];
let mouse = { x: 0, y: 0 };
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };

function initSphere() {
  const canvas = document.getElementById('sphereCanvas');
  const banner = document.querySelector('.banner');

  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    75,
    banner.offsetWidth / banner.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 22); // Center camera on profile photo position
  camera.lookAt(0, 3, 0); // Look at the profile photo center

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
  profileSprite.scale.set(5, 5, 1);
  profileSprite.renderOrder = 10; // Render on top of lines
  scene.add(profileSprite);

  // Create technology icons
  const radius = 15;
  technologies.forEach((tech, index) => {
    // Distribute technologies evenly on sphere surface
    const phi = Math.acos(-1 + (2 * index) / technologies.length);
    const theta = Math.sqrt(technologies.length * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    // Create icon sprite using Font Awesome
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

    // Draw Font Awesome icon
    context.fillStyle = tech.color;
    context.font = '900 45px "Font Awesome 6 Free", "Font Awesome 6 Brands"';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Get the icon character from Font Awesome
    const iconChar = getIconChar(tech.icon);
    context.fillText(iconChar, 90, 90);

    // Add tech name below with better visibility
    context.fillStyle = '#fff';
    context.font = 'Bold 16px Arial';
    context.strokeStyle = '#000';
    context.lineWidth = 3;
    context.strokeText(tech.name, 90, 155);
    context.fillText(tech.name, 90, 155);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(2, 2, 1);
    sprite.renderOrder = 5; // Render on top of lines but below profile
    sprite.userData = {
      name: tech.name,
      color: tech.color,
      originalScale: { x: 2, y: 2, z: 1 },
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

  // Helper function to get icon character
  function getIconChar(iconClass) {
    // Map of Font Awesome classes to Unicode characters
    const iconMap = {
      'fa-git-alt': '\uf841',
      'fa-github': '\uf09b',
      'fa-microsoft': '\uf3ca',
      'fa-react': '\uf41b',
      'fa-js': '\uf3b8',
      'fa-css3-alt': '\uf38b',
      'fa-html5': '\uf13b',
      'fa-python': '\uf3e2',
      'fa-salesforce': '\uf83b',
      'fa-bootstrap': '\uf836',
      'fa-java': '\uf4e4',
      'fa-fire': '\uf06d',
      'fa-google': '\uf1a0',
      'fa-database': '\uf1c0',
      'fa-node-js': '\uf3d3',
      'fa-npm': '\uf3d4',
      'fa-docker': '\uf395',
      'fa-aws': '\uf375',
      'fa-code': '\uf121',
      'fa-n': 'N',
      'fa-wind': '\uf72e',
      'fa-robot': '\uf544',
      'fa-file-excel': '\uf1c3',
      'fa-map-location-dot': '\uf5a0',
      'fa-bolt': '\uf0e7',
      'fa-atom': '\uf5d2',
      'fa-cube': '\uf1b2',
      'fa-chart-line': '\uf201'
    };

    // Extract the icon name from the class
    const iconName = iconClass.split(' ').pop();
    return iconMap[iconName] || '●';
  }

  // Animation loop
  animate();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  // Auto-rotate (very slow, barely noticeable)
  if (!isDragging) {
    rotation.y += 0.0001;
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
  camera.aspect = banner.offsetWidth / banner.offsetHeight;
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

// Initialize when page loads
window.addEventListener('load', initSphere);