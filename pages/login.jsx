import classes from "../styles/scss/home.module.scss";

export default function Login() {
  return (
    <main className={classes.main}>
      <h1>Understanding Relationship Patterns</h1>
      <form action="/login" method="POST">
        <label htmlFor="username">
          Username
          <input id="username" type="text" name="username" required />
        </label>
        <label htmlFor="password">
          Password
          <input id="password" type="password" name="password" required />
        </label>
        <input id="submit" type="submit" name="submit" value="Login" />
      </form>
    </main>
  );
}
