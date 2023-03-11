import React, { useEffect, useState } from "react";
import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "../components/icons.component";
import { validEmail } from "../lib";
import { register } from "../api/user";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export function Register() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    credentials.email && !validEmail(credentials.email)
      ? setIsEmailValid(false)
      : setIsEmailValid(true);
  }, [credentials]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await register(credentials);

      window.localStorage.setItem("token", result?.token);
      if (result?.user) {
        alert("Sign up successful");
        return navigate("/login");
      }
    } catch (error: any) {
      alert(error?.response?.data.message);
    }
  };

  return (
    <div className="min-h-screen py-10 px-3 bg-no-repeat bg-right">
      <div className="flex flex-col items-center gap-7 py-5">
        <div className="form-container bg-white border w-full border-zinc-300 rounded-md px-4 py-6 max-w-lg min-w-[290px]">
          <h2 className="text-2xl font-semibold mb-1">Login</h2>
          <hr />
          <form onSubmit={signUp} className="py-2 mt-2">
            <div
              className="inp border-2 border-zinc-300
               rounded p-2 flex w-full gap-1 items-center my-4"
            >
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="border-none outline-none grow bg-inherit"
                onChange={handleChange}
              />
            </div>
            <div
              className={`inp border-2 ${
                isEmailValid ? "border-zinc-300" : "border-red-500"
              } rounded p-2 flex w-full gap-1 items-center my-4`}
            >
              <input
                type="text"
                placeholder="Email"
                name="email"
                className="border-none outline-none grow bg-inherit"
                onChange={handleChange}
              />
              <div className="info">
                {credentials.email &&
                  (!isEmailValid ? (
                    <span>
                      <InformationCircleIcon
                        height={20}
                        width={20}
                        className="text-red-500"
                      />
                    </span>
                  ) : (
                    <span>
                      <CheckIcon
                        height={20}
                        width={20}
                        className="text-blue-1"
                      />
                    </span>
                  ))}
              </div>
            </div>
            <div
              className="inp border-2 border-zinc-300
               rounded p-2 flex w-full gap-1 items-center my-4"
            >
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                className="border-none outline-none grow bg-inherit"
                onChange={handleChange}
              />
            </div>
            <div
              className={`inp border-2 border-zinc-300 rounded p-2 flex w-full gap-1 items-center my-4`}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="border-none outline-none grow bg-inherit"
                onChange={handleChange}
              />
              <div className="info">
                {credentials.password && (
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon
                        height={20}
                        width={20}
                        className="text-zinc-300"
                      />
                    ) : (
                      <EyeIcon
                        height={20}
                        width={20}
                        className="text-zinc-300"
                      />
                    )}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!validEmail(credentials.email)}
              className="inline-block w-full py-3 px-2 rounded text-white bg-[blue] disabled:opacity-[0.7]"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-zinc-400 text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
