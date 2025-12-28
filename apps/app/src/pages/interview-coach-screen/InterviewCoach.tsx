import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  PageContainer,
  FormContainer,
  Title,
  FormGroup,
  Label,
  Select,
  RadioGroup,
  SubmitButton,
} from './InterviewCoach.styles';
import ModeOption, { type Mode } from '@components/ModeOption/ModeOption';
import RoleAutocomplete, { type Role } from '@components/RoleAutocomplete/RoleAutocomplete';
import MultiTechStackAutocomplete, { type TechStack } from '@components/MultiTechStackAutocomplete/MultiTechStackAutocomplete';
import { MODES, LEVELS, ROLES, TECH_STACKS, type Level, type LevelOption, type ModeConfig } from '@services/mockData';

interface FormData {
  role: Role | '';
  level: Level | '';
  techStack: TechStack[];
  mode: Mode | '';
}

const InterviewCoach: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    role: '',
    level: '',
    techStack: [],
    mode: '',
  });

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFormData((prev) => ({
      ...prev,
      level: e.target.value as Level,
    }));
  };

  const handleRoleChange = (role: Role): void => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleTechStackChange = (techStack: TechStack[]): void => {
    setFormData((prev) => ({
      ...prev,
      techStack,
    }));
  };

  const handleModeChange = (mode: Mode): void => {
    setFormData((prev) => ({
      ...prev,
      mode,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Handle form submission
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Interview Coach Setup</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup $delay={0.2} $zIndex={1001}>
            <Label htmlFor="role">Select Role</Label>
            <RoleAutocomplete
              value={formData.role}
              onChange={handleRoleChange}
              options={ROLES}
              required
            />
          </FormGroup>

          <FormGroup $delay={0.3}>
            <Label htmlFor="level">Level</Label>
            <Select
              id="level"
              value={formData.level}
              onChange={handleLevelChange}
              required
            >
              <option value="">Choose a level...</option>
              {LEVELS.map((level: LevelOption) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup $delay={0.35} $zIndex={1000}>
            <Label htmlFor="techStack">Tech Stack</Label>
            <MultiTechStackAutocomplete
              value={formData.techStack}
              onChange={handleTechStackChange}
              options={TECH_STACKS}
              required
            />
          </FormGroup>

          <FormGroup $delay={0.4} $zIndex={999}>
            <Label>Mode</Label>
            <RadioGroup>
              {MODES.map((modeConfig: ModeConfig, index: number) => (
                <ModeOption
                  key={modeConfig.mode}
                  mode={modeConfig.mode}
                  label={modeConfig.label}
                  description={modeConfig.description}
                  color={modeConfig.color}
                  isSelected={formData.mode === modeConfig.mode}
                  onChange={() => handleModeChange(modeConfig.mode)}
                  required={index === 0}
                />
              ))}
            </RadioGroup>
          </FormGroup>

          <SubmitButton type="submit">Start Interview</SubmitButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default InterviewCoach;
