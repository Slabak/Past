const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(2, 5, 5);
scene.add(pointLight);

const floorTexture = new THREE.TextureLoader().load('assets/floor_texture.jpg');
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshStandardMaterial({ map: floorTexture })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wallTexture = new THREE.TextureLoader().load('assets/wall_texture.jpg');
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
wall1.position.set(0, 1.5, -3);
scene.add(wall1);

const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
wall2.position.set(0, 1.5, 3);
wall2.rotation.y = Math.PI;
scene.add(wall2);

const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
wall3.position.set(-3, 1.5, 0);
wall3.rotation.y = Math.PI / 2;
scene.add(wall3);

const wall4 = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMaterial);
wall4.position.set(3, 1.5, 0);
wall4.rotation.y = -Math.PI / 2;
scene.add(wall4);

const mirrorTexture = new THREE.TextureLoader().load('assets/mirror_texture.jpg');
const mirror = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1),
  new THREE.MeshStandardMaterial({ map: mirrorTexture })
);
mirror.position.set(0, 1.5, -2.99);
scene.add(mirror);

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('assets/music.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([mirror]);
  if (intersects.length > 0) {
    alert('Вы нашли код на зеркале: 3 8 5');
  }
}
window.addEventListener('click', onMouseClick, false);

const loader = new THREE.GLTFLoader();
loader.load('assets/tub_model.glb', function (gltf) {
  const tub = gltf.scene;
  tub.position.set(0, 0, 0);
  scene.add(tub);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
