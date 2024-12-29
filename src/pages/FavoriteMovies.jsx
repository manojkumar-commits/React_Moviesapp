import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useNavigation from './Hooks/useNavigation';

const FavoriteMovies = () => {
    const [favorites, setFavorites] = useState([]);
    const { goToPage } = useNavigation();

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);


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



    const handleRemoveFavorite = (movie) => {
        const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Favorite Movies</h2>
            {/* Back to Movies Dashboard Button */}
            <Link to="/dashboard" style={{ textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}>
                <Button variant="contained" color="primary">
                    Back to Movie Dashboard
                </Button>
            </Link>
            {favorites.length === 0 ? (
                <Typography variant="h6" color="textSecondary">You have no favorite movies.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {favorites.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.imdbID}>
                            <Card>
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
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemoveFavorite(movie)}
                                    >
                                        Remove from Favorites
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}


        </div>
    );
};

export default FavoriteMovies;
