import { useState, type FormEvent } from 'react';
import {
  LoginContainer,
  LoginCard,
  LoginTitle,
  LoginSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  LoginFooter,
  LoginLink,
} from './Login.styles';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    console.log('Login submitted:', formData);
    // TODO: Handle login
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Welcome Back</LoginTitle>
        <LoginSubtitle>Sign in to your account to continue</LoginSubtitle>
        <Form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          <SubmitButton type="submit">Sign In</SubmitButton>
        </Form>
        <LoginFooter>
          <span>Don't have an account?</span>
          <LoginLink to="/register">Create an account</LoginLink>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
