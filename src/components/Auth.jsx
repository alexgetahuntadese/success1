import { useState } from "react";
import Parse from "../back4app";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(Parse.User.current());

  const signUp = async () => {
    const u = new Parse.User();
    u.set("username", username);
    u.set("password", password);
    u.set("email", email);

    try {
      await u.signUp();
      setMsg("Sign-up successful!");
      setUser(u);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const login = async () => {
    try {
      const u = await Parse.User.logIn(username, password);
      setMsg(`Welcome ${u.get("username")}!`);
      setUser(u);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const logout = async () => {
    await Parse.User.logOut();
    setUser(null);
    setMsg("Logged out.");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      {user ? (
        <div>
          <p>Logged in as: {user.get("username")}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={signUp}>Sign Up</button>
            <button onClick={login} style={{ marginLeft: 5 }}>
              Login
            </button>
          </div>
        </div>
      )}
      <p>{msg}</p>
    </div>
  );
}
