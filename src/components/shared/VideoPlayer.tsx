import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

type Props = {
  source: string;
  thumbnail: string;
};

export default function VideoPlayer({ source, thumbnail }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current!;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    }

    const player = new Plyr(video, {
      controls: [
        'play-large', // The large play button in the center
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        'fullscreen' // Toggle fullscreen
      ],
      seekTime: 15
    });
    player.play();

    return () => {
      player.destroy();
    };
  }, [source, thumbnail]);

  return <video ref={videoRef} poster={thumbnail} />;
}
