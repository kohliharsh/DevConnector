import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
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
    if (password !== password2) {
      console.log("password do not match");
    } else {
      const newUser = {
        name,
        email,
        password,
        password2,
      };
      try {
        const res = await axios.post("/api/users/register", newUser);
        console.log(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Name"
            name="name"
            value={name}
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className="form-group">
          <input
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
