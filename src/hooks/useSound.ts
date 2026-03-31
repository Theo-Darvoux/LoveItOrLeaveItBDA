import { useRef, useCallback, useEffect } from 'react';
import { Howl } from 'howler';


export function useSound(enabled: boolean) {
  const soundsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    function createToneBlob(freq: number, duration: number, type: OscillatorType = 'sine'): Promise<string> {
      return new Promise((resolve) => {
        const offlineCtx = new OfflineAudioContext(1, 44100 * duration, 44100);
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, 0);
        gain.gain.exponentialRampToValueAtTime(0.01, duration);

        osc.connect(gain);
        gain.connect(offlineCtx.destination);
        osc.start();
        osc.stop(duration);

        offlineCtx.startRendering().then((buffer) => {
          const wav = audioBufferToWav(buffer);
          const blob = new Blob([wav], { type: 'audio/wav' });
          resolve(URL.createObjectURL(blob));
        });
      });
    }

    function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const format = 1;
      const bitDepth = 16;
      const dataLength = buffer.length * numChannels * (bitDepth / 8);
      const headerLength = 44;
      const totalLength = headerLength + dataLength;
      const arrayBuffer = new ArrayBuffer(totalLength);
      const view = new DataView(arrayBuffer);

      function writeString(offset: number, str: string) {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      }

      writeString(0, 'RIFF');
      view.setUint32(4, totalLength - 8, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
      view.setUint16(32, numChannels * (bitDepth / 8), true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, dataLength, true);

      const channelData = buffer.getChannelData(0);
      let offset = 44;
      for (let i = 0; i < buffer.length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }

      return arrayBuffer;
    }

    async function initSounds() {
      try {
        const [loveUrl, leaveUrl, unknownUrl, clapUrl, resultUrl] = await Promise.all([
          createToneBlob(880, 0.15, 'sine'),      // love
          createToneBlob(220, 0.2, 'sawtooth'),    // leave
          createToneBlob(440, 0.1, 'triangle'),    // unknown
          createToneBlob(1200, 0.08, 'square'),    // clap
          createToneBlob(660, 0.5, 'sine'),        // result
        ]);

        soundsRef.current = {
          love: new Howl({ src: [loveUrl], volume: 0.4 }),
          leave: new Howl({ src: [leaveUrl], volume: 0.3 }),
          unknown: new Howl({ src: [unknownUrl], volume: 0.3 }),
          clap: new Howl({ src: [clapUrl], volume: 0.5 }),
          result: new Howl({ src: [resultUrl], volume: 0.5 }),
        };
      } catch (error) {
        console.error('Failed to initialize sounds:', error);
      }
    }

    initSounds();

    return () => {
      Object.values(soundsRef.current).forEach((s) => s.unload());
    };
  }, []);

  const play = useCallback(
    (name: string) => {
      if (!enabled) return;
      soundsRef.current[name]?.play();
    },
    [enabled]
  );

  return { play };
}
