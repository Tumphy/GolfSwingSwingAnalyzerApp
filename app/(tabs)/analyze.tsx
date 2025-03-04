import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, Camera, RefreshCw, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import Colors from '@/constants/Colors';

export default function AnalyzeScreen() {
  const [selectedView, setSelectedView] = useState('face-on');
  const [faceOnVideo, setFaceOnVideo] = useState(null);
  const [downLineVideo, setDownLineVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [handedness, setHandedness] = useState('right');

  const pickVideo = async (view) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        if (view === 'face-on') {
          setFaceOnVideo(result.assets[0].uri);
        } else {
          setDownLineVideo(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };

  const recordVideo = async (view) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Available', 'Video recording is not available on web. Please upload a video instead.');
        return;
      }
      
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted) {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
          videoMaxDuration: 10,
        });
        
        if (!result.canceled) {
          if (view === 'face-on') {
            setFaceOnVideo(result.assets[0].uri);
          } else {
            setDownLineVideo(result.assets[0].uri);
          }
        }
      } else {
        Alert.alert('Permission Required', 'Camera permission is required to record videos.');
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const analyzeSwing = () => {
    if (!faceOnVideo && !downLineVideo) {
      Alert.alert('Missing Videos', 'Please upload at least one swing video to analyze.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Analysis Complete', 
        'Your swing has been analyzed successfully! Check the Progress tab to see your results.',
        [{ text: 'OK' }]
      );
    }, 3000);
  };

  const resetVideos = () => {
    setFaceOnVideo(null);
    setDownLineVideo(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analyze Your Swing</Text>
          <Text style={styles.subtitle}>Upload videos from two angles for best results</Text>
        </View>
        
        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[
              styles.viewOption,
              selectedView === 'face-on' && styles.selectedViewOption
            ]}
            onPress={() => setSelectedView('face-on')}
          >
            <Text style={[
              styles.viewOptionText,
              selectedView === 'face-on' && styles.selectedViewOptionText
            ]}>Face-On View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.viewOption,
              selectedView === 'down-line' && styles.selectedViewOption
            ]}
            onPress={() => setSelectedView('down-line')}
          >
            <Text style={[
              styles.viewOptionText,
              selectedView === 'down-line' && styles.selectedViewOptionText
            ]}>Down-the-Line View</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoContainer}>
          {selectedView === 'face-on' ? (
            faceOnVideo ? (
              <View style={styles.videoPreviewContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' }}
                  style={styles.videoPreview}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                  style={styles.videoOverlay}
                >
                  <Text style={styles.videoLabel}>Face-On View</Text>
                </LinearGradient>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => setFaceOnVideo(null)}
                >
                  <RefreshCw size={16} color={Colors.white} />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Upload size={40} color={Colors.primary} />
                <Text style={styles.uploadText}>Upload Face-On View</Text>
                <Text style={styles.uploadSubtext}>Stand directly in front of the camera</Text>
                
                <View style={styles.uploadButtons}>
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => pickVideo('face-on')}
                  >
                    <Upload size={18} color={Colors.white} />
                    <Text style={styles.uploadButtonText}>Upload Video</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadButton, styles.recordButton]}
                    onPress={() => recordVideo('face-on')}
                  >
                    <Camera size={18} color={Colors.white} />
                    <Text style={styles.uploadButtonText}>Record Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : (
            downLineVideo ? (
              <View style={styles.videoPreviewContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' }}
                  style={styles.videoPreview}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                  style={styles.videoOverlay}
                >
                  <Text style={styles.videoLabel}>Down-the-Line View</Text>
                </LinearGradient>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => setDownLineVideo(null)}
                >
                  <RefreshCw size={16} color={Colors.white} />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Upload size={40} color={Colors.primary} />
                <Text style={styles.uploadText}>Upload Down-the-Line View</Text>
                <Text style={styles.uploadSubtext}>Stand behind or in front of the golfer</Text>
                
                <View style={styles.uploadButtons}>
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => pickVideo('down-line')}
                  >
                    <Upload size={18} color={Colors.white} />
                    <Text style={styles.uploadButtonText}>Upload Video</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadButton, styles.recordButton]}
                    onPress={() => recordVideo('down-line')}
                  >
                    <Camera size={18} color={Colors.white} />
                    <Text style={styles.uploadButtonText}>Record Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        </View>
        
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Handedness</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{handedness === 'right' ? 'Right-handed' : 'Left-handed'}</Text>
              <ChevronDown size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.uploadStatus}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Face-On View</Text>
            <Text style={[
              styles.statusValue, 
              faceOnVideo ? styles.statusComplete : styles.statusIncomplete
            ]}>
              {faceOnVideo ? 'Uploaded' : 'Not Uploaded'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Down-the-Line View</Text>
            <Text style={[
              styles.statusValue, 
              downLineVideo ? styles.statusComplete : styles.statusIncomplete
            ]}>
              {downLineVideo ? 'Uploaded' : 'Not Uploaded'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetVideos}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.analyzeButton,
              (!faceOnVideo && !downLineVideo) && styles.disabledButton,
              isUploading && styles.uploadingButton
            ]}
            onPress={analyzeSwing}
            disabled={(!faceOnVideo && !downLineVideo) || isUploading}
          >
            <Text style={styles.analyzeButtonText}>
              {isUploading ? 'Analyzing...' : 'Analyze Swing'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Tips for Better Analysis</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>Record in good lighting conditions</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>Ensure your full body is visible in the frame</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>Record at 60fps or higher if possible</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>4</Text>
            <Text style={styles.infoText}>Use a tripod for stable footage</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  viewSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedViewOption: {
    backgroundColor: Colors.white,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray,
  },
  selectedViewOptionText: {
    color: Colors.text,
  },
  videoContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginTop: 15,
    marginBottom: 5,
  },
  uploadSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  recordButton: {
    backgroundColor: Colors.secondary,
  },
  uploadButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  videoPreviewContainer: {
    flex: 1,
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  videoLabel: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  retakeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeButtonText: {
    color: Colors.white,
    marginLeft: 5,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  optionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    marginRight: 5,
  },
  uploadStatus: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statusComplete: {
    color: Colors.success,
  },
  statusIncomplete: {
    color: Colors.warning,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 30,
    marginRight: 10,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  analyzeButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  uploadingButton: {
    backgroundColor: Colors.secondary,
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightPrimary,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
  },
});