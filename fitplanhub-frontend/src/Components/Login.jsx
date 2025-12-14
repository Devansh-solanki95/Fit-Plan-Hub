import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE 👉", data);

    if (data.status === true) {
      const token = data.data.token; 
      localStorage.setItem("jwtToken", token);

      const role = data.data.role;
      if (role === "USER") {
        navigate("/user-dashboard", { replace: true });
      } else if (role === "TRAINER") {
        navigate("/trainer-dashboard", { replace: true });
      }
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      padding: "16px"
    },
    form: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "400px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      textAlign: "center"
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "8px"
    },
    subtitle: {
      fontSize: "16px",
      color: "#6b7280",
      marginBottom: "24px"
    },
    input: {
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    inputFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)"
    },
    button: {
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#2563eb",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.2s"
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1 style={styles.title}>FIT PLAN HUB</h1>
        <p style={styles.subtitle}>Welcome back! Please login to your account</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { borderColor: "#d1d5db", boxShadow: "none" })}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
