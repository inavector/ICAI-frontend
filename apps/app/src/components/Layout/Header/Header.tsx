import { useLocation } from 'react-router-dom';
import {
  HeaderContainer,
  HeaderContent,
  Logo,
  Nav,
  NavLink,
  NavActions,
  AuthButton,
} from './Header.styles';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/home">Interview Coach</Logo>
        <Nav>
          <NavLink to="/home" $isActive={isActive('/home')}>
            Home
          </NavLink>
          <NavLink to="/interview-coach" $isActive={isActive('/interview-coach')}>
            Interview Coach
          </NavLink>
        </Nav>
        <NavActions>
          <AuthButton to="/login" $variant="outline">
            Login
          </AuthButton>
          <AuthButton to="/register" $variant="primary">
            Register
          </AuthButton>
        </NavActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
