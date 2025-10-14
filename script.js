// Модульные импорты из CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

// Сцена, камера, рендерер
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Контролы
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5,10,7);
scene.add(directionalLight);

// Загрузка текстур
const loaderTexture = new THREE.TextureLoader();
const floorTexture = loaderTexture.load('assets/floor_texture.jpg');
const wallTexture = loaderTexture.load('assets/wall_texture.jpg');
const mirrorTexture = loaderTexture.load('assets/mirror_texture.jpg');

// Пол
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10,10),
  new THREE.MeshStandardMaterial({ map: floorTexture })
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Стены
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(10,5),
  new THREE.MeshStandardMaterial({ map: wallTexture })
);
backWall.position.set(0,2.5,-5);
scene.add(backWall);

// Зеркало
const mirror = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2),
  new THREE.MeshStandardMaterial({ map: mirrorTexture })
);
mirror.position.set(0,2,-4.9);
scene.add(mirror);

// Клик по зеркалу
window.addEventListener('click', (event)=>{
  const mouse = new THREE.Vector2(
    (event.clientX/window.innerWidth)*2-1,
    -(event.clientY/window.innerHeight)*2+1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(mirror);
  if(intersects.length>0){
    alert("Вы нашли код на зеркале: 3 8 5");
  }
}, false);

// Загрузка модели ванны
const loaderGLB = new GLTFLoader();
loaderGLB.load('assets/tub_model.glb', function(gltf){
  const tub = gltf.scene;
  tub.position.set(0,0,0);
  scene.add(tub);
}, undefined, function(err){
  console.error(err);
});

// Музыка
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('assets/music.mp3', function(buffer){
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  window.addEventListener('click', ()=>{ if(!sound.isPlaying) sound.play(); }, {once:true});
});

// Анимация
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();

// Обновление при ресайзе
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
