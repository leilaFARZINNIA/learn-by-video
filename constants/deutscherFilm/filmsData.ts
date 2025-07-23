// Typ für jeden Film-Eintrag
export interface Film {
  id: number;
  title: string;
  url: string;
}

// Liste der Filme (mit deutschen Kommentaren und echten Trailer-Links)
export const films: Film[] = [
  // 1. Deutscher Kultfilm
  { id: 1, title: 'Lola rennt', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  // 2. Deutsche Tragikomödie
  { id: 2, title: 'Good Bye Lenin!', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  // 3. Deutsches Filmdrama
  { id: 3, title: 'Das Leben der Anderen', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  // 4. Historischer Film
  { id: 4, title: 'Der Untergang', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  // 5. Tragikomödie
  { id: 5, title: 'Oh Boy', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  // 6. Komödie/Drama
  { id: 6, title: 'Toni Erdmann', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  // 7. Psychothriller
  { id: 7, title: 'Who Am I', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  // 8. Romanze
  { id: 8, title: 'Barbara', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  // 9. Deutsche Komödie
  { id: 9, title: 'Fack ju Göhte', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  // 10. Kriegsfilm
  { id: 10, title: 'Das Boot', url: 'https://www.youtube.com/watch?v=0TgKTLqQZ0w' },
  // 11. Drama
  { id: 11, title: 'Sophie Scholl – Die letzten Tage', url: 'https://www.youtube.com/watch?v=H7sLz6QpDYY' },
  // 12. Drama
  { id: 12, title: 'Die Welle', url: 'https://www.youtube.com/watch?v=Ic5vxw3eijY' },
  // 13. Familienfilm
  { id: 13, title: 'Heidi', url: 'https://www.youtube.com/watch?v=E3qD7Wyd2dM' },
  // 14. Komödie
  { id: 14, title: 'Männerherzen', url: 'https://www.youtube.com/watch?v=djt6s9tXyp4' },
  // 15. Roadmovie/Drama
  { id: 15, title: 'Im Juli', url: 'https://www.youtube.com/watch?v=0-2GhYcFt48' },
  // 16. Liebesfilm
  { id: 16, title: 'Keinohrhasen', url: 'https://www.youtube.com/watch?v=l8IfH9QZXhk' },
  // 17. Komödie/Drama
  { id: 17, title: 'Soul Kitchen', url: 'https://www.youtube.com/watch?v=k0Q9j5jGxlY' },
  // 18. Animationsfilm
  { id: 18, title: 'Lauras Stern', url: 'https://www.youtube.com/watch?v=F3mn0TcFsus' },
  // 19. Drama
  { id: 19, title: 'Victoria', url: 'https://www.youtube.com/watch?v=JsaWbQJU2W0' },
  // 20. Coming-of-Age-Drama
  { id: 20, title: 'Crazy', url: 'https://www.youtube.com/watch?v=r7rvWjO_fKs' },
];

// Navigationsfunktion für Filmklick
// Übergib sie direkt im onPress-Handler (React Navigation/Expo Router)
import { Router } from 'expo-router';

export function handleFilmClick(router: Router, film: Film) {
  router.push({
    pathname: ('/video-player'),
    params: {
      title: film.title,
      url: film.url,
    },
  });
}
