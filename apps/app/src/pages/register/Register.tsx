import { useState, type FormEvent } from 'react';
import {
  RegisterContainer,
  RegisterCard,
  RegisterTitle,
  RegisterSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  RegisterFooter,
  RegisterLink,
} from './Register.styles';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Register submitted:', formData);
    // TODO: Handle registration
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>Create Account</RegisterTitle>
        <RegisterSubtitle>Sign up to get started with Interview Coach</RegisterSubtitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </FormGroup>
          <SubmitButton type="submit">Create Account</SubmitButton>
        </Form>
        <RegisterFooter>
          <span>Already have an account?</span>
          <RegisterLink to="/login">Sign in</RegisterLink>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
