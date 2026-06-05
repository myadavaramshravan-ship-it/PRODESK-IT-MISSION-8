# CineStream - Movie Discovery App

A modern, interactive movie discovery application built with React and Vite. Search for movies, discover trending titles, and save your favorites to a personalized watchlist.

## Features

✨ **Core Features**
- 🎬 Search millions of movies using OMDB API
- 📈 Browse trending movies with smart pagination
- ❤️ Save movies to your personal favorites list
- 🎭 Mood Matcher - Find movies based on your mood
- 📱 Responsive design for all devices
- ⚡ Infinite scroll for seamless browsing
- 💾 Local storage for persistent favorites

## Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite 8.0+
- **Routing:** React Router DOM 7.16+
- **Styling:** Tailwind CSS 4.3+
- **API:** OMDB (Open Movie Database)
- **State Management:** React Context API
- **Storage:** Browser Local Storage

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cinestream.git
cd cinestream
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_OMDB_API_KEY=your_omdb_api_key_here
```

Get your free OMDB API key at: https://www.omdbapi.com/apikey.aspx

4. **Start the development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

### Search Movies
1. Type a movie title in the search bar
2. Press Enter or click the Search button
3. Browse results and scroll to load more

### Mood Matcher
1. Enter how you're feeling (e.g., "sad", "happy", "scary")
2. Click "Mood Match" button
3. Get genre-based recommendations

### Save Favorites
1. Click the heart icon on any movie card
2. View your collection in the Favorites page
3. Favorites are saved locally in your browser

### Trending Movies
- Homepage displays trending movies on load
- Movies are randomly selected from predefined search terms
- Infinite scroll loads more movies automatically

## Project Structure

```
cinestream/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── SearchBar.jsx       # Movie search input
│   │   ├── MovieCard.jsx       # Individual movie card
│   │   └── MoodMatcher.jsx     # Mood-based search
│   ├── pages/
│   │   ├── Home.jsx            # Main page with trending
│   │   └── Favorites.jsx       # Saved favorites page
│   ├── context/
│   │   └── FavoritesContext.jsx # Global favorites state
│   ├── hooks/
│   │   ├── useDebounce.js      # Debounce search input
│   │   └── useInfiniteScroll.js # Infinite scroll logic
│   ├── utils/
│   │   └── localStorage.js     # Local storage helpers
│   ├── api/
│   │   └── omdb.js             # OMDB API calls
│   ├── routes/
│   │   └── AppRoutes.jsx       # Route configuration
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How It Works

### Movie Search Flow
1. User types in search bar → Debounced after 500ms
2. Search query triggers API call to OMDB
3. Results displayed in movie grid
4. Scroll triggers pagination to load more results

### Favorites System
1. Click heart icon to add/remove from favorites
2. Favorites stored in browser's localStorage
3. Persists across browser sessions
4. FavoritesContext shares state across app

### Infinite Scroll
- Scroll event listener detects bottom of page
- Automatically loads next page of results
- Works for both search results and trending

## API Integration

### OMDB API Endpoints Used

**Search Movies**
```
GET https://www.omdbapi.com/?s={query}&page={page}&apikey={API_KEY}
```

**Get Movie Details**
```
GET https://www.omdbapi.com/?i={imdbID}&apikey={API_KEY}
```

## Component Details

### MovieCard
- Displays movie poster, title, year
- Heart button for adding to favorites
- Favorite status indication
- Lazy loading for images

### SearchBar
- Debounced input for performance
- Enter key or button submit
- Placeholder text hints at features

### MoodMatcher
- Simple keyword-based genre mapping
- Sad → Drama, Happy → Comedy, etc.
- Returns "avengers" as default

### Home Page
- Initial load shows trending movies
- Search updates view with results
- Infinite scroll pagination

### Favorites Page
- Shows all saved movies
- Empty state message
- Same MovieCard component

## Performance Optimizations

- 🚀 Debounced search input (500ms)
- 📸 Lazy loading for movie images
- 🔄 Efficient state updates with useCallback
- 📦 Code splitting with Vite
- 🎯 Intersection Observer for scroll detection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Movies not showing
- Check OMDB API key in `.env` file
- Verify API key is valid and active
- Check browser console for errors

### Favorites not persisting
- Ensure localStorage is enabled
- Check browser privacy settings
- Clear cache if issues persist

### Search not working
- Wait for debounce delay (500ms)
- Verify internet connection
- Check OMDB API status

## Future Enhancements

- 📱 Advanced filtering options
- 🌙 Dark mode toggle
- 📊 Movie ratings and reviews
- 🎥 Trailer preview integration
- 🔍 Advanced search filters
- 👥 Share favorites with friends
- 📑 Pagination controls
- 🏆 Top rated movies section

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Credits

- **Movie Data:** [OMDB (Open Movie Database)](https://www.omdbapi.com/)
- **Built with:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review component code for implementation details

---

**Happy streaming! 🎬**
