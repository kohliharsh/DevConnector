import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { name, email, password, password2 } = formData;
  function handleChange(event) {
    const { name, value } = event.target;
    return setFormData((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  }

  const submit = async (event) => {
    event.preventDefault();

    const newUser = {
      email,
      password,
    };
    try {
      const res = await axios.post("/api/users/login", newUser);
      console.log(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign in</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into your account
      </p>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange}
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
