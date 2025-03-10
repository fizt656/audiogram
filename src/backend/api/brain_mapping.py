import numpy as np
import json
import os

# Define brain regions associated with different emotions
# This is a simplified mapping based on neuroscience research
# In a real application, this would be more nuanced and based on actual fMRI studies
EMOTION_BRAIN_MAPPING = {
    'happy': {
        'regions': [
            {'name': 'nucleus_accumbens', 'intensity': 0.8},
            {'name': 'ventral_tegmental_area', 'intensity': 0.7},
            {'name': 'orbitofrontal_cortex', 'intensity': 0.6},
            {'name': 'amygdala', 'intensity': 0.3}
        ],
        'color': [255, 215, 0]  # Gold color for happiness
    },
    'sad': {
        'regions': [
            {'name': 'amygdala', 'intensity': 0.7},
            {'name': 'hippocampus', 'intensity': 0.5},
            {'name': 'anterior_cingulate_cortex', 'intensity': 0.8},
            {'name': 'prefrontal_cortex', 'intensity': 0.6}
        ],
        'color': [0, 0, 139]  # Dark blue for sadness
    },
    'calm': {
        'regions': [
            {'name': 'prefrontal_cortex', 'intensity': 0.7},
            {'name': 'anterior_cingulate_cortex', 'intensity': 0.4},
            {'name': 'hippocampus', 'intensity': 0.3},
            {'name': 'insula', 'intensity': 0.2}
        ],
        'color': [0, 128, 128]  # Teal for calmness
    },
    'energetic': {
        'regions': [
            {'name': 'motor_cortex', 'intensity': 0.8},
            {'name': 'supplementary_motor_area', 'intensity': 0.7},
            {'name': 'basal_ganglia', 'intensity': 0.6},
            {'name': 'cerebellum', 'intensity': 0.7}
        ],
        'color': [255, 69, 0]  # Orange-red for energy
    },
    'tense': {
        'regions': [
            {'name': 'amygdala', 'intensity': 0.9},
            {'name': 'hypothalamus', 'intensity': 0.7},
            {'name': 'periaqueductal_gray', 'intensity': 0.6},
            {'name': 'anterior_insula', 'intensity': 0.7}
        ],
        'color': [128, 0, 128]  # Purple for tension
    }
}

# Brain region coordinates (simplified for demonstration)
# In a real application, these would be actual 3D coordinates from an atlas
BRAIN_REGION_COORDINATES = {
    'nucleus_accumbens': {'x': [10, -10], 'y': [12], 'z': [-8]},
    'ventral_tegmental_area': {'x': [0], 'y': [-16], 'z': [-12]},
    'orbitofrontal_cortex': {'x': [25, -25], 'y': [30], 'z': [-12]},
    'amygdala': {'x': [23, -23], 'y': [-5], 'z': [-15]},
    'hippocampus': {'x': [30, -30], 'y': [-20], 'z': [-10]},
    'anterior_cingulate_cortex': {'x': [0], 'y': [30], 'z': [20]},
    'prefrontal_cortex': {'x': [35, -35], 'y': [45], 'z': [25]},
    'insula': {'x': [40, -40], 'y': [5], 'z': [5]},
    'motor_cortex': {'x': [30, -30], 'y': [-15], 'z': [55]},
    'supplementary_motor_area': {'x': [5, -5], 'y': [0], 'z': [60]},
    'basal_ganglia': {'x': [15, -15], 'y': [5], 'z': [5]},
    'cerebellum': {'x': [25, -25], 'y': [-60], 'z': [-30]},
    'hypothalamus': {'x': [0], 'y': [-5], 'z': [-10]},
    'periaqueductal_gray': {'x': [0], 'y': [-30], 'z': [-10]},
    'anterior_insula': {'x': [35, -35], 'y': [15], 'z': [5]}
}

def map_emotion_to_brain(emotion_data):
    """
    Map emotion scores to brain activation patterns
    
    Parameters:
    -----------
    emotion_data : dict
        Dictionary containing emotion scores
        
    Returns:
    --------
    dict
        Dictionary containing brain activation patterns
    """
    # Get overall emotion scores
    emotion_scores = emotion_data['overall_emotions']
    
    # Initialize activation map
    activation_map = {
        'regions': {},
        'voxel_data': {},
        'time_series': []
    }
    
    # Calculate region activations based on emotion scores
    for region_name in BRAIN_REGION_COORDINATES.keys():
        activation_map['regions'][region_name] = 0
    
    # For each emotion, add its contribution to region activations
    for emotion, score in emotion_scores.items():
        if emotion in EMOTION_BRAIN_MAPPING:
            emotion_regions = EMOTION_BRAIN_MAPPING[emotion]['regions']
            for region in emotion_regions:
                region_name = region['name']
                intensity = region['intensity']
                # Add weighted contribution to region activation
                activation_map['regions'][region_name] += score * intensity
    
    # Normalize region activations to 0-1 range
    max_activation = max(activation_map['regions'].values())
    if max_activation > 0:
        for region in activation_map['regions']:
            activation_map['regions'][region] /= max_activation
    
    # Generate voxel-based activation data for visualization
    activation_map['voxel_data'] = generate_voxel_activations(activation_map['regions'])
    
    # Generate time series data from segments
    if 'segments' in emotion_data:
        activation_map['time_series'] = generate_time_series(emotion_data['segments'])
    
    return activation_map

def generate_voxel_activations(region_activations, grid_size=100):
    """
    Generate voxel-based activation data for visualization
    
    This creates a simplified 3D grid of activation values
    In a real application, this would map to actual MRI voxel coordinates
    """
    # Create empty 3D grid
    grid = np.zeros((grid_size, grid_size, grid_size))
    
    # For each active region, add activation to corresponding voxels
    for region_name, activation in region_activations.items():
        if activation > 0.1:  # Only include regions with significant activation
            coords = BRAIN_REGION_COORDINATES[region_name]
            
            # For each coordinate in the region
            for x in coords['x']:
                for y in coords['y']:
                    for z in coords['z']:
                        # Convert from anatomical coordinates to grid indices
                        grid_x = int((x + 50) * grid_size / 100)
                        grid_y = int((y + 50) * grid_size / 100)
                        grid_z = int((z + 50) * grid_size / 100)
                        
                        # Ensure coordinates are within grid bounds
                        if 0 <= grid_x < grid_size and 0 <= grid_y < grid_size and 0 <= grid_z < grid_size:
                            # Create a small sphere of activation around the coordinate
                            radius = int(5 * activation)
                            for dx in range(-radius, radius+1):
                                for dy in range(-radius, radius+1):
                                    for dz in range(-radius, radius+1):
                                        # Calculate distance from center
                                        distance = np.sqrt(dx**2 + dy**2 + dz**2)
                                        if distance <= radius:
                                            # Calculate activation based on distance from center
                                            voxel_activation = activation * (1 - distance/radius)
                                            
                                            # Set voxel activation (with bounds checking)
                                            vx, vy, vz = grid_x+dx, grid_y+dy, grid_z+dz
                                            if 0 <= vx < grid_size and 0 <= vy < grid_size and 0 <= vz < grid_size:
                                                # Use maximum if multiple regions overlap
                                                grid[vx, vy, vz] = max(grid[vx, vy, vz], voxel_activation)
    
    # Convert to list format for JSON serialization
    # We'll use a sparse representation to reduce data size
    voxel_list = []
    for x in range(grid_size):
        for y in range(grid_size):
            for z in range(grid_size):
                if grid[x, y, z] > 0.1:  # Only include voxels with significant activation
                    voxel_list.append({
                        'x': x,
                        'y': y,
                        'z': z,
                        'value': float(grid[x, y, z])
                    })
    
    return {
        'dimensions': [grid_size, grid_size, grid_size],
        'voxels': voxel_list
    }

def generate_time_series(segments):
    """
    Generate time series data for brain regions based on emotion segments
    """
    time_series = []
    
    for segment in segments:
        segment_emotions = segment['emotions']
        segment_activations = {}
        
        # Initialize all regions to 0
        for region_name in BRAIN_REGION_COORDINATES.keys():
            segment_activations[region_name] = 0
        
        # For each emotion, add its contribution to region activations
        for emotion, score in segment_emotions.items():
            if emotion in EMOTION_BRAIN_MAPPING:
                emotion_regions = EMOTION_BRAIN_MAPPING[emotion]['regions']
                for region in emotion_regions:
                    region_name = region['name']
                    intensity = region['intensity']
                    # Add weighted contribution to region activation
                    segment_activations[region_name] += score * intensity
        
        # Normalize segment activations
        max_activation = max(segment_activations.values())
        if max_activation > 0:
            for region in segment_activations:
                segment_activations[region] /= max_activation
        
        time_series.append({
            'start_time': segment['start_time'],
            'end_time': segment['end_time'],
            'activations': segment_activations
        })
    
    return time_series

def get_emotion_colors():
    """
    Get color mappings for emotions
    """
    colors = {}
    for emotion, data in EMOTION_BRAIN_MAPPING.items():
        colors[emotion] = data['color']
    return colors
