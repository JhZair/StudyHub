// Configuración de la escena 3D con Three.js
console.log('1. Cargando three-scene.js...');

// Función auto-ejecutable para evitar el ámbito global
(function() {
    console.log('2. Iniciando función auto-ejecutable');
    
    // Verificar si el contenedor del canvas existe
    console.log('3. Buscando contenedor del canvas...');
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) {
        console.error('Error: No se encontró el contenedor del canvas');
        return;
    }
    console.log('4. Contenedor del canvas encontrado:', canvasContainer);

    // Cargar Three.js de forma síncrona
    console.log('5. Cargando Three.js...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
    script.onerror = function(e) {
        console.error('Error al cargar Three.js:', e);
        console.error('Script que falló:', script.src);
    };
    script.onload = function() {
        console.log('6. Three.js cargado correctamente');
        // Cargar OrbitControls después de que Three.js esté listo
        console.log('7. Cargando OrbitControls...');
        const orbitScript = document.createElement('script');
        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        orbitScript.onerror = function(e) {
            console.error('Error al cargar OrbitControls:', e);
            console.error('Script que falló:', orbitScript.src);
        };
        console.log('7.1 Script OrbitControls configurado');
        orbitScript.onload = function() {
            console.log('8. OrbitControls cargado correctamente');
            console.log('9. Iniciando la escena 3D...');
            init();
        };
        document.head.appendChild(orbitScript);
    };
    document.head.appendChild(script);

    // Función para crear partículas alrededor de un punto
    function createParticles(count, minRadius, maxRadius, color) {
        const particles = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const colorObj = new THREE.Color(color);
        
        for (let i = 0; i < count; i++) {
            // Posición aleatoria en una esfera achatada
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            // Radio aleatorio entre minRadius y maxRadius
            const r = minRadius + Math.random() * (maxRadius - minRadius);
            
            // Achatamiento en el eje Y para dar forma de disco
            const yFactor = 0.3 + Math.random() * 0.4; // Más achatado
            
            positions.push(
                r * Math.sin(phi) * Math.cos(theta) * (0.8 + Math.random() * 0.4), // Variación adicional en X
                r * Math.sin(phi) * Math.sin(theta) * yFactor, // Más achatado en Y
                r * Math.cos(phi) * (0.8 + Math.random() * 0.4)  // Variación adicional en Z
            );
            
            // Tamaño aleatorio para las partículas
            sizes.push(0.05 + Math.random() * 0.2);
            
            // Variar el color con más rango
            const hue = (colorObj.getHSL({}).h + (Math.random() * 0.4 - 0.2)) % 1;
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.5 + Math.random() * 0.4;
            const particleColor = new THREE.Color().setHSL(hue, saturation, lightness);
            colors.push(particleColor.r, particleColor.g, particleColor.b);
        }
        
        particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        return particles;
    }

    // Función para inicializar la escena
    function init() {
        // Crear la escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.01);
        
        // Configuración de la cámara
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;
        camera.position.y = 5;
        
        // Configuración del renderizador
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 1);
        canvasContainer.appendChild(renderer.domElement);
        
        // Controles de órbita
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.minDistance = 10;
        controls.maxDistance = 30;
        controls.target.set(0, 0, 0);
        controls.update();

        // Crear fondo estrellado
        function createStarfield(starCount = 2000) {
            const starsGeometry = new THREE.BufferGeometry();
            const starVertices = [];
            const starColors = [];
            
            // Colores para diferentes tipos de estrellas
            const starColorsPalette = [
                0xffffff,  // Blanco
                0xfff4e5,  // Blanco cálido
                0xe6f0ff,  // Blanco frío
                0xffe4b5,  // Amarillo claro
                0xb3d9ff   // Azul claro
            ];
            
            for (let i = 0; i < starCount; i++) {
                // Posición aleatoria en una esfera grande
                const radius = 100 + Math.random() * 400; // Rango de distancia
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);
                
                starVertices.push(x, y, z);
                
                // Color aleatorio de la paleta
                const starColor = new THREE.Color(
                    starColorsPalette[Math.floor(Math.random() * starColorsPalette.length)]
                );
                
                // Variar ligeramente el brillo
                const brightness = 0.5 + Math.random() * 0.5;
                starColor.multiplyScalar(brightness);
                
                starColors.push(starColor.r, starColor.g, starColor.b);
            }
            
            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
            
            const starsMaterial = new THREE.PointsMaterial({
                size: 0.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending
            });
            
            return new THREE.Points(starsGeometry, starsMaterial);
        }
        
        // Crear constelaciones
        function createConstellations(starCount = 15, clusterCount = 8) {
            const group = new THREE.Group();
            
            for (let c = 0; c < clusterCount; c++) {
                // Posición aleatoria para el centro del cúmulo
                const centerX = (Math.random() - 0.5) * 400;
                const centerY = (Math.random() - 0.5) * 400;
                const centerZ = (Math.random() - 0.5) * 400;
                
                const distance = 15 + Math.random() * 30; // Radio del cúmulo
                const color = new THREE.Color().setHSL(
                    Math.random(), 
                    0.5 + Math.random() * 0.5, 
                    0.5 + Math.random() * 0.5
                );
                
                // Crear estrellas del cúmulo
                const starsGeometry = new THREE.BufferGeometry();
                const starVertices = [];
                const starColors = [];
                
                for (let i = 0; i < starCount; i++) {
                    // Posición aleatoria dentro del cúmulo
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * distance;
                    const height = (Math.random() - 0.5) * distance * 0.5;
                    
                    const x = centerX + Math.cos(angle) * dist;
                    const y = centerY + Math.sin(angle) * dist;
                    const z = centerZ + height;
                    
                    starVertices.push(x, y, z);
                    
                    // Variar ligeramente el color
                    const starColor = color.clone();
                    starColor.offsetHSL(
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.2
                    );
                    
                    starColors.push(starColor.r, starColor.g, starColor.b);
                }
                
                starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
                starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
                
                const starsMaterial = new THREE.PointsMaterial({
                    size: 0.8 + Math.random() * 1.2,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.9,
                    sizeAttenuation: true,
                    blending: THREE.AdditiveBlending
                });
                
                const cluster = new THREE.Points(starsGeometry, starsMaterial);
                group.add(cluster);
                
                // Conectar estrellas con líneas para formar constelaciones
                if (starCount > 2) {
                    const lineGeometry = new THREE.BufferGeometry();
                    const lineVertices = [];
                    const lineColors = [];
                    
                    // Crear conexiones aleatorias entre estrellas
                    const connections = Math.min(starCount * 2, starCount * (starCount - 1) / 2);
                    const connected = new Set();
                    
                    for (let i = 0; i < connections; i++) {
                        let a, b;
                        do {
                            a = Math.floor(Math.random() * starCount);
                            b = Math.floor(Math.random() * starCount);
                        } while (a === b || connected.has(`${Math.min(a,b)}-${Math.max(a,b)}`));
                        
                        connected.add(`${Math.min(a,b)}-${Math.max(a,b)}`);
                        
                        const a3 = a * 3;
                        const b3 = b * 3;
                        
                        lineVertices.push(
                            starVertices[a3], starVertices[a3 + 1], starVertices[a3 + 2],
                            starVertices[b3], starVertices[b3 + 1], starVertices[b3 + 2]
                        );
                        
                        // Color de la línea (promedio de los colores de las estrellas)
                        const r = (starColors[a3] + starColors[b3]) / 2;
                        const g = (starColors[a3 + 1] + starColors[b3 + 1]) / 2;
                        const blue = (starColors[a3 + 2] + starColors[b3 + 2]) / 2;
                        
                        lineColors.push(r, g, blue, r, g, blue);
                    }
                    
                    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
                    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
                    
                    const lineMaterial = new THREE.LineBasicMaterial({
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.3,
                        linewidth: 1
                    });
                    
                    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
                    group.add(lines);
                }
            }
            
            return group;
        }
        
        // Luces
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1, 50);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        
        // Agregar fondo estrellado y constelaciones
        const starfield = createStarfield(3000);
        scene.add(starfield);
        
        const constellations = createConstellations(15, 8);
        scene.add(constellations);
        
        // Crear esfera principal
        const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4169e1,
            shininess: 100,
            specular: 0xffffff,
            emissive: 0x1a1a3a,
            emissiveIntensity: 0.5,
            wireframe: false
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        
        // Crear partículas alrededor de la esfera
        const particleCount = 2000; // Más partículas
        const particleGeometry = createParticles(particleCount, 3, 12, 0x6a5acd); // Radio más amplio
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.01,
            depthWrite: false
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        
        // Crear múltiples anillos con diferentes características
        const rings = [];
        const ringConfigs = [
            { radius: 6,  tube: 0.15, color: 0x9370db, opacity: 0.6, rotation: { x: Math.PI/2, y: 0, z: 0 } },
            { radius: 7,  tube: 0.1,  color: 0x4169e1, opacity: 0.4, rotation: { x: Math.PI/3, y: Math.PI/4, z: 0 } },
            { radius: 5,  tube: 0.12, color: 0xba55d3, opacity: 0.5, rotation: { x: 0, y: Math.PI/2, z: Math.PI/4 } },
            { radius: 8,  tube: 0.08, color: 0x8a2be2, opacity: 0.3, rotation: { x: Math.PI/4, y: 0, z: Math.PI/3 } },
            { radius: 4,  tube: 0.1,  color: 0x9932cc, opacity: 0.4, rotation: { x: Math.PI/6, y: Math.PI/3, z: Math.PI/6 } }
        ];

        ringConfigs.forEach(config => {
            const ringGeometry = new THREE.TorusGeometry(config.radius, config.tube, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: config.opacity,
                blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
            scene.add(ring);
            rings.push({
                mesh: ring,
                speed: 0.02 + Math.random() * 0.03,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                }
            });
        });
        
        // Manejo del redimensionamiento
        function onWindowResize() {
            camera.aspect = (window.innerWidth / 2) / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 2, window.innerHeight);
        }
        
        // Variables para la animación
        let time = 0;
        
        // Animación
        function animate() {
            requestAnimationFrame(animate);
            
            time += 0.01;
            
            // Rotar la esfera
            sphere.rotation.y += 0.002;
            
            // Animar partículas
            if (particles) {
                // Rotación general más lenta
                particles.rotation.y = time * 0.05;
                
                // Movimiento ondulante suave
                const positions = particles.geometry.attributes.position.array;
                const originalPositions = particles.userData.originalPositions || [];
                
                // Guardar posiciones originales si es la primera vez
                if (originalPositions.length === 0) {
                    for (let i = 0; i < positions.length; i++) {
                        originalPositions[i] = positions[i];
                    }
                    particles.userData.originalPositions = originalPositions;
                }
                
                // Aplicar movimiento ondulante
                for (let i = 0; i < positions.length; i += 3) {
                    const i3 = i / 3;
                    const wave = Math.sin(time * 0.5 + i3 * 0.1) * 0.1;
                    
                    positions[i] = originalPositions[i] * (1 + Math.sin(time * 0.3 + i3 * 0.01) * 0.2);
                    positions[i + 1] = originalPositions[i + 1] * (1 + wave);
                    positions[i + 2] = originalPositions[i + 2] * (1 + Math.cos(time * 0.2 + i3 * 0.01) * 0.2);
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
            }
            
            // Animar anillos
            rings.forEach(ring => {
                ring.mesh.rotation.x += ring.rotationSpeed.x;
                ring.mesh.rotation.y += ring.rotationSpeed.y;
                ring.mesh.rotation.z += ring.rotationSpeed.z;
                
                // Efecto de pulso en la opacidad
                const material = ring.mesh.material;
                material.opacity = (material.opacity + ring.speed) % 1;
                material.opacity = Math.max(0.2, Math.min(0.8, material.opacity));
                
                // Rotación adicional
                ring.mesh.rotation.y += 0.002;
            });
            
            // Mover luz puntual
            pointLight.position.x = Math.sin(time * 0.5) * 10;
            pointLight.position.z = Math.cos(time * 0.3) * 10;
            
            // Rotación sutil del fondo estelar
            if (starfield) {
                starfield.rotation.y = time * 0.01;
                starfield.rotation.x = time * 0.005;
            }
            
            // Rotación más lenta para las constelaciones
            if (constellations) {
                constellations.rotation.y = time * 0.005;
                constellations.rotation.x = time * 0.002;
            }
            
            controls.update();
            renderer.render(scene, camera);
        }
        
        window.addEventListener('resize', onWindowResize);
        
        // Iniciar animación
        animate();
    }
})();
