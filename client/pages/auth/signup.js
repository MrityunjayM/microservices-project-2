import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

const SignUpView = () => {
  const [uInput, setUInput] = useState({ email: "", password: "" });
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: uInput,
    onSuccess: () => Router.push("/"),
  });

  const changeHandler = (e) => {
    setUInput((ps) => ({ ...ps, [e.target.name]: e.target.value }));
  };

  const submitHandler = (e) => {
    e.preventDefault(); // prevents default behaviour of form submission

    if (!uInput.email) {
      alert("Please enter your email");
      return;
    }
    if (!uInput.password) {
      alert("Please enter your password");
      return;
    }

    doRequest();
    setUInput({ email: "", password: "" });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <Head>
        <title>SignUp | Microservices | Project - 2</title>
      </Head>

      <div className="card">
        <div className="card-header">
          <span className="card-header-title">SignUp</span>
        </div>
        <div className="card-content">
          <form onSubmit={submitHandler}>
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="control">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  value={uInput.email}
                  placeholder="your email eg. john@gmail.com"
                  onChange={changeHandler}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="control">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input"
                  value={uInput.password}
                  placeholder="your password here"
                  onChange={changeHandler}
                />
              </div>
            </div>
            {/* Show errors */}
            {errors}

            <div className="field">
              <div className="control">
                <button className="button is-info is-fullwidth">SignUp</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;
