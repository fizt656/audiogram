import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Card from './common/Card';
import Button from './common/Button';
import { H3, H4, Text } from './common/Typography';
import Loader from './common/Loader';
import Flex from './layout/Flex';
import Controls from './common/Controls';

const VisualizationContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ControlPanel = styled(Flex)`
  margin-bottom: var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const SliceControls = styled(Flex)`
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SliceLabel = styled(Text)`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
`;

const SliceNumber = styled(Text)`
  font-family: var(--font-family-mono);
  color: var(--color-accent-primary);
  min-width: 1.8rem;
  text-align: center;
  font-size: 0.875rem;
  margin-left: var(--spacing-sm);
`;

const SliceSlider = styled.input`
  -webkit-appearance: none;
  width: 120px;
  height: 4px;
  background: var(--color-bg-tertiary);
  border-radius: var(--border-radius-circle);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: var(--border-radius-circle);
    background: var(--color-accent-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--color-accent-secondary);
      box-shadow: 0 0 5px rgba(93, 95, 239, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const VisualizationView = styled.div`
  flex: 1;
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow-sm);
  
  .brain-canvas {
    width: 100%;
    height: 100%;
  }
  
  .slice-view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    .slice-image {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: var(--border-radius-sm);
      box-shadow: var(--shadow-md);
    }
    
    .overlay-image {
      position: absolute;
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      opacity: 0.7;
      mix-blend-mode: screen;
      border-radius: var(--border-radius-sm);
    }
  }
`;

const InfoOverlay = styled(Card)`
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  width: 300px;
  max-width: 40%;
  background-color: rgba(243, 242, 242, 0.9);
  backdrop-filter: blur(5px);
  z-index: var(--z-index-overlay);
  
  @media (max-width: 768px) {
    width: auto;
    max-width: 90%;
    left: var(--spacing-md);
  }
`;

const BrainVisualization = ({ brainData, onRegionSelect, isLoading }) => {
  const [viewMode, setViewMode] = useState('axial');
  const [currentSlice, setCurrentSlice] = useState(0);
  const [sliceCount, setSliceCount] = useState(0);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [viewData, setViewData] = useState(null);
  
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  
  // Initialize 3D visualization
  useEffect(() => {
    if (viewMode === '3d' && brainData && canvasRef.current) {
      // Set up scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xE5E5E5); // Match our new light color scheme
      sceneRef.current = scene;
      
      // Set up camera
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;
      
      // Set up renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Create a more realistic brain geometry using multiple ellipsoids
      const createBrainModel = () => {
        const brainGroup = new THREE.Group();
        
        // Create cerebrum (main brain mass) using slightly deformed sphere
        const cerebrumGeometry = new THREE.SphereGeometry(1.8, 32, 32);
        // Deform the sphere to look more brain-like
        const cerebrumPositions = cerebrumGeometry.attributes.position;
        for (let i = 0; i < cerebrumPositions.count; i++) {
          const x = cerebrumPositions.getX(i);
          const y = cerebrumPositions.getY(i);
          const z = cerebrumPositions.getZ(i);
          
          // Add some random deformation
          const noise = 0.2 * (Math.random() - 0.5);
          
          // Flatten bottom slightly
          const newY = y < 0 ? y * 0.8 : y;
          
          // Elongate slightly front to back
          const newZ = z * 1.2;
          
          // Create a groove down the middle (longitudinal fissure)
          const groove = Math.abs(x) < 0.2 ? 0.2 * Math.sign(x) : 0;
          
          cerebrumPositions.setX(i, x + groove + noise * 0.5);
          cerebrumPositions.setY(i, newY + noise * 0.3);
          cerebrumPositions.setZ(i, newZ + noise * 0.5);
        }
        
        const cerebrumMaterial = new THREE.MeshStandardMaterial({
          color: 0xE0CDCD, // Pinkish gray
          transparent: true,
          opacity: 0.9,
          roughness: 0.7,
          metalness: 0.1
        });
        
        const cerebrum = new THREE.Mesh(cerebrumGeometry, cerebrumMaterial);
        brainGroup.add(cerebrum);
        
        // Add cerebellum (smaller brain part at the back bottom)
        const cerebellumGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const cerebellumMaterial = new THREE.MeshStandardMaterial({
          color: 0xD0BCBC, // Slightly darker
          transparent: true,
          opacity: 0.9,
          roughness: 0.8,
          metalness: 0.1
        });
        
        const cerebellum = new THREE.Mesh(cerebellumGeometry, cerebellumMaterial);
        cerebellum.position.set(0, -1.2, -1.2);
        cerebellum.scale.set(1.2, 0.8, 0.9);
        brainGroup.add(cerebellum);
        
        // Add brain stem
        const stemGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({
          color: 0xD6C6C6,
          transparent: true,
          opacity: 0.9
        });
        
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(0, -2, -0.8);
        stem.rotation.set(Math.PI / 4, 0, 0);
        brainGroup.add(stem);
        
        return brainGroup;
      };
      
      const brain = createBrainModel();
      scene.add(brain);
      
      // Add activation points based on brainData
      if (brainData.voxel_data && brainData.voxel_data.voxels) {
        // Create a group for all activation points
        const activationGroup = new THREE.Group();
        scene.add(activationGroup);
        
        // Create a particle system for smaller activation points
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = [];
        const particleColors = [];
        const particleSizes = [];
        
        // Create larger activation points for significant activations
        const significantPoints = [];
        const pointGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        
        brainData.voxel_data.voxels.forEach(voxel => {
          // Normalize coordinates to fit within brain
          const x = (voxel.x / 50) - 1;
          const y = (voxel.y / 50) - 1;
          const z = (voxel.z / 50) - 1;
          
          // Color based on activation value
          const hue = 0.7 - voxel.value * 0.7; // Blue to red
          const color = new THREE.Color().setHSL(hue, 1, 0.5);
          
          if (voxel.value > 0.6) {
            // Create mesh for significant activations
            const pointMaterial = new THREE.MeshPhongMaterial({
              color: color,
              transparent: true,
              opacity: Math.min(0.9, voxel.value),
              emissive: color,
              emissiveIntensity: 0.5,
              shininess: 80
            });
            
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(x, y, z);
            point.scale.set(voxel.value, voxel.value, voxel.value);
            activationGroup.add(point);
            significantPoints.push(point);
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: color,
              transparent: true,
              opacity: 0.3,
              side: THREE.BackSide
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(point.position);
            glow.scale.set(1.5, 1.5, 1.5);
            activationGroup.add(glow);
            
            // Add pulsing animation
            gsap.to(point.scale, {
              x: voxel.value * 1.5,
              y: voxel.value * 1.5,
              z: voxel.value * 1.5,
              duration: 1 + Math.random() * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
            
            gsap.to(glow.scale, {
              x: 1.8,
              y: 1.8,
              z: 1.8,
              duration: 1.5 + Math.random() * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          } else {
            // Add to particle system for smaller activations
            particlePositions.push(x, y, z);
            particleColors.push(color.r, color.g, color.b);
            particleSizes.push(voxel.value * 5);
          }
        });
        
        // Create particle system for smaller activations
        if (particlePositions.length > 0) {
          particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
          particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
          particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
          
          const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
          });
          
          const particles = new THREE.Points(particleGeometry, particleMaterial);
          activationGroup.add(particles);
        }
        
        // Add subtle rotation to the activation group
        gsap.to(activationGroup.rotation, {
          y: Math.PI * 2,
          duration: 120,
          repeat: -1,
          ease: "none"
        });
      }
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate brain slowly
        if (brain) {
          brain.rotation.y += 0.002;
        }
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Handle window resize
      const handleResize = () => {
        if (canvasRef.current && cameraRef.current && rendererRef.current) {
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        
        if (rendererRef.current && rendererRef.current.domElement && canvasRef.current) {
          canvasRef.current.removeChild(rendererRef.current.domElement);
        }
        
        if (sceneRef.current) {
          while(sceneRef.current.children.length > 0) { 
            sceneRef.current.remove(sceneRef.current.children[0]); 
          }
        }
      };
    }
  }, [viewMode, brainData]);
  
  // Update view data when brainData or viewMode changes
  useEffect(() => {
    if (!brainData) return;
    
    // Check if we have brain_views data (new API format)
    if (brainData.brain_views && brainData.brain_views[viewMode]) {
      setViewData(brainData.brain_views[viewMode]);
      
      // Reset slice position when changing view mode
      if (brainData.brain_views[viewMode].slices) {
        setSliceCount(brainData.brain_views[viewMode].slices.length - 1);
        setCurrentSlice(Math.floor(brainData.brain_views[viewMode].slices.length / 2));
      }
    } else {
      // Fallback to old format or if the requested view is not available
      setViewData(brainData);
      
      // Reset slice position when changing view mode
      if (brainData.slices) {
        setSliceCount(brainData.slices.length - 1);
        setCurrentSlice(Math.floor(brainData.slices.length / 2));
      }
    }
  }, [brainData, viewMode]);
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleSliceChange = (e) => {
    setCurrentSlice(parseInt(e.target.value));
  };
  
  const handleRegionClick = (region) => {
    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };
  
  const renderSliceView = () => {
    if (!viewData || !viewData.slices || viewData.slices.length === 0) {
      return (
        <Flex direction="column" justify="center" align="center" padding="var(--spacing-xl)" textAlign="center">
          <H3 gutterBottom>No slice data available</H3>
          <Text muted>Try another view mode or upload a different music file</Text>
        </Flex>
      );
    }
    
    const slice = viewData.slices[currentSlice];
    
    return (
      <div className="slice-view">
        <img 
          src={slice.image} 
          alt={`Brain ${viewMode} slice ${currentSlice}`}
          className="slice-image"
        />
        {slice.overlay && (
          <img 
            src={slice.overlay} 
            alt={`Activation overlay`}
            className="overlay-image"
          />
        )}
      </div>
    );
  };
  
  const render3DView = () => {
    return <div ref={canvasRef} className="brain-canvas"></div>;
  };
  
  if (isLoading) {
    return (
      <VisualizationContainer>
        <Card.Header>
          <Card.Title>Brain Visualization</Card.Title>
        </Card.Header>
        <Card.Content padding="0">
          <VisualizationView>
            <Flex direction="column" justify="center" align="center" fullWidth fullHeight>
              <Loader.Spinner size="60px" text="Generating brain visualization..." />
            </Flex>
          </VisualizationView>
        </Card.Content>
      </VisualizationContainer>
    );
  }
  
  if (!brainData) {
    return (
      <VisualizationContainer>
        <Card.Header>
          <Card.Title>Brain Visualization</Card.Title>
        </Card.Header>
        <Card.Content padding="0">
          <VisualizationView>
            <Flex direction="column" justify="center" align="center" padding="var(--spacing-xl)" textAlign="center">
              <H3 gutterBottom>No brain data available</H3>
              <Text muted>Upload and analyze music to see brain activation patterns</Text>
            </Flex>
          </VisualizationView>
        </Card.Content>
      </VisualizationContainer>
    );
  }
  
  return (
    <VisualizationContainer>
      <Card.Header>
        <Card.Title>Brain Visualization</Card.Title>
      </Card.Header>
      
      <Card.Content padding="var(--spacing-md)">
        <ControlPanel justify="space-between" align="center">
          <SliceControls align="center">
            <SliceLabel>Slice:</SliceLabel>
            <SliceSlider 
              type="range" 
              min="0" 
              max={sliceCount} 
              value={currentSlice}
              onChange={handleSliceChange}
            />
            <SliceNumber>{currentSlice + 1}</SliceNumber>
          </SliceControls>
        </ControlPanel>
        
        <VisualizationView>
          {renderSliceView()}
          
          {showInfo && (
            <InfoOverlay variant="elevated">
              <Card.Header>
                <Card.Title>Brain Activation</Card.Title>
                <Button 
                  variant="icon" 
                  onClick={() => setShowInfo(false)}
                  aria-label="Close"
                >
                  ×
                </Button>
              </Card.Header>
              <Card.Content>
                <Text size="sm" muted gutterBottom>
                  This visualization shows how different brain regions might activate in response to the 
                  emotional content of your music. Brighter areas indicate stronger activation.
                </Text>
                <Text size="sm" muted>
                  Use the slice slider to navigate through different brain slices.
                </Text>
              </Card.Content>
            </InfoOverlay>
          )}
        </VisualizationView>
      </Card.Content>
    </VisualizationContainer>
  );
};

export default BrainVisualization;
