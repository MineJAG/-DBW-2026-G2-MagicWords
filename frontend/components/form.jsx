import "../styles/form.css";

export function SigninForm() {
  return (
    <div className="form-container">
      <h4>Sign In</h4>
      <form action="/" method="post" className="row g-3 ">
        <p>Insert your username.</p>
        <input type="text" id="username" placeholder="e.g. klaud23" />
        <div className="error">*That username is already in use</div>
        <p>Insert your email.</p>
        <input type="email" id="email" placeholder="example@email.com" />
        <p>Insert your password.</p>
        <span>Must be 6–12 characters and include at least one number.</span>
        <input type="password" id="password" placeholder="Password" />
        <p>Confirm password.</p>
        <input type="password" id="passwordVerification" placeholder="Password Confirmation" />
        <input type="submit" id="submit" value="Sign In" />
      </form>
    </div>
  );
}
