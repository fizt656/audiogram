import librosa
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os
import json

# Define emotion categories and their associated musical features
EMOTION_FEATURES = {
    'happy': {
        'tempo': 'fast',
        'mode': 'major',
        'energy': 'high',
        'valence': 'high'
    },
    'sad': {
        'tempo': 'slow',
        'mode': 'minor',
        'energy': 'low',
        'valence': 'low'
    },
    'calm': {
        'tempo': 'slow',
        'mode': 'major',
        'energy': 'low',
        'valence': 'medium'
    },
    'energetic': {
        'tempo': 'fast',
        'mode': 'major',
        'energy': 'high',
        'valence': 'medium'
    },
    'tense': {
        'tempo': 'medium',
        'mode': 'minor',
        'energy': 'medium',
        'valence': 'low'
    }
}

def analyze_music_emotion(audio_path):
    """
    Analyze music file and extract emotional characteristics
    
    Parameters:
    -----------
    audio_path : str
        Path to the audio file
        
    Returns:
    --------
    dict
        Dictionary containing emotion scores and musical features
    """
    # Load audio file
    y, sr = librosa.load(audio_path, sr=22050)
    
    # Extract musical features
    # Tempo (BPM)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # Spectral features
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr).mean()
    
    # Harmonic features
    harmonic = librosa.effects.harmonic(y)
    chroma = librosa.feature.chroma_cqt(y=harmonic, sr=sr).mean(axis=1)
    
    # MFCC features
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = mfcc.mean(axis=1)
    
    # Energy
    energy = np.sum(y**2) / len(y)
    
    # Estimate key and mode (major/minor)
    key = np.argmax(chroma)
    mode_feature = estimate_mode(y, sr)
    mode = "major" if mode_feature > 0.5 else "minor"
    
    # Map features to emotion scores
    emotion_scores = calculate_emotion_scores(tempo, mode, energy, spectral_centroid)
    
    # Create segments for time-based emotion analysis
    segments = create_time_segments(y, sr)
    
    return {
        'overall_emotions': emotion_scores,
        'segments': segments,
        'features': {
            'tempo': float(tempo),
            'mode': mode,
            'energy': float(energy),
            'spectral_centroid': float(spectral_centroid),
            'key': int(key)
        }
    }

def estimate_mode(y, sr):
    """
    Estimate if the music is in major or minor mode
    Returns value between 0 (minor) and 1 (major)
    """
    # This is a simplified approach - in a real application, 
    # we would use more sophisticated harmonic analysis
    harmonic = librosa.effects.harmonic(y)
    chroma = librosa.feature.chroma_cqt(y=harmonic, sr=sr)
    
    # Major and minor chord templates
    major_template = np.array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0])
    minor_template = np.array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0])
    
    # Rotate and correlate with templates
    major_corr = []
    minor_corr = []
    
    for i in range(12):
        rolled_chroma = np.roll(chroma.mean(axis=1), i)
        major_corr.append(np.corrcoef(rolled_chroma, major_template)[0, 1])
        minor_corr.append(np.corrcoef(rolled_chroma, minor_template)[0, 1])
    
    # Compare best major correlation with best minor correlation
    max_major_corr = max(major_corr)
    max_minor_corr = max(minor_corr)
    
    # Return value between 0 (minor) and 1 (major)
    if max_major_corr + max_minor_corr == 0:
        return 0.5  # Neutral if no correlation
    
    return max_major_corr / (max_major_corr + max_minor_corr)

def calculate_emotion_scores(tempo, mode, energy, spectral_centroid):
    """
    Calculate emotion scores based on extracted features
    """
    # Normalize features
    tempo_norm = min(tempo / 180.0, 1.0)  # Normalize tempo with 180 BPM as upper bound
    energy_norm = min(energy * 100, 1.0)  # Simple energy normalization
    brightness = min(spectral_centroid / 2000.0, 1.0)  # Spectral centroid normalization
    
    # Mode is already binary (major=1, minor=0)
    mode_value = 1.0 if mode == "major" else 0.0
    
    # Calculate emotion scores
    # These formulas are simplified and would be refined with actual music psychology research
    happy_score = 0.4 * tempo_norm + 0.3 * mode_value + 0.3 * energy_norm
    sad_score = 0.3 * (1 - tempo_norm) + 0.4 * (1 - mode_value) + 0.3 * (1 - energy_norm)
    calm_score = 0.4 * (1 - tempo_norm) + 0.2 * mode_value + 0.4 * (1 - energy_norm)
    energetic_score = 0.5 * tempo_norm + 0.1 * mode_value + 0.4 * energy_norm
    tense_score = 0.2 * tempo_norm + 0.5 * (1 - mode_value) + 0.3 * brightness
    
    # Normalize scores to sum to 1
    total = happy_score + sad_score + calm_score + energetic_score + tense_score
    
    return {
        'happy': float(happy_score / total),
        'sad': float(sad_score / total),
        'calm': float(calm_score / total),
        'energetic': float(energetic_score / total),
        'tense': float(tense_score / total)
    }

def create_time_segments(y, sr, segment_duration=3.0):
    """
    Create time-based segments for emotion analysis throughout the song
    """
    # Calculate number of segments
    total_duration = len(y) / sr
    num_segments = int(total_duration / segment_duration)
    
    segments = []
    
    for i in range(num_segments):
        start_sample = int(i * segment_duration * sr)
        end_sample = int((i + 1) * segment_duration * sr)
        
        # Get segment audio
        segment_y = y[start_sample:end_sample]
        
        # Extract features for this segment
        tempo, _ = librosa.beat.beat_track(y=segment_y, sr=sr)
        energy = np.sum(segment_y**2) / len(segment_y)
        spectral_centroid = librosa.feature.spectral_centroid(y=segment_y, sr=sr).mean()
        
        # Estimate mode for segment
        mode_feature = estimate_mode(segment_y, sr)
        mode = "major" if mode_feature > 0.5 else "minor"
        
        # Calculate emotion scores for segment
        emotion_scores = calculate_emotion_scores(tempo, mode, energy, spectral_centroid)
        
        segments.append({
            'start_time': i * segment_duration,
            'end_time': (i + 1) * segment_duration,
            'emotions': emotion_scores
        })
    
    return segments
