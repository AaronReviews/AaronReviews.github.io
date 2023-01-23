import * as THREE from 'three';
import { OrbitControls } from 'addons/OrbitControls.js';
import { GLTFLoader } from 'addons/GLTFLoader.js';
import { DRACOLoader } from 'addons/DRACOLoader.js';

let container, camera, scene, renderer, controls, floorMat, backLight, spotLight, frontLight, rearLight, distLight, sideLight;
container = document.createElement('div');
container.className = 'animation';
container.style.opacity = '0';

function generateobject(elem1, elem2, elem3) {
    return { 'x': elem1, 'y': elem2, 'z': elem3 };
}

let CameraPositions = [
    generateobject(-5.5, 3, 3),
    generateobject(5.23, 2.5, 2.94),
    generateobject(-5.61, 4.5, 4.32),
    generateobject(2.12, 2.94, -2.87),
    generateobject(-0.07, 2.41, 2.86)
];

let ControlPositions = [
    generateobject(1.1, 1.6, -0.5),
    generateobject(-0.19, 0.84, 0.04),
    generateobject(0.65, 1.79, -0.94),
    generateobject(-0.17, 0.82, 0.41),
    generateobject(-0.06, 0.87, 0.61)
];

const lights = {
    "spot": [0xf8edd4, 1000],
    "ambient": [0xf8edd4, 0.025],
    "red": [0xbf0000, 20],
    "blue": [0x0000ff, 35],
    "green": [0x00dd00, 25],
    "purple": [0x250f6e, 12]
}

frontLight = new THREE.PointLight(lights.red[0], 0, 10, 1);
frontLight.position.set(0, 2, 3);
frontLight.castShadow = false;
frontLight.power = lights.red[1];

rearLight = new THREE.PointLight(lights.blue[0], 0, 8, 0.75);
rearLight.position.set(0, 1, -2);
rearLight.castShadow = true;
rearLight.power = lights.blue[1];
rearLight.shadow.mapSize.width = 500;
rearLight.shadow.mapSize.height = 800;
rearLight.shadow.camera.near = 0.1;
rearLight.shadow.camera.far = 500;

sideLight = new THREE.PointLight(lights.purple[0], 0, 15, 2);
sideLight.position.set(1.3, 5, 0.5);
sideLight.castShadow = false;
sideLight.power = lights.purple[1];
sideLight.shadow.mapSize.width = 800;
sideLight.shadow.mapSize.height = 800;
sideLight.shadow.camera.near = 0.1;
sideLight.shadow.camera.far = 50;

distLight = new THREE.PointLight(lights.green[0], 0, 10, 2);
distLight.position.set(-3, 1, -1);
distLight.castShadow = true;
distLight.power = lights.green[1];
distLight.shadow.mapSize.width = 800;
distLight.shadow.mapSize.height = 800;
distLight.shadow.camera.near = 0.1;
distLight.shadow.camera.far = 50;

spotLight = new THREE.SpotLight(lights.spot[0]);
spotLight.position.set(0, 4, 2.5);
spotLight.angle - Math.PI / 4;
spotLight.penumbra = 1;
spotLight.intensity = 5;
spotLight.distance = 11;
spotLight.power = lights.spot[1];
spotLight.decay = 14;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1000;
spotLight.shadow.mapSize.height = 1000;
spotLight.shadow.camera.near = 4;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 50;

backLight = new THREE.AmbientLight(lights.ambient[0], lights.ambient[1]);

var pos = 0;

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.opacity = '0';
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 80);
    camera.position.set(CameraPositions[pos].x, CameraPositions[pos].y, CameraPositions[pos].z);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(ControlPositions[pos].x, ControlPositions[pos].y, ControlPositions[pos].z);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 8;
    controls.update();

    scene = new THREE.Scene({ alpha: true });
    scene.background = new THREE.Color(0x030305);

    floorMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.0005
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./lib/data/hardwood2_diffuse.jpg', function(map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        map.encoding = THREE.sRGBEncoding;
        floorMat.map = map;
        floorMat.needsUpdate = true;
    });

    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMesh.castShadow = false;
    floorMesh.rotation.x = -Math.PI / 2.0;

    scene.add(floorMesh);
    scene.add(frontLight);
    scene.add(rearLight);
    scene.add(sideLight);
    scene.add(distLight);
    scene.add(backLight);
    scene.add(spotLight);

    const glbPath = 'lib/data/DracoPiano.glb'
    const draco = new DRACOLoader();
    draco.setDecoderConfig({ type: 'js' });
    draco.setDecoderPath('lib/js/');
    draco.preload();
    const gltf = new GLTFLoader();
    gltf.setDRACOLoader(draco);
    gltf.load(glbPath, function(gltf) {
        gltf.scene.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
        scene.add(gltf.scene);
    })
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderScene();
}

function renderScene() {
    floorMat.needsUpdate = true;
    renderer.render(scene, camera);
}

export { container, camera, scene, floorMat, backLight, spotLight, frontLight, rearLight, distLight, sideLight, renderer, controls, pos, CameraPositions, ControlPositions, init, animate };