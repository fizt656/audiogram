from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
import librosa
from api.music_analysis import analyze_music_emotion
from api.brain_mapping import map_emotion_to_brain
from api.mri_processing import get_mri_slices, overlay_activation

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Analyze uploaded music file and return emotion data with brain activation patterns
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save the uploaded file temporarily
    temp_path = os.path.join('temp', file.filename)
    os.makedirs('temp', exist_ok=True)
    file.save(temp_path)
    
    try:
        # Analyze music to extract emotions
        emotions = analyze_music_emotion(temp_path)
        
        # Map emotions to brain activation patterns
        activation_patterns = map_emotion_to_brain(emotions)
        
        # Get MRI slices with activation overlays for all view types
        view_types = ['axial', 'coronal', 'sagittal']
        brain_views = {}
        
        for view_type in view_types:
            mri_data = get_mri_slices(slice_type=view_type, num_slices=50)
            overlay_data = overlay_activation(mri_data, activation_patterns)
            brain_views[view_type] = overlay_data
        
        # Clean up temp file
        os.remove(temp_path)
        
        return jsonify({
            'emotions': emotions,
            'brain_data': brain_views[view_types[0]],  # For backward compatibility
            'brain_views': brain_views
        })
    
    except Exception as e:
        # Clean up temp file in case of error
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': str(e)}), 500

@app.route('/api/mri/slices', methods=['GET'])
def get_slices():
    """
    Get available MRI slices
    """
    try:
        slice_type = request.args.get('type', 'axial')
        mri_data = get_mri_slices(slice_type=slice_type, num_slices=50)
        return jsonify(mri_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/info/regions', methods=['GET'])
def get_region_info():
    """
    Get information about brain regions
    """
    try:
        region = request.args.get('region', None)
        # Load brain region information from JSON file
        # Use absolute path to find the file in the src/data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        with open(os.path.join(data_dir, 'brain_regions.json'), 'r') as f:
            regions_data = json.load(f)
        
        if region and region in regions_data:
            return jsonify(regions_data[region])
        return jsonify(regions_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
