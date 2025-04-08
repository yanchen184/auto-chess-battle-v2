import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #61dafb;
  margin-bottom: 20px;
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  margin-bottom: 30px;
`;

const CharacterCard = styled.div`
  background-color: ${props => props.selected ? '#2c3e50' : '#1a1d24'};
  border: 2px solid ${props => props.selected ? '#61dafb' : 'transparent'};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CharacterIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 2rem;
  color: #1a1d24;
`;

const CharacterName = styled.h3`
  color: #ffffff;
  margin-bottom: 10px;
`;

const CharacterDescription = styled.p`
  color: #b3e0ff;
  font-size: 0.9rem;
`;

const Button = styled.button`
  padding: 12px 30px;
  background-color: #61dafb;
  color: #282c34;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  
  &:hover {
    background-color: #4db8e5;
  }
  
  &:disabled {
    background-color: #4a4a4a;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const LoadingMessage = styled.div`
  color: #61dafb;
  margin: 40px 0;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
  text-align: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #61dafb;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Character selection page component
const CharacterSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlayer, selectCharacter, loading, error } = useGame();
  
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [pageError, setPageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get game ID from location state (if joining game)
  const gameId = location.state?.gameId;
  
  // Sample character data (in a real app, this would come from a database)
  const characters = [
    {
      id: 'warrior',
      name: '戰士',
      icon: '⚔️',
      description: '高生命值和防禦力，擅長近身戰鬥'
    },
    {
      id: 'mage',
      name: '法師',
      icon: '🔮',
      description: '強大的魔法攻擊，但生命值較低'
    },
    {
      id: 'archer',
      name: '弓箭手',
      icon: '🏹',
      description: '遠程攻擊，擅長迴避敵人'
    },
    {
      id: 'healer',
      name: '治療師',
      icon: '💚',
      description: '恢復能力，可以治愈自己和隊友'
    }
  ];
  
  // Load previously selected character (if any)
  useEffect(() => {
    if (currentPlayer?.character?.id) {
      setSelectedCharacterId(currentPlayer.character.id);
    }
  }, [currentPlayer]);
  
  // Handle character selection
  const handleSelectCharacter = (character) => {
    setSelectedCharacterId(character.id);
  };
  
  // Handle starting game
  const handleStartGame = async () => {
    if (!selectedCharacterId) {
      setPageError('請選擇一個角色');
      return;
    }
    
    setIsLoading(true);
    setPageError('');
    
    try {
      // Find selected character
      const character = characters.find(char => char.id === selectedCharacterId);
      
      if (!character) {
        throw new Error('角色不存在');
      }
      
      // Save character selection to game context
      selectCharacter(character);
      
      // Navigate to game page (with gameId if joining existing game)
      navigate('/game', { state: { gameId } });
    } catch (error) {
      console.error('開始遊戲錯誤:', error);
      setPageError('無法開始遊戲，請重試');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Go back to home page
  const handleBack = () => {
    navigate('/');
  };
  
  // Show loading state
  if (loading) {
    return (
      <Container>
        <LoadingMessage>加載中...</LoadingMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <BackButton onClick={handleBack}>← 返回首頁</BackButton>
      
      <Title>{gameId ? '加入遊戲' : '選擇角色'}</Title>
      
      {/* Display player info */}
      {currentPlayer?.name && (
        <p>玩家: {currentPlayer.name}</p>
      )}
      
      {/* Character grid */}
      <CharacterGrid>
        {characters.map(character => (
          <CharacterCard 
            key={character.id}
            onClick={() => handleSelectCharacter(character)}
            selected={selectedCharacterId === character.id}
          >
            <CharacterIcon>{character.icon}</CharacterIcon>
            <CharacterName>{character.name}</CharacterName>
            <CharacterDescription>{character.description}</CharacterDescription>
          </CharacterCard>
        ))}
      </CharacterGrid>
      
      {/* Error messages */}
      {(error || pageError) && (
        <ErrorMessage>
          {error || pageError}
        </ErrorMessage>
      )}
      
      {/* Start game button */}
      <Button 
        onClick={handleStartGame} 
        disabled={isLoading || !selectedCharacterId}
      >
        {isLoading ? '處理中...' : gameId ? '加入遊戲' : '開始遊戲'}
      </Button>
    </Container>
  );
};

export default CharacterSelect;