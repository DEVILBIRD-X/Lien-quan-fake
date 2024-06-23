// Khởi tạo cảnh, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Tạo địa hình
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Tạo nhân vật
const characterGeometry = new THREE.BoxGeometry(1, 2, 1);
const characterMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const character = new THREE.Mesh(characterGeometry, characterMaterial);
scene.add(character);

// Đặt vị trí ban đầu cho camera
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(character.position);

// Tạo joystick
const joystickManager = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'white'
});

// Biến để theo dõi di chuyển
let moveX = 0;
let moveY = 0;

// Lắng nghe sự kiện di chuyển của joystick
joystickManager.on('move', (evt, data) => {
    const maxDistance = 50; // Khoảng cách tối đa mà joystick có thể di chuyển
    moveX = (data.vector.x / maxDistance) * 0.1;
    moveY = (data.vector.y / maxDistance) * 0.1;
});

joystickManager.on('end', () => {
    moveX = 0;
    moveY = 0;
});

// Cập nhật vị trí của nhân vật trong hàm animate
function animate() {
    requestAnimationFrame(animate);

    character.position.x += moveX;
    character.position.z -= moveY;

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