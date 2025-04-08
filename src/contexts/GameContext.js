import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';

// Create context
const GameContext = createContext();

// Custom hook for using the game context
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Handle anonymous authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to retrieve user data from local storage
        const storedUser = localStorage.getItem('gameUser');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.id) {
              setCurrentPlayer(parsedUser);
            } else {
              // If stored user is invalid, create a new one
              throw new Error('Invalid stored user data');
            }
          } catch (parseError) {
            // Handle invalid JSON or invalid user data
            console.log('Creating new anonymous user');
            const userCredential = await signInAnonymously(auth);
            const newUser = {
              id: userCredential.user.uid,
              isAnonymous: true
            };
            setCurrentPlayer(newUser);
            localStorage.setItem('gameUser', JSON.stringify(newUser));
          }
        } else {
          // If no user in local storage, create an anonymous user
          console.log('No stored user, creating anonymous user');
          const userCredential = await signInAnonymously(auth);
          const newUser = {
            id: userCredential.user.uid,
            isAnonymous: true
          };
          setCurrentPlayer(newUser);
          localStorage.setItem('gameUser', JSON.stringify(newUser));
        }
        
        setAuthInitialized(true);
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please refresh the page and try again.');
        
        // Create fallback user for offline mode
        const fallbackUser = {
          id: 'offline-' + Date.now(),
          isAnonymous: true,
          isOffline: true
        };
        setCurrentPlayer(fallbackUser);
        localStorage.setItem('gameUser', JSON.stringify(fallbackUser));
        setAuthInitialized(true);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && currentPlayer && !currentPlayer.isOffline) {
        // User signed out
        console.log('User signed out');
        setCurrentPlayer(null);
        localStorage.removeItem('gameUser');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Update player name
  const updatePlayerName = (name) => {
    if (!currentPlayer) return;
    
    const updatedPlayer = {
      ...currentPlayer,
      name
    };
    
    setCurrentPlayer(updatedPlayer);
    localStorage.setItem('gameUser', JSON.stringify(updatedPlayer));
    
    return updatedPlayer;
  };
  
  // Handle character selection
  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    
    // If player object exists, update the player's character
    if (currentPlayer) {
      const updatedPlayer = {
        ...currentPlayer,
        character
      };
      
      setCurrentPlayer(updatedPlayer);
      localStorage.setItem('gameUser', JSON.stringify(updatedPlayer));
      
      return updatedPlayer;
    }
    
    return null;
  };
  
  // Reset game state
  const resetGame = () => {
    setCurrentGame(null);
    setSelectedCharacter(null);
  };
  
  // Provide context value
  const value = {
    currentGame,
    setCurrentGame,
    currentPlayer,
    setCurrentPlayer,
    selectedCharacter,
    setSelectedCharacter,
    loading,
    error,
    authInitialized,
    updatePlayerName,
    selectCharacter,
    resetGame
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};