import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div style={{ width: 400 }}>
        <LoginForm />
      </div>
    </div>
  );
};
