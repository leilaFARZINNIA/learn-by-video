import { Router } from 'expo-router';
import { Media } from '../types/media';

export function handleFilmClick(router: Router, media: Media) {
  router.push({
    pathname: '/video-player',
    params: {
      id: media.media_id
    },
  });
}
