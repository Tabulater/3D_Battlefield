import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

interface Battlefield3DProps {}

export const Battlefield3D = forwardRef<any, Battlefield3DProps>(({}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationIdRef = useRef<number>();
  
  // Camera controls
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0, phi: Math.PI / 4 });
  const cameraDistanceRef = useRef(60);

  // Animation objects
  const animatedObjectsRef = useRef<any[]>([]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      cameraAngleRef.current = { theta: 0, phi: Math.PI / 4 };
      cameraDistanceRef.current = 60;
      updateCameraPosition();
    }
  }));

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;

    const { theta, phi } = cameraAngleRef.current;
    const distance = cameraDistanceRef.current;

    cameraRef.current.position.x = distance * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.y = distance * Math.cos(phi);
    cameraRef.current.position.z = distance * Math.sin(phi) * Math.sin(theta);
    
    cameraRef.current.lookAt(0, 0, 0);
  };

  const initializeScene = () => {
    if (!mountRef.current) {
      console.log('Mount ref is null');
      return;
    }
    console.log('Initializing scene...');

    // Scene with dramatic atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Bright sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 100, 400);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    updateCameraPosition();

    // Enhanced Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x87CEEB);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Epic Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Main sun light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    scene.add(directionalLight);

    // Additional bright lights
    const fireLight1 = new THREE.PointLight(0xffa500, 2, 100);
    fireLight1.position.set(-40, 15, -30);
    scene.add(fireLight1);

    const fireLight2 = new THREE.PointLight(0xffa500, 2, 100);
    fireLight2.position.set(50, 20, 40);
    scene.add(fireLight2);

    const fireLight3 = new THREE.PointLight(0xffa500, 2, 100);
    fireLight3.position.set(0, 25, -50);
    scene.add(fireLight3);

    // Create epic military scene
    createTerrain();
    createMainTank();
    createTankFleet();
    createMilitaryBase();
    createAircraft();
    createVehicleFleet();
    createSoldierSquads();
    createDefenseSystems();
    createEnvironmentalDetails();
    createExplosionEffects();
    createSmokeSystem();
    
    // Add a simple test cube to verify rendering
    const testGeometry = new THREE.BoxGeometry(10, 10, 10);
    const testMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    testCube.position.set(0, 5, 0);
    sceneRef.current!.add(testCube);

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = event.clientX - previousMouseRef.current.x;
      const deltaY = event.clientY - previousMouseRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.01;
      cameraAngleRef.current.phi += deltaY * 0.01;

      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi));

      updateCameraPosition();
      previousMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      const zoomSpeed = 3;
      cameraDistanceRef.current += event.deltaY * 0.01 * zoomSpeed;
      cameraDistanceRef.current = Math.max(15, Math.min(200, cameraDistanceRef.current));
      
      updateCameraPosition();
    };

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    mountRef.current.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    mountRef.current.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    console.log('Scene initialization complete');
    return () => {
      mountRef.current?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      mountRef.current?.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  };

  const createTerrain = () => {
    if (!sceneRef.current) return;

    // Main battlefield ground with height variation
    const groundGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
    const positions = groundGeometry.attributes.position.array;
    
    // Create realistic terrain height variation
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.01) * 3 + Math.cos(z * 0.01) * 2 + Math.random() * 1.5;
    }
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x228B22,
      transparent: true,
      opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    sceneRef.current!.add(ground);

    // Multiple dirt roads
    const roadPositions = [
      { x: 0, z: 0, width: 12, length: 200, rotation: 0 },
      { x: 0, z: 0, width: 8, length: 150, rotation: Math.PI / 2 },
      { x: 30, z: 30, width: 6, length: 100, rotation: Math.PI / 4 }
    ];

    roadPositions.forEach(road => {
      const roadGeometry = new THREE.PlaneGeometry(road.width, road.length);
      const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
      const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.rotation.z = road.rotation;
      roadMesh.position.set(road.x, 0.02, road.z);
      roadMesh.receiveShadow = true;
      sceneRef.current.add(roadMesh);
    });

    // Battle craters
    for (let i = 0; i < 15; i++) {
      const craterGeometry = new THREE.CylinderGeometry(
        4 + Math.random() * 6, 
        5 + Math.random() * 8, 
        1 + Math.random() * 2, 
        12
      );
      const craterMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const crater = new THREE.Mesh(craterGeometry, craterMaterial);
      crater.position.set(
        (Math.random() - 0.5) * 200,
        -0.5,
        (Math.random() - 0.5) * 200
      );
      crater.receiveShadow = true;
      sceneRef.current.add(crater);
    }
  };

  const createMainTank = () => {
    if (!sceneRef.current) return;

    const tank = new THREE.Group();
    
    // Enhanced tank body with details
    const bodyGeometry = new THREE.BoxGeometry(12, 3, 18);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;
    
    // Tank turret with more detail
    const turretGeometry = new THREE.CylinderGeometry(4, 4, 2.5, 12);
    const turretMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.y = 4.5;
    turret.castShadow = true;
    
    // Main cannon
    const barrelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 16, 12);
    const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(8, 4.5, 0);
    barrel.castShadow = true;
    
    // Tank tracks with more realism
    for (let i = 0; i < 2; i++) {
      const trackGeometry = new THREE.BoxGeometry(3, 2.5, 20);
      const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const track = new THREE.Mesh(trackGeometry, trackMaterial);
      track.position.set(i === 0 ? -7.5 : 7.5, 1.25, 0);
      track.castShadow = true;
      track.receiveShadow = true;
      tank.add(track);

      // Track wheels
      for (let j = 0; j < 6; j++) {
        const wheelGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(i === 0 ? -7.5 : 7.5, 1.25, -8 + j * 3.2);
        wheel.castShadow = true;
        tank.add(wheel);
      }
    }

    // Tank accessories
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(-2, 7, 2);
    antenna.castShadow = true;
    
    tank.add(body);
    tank.add(turret);
    tank.add(barrel);
    tank.add(antenna);
    tank.position.set(0, 0, 0);
    
    // Add to animated objects for turret rotation
    animatedObjectsRef.current.push({
      object: turret,
      type: 'rotate',
      axis: 'y',
      speed: 0.3
    });
    
    sceneRef.current.add(tank);
  };

  const createTankFleet = () => {
    if (!sceneRef.current) return;

    const tankPositions = [
      { x: -25, z: -15, rotation: 0.3 },
      { x: 30, z: -20, rotation: -0.5 },
      { x: -40, z: 25, rotation: 1.2 },
      { x: 45, z: 30, rotation: -1.8 },
      { x: -15, z: 40, rotation: 0.8 },
      { x: 25, z: -45, rotation: -0.2 }
    ];

    tankPositions.forEach(pos => {
      const tank = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(10, 2.5, 15);
      const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.25, 0.3, 0.15 + Math.random() * 0.1)
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1.75;
      body.castShadow = true;
      body.receiveShadow = true;
      
      const turretGeometry = new THREE.CylinderGeometry(3, 3, 2, 10);
      const turretMaterial = new THREE.MeshLambertMaterial({ color: bodyMaterial.color });
      const turret = new THREE.Mesh(turretGeometry, turretMaterial);
      turret.position.y = 3.5;
      turret.castShadow = true;
      
      const barrelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 12, 8);
      const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(6, 3.5, 0);
      barrel.castShadow = true;
      
      // Tracks
      for (let i = 0; i < 2; i++) {
        const trackGeometry = new THREE.BoxGeometry(2.5, 2, 16);
        const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.position.set(i === 0 ? -6 : 6, 1, 0);
        track.castShadow = true;
        track.receiveShadow = true;
        tank.add(track);
      }
      
      tank.add(body);
      tank.add(turret);
      tank.add(barrel);
      tank.position.set(pos.x, 0, pos.z);
      tank.rotation.y = pos.rotation;
      
      sceneRef.current!.add(tank);
    });
  };

  const createMilitaryBase = () => {
    if (!sceneRef.current) return;

    // Command Center - Large imposing structure
    const commandGeometry = new THREE.BoxGeometry(25, 8, 20);
    const commandMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const command = new THREE.Mesh(commandGeometry, commandMaterial);
    command.position.set(-60, 4, -30);
    command.castShadow = true;
    command.receiveShadow = true;
    sceneRef.current.add(command);

    // Multiple Watchtowers
    const towerPositions = [
      { x: -80, z: -50 }, { x: 80, z: -50 }, 
      { x: -80, z: 50 }, { x: 80, z: 50 },
      { x: 0, z: -70 }, { x: 0, z: 70 }
    ];

    towerPositions.forEach(pos => {
      const towerGroup = new THREE.Group();
      
      const towerBaseGeometry = new THREE.BoxGeometry(6, 20, 6);
      const towerBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
      const towerBase = new THREE.Mesh(towerBaseGeometry, towerBaseMaterial);
      towerBase.position.y = 10;
      towerBase.castShadow = true;
      towerBase.receiveShadow = true;

      const towerTopGeometry = new THREE.BoxGeometry(8, 3, 8);
      const towerTopMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
      const towerTop = new THREE.Mesh(towerTopGeometry, towerTopMaterial);
      towerTop.position.y = 21.5;
      towerTop.castShadow = true;
      towerTop.receiveShadow = true;

      // Searchlight
      const lightGeometry = new THREE.CylinderGeometry(1, 1.5, 2, 8);
      const lightMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
      const searchlight = new THREE.Mesh(lightGeometry, lightMaterial);
      searchlight.position.y = 24;
      searchlight.castShadow = true;

      towerGroup.add(towerBase);
      towerGroup.add(towerTop);
      towerGroup.add(searchlight);
      towerGroup.position.set(pos.x, 0, pos.z);
      
      // Add rotating searchlight
      animatedObjectsRef.current.push({
        object: searchlight,
        type: 'rotate',
        axis: 'y',
        speed: 0.5
      });
      
      sceneRef.current.add(towerGroup);
    });

    // Barracks complex
    const barracksPositions = [
      { x: -40, z: 60, w: 30, h: 8, d: 12 },
      { x: 40, z: 60, w: 30, h: 8, d: 12 },
      { x: -40, z: -60, w: 25, h: 6, d: 10 },
      { x: 40, z: -60, w: 25, h: 6, d: 10 }
    ];

    barracksPositions.forEach(barrack => {
      const barracksGeometry = new THREE.BoxGeometry(barrack.w, barrack.h, barrack.d);
      const barracksMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
      const barracks = new THREE.Mesh(barracksGeometry, barracksMaterial);
      barracks.position.set(barrack.x, barrack.h / 2, barrack.z);
      barracks.castShadow = true;
      barracks.receiveShadow = true;
      sceneRef.current!.add(barracks);
    });

    // Radar dish
    const radarPoleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 25, 8);
    const radarPoleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const radarPole = new THREE.Mesh(radarPoleGeometry, radarPoleMaterial);
    radarPole.position.set(60, 12.5, 0);
    radarPole.castShadow = true;

    const radarDishGeometry = new THREE.CylinderGeometry(8, 8, 1, 16);
    const radarDishMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const radarDish = new THREE.Mesh(radarDishGeometry, radarDishMaterial);
    radarDish.position.set(60, 25, 0);
    radarDish.rotation.x = Math.PI / 6;
    radarDish.castShadow = true;

    animatedObjectsRef.current.push({
      object: radarDish,
      type: 'rotate',
      axis: 'y',
      speed: 1
    });

    sceneRef.current!.add(radarPole);
    sceneRef.current!.add(radarDish);
  };

  const createAircraft = () => {
    if (!sceneRef.current) return;

    // Fighter jets
    const jetPositions = [
      { x: -70, z: 20, rotation: 0.5 },
      { x: -70, z: 30, rotation: 0.5 },
      { x: 70, z: -20, rotation: -2.5 }
    ];

    jetPositions.forEach(pos => {
      const jet = new THREE.Group();
      
      // Fuselage
      const fuselageGeometry = new THREE.CylinderGeometry(1.5, 0.8, 20, 8);
      const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
      const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
      fuselage.rotation.z = Math.PI / 2;
      fuselage.position.y = 2;
      fuselage.castShadow = true;
      fuselage.receiveShadow = true;
      
      // Wings
      const wingGeometry = new THREE.BoxGeometry(16, 0.5, 8);
      const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      wings.position.y = 2;
      wings.castShadow = true;
      wings.receiveShadow = true;
      
      jet.add(fuselage);
      jet.add(wings);
      jet.position.set(pos.x, 0, pos.z);
      jet.rotation.y = pos.rotation;
      
      sceneRef.current!.add(jet);
    });

    // Helicopters
    const heliPositions = [
      { x: -50, z: -40 },
      { x: 50, z: 40 }
    ];

    heliPositions.forEach(pos => {
      const heli = new THREE.Group();
      
      // Body
      const bodyGeometry = new THREE.CapsuleGeometry(2, 8, 4, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      body.position.y = 3;
      body.castShadow = true;
      body.receiveShadow = true;
      
      // Main rotor
      const rotorGeometry = new THREE.BoxGeometry(0.2, 0.2, 16);
      const rotorMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
      rotor.position.y = 6;
      rotor.castShadow = true;
      
      // Tail rotor
      const tailRotorGeometry = new THREE.BoxGeometry(3, 0.1, 0.1);
      const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
      tailRotor.position.set(-6, 4, 0);
      tailRotor.castShadow = true;
      
      heli.add(body);
      heli.add(rotor);
      heli.add(tailRotor);
      heli.position.set(pos.x, 0, pos.z);
      
      // Add spinning rotors
      animatedObjectsRef.current.push({
        object: rotor,
        type: 'rotate',
        axis: 'y',
        speed: 10
      });
      
      animatedObjectsRef.current.push({
        object: tailRotor,
        type: 'rotate',
        axis: 'x',
        speed: 15
      });
      
      sceneRef.current.add(heli);
    });
  };

  const createVehicleFleet = () => {
    if (!sceneRef.current) return;

    // Military trucks
    const truckPositions = [
      { x: 20, z: 50 }, { x: 30, z: 50 }, { x: 40, z: 50 },
      { x: -20, z: -50 }, { x: -30, z: -50 }
    ];

    truckPositions.forEach(pos => {
      const truck = new THREE.Group();
      
      // Cab
      const cabGeometry = new THREE.BoxGeometry(4, 4, 6);
      const cabMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
      const cab = new THREE.Mesh(cabGeometry, cabMaterial);
      cab.position.set(0, 2, 3);
      cab.castShadow = true;
      cab.receiveShadow = true;
      
      // Cargo bed
      const bedGeometry = new THREE.BoxGeometry(4, 3, 10);
      const bedMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5d23 });
      const bed = new THREE.Mesh(bedGeometry, bedMaterial);
      bed.position.set(0, 1.5, -5);
      bed.castShadow = true;
      bed.receiveShadow = true;
      
      // Wheels
      for (let i = 0; i < 6; i++) {
        const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.8, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(
          i % 2 === 0 ? -2.5 : 2.5,
          1,
          i < 2 ? 2 : (i < 4 ? -2 : -8)
        );
        wheel.castShadow = true;
        truck.add(wheel);
      }
      
      truck.add(cab);
      truck.add(bed);
      truck.position.set(pos.x, 0, pos.z);
      
      sceneRef.current.add(truck);
    });

    // Armored vehicles
    const armoredPositions = [
      { x: -35, z: 15 }, { x: 35, z: -15 }
    ];

    armoredPositions.forEach(pos => {
      const armored = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(6, 3, 12);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 2;
      body.castShadow = true;
      body.receiveShadow = true;
      
      // Gun turret
      const turretGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 8);
      const turretMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
      const turret = new THREE.Mesh(turretGeometry, turretMaterial);
      turret.position.y = 4;
      turret.castShadow = true;
      
      const gunGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
      const gunMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const gun = new THREE.Mesh(gunGeometry, gunMaterial);
      gun.rotation.z = Math.PI / 2;
      gun.position.set(3, 4, 0);
      gun.castShadow = true;
      
      // Wheels
      for (let i = 0; i < 8; i++) {
        const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(
          i % 2 === 0 ? -3.5 : 3.5,
          0.8,
          -4 + (Math.floor(i / 2) * 2.5)
        );
        wheel.castShadow = true;
        armored.add(wheel);
      }
      
      armored.add(body);
      armored.add(turret);
      armored.add(gun);
      armored.position.set(pos.x, 0, pos.z);
      
      sceneRef.current.add(armored);
    });
  };

  const createSoldierSquads = () => {
    if (!sceneRef.current) return;

    // Create multiple soldier formations
    const squadPositions = [
      { centerX: 10, centerZ: 15, count: 8 },
      { centerX: -15, centerZ: -10, count: 6 },
      { centerX: 25, centerZ: -25, count: 10 },
      { centerX: -30, centerZ: 20, count: 7 },
      { centerX: 0, centerZ: -35, count: 12 }
    ];

    squadPositions.forEach(squad => {
      for (let i = 0; i < squad.count; i++) {
        const soldier = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.6, 2, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
          color: new THREE.Color().setHSL(0.25, 0.4, 0.2 + Math.random() * 0.1)
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        body.receiveShadow = true;
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.8;
        head.castShadow = true;
        head.receiveShadow = true;
        
        // Helmet
        const helmetGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 2.9;
        helmet.castShadow = true;
        
        // Weapon
        const weaponGeometry = new THREE.BoxGeometry(0.1, 0.1, 2);
        const weaponMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0.5, 2, 0);
        weapon.rotation.z = -Math.PI / 6;
        weapon.castShadow = true;
        
        soldier.add(body);
        soldier.add(head);
        soldier.add(helmet);
        soldier.add(weapon);
        
        // Position soldiers in formation
        const angle = (i / squad.count) * Math.PI * 2;
        const radius = 3 + Math.random() * 4;
        soldier.position.set(
          squad.centerX + Math.cos(angle) * radius,
          0,
          squad.centerZ + Math.sin(angle) * radius
        );
        soldier.rotation.y = angle + Math.PI;
        
        sceneRef.current.add(soldier);
      }
    });
  };

  const createDefenseSystems = () => {
    if (!sceneRef.current) return;

    // Anti-aircraft guns
    const aaPositions = [
      { x: -45, z: -35 }, { x: 45, z: 35 }, { x: -45, z: 35 }, { x: 45, z: -35 }
    ];

    aaPositions.forEach(pos => {
      const aaGun = new THREE.Group();
      
      const baseGeometry = new THREE.CylinderGeometry(3, 4, 2, 8);
      const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 1;
      base.castShadow = true;
      base.receiveShadow = true;
      
      const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 8);
      const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      barrel.position.set(0, 3, 4);
      barrel.rotation.x = -Math.PI / 4;
      barrel.castShadow = true;
      
      aaGun.add(base);
      aaGun.add(barrel);
      aaGun.position.set(pos.x, 0, pos.z);
      
      sceneRef.current.add(aaGun);
    });

    // Missile launchers
    const missilePositions = [
      { x: 0, z: 45 }, { x: 0, z: -45 }
    ];

    missilePositions.forEach(pos => {
      const launcher = new THREE.Group();
      
      const baseGeometry = new THREE.BoxGeometry(6, 2, 12);
      const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x2d4a2d });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 1;
      base.castShadow = true;
      base.receiveShadow = true;
      
      // Missiles
      for (let i = 0; i < 4; i++) {
        const missileGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 8);
        const missileMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const missile = new THREE.Mesh(missileGeometry, missileMaterial);
        missile.position.set(-1.5 + i * 1, 3, 0);
        missile.rotation.x = -Math.PI / 6;
        missile.castShadow = true;
        launcher.add(missile);
      }
      
      launcher.add(base);
      launcher.position.set(pos.x, 0, pos.z);
      
      sceneRef.current.add(launcher);
    });
  };

  const createEnvironmentalDetails = () => {
    if (!sceneRef.current) return;

    // Dense forest around perimeter
    const treeCount = 60;
    for (let i = 0; i < treeCount; i++) {
      const tree = new THREE.Group();
      
      const trunkHeight = 8 + Math.random() * 12;
      const trunkGeometry = new THREE.CylinderGeometry(
        0.8 + Math.random() * 0.4, 
        1.2 + Math.random() * 0.6, 
        trunkHeight, 
        8
      );
      const trunkMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.1, 0.6, 0.2 + Math.random() * 0.2)
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = trunkHeight / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      
      const foliageSize = 4 + Math.random() * 6;
      const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
      const foliageMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.3)
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = trunkHeight + foliageSize * 0.7;
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      
      tree.add(trunk);
      tree.add(foliage);
      
      // Position trees around perimeter
      const angle = (i / treeCount) * Math.PI * 2;
      const distance = 90 + Math.random() * 40;
      tree.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );
      
      sceneRef.current.add(tree);
    }

    // Supply depot with crates
    const cratePositions: { x: number; z: number }[] = [];
    for (let x = -10; x <= 10; x += 4) {
      for (let z = 70; z <= 85; z += 4) {
        cratePositions.push({ x, z });
      }
    }

    cratePositions.forEach(pos => {
      const crateGeometry = new THREE.BoxGeometry(
        2 + Math.random(), 
        2 + Math.random(), 
        2 + Math.random()
      );
      const crateMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.1, 0.3, 0.4 + Math.random() * 0.2)
      });
      const crate = new THREE.Mesh(crateGeometry, crateMaterial);
      crate.position.set(pos.x + Math.random() * 2, 1, pos.z + Math.random() * 2);
      crate.rotation.y = Math.random() * Math.PI;
      crate.castShadow = true;
      crate.receiveShadow = true;
      sceneRef.current.add(crate);
    });

    // Fuel barrels
    const barrelPositions = [
      { x: 55, z: 25 }, { x: 58, z: 25 }, { x: 61, z: 25 },
      { x: -55, z: -25 }, { x: -58, z: -25 }, { x: -61, z: -25 }
    ];

    barrelPositions.forEach(pos => {
      const barrelGeometry = new THREE.CylinderGeometry(1, 1, 3, 12);
      const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      barrel.position.set(pos.x, 1.5, pos.z);
      barrel.castShadow = true;
      barrel.receiveShadow = true;
      sceneRef.current.add(barrel);
    });

    // Communication towers
    const towerPositions = [
      { x: -90, z: 0 }, { x: 90, z: 0 }
    ];

    towerPositions.forEach(pos => {
      const tower = new THREE.Group();
      
      const poleGeometry = new THREE.CylinderGeometry(0.3, 0.5, 40, 8);
      const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 20;
      pole.castShadow = true;
      
      // Antenna arrays
      for (let i = 0; i < 3; i++) {
        const antennaGeometry = new THREE.BoxGeometry(8, 0.2, 0.2);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 35 + i * 2;
        antenna.rotation.y = (i * Math.PI) / 3;
        antenna.castShadow = true;
        tower.add(antenna);
      }
      
      tower.add(pole);
      tower.position.set(pos.x, 0, pos.z);
      
      sceneRef.current.add(tower);
    });
  };

  const createExplosionEffects = () => {
    if (!sceneRef.current) return;

    // Fire effects at various locations
    const firePositions = [
      { x: -25, z: -40 }, { x: 30, z: 35 }, { x: -50, z: 20 }
    ];

    firePositions.forEach(pos => {
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = pos.x + (Math.random() - 0.5) * 8;
        positions[i3 + 1] = Math.random() * 15;
        positions[i3 + 2] = pos.z + (Math.random() - 0.5) * 8;
        
        // Fire colors
        colors[i3] = 1; // R
        colors[i3 + 1] = 0.3 + Math.random() * 0.7; // G
        colors[i3 + 2] = 0; // B
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 1.5,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });

      const fire = new THREE.Points(geometry, material);
      animatedObjectsRef.current.push({
        object: fire,
        type: 'fire',
        originalPositions: positions.slice()
      });
      
      sceneRef.current.add(fire);
    });
  };

  const createSmokeSystem = () => {
    if (!sceneRef.current) return;

    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 300;
      positions[i + 1] = Math.random() * 80;
      positions[i + 2] = (Math.random() - 0.5) * 300;
      
      const intensity = 0.2 + Math.random() * 0.4;
      colors[i] = intensity * 0.8;
      colors[i + 1] = intensity * 0.6;
      colors[i + 2] = intensity * 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      transparent: true,
      opacity: 0.4,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const smoke = new THREE.Points(geometry, material);
    animatedObjectsRef.current.push({
      object: smoke,
      type: 'smoke',
      originalPositions: positions.slice()
    });
    
    sceneRef.current.add(smoke);
  };

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate);

    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const time = Date.now() * 0.001;

    // Animate all objects
    animatedObjectsRef.current.forEach(item => {
      if (item.type === 'rotate') {
        item.object.rotation[item.axis] += item.speed * 0.01;
      } else if (item.type === 'fire') {
        const positions = item.object.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 2 + i) * 0.1;
        }
        item.object.geometry.attributes.position.needsUpdate = true;
      } else if (item.type === 'smoke') {
        const positions = item.object.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(time * 0.5 + i) * 0.02;
          positions[i + 1] += 0.05;
          positions[i + 2] += Math.cos(time * 0.3 + i) * 0.02;
          
          if (positions[i + 1] > 80) {
            positions[i + 1] = 0;
          }
        }
        item.object.geometry.attributes.position.needsUpdate = true;
      }
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  useEffect(() => {
    console.log('Battlefield3D component mounted');
    const cleanup = initializeScene();
    animate();

    return () => {
      console.log('Battlefield3D component unmounting');
      cleanup?.();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        cursor: 'grab',
        touchAction: 'none'
      }}
    />
  );
});

Battlefield3D.displayName = 'Battlefield3D';