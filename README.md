# How to Update Your Site Content

## Quick Guide

Your site content is stored in simple text files. To update your site, just edit these files:

### Files to Edit

1. **`public/profile.json`** - Your "About Me" page (name, age, bio, likes)
2. **`public/games.json`** - Your favorite games list
3. **`public/movies.json`** - Your favorite movies list
4. **`public/songs.json`** - Your favorite songs list
5. **`public/music.json`** - Music player songs (the songs that play on your site)

### How to Edit

1. Click on the file you want to edit (like `public/profile.json`)
2. Click the pencil icon (Edit button) at the top right
3. Make your changes - just edit the text between the quotes
4. Scroll down and click "Commit changes"
5. Click the refresh button on your site to see the changes!

### Important Rules

- **Don't delete** the curly braces `{ }` or square brackets `[ ]`
- **Don't delete** the commas `,` between items
- **Keep quotes** around text: `"your text here"`
- If you mess up, just click "Cancel" and try again!

### Example

To change your name in `profile.json`, find this line:
```json
"name": "☠ Haze ☠",
```
Change it to:
```json
"name": "Your New Name",
```

That's it! Just save and refresh your site.

---

## Adding/Removing Music Player Songs

The music player uses MP3 files. Here's how to add or remove songs:

### Adding a Song

1. **Upload your MP3 file:**
   - Go to the `public` folder
   - Click "Add file" → "Upload files"
   - Upload your MP3 file (like `My Song.mp3`)

2. **Add the song to the list:**
   - Go to `public/music.json`
   - Click the pencil icon to edit
   - Find the `"songs"` section (look for the square brackets `[ ]`)
   - Copy one of the existing song entries and paste it after the last song
   - Change the `id`, `title`, `artist`, and `file` to match your new song

**Example:** If you uploaded `Cool Song.mp3` by Artist Name, add this inside the `songs` array:
```json
{
  "id": "2",
  "title": "Cool Song",
  "artist": "Artist Name",
  "file": "/Cool Song.mp3"
},
```

**Important:** 
- The `file` path must match your uploaded filename exactly (including spaces and capitalization)
- Use a different `id` number for each song
- Don't forget the comma `,` after the closing brace `}` (except for the last song)

### Removing a Song

1. Go to `public/music.json`
2. Find the song you want to remove
3. Delete the entire song block (from `{` to `},`)
4. Make sure there's still a comma after the previous song, or remove the comma if it's the last one
5. Save and commit

**Tip:** You can also delete the MP3 file from the `public` folder if you want to free up space, but it's not required.
