import { useEffect } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

export default function useGlightbox(youtubeId: string) {
  useEffect(() => {
    const player = GLightbox({
      source: 'youtube',
      href: `https://youtu.be/${youtubeId}`,
      autoplayVideos: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      cssEffects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' }
      },
      touchNavigation: true,
      closeOnOutsideClick: false,
      type: 'video',
      plyr: {
        config: {
          ratio: '16:9',
          muted: false,
          hideControls: true,
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3
          }
        }
      }
    });

    return () => {
      player.destroy();
    };
  }, [youtubeId]);
}
