import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';
// import { v4 as uuidv4 } from 'uuid';

// Styled components for the UI
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #61dafb;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #b3e0ff;
`;

const FormContainer = styled.div`
  background-color: #1a1d24;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #b3e0ff;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #4a4a4a;
  background-color: #282c34;
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #61dafb;
    box-shadow: 0 0 0 2px rgba(97, 218, 251, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #61dafb;
  color: #282c34;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  
  &:hover {
    background-color: #4db8e5;
  }
  
  &:disabled {
    background-color: #4a4a4a;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #4a4a4a;
  }
  
  span {
    padding: 0 10px;
    color: #aaaaaa;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 10px;
  text-align: center;
`;

const FeatureList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 40px;
  width: 100%;
  max-width: 900px;
`;

const FeatureItem = styled.div`
  background-color: #1a1d24;
  padding: 20px;
  border-radius: 10px;
  width: 250px;
  margin: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const FeatureTitle = styled.h3`
  color: #61dafb;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: #b3e0ff;
  font-size: 0.9rem;
`;

const StatusMessage = styled.div`
  background-color: #2c3e50;
  color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .dot {
    height: 10px;
    width: 10px;
    background-color: ${props => props.isOnline ? '#2ecc71' : '#e74c3c'};
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { currentPlayer, updatePlayerName, authInitialized } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Load player name from context (if any)
  useEffect(() => {
    if (currentPlayer?.name) {
      setPlayerName(currentPlayer.name);
    }
  }, [currentPlayer]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Handle creating a new game
  const handleCreateGame = async () => {
    // Clear previous errors
    setError('');
    
    // Validate input
    if (!playerName.trim()) {
      setError('請輸入玩家名稱');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update player name in context and local storage
      updatePlayerName(playerName);
      
      // Navigate to character selection screen
      navigate('/select');
    } catch (error) {
      console.error('創建遊戲錯誤:', error);
      setError('創建遊戲失敗，請重試');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle joining an existing game
  const handleJoinGame = async () => {
    // Clear previous errors
    setError('');
    
    // Validate inputs
    if (!playerName.trim()) {
      setError('請輸入玩家名稱');
      return;
    }
    
    if (!gameId.trim()) {
      setError('請輸入遊戲ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update player name in context and local storage
      updatePlayerName(playerName);
      
      // Navigate to character selection with game ID
      navigate('/select', { state: { gameId } });
    } catch (error) {
      console.error('加入遊戲錯誤:', error);
      setError('加入遊戲失敗，請檢查遊戲ID並重試');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <HomeContainer>
      <Title>自走棋對戰</Title>
      <Subtitle>策略、技巧與運氣的完美結合</Subtitle>
      
      <FormContainer>
        <FormTitle>開始遊戲</FormTitle>
        
        <StatusMessage isOnline={isOnline}>
          <span className="dot"></span>
          {isOnline ? '已連接服務器' : '離線模式 - 部分功能可能不可用'}
        </StatusMessage>
        
        <InputGroup>
          <Label htmlFor="playerName">玩家名稱</Label>
          <Input
            id="playerName"
            type="text"
            placeholder="請輸入您的名稱"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={loading || !authInitialized}
          />
        </InputGroup>
        
        <Button 
          onClick={handleCreateGame} 
          disabled={loading || !playerName.trim() || !authInitialized}
        >
          {loading ? '處理中...' : '創建新遊戲'}
        </Button>
        
        <Divider><span>或者</span></Divider>
        
        <InputGroup>
          <Label htmlFor="gameId">遊戲ID</Label>
          <Input
            id="gameId"
            type="text"
            placeholder="輸入遊戲ID以加入遊戲"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            disabled={loading || !authInitialized}
          />
        </InputGroup>
        
        <Button 
          onClick={handleJoinGame} 
          disabled={loading || !playerName.trim() || !gameId.trim() || !authInitialized}
        >
          {loading ? '處理中...' : '加入遊戲'}
        </Button>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
      
      <FeatureList>
        <FeatureItem>
          <FeatureTitle>多樣角色</FeatureTitle>
          <FeatureDescription>
            選擇不同角色，發揮各自獨特能力和專屬卡牌
          </FeatureDescription>
        </FeatureItem>
        
        <FeatureItem>
          <FeatureTitle>策略卡牌</FeatureTitle>
          <FeatureDescription>
            合理安排移動和攻擊卡牌，規劃完美戰術
          </FeatureDescription>
        </FeatureItem>
        
        <FeatureItem>
          <FeatureTitle>實時對戰</FeatureTitle>
          <FeatureDescription>
            與好友進行即時連線對戰，體驗緊張刺激的戰鬥
          </FeatureDescription>
        </FeatureItem>
      </FeatureList>
    </HomeContainer>
  );
};

export default Home;