import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register }) => {
  let mt = "6rem";
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
      mt = "10000";
      setAlert("password do not match", "danger");
    } else {
      register({ name, email, password, password2 });
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary" style={{ marginTop: mt }}>
        Sign Up
      </h1>
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
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
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

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
