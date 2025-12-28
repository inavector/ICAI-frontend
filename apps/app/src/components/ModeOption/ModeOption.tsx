import {
  ModeOptionContainer,
  HiddenRadio,
  ModeLabel,
  Tooltip,
} from './ModeOption.styles';

export type Mode = 'conversation' | 'drilldown' | 'case' | 'challenge' | 'retrospective';

interface ModeOptionProps {
  mode: Mode;
  label: string;
  description: string;
  color: string;
  isSelected: boolean;
  onChange: () => void;
  required?: boolean;
}

const ModeOption: React.FC<ModeOptionProps> = ({
  mode,
  label,
  description,
  color,
  isSelected,
  onChange,
  required = false,
}) => {
  return (
    <ModeOptionContainer
      $color={color}
      $isSelected={isSelected}
      onClick={onChange}
    >
      <HiddenRadio
        type="radio"
        name="mode"
        value={mode}
        checked={isSelected}
        onChange={onChange}
        required={required}
      />
      <ModeLabel>{label}</ModeLabel>
      <Tooltip>{description}</Tooltip>
    </ModeOptionContainer>
  );
};

export default ModeOption;
