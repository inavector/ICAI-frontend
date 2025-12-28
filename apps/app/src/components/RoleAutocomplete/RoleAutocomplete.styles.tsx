import styled from 'styled-components';

export const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  box-sizing: border-box;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background-color: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const Option = styled.li<{ $isHighlighted: boolean }>`
  padding: 0.75rem;
  cursor: pointer;
  color:rgb(70, 70, 70);
  background-color: ${(props) => (props.$isHighlighted ? '#f5f5f5' : '#ffffff')};
  transition: background-color 0.2s ease;
  opacity: 1;

  &:hover {
    background-color: #f5f5f5;
    color:rgb(0, 0, 0);
  }

  &:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
`;
