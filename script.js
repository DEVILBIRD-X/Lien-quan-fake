// Khởi tạo cảnh, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Tạo địa hình
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Tạo nhân vật
const characterGeometry = new THREE.BoxGeometry(1, 2, 1);
const characterMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const character = new THREE.Mesh(characterGeometry, characterMaterial);
scene.add(character);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Đặt vị trí ban đầu cho camera
camera.position.set(0, 10, 10);
camera.lookAt(character.position);

// Tạo joystick
const joystickManager = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50px', bottom: '50px' },
    color: 'white'
});

// Biến để theo dõi di chuyển
let moveX = 0;
let moveY = 0;

// Lắng nghe sự kiện di chuyển của joystick
joystickManager.on('move', (evt, data) => {
    const maxDistance = 50; // Khoảng cách tối đa mà joystick có thể di chuyển
    moveX = (data.vector.x / maxDistance) * 0.5;
    moveY = (data.vector.y / maxDistance) * 0.5;
});

joystickManager.on('end', () => {
    moveX = 0;
    moveY = 0;
});

// Hàm animate
function animate() {
    requestAnimationFrame(animate);

    // Di chuyển nhân vật
    character.position.x += moveX;
    character.position.z += moveY;

    // Giới hạn di chuyển trong bản đồ
    character.position.x = Math.max(Math.min(character.position.x, 100), -100);
    character.position.z = Math.max(Math.min(character.position.z, 100), -100);

    // Cập nhật camera theo nhân vật
    camera.position.x = character.position.x;
    camera.position.z = character.position.z + 10;
    camera.lookAt(character.position);

    renderer.render(scene, camera);
}

// Lắng nghe sự kiện resize để cập nhật kích thước renderer và camera
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

animate();
