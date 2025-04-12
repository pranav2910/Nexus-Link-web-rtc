// src/service/audioService.js
export const startAudioStream = async () => {
    try {
      // Request only the audio stream from the user's device
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return audioStream;
    } catch (error) {
      console.error("Error accessing audio stream", error);
      throw error;
    }
  };
  
  export const muteAudio = (stream) => {
    stream.getAudioTracks().forEach(track => (track.enabled = false));
  };
  
  export const unmuteAudio = (stream) => {
    stream.getAudioTracks().forEach(track => (track.enabled = true));
  };
  