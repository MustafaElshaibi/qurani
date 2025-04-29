
import { nextTrack, setCurrentTime, setDuration, setPlaybackPositions } from "../rtk/Reducers/PlayerReducer";



class AudioService {
  
  constructor() {
    this.audio = new Audio();
    this.store = null;
    this.currentSurah = null;
    this.preloadAudio = new Audio();
    this.retryCount = 0;
    this.MAX_RETRIES = 2;
    this.playPromise = null;
    
    this.audio.ontimeupdate = () => {
      this.store.dispatch(setCurrentTime(this.audio.currentTime));
    };
    
    this.audio.onloadedmetadata = () => {
      this.store.dispatch(setDuration(this.audio.duration));
      this.preloadNextTrack();

        // Set initial position from storage
        const savedPosition = this.store.getState().player.playbackPositions[this.currentSurah?.id] || 0;
        this.audio.currentTime = savedPosition;
    };
    
    this.audio.onended = () => {
      this.saveCurrentPosition(true); // Reset position on end
        this.store.dispatch(nextTrack());
      
    };


  
    this.audio.onerror = (error) => {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        this.audio.load();
      } else {
        this.saveCurrentPosition(false);
        this.store.dispatch(nextTrack());
        this.retryCount = 0;
      }
    };
  }

  initialize(store) {
    if (!store) throw new Error("Store is required");
    this.store = store;
  }

  saveCurrentPosition(ended) {
    if (this.currentSurah) {
      const position = ended ? 0 : this.audio.currentTime;
      this.store.dispatch(setPlaybackPositions({
        surahId: this.currentSurah?.id,
        position: position
      }));
    }
  }

  play(track) {
    // Save previous track position
    if (this.currentSurah && Math.floor(this.audio.currentTime) !== Math.floor(this.audio.duration)) {
      this.saveCurrentPosition(false);
    }

    
    // Set new track and load
    this.currentSurah = track;
    this.audio.src = track.url;
    

    // Check for saved position
    const savedPosition = this.store.getState().player.playbackPositions[track.id] || 0;
    
    // Load metadata first to ensure duration is available
    this.audio.load();
    
    // Set initial time after metadata loaded
    this.audio.currentTime = savedPosition == this.audio.duration ?  0 : savedPosition;
    
    this.audio.play().catch(error => {
      console.error('Playback failed:', error);
    });
  }

  pause() {
    if(Math.floor(this.audio.currentTime) === Math.floor(this.audio.duration)) return;
    this.audio.pause();
    this.saveCurrentPosition(false);
  }



  seekTo(time) {
    this.audio.currentTime = time;
    this.saveCurrentPosition(false);
  }

  setVolume(volume) {
    this.audio.volume = volume;
    
  }

 
  preloadNextTrack() {
    const state = this.store.getState().player;
    const nextTrack = state.queue[0];
    
    if (nextTrack && nextTrack.id !== this.currentSurah?.id) {
      this.preloadAudio.src = nextTrack.url;
      this.preloadAudio.load();
    }
  }
}

export default new AudioService();

