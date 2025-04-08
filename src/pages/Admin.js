import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

// Styled components
const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #61dafb;
`;

const ContentSection = styled.div`
  background-color: #1a1d24;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 15px;
  border-bottom: 1px solid #4a4a4a;
  padding-bottom: 10px;
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

const LoadingMessage = styled.div`
  color: #61dafb;
  margin: 40px 0;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 10px 0;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  margin: 10px 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #4a4a4a;
  }
  
  th {
    background-color: #2c3e50;
    color: #ffffff;
  }
  
  tr:hover {
    background-color: #2c3e50;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #4a4a4a;
  background-color: #282c34;
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #61dafb;
  }
`;

const VersionInfo = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #2c3e50;
  border-radius: 5px;
  color: #b3e0ff;
  font-size: 0.9rem;
`;

// Admin page component
const Admin = () => {
  const navigate = useNavigate();
  const { currentPlayer, loading } = useGame();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Example admin password (in a real app, this would be verified on the server)
  const ADMIN_PASSWORD = 'admin123';
  
  // Handle login
  const handleLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setError('');
      setSuccess('登入成功！');
    } else {
      setError('密碼錯誤，請重試');
      setSuccess('');
    }
  };
  
  // Handle going back to home
  const handleBack = () => {
    navigate('/');
  };
  
  // Show loading state
  if (loading) {
    return (
      <AdminContainer>
        <LoadingMessage>加載中...</LoadingMessage>
      </AdminContainer>
    );
  }
  
  // Login screen
  if (!isAuthorized) {
    return (
      <AdminContainer>
        <Header>
          <Title>管理員面板</Title>
          <BackButton onClick={handleBack}>返回首頁</BackButton>
        </Header>
        
        <ContentSection>
          <SectionTitle>登入</SectionTitle>
          <p>請輸入管理員密碼以繼續：</p>
          
          <Input
            type="password"
            placeholder="管理員密碼"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <Button onClick={handleLogin}>登入</Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ContentSection>
      </AdminContainer>
    );
  }
  
  // Admin dashboard
  return (
    <AdminContainer>
      <Header>
        <Title>管理員面板</Title>
        <BackButton onClick={handleBack}>返回首頁</BackButton>
      </Header>
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <ContentSection>
        <SectionTitle>系統狀態</SectionTitle>
        <p>Firebase 連接狀態: <span style={{ color: '#2ecc71' }}>正常</span></p>
        <p>活躍遊戲: 0</p>
        <p>註冊玩家: 1</p>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>遊戲列表</SectionTitle>
        <p>目前沒有活躍遊戲。</p>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>玩家列表</SectionTitle>
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>名稱</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentPlayer && (
                <tr>
                  <td>{currentPlayer.id.slice(0, 8)}...</td>
                  <td>{currentPlayer.name || '未命名'}</td>
                  <td>在線</td>
                  <td>
                    <Button>查看詳情</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </ContentSection>
      
      <VersionInfo>
        自走棋對戰 v2.0 | 最後更新：2025-04-08
      </VersionInfo>
    </AdminContainer>
  );
};

export default Admin;