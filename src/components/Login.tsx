import { useEffect, useState } from "react";
import { login } from "../utils/apiUtils";
import { navigate } from "raviger";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Username: ", username);
    console.log("Password: ", password);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      navigate("/forms");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/forms");
      window.location.reload();
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <label>Password</label>
          <input
            className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button
          className="bg-zinc-100 p-2.5 m-2.5 rounded-2xl hover:bg-white focus:bg-white"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
