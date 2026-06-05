export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Sign in">
        <div className="login-form-wrap">
          <form className="login-form">
            <h1>Welcome back</h1>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="••••••••••"
                autoComplete="current-password"
              />
            </label>

            <label className="checkbox-field">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>

            <button type="submit" className="primary-button">
              Sign in
            </button>
          </form>
        </div>
      </section>

      <section className="brand-panel" aria-label="Ticktock introduction">
        <div className="brand-content">
          <p className="brand-name">ticktock</p>
          <p className="brand-copy">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </section>
    </main>
  );
}
