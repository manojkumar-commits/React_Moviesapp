import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CircularProgress, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import useNavigation from './Hooks/useNavigation';

const MoviesDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [favorites, setFavorites] = useState([]); // State to store favorite movies
    const { goToPage } = useNavigation();



    useEffect(() => {
        const checkTokenExpiry = () => {
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            if (!tokenExpiry || Date.now() > tokenExpiry) {
                // Token expired or not present, redirect to login
                toast.error("Session expired, please log in again.");
                goToPage('/'); // Navigate to login page
            }
        };

        checkTokenExpiry();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        toast.success("Logged out successfully!");
        goToPage('/');
    };





    useEffect(() => {
        // Load favorite movies from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);

        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://www.omdbapi.com/', {
                    params: {
                        s: search || 'movie',
                        page,
                        genre,
                        apikey: 'ec82f094',
                    },
                });
                if (response.data.Search) {
                    setMovies((prevMovies) => [...prevMovies, ...response.data.Search]);
                    setHasMore(response.data.totalResults > page * 5); // Change the total to 5 per page
                } else {
                    setMovies([]);
                    setHasMore(false);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies', error);
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page, search, genre]);

    const handleLoadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setMovies([]);
        setPage(1);
        setHasMore(true);
    };

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
        setMovies([]);
        setPage(1);
        setHasMore(true);
    };

    const handleMovieClick = async (movieId) => {
        try {
            const response = await axios.get('https://www.omdbapi.com/', {
                params: {
                    i: movieId,
                    apikey: 'ec82f094',
                },
            });
            setSelectedMovie(response.data);
            setDialogOpen(true);
        } catch (error) {
            console.error('Error fetching movie details', error);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedMovie(null);
    };

    const handleFavoriteToggle = (movie) => {
        const updatedFavorites = [...favorites];
        const index = updatedFavorites.findIndex((fav) => fav.imdbID === movie.imdbID);
        if (index === -1) {
            updatedFavorites.push(movie); // Add to favorites
        } else {
            updatedFavorites.splice(index, 1); // Remove from favorites
        }

        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
    };

    return (
        <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
            {/* Search field and genre filter */}
            <Box sx={{ width: '30%' }}>
                <h2>Movie Search</h2>
                <TextField
                    label="Search for a movie"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px' }}
                />
                <FormControl fullWidth style={{ marginBottom: '20px' }}>
                    <InputLabel>Genre</InputLabel>
                    <Select
                        value={genre}
                        onChange={handleGenreChange}
                        label="Genre"
                    >
                        <MenuItem value="">All Genres</MenuItem>
                        <MenuItem value="Action">Action</MenuItem>
                        <MenuItem value="Comedy">Comedy</MenuItem>
                        <MenuItem value="Drama">Drama</MenuItem>
                        <MenuItem value="Horror">Horror</MenuItem>
                        <MenuItem value="Romance">Romance</MenuItem>
                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                        <MenuItem value="Thriller">Thriller</MenuItem>
                    </Select>
                </FormControl>

            </Box>

            {/* Movies grid */}
            <Box sx={{ width: '65%' }}>
                <Link to="/" style={{ float: 'right' }}  >
                    <Tooltip title="Logout">
                        <IconButton>
                            <LogoutIcon color='error' onClick={handleLogout} />
                        </IconButton>
                    </Tooltip>

                </Link>
                <Link to="/favorites" style={{ float: 'right' }}  >
                    <Tooltip title="Favorite Movies">
                        <IconButton>
                            <FavoriteIcon color='success' />
                        </IconButton>
                    </Tooltip>

                </Link>

                <Grid container spacing={2}>
                    {movies.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.imdbID}>
                            <Card onClick={() => handleMovieClick(movie.imdbID)} style={{ cursor: 'pointer' }}>
                                <img
                                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=No+Image'}
                                    alt={movie.Title}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{movie.Title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Release Date: {movie.Year}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Type: {movie.Type}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Rating: {movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'}
                                    </Typography>
                                    {/* Favorite Button */}
                                    <Button
                                        variant="outlined"
                                        color={favorites.some((fav) => fav.imdbID === movie.imdbID) ? 'secondary' : 'primary'}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering movie click
                                            handleFavoriteToggle(movie);
                                        }}
                                    >
                                        {favorites.some((fav) => fav.imdbID === movie.imdbID) ? 'Unfavorite' : 'Favorite'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Loading Indicator */}
                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </div>
                )}

                {/* Load More Button */}
                {!loading && hasMore && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={handleLoadMore}>
                            Load More
                        </Button>
                    </div>
                )}

                {/* No Results */}
                {!loading && !hasMore && search && movies.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Typography variant="h6" color="textSecondary">
                            No movies found for "{search}".
                        </Typography>
                    </div>
                )}
            </Box>

            {/* Movie Details Dialog */}
            {selectedMovie && (
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialogContent-root': {
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        },
                    }}
                >
                    <DialogTitle>{selectedMovie.Title}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img
                                src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/500x750?text=No+Image'}
                                alt={selectedMovie.Title}
                                style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}
                            />
                            <Typography variant="h6">Release Date: {selectedMovie.Released}</Typography>
                            <Typography variant="body1" sx={{ marginTop: '20px' }}>
                                {selectedMovie.Plot}
                            </Typography>

                            <Typography variant="h6" sx={{ marginTop: '20px' }}>Cast & Crew:</Typography>
                            <Typography variant="body2">{selectedMovie.Actors}</Typography>
                            <Typography variant="body2">{selectedMovie.Director}</Typography>

                            {selectedMovie.Trailer && (
                                <Box sx={{ marginTop: '20px' }}>
                                    <Button variant="contained" color="primary" onClick={() => window.open(selectedMovie.Trailer)}>
                                        Watch Trailer
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default MoviesDashboard;
