import { useFormValidation } from "../hooks/formValidation";

import "../styles/form.css";

export function SigninForm() {
  const {
    setUsername,
    setEmail,
    setPassword,
    setPasswordVerification,
    handleSubmit,
  } = useFormValidation();
  return (
    <div className="form-container">
      <h4>Sign In</h4>
      <form
        action="/"
        method="post"
        className="row g-3"
        onSubmit={handleSubmit}
      >
        <p>Insert your username.</p>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. klaud23"
        />
        <div className="error"></div>
        <p>Insert your email.</p>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
        <div className="error"></div>
        <p>Insert your password.</p>
        <span>Must be 6–12 characters and include at least one number.</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="error"></div>
        <p>Confirm password.</p>
        <input
          type="password"
          onChange={(e) => setPasswordVerification(e.target.value)}
          placeholder="Password Confirmation"
        />
        <div className="error"></div>
        <input type="submit" value="Sign In" />
      </form>
    </div>
  );
}
