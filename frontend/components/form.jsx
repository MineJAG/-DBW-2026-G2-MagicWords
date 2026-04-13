import { signInFormValidation } from "../hooks/signInValidation";
import { signUpFormValidation } from "../hooks/signUpValidation";

export function SigninForm() {
  const {
    setUsername,
    setEmail,
    setPassword,
    setPasswordVerification,
    errors,
    handleSubmit,
  } = signInFormValidation();

  return (
    <div className="form-container">
      <h4>Sign In</h4>
      <form action="/" method="post" className="row g-3" onSubmit={handleSubmit}>
        <p>Insert your username.</p>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. klaud23"
        />
        <div className="error">{errors.username}</div>

        <p>Insert your email.</p>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
        <div className="error">{errors.email}</div>

        <p>Insert your password.</p>
        <span>Must be 6–12 characters and include at least one number.</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="error">{errors.password}</div>

        <p>Confirm password.</p>
        <input
          type="password"
          onChange={(e) => setPasswordVerification(e.target.value)}
          placeholder="Password Confirmation"
        />
        <div className="error">
          {errors.passwordVerification}
        </div>

        <input type="submit" value="Sign In" />
      </form>
    </div>
  );
}

export function LoginForm() {
  const {
    setUsernameOrEmail,
    setPassword,
    errors,
    handleSubmit,
  } = signUpFormValidation();
  return (
    <div className="form-container">
      <h4>Sign Up</h4>
      <form
        action="/"
        method="post"
        className="row g-3"
        onSubmit={handleSubmit}
      >
        <p>Insert your username or email.</p>
        <input
          type="text"
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="Username or Email"
        />
        <div className="error">
          {errors.usernameOrEmail}
        </div>
        <p>Insert your password.</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="error">
          {errors.password}
        </div>
        <input type="submit" value="Sign Up" />
      </form>
    </div>
  );
}