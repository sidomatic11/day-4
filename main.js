import * as THREE from "three";

// SECTION - Scene Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //makes edges smoother, max 2 to avoid performance issues
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

/* Handle Responsiveness and Full Screen */
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //repeated here to account for monitor change
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		console.log("go full");
		renderer.domElement.requestFullscreen();
	} else {
		console.log("leave full");
		document.exitFullscreen();
	}
});

// SECTION - Lighting

const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(70, 0, 50);
scene.add(directionalLight);

// SECTION - Scene Objects

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0,
});
const clockwiseCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(clockwiseCube);
const counterclockwiseCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(counterclockwiseCube);

const geometries = [];
// const geometries = [
// new THREE.BoxGeometry(1, 1, 1),
// new THREE.CircleGeometry(1, 32),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.ConeGeometry(1, 1, 3),
// new THREE.IcosahedronGeometry(1),
// new THREE.CylinderGeometry(1, 1, 2, 32),
// new THREE.DodecahedronGeometry(1),
// new THREE.OctahedronGeometry(1),
// new THREE.PlaneGeometry(1, 1),
// new THREE.RingGeometry(0.5, 1, 32),
// new THREE.SphereGeometry(1, 32, 32),
// new THREE.TetrahedronGeometry(1),
// new THREE.TorusGeometry(1, 0.4, 16, 100),
// new THREE.TorusKnotGeometry(1, 0.3, 100, 16),
// ];

const count = 240;
for (let i = 0; i < count; i++) {
	if (Math.random() > 0.5) {
		geometries.push(new THREE.IcosahedronGeometry(1));
	} else {
		geometries.push(new THREE.ConeGeometry(1, 1, 3));
	}
}

const materials = [];

for (let i = 0; i < 10; i++) {
	const red = Math.random() * 1;
	const green = Math.random() * 1;
	const blue = Math.random() * 1;

	// Adjust for lighter pastel range (reduce saturation and increase lightness)
	const pastelRed = ((red + 1) % 2) * red * 0.5 + 0.3;
	const pastelGreen = ((green + 1) % 2) * green * 0.5 + 0.3;
	const pastelBlue = ((blue + 1) % 2) * blue * 0.5 + 0.3;

	const color = new THREE.Color(pastelRed, pastelGreen, pastelBlue);
	materials.push(new THREE.MeshPhongMaterial({ color: color }));
}

let objects = [];

geometries.forEach((geometry, index) => {
	const mesh = new THREE.Mesh(geometry, materials[index % 10]);
	mesh.position.x = (Math.random() - 0.5) * 40; // Random x position within -10 to 10
	mesh.position.y = (Math.random() - 0.5) * 40; // Random y position within -10 to 10
	mesh.position.z = (Math.random() - 0.5) * 70; // Random z position within -10 to 10

	objects.push(mesh);

	/* Add half objects for clockwise, and other half for counterclockwise */
	if (index % 2 === 0) {
		clockwiseCube.add(mesh);
	} else {
		counterclockwiseCube.add(mesh);
	}
});

// SECTION - Animation

function animate() {
	clockwiseCube.rotation.z -= 0.002;
	counterclockwiseCube.rotation.z += 0.001;
	// camera.position.z -= 0.01;

	objects.forEach((object, index) => {
		object.rotation.x += 0.01;
		object.rotation.y += 0.01;
	});

	renderer.render(scene, camera);
}
