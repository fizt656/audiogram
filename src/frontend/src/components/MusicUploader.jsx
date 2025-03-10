import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Card from './common/Card';
import Button from './common/Button';
import { H3, Text, Caption } from './common/Typography';
import Loader from './common/Loader';
import Flex from './layout/Flex';

const UploaderCard = styled(Card)`
  width: 100%;
  min-width: 300px;
`;

const DropZone = styled.div`
  border: 1px dashed ${props => props.isDragActive ? 'var(--color-accent-primary)' : 'var(--color-accent-tertiary)'};
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
  transition: all var(--transition-normal);
  background-color: ${props => props.isDragActive ? 'rgba(13, 12, 12, 0.05)' : 'transparent'};
  cursor: pointer;
  margin-bottom: var(--spacing-md);
  min-height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover {
    border-color: var(--color-accent-primary);
    background-color: rgba(13, 12, 12, 0.05);
  }
`;

// Audio and loading messages are now handled by App component

const FileInput = styled.input`
  display: none;
`;

const MusicIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-circle);
  background-color: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  color: var(--color-accent-primary);
  font-size: 24px;
`;

const SelectedFile = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-circle);
  background-color: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
`;

const FileName = styled(Text)`
  font-weight: var(--font-weight-medium);
  margin: 0;
`;

const FileSize = styled(Caption)`
  margin: 0;
`;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Loading messages moved to App.jsx

const MusicUploader = ({ onAnalysisStart, onAnalysisComplete, onError, setAudioUrl, isLoading, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // We don't need local loading state anymore as it's passed as a prop and managed by App.jsx
  
  // Create object URL for audio playback when file is selected
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url); // Pass the URL to the parent component
      return () => URL.revokeObjectURL(url);
    }
  }, [file, setAudioUrl]);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isAudioFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      onError('Please upload an audio file (MP3, WAV, etc.)');
    }
  };
  
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isAudioFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      onError('Please upload an audio file (MP3, WAV, etc.)');
    }
  };
  
  const isAudioFile = (file) => {
    return file.type.startsWith('audio/') || 
           file.name.endsWith('.mp3') || 
           file.name.endsWith('.wav') ||
           file.name.endsWith('.ogg') ||
           file.name.endsWith('.flac');
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleAnalyzeClick = async () => {
    if (!file) return;
    
    // Start loading state - audio playback is now handled by App.jsx
    setIsLoading(true);
    onAnalysisStart(); // This will trigger audio playback in App.jsx
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('Sending request to /api/analyze');
      
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Received response:', response.data);
      setIsLoading(false);
      onAnalysisComplete(response.data);
    } catch (error) {
      setIsLoading(false);
      onError(error.response?.data?.error || 'An error occurred during analysis');
    }
  };
  
  return (
    <UploaderCard>
      <Card.Header>
        <Card.Title>Upload Music</Card.Title>
      </Card.Header>
      
      <Card.Content>
        <DropZone
          isDragActive={isDragActive}
          onClick={() => fileInputRef.current.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <MusicIcon>♪</MusicIcon>
          <Text gutterBottom>
            Drag & drop your music file here or click to browse
          </Text>
          <Caption muted>
            Supported formats: MP3, WAV, OGG, FLAC
          </Caption>
          
          <FileInput
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleFileInputChange}
          />
        </DropZone>
        
        {file && (
          <>
            <SelectedFile variant="flat">
              <FileInfo>
                <FileIcon>♪</FileIcon>
                <div>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                </div>
              </FileInfo>
              <Button 
                variant="icon" 
                onClick={handleRemoveFile}
                aria-label="Remove file"
              >
                ✕
              </Button>
            </SelectedFile>
            
            {/* Audio element moved to App.jsx */}
          </>
        )}
        
        {/* Loading UI moved to App.jsx */}
      </Card.Content>
      
      <Card.Footer>
        <Button 
          variant="primary"
          size="large"
          fullWidth
          onClick={handleAnalyzeClick}
          disabled={!file || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Music'}
        </Button>
      </Card.Footer>
    </UploaderCard>
  );
};

export default MusicUploader;
