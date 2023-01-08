import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classes from "../styles/scss/home.module.scss";

export default function Homepage() {
  const router = useRouter();
  const [showErrors, setShowErrors] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [showErrors]);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch("/api/login", options);
    const result = await response.json();
    console.log("Result", result);
    if (result.success !== undefined && result.success === true) {
      setLoading(true);
      sessionStorage.setItem("user", result.user);
      router.push("/global");
    } else {
      setShowErrors(result.error !== undefined ? result.error : result.message);
    }
  }

  return (
    <main className={classes.main}>
      {loading === false ? (
        <div className={classes.container}>
          <h1 className={classes.title}>Login</h1>
          <div className={classes.form_container}>
            {showErrors !== "" && (
              <div className={classes.errorList}>
                <ul>
                  <li>{showErrors}</li>
                </ul>
              </div>
            )}
            <form action="/api/login" method="POST" onSubmit={handleSubmit}>
              <label htmlFor="username">
                Username
                <input id="username" type="text" name="username" required />
              </label>
              <label htmlFor="password">
                Password
                <input id="password" type="password" name="password" required />
              </label>
              <input
                id="submit"
                className={classes.submit_input}
                type="submit"
                name="submit"
                value="Login"
              />
            </form>
            <a href="/register">Don't have an account?</a>
          </div>
        </div>
      ) : (
        <div className={`${classes.container} ${classes.center}`}>
          <p>Loading Data...</p>
        </div>
      )}
    </main>
  );
}
