import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

// Styled components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const GameInfo = styled.div`
  background-color: #1a1d24;
  padding: 15px;
  border-radius: 8px;
  color: #ffffff;
  margin-bottom: 20px;
  width: 100%;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1 / 1;
  background-color: #1a1d24;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const Cell = styled.div`
  background-color: ${props => (props.x + props.y) % 2 === 0 ? '#2c3e50' : '#34495e'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  
  &:hover {
    box-shadow: inset 0 0 0 2px #61dafb;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1a1d24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  width: 100%;
`;

const PlayerName = styled.h3`
  color: #61dafb;
  margin-bottom: 5px;
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CharacterIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 1.5rem;
  color: #1a1d24;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Card = styled.div`
  background-color: #34495e;
  padding: 10px;
  border-radius: 5px;
  width: 100px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #61dafb;
  color: #282c34;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #4db8e5;
  }
  
  &:disabled {
    background-color: #4a4a4a;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const EndTurnButton = styled(Button)`
  margin-top: 20px;
  background-color: #e74c3c;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const LoadingMessage = styled.div`
  color: #61dafb;
  margin: 40px 0;
  font-size: 1.2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #61dafb;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Game component
const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlayer, currentGame, loading, error } = useGame();
  
  // Get game ID from location state (if available)
  const gameId = location.state?.gameId;
  
  // If no character selected, redirect to character selection
  useEffect(() => {
    if (!loading && currentPlayer && !currentPlayer.character) {
      navigate('/select');
    }
  }, [currentPlayer, loading, navigate]);
  
  // Handle going back to home
  const handleBackToHome = () => {
    if (window.confirm('確定要離開遊戲嗎？您的進度將不會被保存。')) {
      navigate('/');
    }
  };
  
  // Show loading state
  if (loading || !currentPlayer?.character) {
    return (
      <GameContainer>
        <LoadingMessage>加載遊戲中...</LoadingMessage>
      </GameContainer>
    );
  }
  
  return (
    <GameContainer>
      <GameHeader>
        <h1>自走棋對戰</h1>
        <BackButton onClick={handleBackToHome}>離開遊戲</BackButton>
      </GameHeader>
      
      <GameInfo>
        <div>遊戲ID: {gameId || '新遊戲'}</div>
        <div>回合: 1</div>
      </GameInfo>
      
      {/* Player info */}
      <PlayerInfo>
        <PlayerName>{currentPlayer.name}</PlayerName>
        <CharacterInfo>
          <CharacterIcon>{currentPlayer.character.icon}</CharacterIcon>
          <div>{currentPlayer.character.name}</div>
        </CharacterInfo>
        
        {/* Player cards */}
        <h4>可用卡牌:</h4>
        <CardsContainer>
          <Card>移動</Card>
          <Card>攻擊</Card>
          <Card>防禦</Card>
        </CardsContainer>
      </PlayerInfo>
      
      {/* Game board */}
      <GameBoard>
        {Array(64).fill().map((_, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);
          return (
            <Cell key={index} x={x} y={y}>
              {/* If it's player position, show character icon */}
              {x === 0 && y === 0 ? currentPlayer.character.icon : ''}
            </Cell>
          );
        })}
      </GameBoard>
      
      <EndTurnButton>結束回合</EndTurnButton>
    </GameContainer>
  );
};

export default Game;