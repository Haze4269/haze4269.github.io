export interface Song {
  id: string;
  title: string;
  artist: string;
  file: string; // Path relative to public folder
}

export const songs: Song[] = [
  {
    id: "1",
    title: "Morning Again",
    artist: "Juice WRLD",
    file: "/Juice WRLD - Morning Again.mp3",
  },
  // Add more songs here easily:
  // {
  //   id: "2",
  //   title: "Song Title",
  //   artist: "Artist Name",
  //   file: "/path/to/song.mp3",
  // },
];

