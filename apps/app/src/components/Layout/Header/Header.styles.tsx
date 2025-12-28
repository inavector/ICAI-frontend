import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
`;

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-wrap: wrap;
  }
`;

export const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-decoration: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    gap: 1rem;
  }
`;

export const NavLink = styled(Link)<{ $isActive: boolean }>`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(props) => (props.$isActive ? '#667eea' : '#6b7280')};
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${(props) => (props.$isActive ? '100%' : '0')};
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const AuthButton = styled(Link)<{ $variant: 'primary' | 'outline' }>`
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: ${(props) =>
    props.$variant === 'outline' ? '1.5px solid #e5e7eb' : 'none'};
  background: ${(props) =>
    props.$variant === 'primary'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'transparent'};
  color: ${(props) => (props.$variant === 'primary' ? '#ffffff' : '#374151')};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.$variant === 'primary'
        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    border-color: ${(props) =>
      props.$variant === 'outline' ? '#667eea' : 'transparent'};
    color: ${(props) => (props.$variant === 'outline' ? '#667eea' : '#ffffff')};
  }

  &:active {
    transform: translateY(0);
  }
`;
