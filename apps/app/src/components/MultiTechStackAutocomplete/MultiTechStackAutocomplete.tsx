import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  AutocompleteContainer,
  Input,
  OptionsList,
  Option,
  SelectedItemsContainer,
  SelectedItem,
  RemoveButton,
} from './MultiTechStackAutocomplete.styles';

export type TechStack = 'react' | 'vue' | 'angular' | 'node' | 'python' | 'java' | 'go' | 'rust';

export interface TechStackOption {
  value: TechStack;
  label: string;
}

interface MultiTechStackAutocompleteProps {
  value: TechStack[];
  onChange: (value: TechStack[]) => void;
  options: TechStackOption[];
  required?: boolean;
}

const MultiTechStackAutocomplete: React.FC<MultiTechStackAutocompleteProps> = ({
  value,
  onChange,
  options,
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTechStacks = options.filter(
    (tech) =>
      tech.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(tech.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = (): void => {
    setIsOpen(true);
  };

  const handleSelect = (tech: TechStackOption): void => {
    if (!value.includes(tech.value)) {
      onChange([...value, tech.value]);
    }
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (techToRemove: TechStack): void => {
    onChange(value.filter((tech) => tech !== techToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredTechStacks.length - 1 ? prev + 1 : prev
      );
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredTechStacks[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Backspace' && searchTerm === '' && value.length > 0) {
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <AutocompleteContainer ref={containerRef}>
      <Input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder="Search for tech stacks..."
        required={required && value.length === 0}
      />
      {isOpen && (
        <OptionsList>
          {filteredTechStacks.length > 0 ? (
            filteredTechStacks.map((tech, index) => (
              <Option
                key={tech.value}
                $isHighlighted={index === highlightedIndex}
                onClick={() => handleSelect(tech)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {tech.label}
              </Option>
            ))
          ) : (
            <Option $isHighlighted={false} style={{ cursor: 'default', color: '#999' }}>
              {value.length === options.length 
                ? 'All tech stacks selected' 
                : 'No options found'}
            </Option>
          )}
        </OptionsList>
      )}
      {value.length > 0 && (
        <SelectedItemsContainer>
          {value.map((techValue) => {
            const tech = options.find((t) => t.value === techValue);
            return (
              <SelectedItem key={techValue}>
                <span>{tech?.label || techValue}</span>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemove(techValue)}
                  aria-label={`Remove ${tech?.label || techValue}`}
                />
              </SelectedItem>
            );
          })}
        </SelectedItemsContainer>
      )}
    </AutocompleteContainer>
  );
};

export default MultiTechStackAutocomplete;
