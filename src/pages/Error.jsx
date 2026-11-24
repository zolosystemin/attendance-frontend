import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const message =
    location.state?.message ||
    "Something went wrong. Please try again.";

  const status = location.state?.status || 500;

  return (
    <div style={styles.container}>
      <h1 style={styles.status}>{status}</h1>
      <h2 style={styles.title}>Oops!</h2>
      <p style={styles.message}>{message}</p>

      <button style={styles.button} onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    textAlign: "center",
    padding: "20px"
  },
  status: {
    fontSize: "72px",
    color: "#ef4444",
    margin: 0
  },
  title: {
    fontSize: "32px",
    margin: "10px 0"
  },
  message: {
    fontSize: "18px",
    color: "#555",
    maxWidth: "400px"
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  }
};

export default ErrorPage;
