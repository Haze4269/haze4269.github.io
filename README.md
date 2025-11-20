# How to Update Your Site Content

## Quick Guide

Your site content is stored in simple text files. To update your site, just edit these files:

### Files to Edit

1. **`public/profile.json`** - Your "About Me" page (name, age, bio, likes, profile icon)
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

## Changing Your Profile Icon

The profile icon is displayed on your "About Me" page. Here's how to change it:

### Changing the Profile Icon

1. **Upload your image file:**
   - Go to the `public` folder
   - Click "Add file" → "Upload files"
   - Upload your image file (PNG, JPG, or other image formats work best)
   - Recommended size: 200x200 pixels or larger (square images work best)

2. **Update the profile.json file:**
   - Go to `public/profile.json`
   - Click the pencil icon to edit
   - Find the `"avatar"` line (it should look like `"avatar": "/avatar-hell.png"`)
   - Change the path to match your uploaded image filename

**Example:** If you uploaded `my-avatar.png`, change this line:
```json
"avatar": "/avatar-hell.png",
```
To:
```json
"avatar": "/my-avatar.png",
```

**Important:** 
- The path must start with `/` (forward slash)
- The filename must match your uploaded file exactly (including spaces and capitalization)
- Use square images for best results (they'll be cropped to a circle)

**Tip:** You can also use images that are already in your `public` folder. Just reference them by their filename with a `/` at the start.

---

## Changing Your Favicon

The favicon is the small icon that appears in browser tabs next to your site's title. Here's how to change it:

### Changing the Favicon

1. **Create or prepare your favicon:**
   - Create a square image (16x16, 32x32, or 64x64 pixels work best)
   - Save it as `.ico` format (or `.png` works too)
   - Common tools: Online favicon generators, image editors, or convert from PNG

2. **Upload your favicon file:**
   - Go to the `public` folder
   - Click "Add file" → "Upload files"
   - Upload your favicon file
   - **Important:** Name it `favicon.ico` (or update the link in `index.html` if using a different name)

3. **If using a different filename:**
   - Go to `index.html` in the root folder
   - Click the pencil icon to edit
   - Find the line that says `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`
   - Change `/favicon.ico` to match your filename (e.g., `/my-favicon.png`)

**Example:** If you uploaded `my-icon.ico`, the line should look like:
```html
<link rel="icon" type="image/x-icon" href="/my-icon.ico" />
```

**Important:** 
- The path must start with `/` (forward slash)
- The filename must match your uploaded file exactly
- For `.ico` files, use `type="image/x-icon"`
- For `.png` files, use `type="image/png"`
- You may need to hard refresh your browser (Ctrl+F5 or Cmd+Shift+R) to see the change

**Tip:** If you want to use a PNG file instead of ICO, you can! Just upload it and update the link tag in `index.html` to point to your PNG file and change the type to `image/png`.

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
