# CineStream - Movie Discovery App

A modern, interactive movie discovery application built with React and Vite. Search for movies, discover trending titles, and save your favorites to a personalized watchlist.

## Features

✨ **Core Features**
- Search millions of movies using OMDB API
- Browse trending movies with smart pagination
- Save movies to your personal favorites list
- Mood Matcher - Find movies based on your mood
- Responsive design for all devices
- Infinite scroll for seamless browsing
- Local storage for persistent favorites

## Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite 8.0+
- **Routing:** React Router DOM 7.16+
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
│   │   ├── Header.jsx          
│   │   ├── SearchBar.jsx       
│   │   ├── MovieCard.jsx      
│   │   └── MoodMatcher.jsx     
│   ├── pages/
│   │   ├── Home.jsx            
│   │   └── Favorites.jsx       
│   ├── context/
│   │   └── FavoritesContext.jsx 
│   ├── hooks/
│   │   ├── useDebounce.js      
│   │   └── useInfiniteScroll.js 
│   ├── utils/
│   │   └── localStorage.js    
│   ├── api/
│   │   └── omdb.js             
│   ├── routes/
│   │   └── AppRoutes.jsx       
│   ├── App.jsx                 
│   ├── main.jsx               
│   └── index.css               
├── index.html                  
├── package.json                
├── vite.config.js              
└── README.md                  
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

## Future Enhancements

- Advanced filtering options
- Dark mode toggle
- Movie ratings and reviews
-  Trailer preview integration
-  Advanced search filters
-  Share favorites with friends
-  Pagination controls
-  Top rated movies section

