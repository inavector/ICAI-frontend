import styled from 'styled-components';

export const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f5f5f5;
  background-image: radial-gradient(circle, #9e9e9e 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  color: #4a4a4a;
  margin-bottom: 2.5rem;
  text-align: center;
  line-height: 1.6;
  width: 80vw;
`;

export const StartButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #667eea;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
    background-color: #5568d3;
  }

  &:active {
    transform: translateY(0);
  }
`;
