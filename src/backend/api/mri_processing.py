import os
import json
import numpy as np
import nibabel as nib
from nilearn import datasets, image, plotting
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import requests
from api.brain_mapping import get_emotion_colors

# Path to store downloaded MRI data
MRI_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'mri')

# Ensure MRI data directory exists
os.makedirs(MRI_DATA_DIR, exist_ok=True)

def download_sample_mri_data():
    """
    Download sample MRI data if not already present
    """
    # Check if we already have the data
    if os.path.exists(os.path.join(MRI_DATA_DIR, 'mni_icbm152_t1_tal_nlin_sym_09a.nii.gz')):
        return os.path.join(MRI_DATA_DIR, 'mni_icbm152_t1_tal_nlin_sym_09a.nii.gz')
    
    # Download MNI template
    print("Downloading MNI template...")
    mni_template = datasets.fetch_icbm152_2009(data_dir=MRI_DATA_DIR)
    return mni_template['t1']

def get_mri_slices(slice_type='axial', num_slices=10):
    """
    Get MRI slices for visualization
    
    Parameters:
    -----------
    slice_type : str
        Type of slice ('axial', 'coronal', or 'sagittal')
    num_slices : int
        Number of slices to return
        
    Returns:
    --------
    dict
        Dictionary containing MRI slice data
    """
    # Ensure we have MRI data
    mri_path = download_sample_mri_data()
    
    # Load MRI data
    mri_img = nib.load(mri_path)
    mri_data = mri_img.get_fdata()
    
    # Get dimensions
    nx, ny, nz = mri_data.shape
    
    # Determine slice indices based on slice type
    if slice_type == 'axial':
        # Axial slices (top to bottom)
        slice_indices = np.linspace(0.3 * nz, 0.8 * nz, num_slices).astype(int)
        slices = [mri_data[:, :, i] for i in slice_indices]
        orientation = 'axial'
    elif slice_type == 'coronal':
        # Coronal slices (front to back)
        slice_indices = np.linspace(0.2 * ny, 0.8 * ny, num_slices).astype(int)
        slices = [mri_data[:, i, :] for i in slice_indices]
        orientation = 'coronal'
    elif slice_type == 'sagittal':
        # Sagittal slices (left to right)
        slice_indices = np.linspace(0.3 * nx, 0.7 * nx, num_slices).astype(int)
        slices = [mri_data[i, :, :] for i in slice_indices]
        orientation = 'sagittal'
    else:
        raise ValueError(f"Invalid slice type: {slice_type}")
    
    # Convert slices to base64 encoded PNGs for web display
    slice_images = []
    for i, slice_data in enumerate(slices):
        # Normalize slice data to 0-255 range
        normalized_slice = ((slice_data - slice_data.min()) / 
                           (slice_data.max() - slice_data.min()) * 255).astype(np.uint8)
        
        # Create matplotlib figure
        fig, ax = plt.subplots(figsize=(5, 5))
        ax.imshow(normalized_slice.T, cmap='gray')
        ax.axis('off')
        
        # Save figure to BytesIO object
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        buf.seek(0)
        
        # Encode as base64
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        
        slice_images.append({
            'index': i,
            'position': int(slice_indices[i]),
            'image': f"data:image/png;base64,{img_str}"
        })
    
    return {
        'orientation': orientation,
        'num_slices': num_slices,
        'dimensions': [nx, ny, nz],
        'slices': slice_images
    }

def overlay_activation(mri_data, activation_map):
    """
    Overlay activation patterns on MRI slices
    
    Parameters:
    -----------
    mri_data : dict
        Dictionary containing MRI slice data
    activation_map : dict
        Dictionary containing activation patterns
        
    Returns:
    --------
    dict
        Dictionary containing MRI slices with activation overlays
    """
    # Get emotion colors for the overlay
    emotion_colors = get_emotion_colors()
    
    # Create a copy of the MRI data
    overlay_data = mri_data.copy()
    
    # Get voxel data from activation map
    voxel_data = activation_map['voxel_data']
    
    # Create a 3D grid of activation values
    grid_size = voxel_data['dimensions'][0]
    activation_grid = np.zeros(voxel_data['dimensions'])
    
    for voxel in voxel_data['voxels']:
        x, y, z = voxel['x'], voxel['y'], voxel['z']
        activation_grid[x, y, z] = voxel['value']
    
    # Get MRI dimensions
    nx, ny, nz = mri_data['dimensions']
    
    # For each slice, create an overlay
    for slice_info in overlay_data['slices']:
        slice_index = slice_info['index']
        slice_position = slice_info['position']
        
        # Get the original slice image
        img_data = slice_info['image']
        
        # Create a new overlay based on the orientation
        if overlay_data['orientation'] == 'axial':
            # Map activation grid to MRI space
            z_pos = slice_position
            z_grid = int((z_pos / nz) * grid_size)
            
            # Create overlay
            overlay = create_overlay(activation_grid[:, :, z_grid], emotion_colors)
            
        elif overlay_data['orientation'] == 'coronal':
            # Map activation grid to MRI space
            y_pos = slice_position
            y_grid = int((y_pos / ny) * grid_size)
            
            # Create overlay
            overlay = create_overlay(activation_grid[:, y_grid, :], emotion_colors)
            
        elif overlay_data['orientation'] == 'sagittal':
            # Map activation grid to MRI space
            x_pos = slice_position
            x_grid = int((x_pos / nx) * grid_size)
            
            # Create overlay
            overlay = create_overlay(activation_grid[x_grid, :, :], emotion_colors)
        
        # Add overlay to slice info
        slice_info['overlay'] = overlay
        
        # Add regions information to the slice
        # In a real application, this would be based on actual brain atlas data
        # For now, we'll add a simplified version based on the activation map
        regions = []
        for region_name, activation in activation_map['regions'].items():
            if activation > 0.3:  # Only include regions with significant activation
                # Get region info from brain_regions.json
                region_info_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                              'data', 'brain_regions.json')
                with open(region_info_path, 'r') as f:
                    brain_regions = json.load(f)
                
                if region_name in brain_regions:
                    region_info = brain_regions[region_name].copy()
                    region_info['activation'] = float(activation)
                    regions.append(region_info)
        
        slice_info['regions'] = regions
    
    return overlay_data

def create_overlay(activation_slice, emotion_colors):
    """
    Create an overlay image for a slice
    
    Parameters:
    -----------
    activation_slice : numpy.ndarray
        2D array of activation values
    emotion_colors : dict
        Dictionary mapping emotions to colors
        
    Returns:
    --------
    str
        Base64 encoded PNG image
    """
    # Transpose to match MRI orientation
    activation_slice = activation_slice.T
    
    # Create RGBA array for overlay
    # Alpha channel will be based on activation value
    overlay = np.zeros((*activation_slice.shape, 4), dtype=np.uint8)
    
    # Set colors based on activation values
    # This is a simplified approach - in a real application, 
    # we would use a more sophisticated color mapping
    
    # Use a mix of emotion colors weighted by their activation values
    # For simplicity, we'll use a fixed color scheme here
    overlay[..., 0] = 255  # Red channel
    overlay[..., 1] = 0    # Green channel
    overlay[..., 2] = 255  # Blue channel
    
    # Set alpha channel based on activation value
    # Scale to 0-255 range with a minimum threshold
    alpha = (activation_slice * 255).astype(np.uint8)
    alpha[alpha < 50] = 0  # Threshold to remove low activations
    overlay[..., 3] = alpha
    
    # Create matplotlib figure
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.imshow(overlay)
    ax.axis('off')
    
    # Save figure to BytesIO object
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    
    # Encode as base64
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    
    return f"data:image/png;base64,{img_str}"

def get_brain_region_info():
    """
    Get information about brain regions
    
    Returns:
    --------
    dict
        Dictionary containing brain region information
    """
    # Path to brain region info JSON
    brain_regions_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                     'data', 'brain_regions.json')
    
    # Check if file exists
    if not os.path.exists(brain_regions_path):
        # Create brain region info
        brain_regions = {
            'nucleus_accumbens': {
                'name': 'Nucleus Accumbens',
                'description': 'Part of the reward circuit, associated with pleasure, motivation, and emotional responses to music.',
                'functions': ['Reward processing', 'Pleasure response', 'Addiction mechanisms'],
                'music_relation': 'Activates during pleasurable music listening, especially during musical chills or frisson.'
            },
            'amygdala': {
                'name': 'Amygdala',
                'description': 'Almond-shaped structure involved in emotional processing, particularly fear and other intense emotions.',
                'functions': ['Emotional processing', 'Fear conditioning', 'Emotional memory'],
                'music_relation': 'Responds to emotionally intense music, particularly sad or scary passages.'
            },
            'hippocampus': {
                'name': 'Hippocampus',
                'description': 'Seahorse-shaped structure crucial for memory formation and spatial navigation.',
                'functions': ['Memory formation', 'Spatial navigation', 'Contextual associations'],
                'music_relation': 'Involved in musical memory and recognition of familiar songs.'
            },
            'prefrontal_cortex': {
                'name': 'Prefrontal Cortex',
                'description': 'Forward-most part of the frontal lobe, involved in complex cognitive functions.',
                'functions': ['Executive function', 'Decision making', 'Emotional regulation'],
                'music_relation': 'Processes musical structure, anticipation, and complex musical patterns.'
            },
            # Add more regions as needed
        }
        
        # Save to file
        os.makedirs(os.path.dirname(brain_regions_path), exist_ok=True)
        with open(brain_regions_path, 'w') as f:
            json.dump(brain_regions, f, indent=2)
    
    # Load brain region info
    with open(brain_regions_path, 'r') as f:
        brain_regions = json.load(f)
    
    return brain_regions
