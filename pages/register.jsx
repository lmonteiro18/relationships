import { set } from "mongoose";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "../styles/scss/register.module.scss";

export default function Register() {
  const router = useRouter();
  const [showErrors, setShowErrors] = useState("");
  const [success, setSuccess] = useState(false);

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

    const response = await fetch("/api/register", options);
    const result = await response.json();
    //console.log("Result", result);
    if (result.success !== undefined && result.success === true) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } else {
      setShowErrors(result.error !== undefined ? result.error : result.message);
    }
  }

  return (
    <main className={classes.main}>
      {success === false ? (
        <div className={classes.container}>
          <h1 className={classes.title}>Register</h1>
          <div className={classes.form_container}>
            {showErrors !== "" && (
              <div className={classes.errorList}>
                <ul>
                  <li>{showErrors}</li>
                </ul>
              </div>
            )}
            <form action="/api/register" method="POST" onSubmit={handleSubmit}>
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
                value="Register"
              />
            </form>
          </div>
        </div>
      ) : (
        <div className={`${classes.container} ${classes.center}`}>
          <h2>Register Successful</h2>
          <p>You are now being redirected to the login page</p>
        </div>
      )}
    </main>
  );
}
