import { useEffect } from "react";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import "./css/Alert.css";

export default function AppAlert({
  type = "success",
  message,
  onClose,
  autoClose = true,
  duration = 2000
}) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const icons = {
    success: <CheckCircle />,
    error: <XCircle />,
    warning: <AlertTriangle />,
    info: <Info />
  };

  return (
    <div className={`app-alert ${type}`}>
      <div className="alert-icon">{icons[type]}</div>

      <div className="alert-content">
        <p>{message}</p>
      </div>

      <button className="alert-close" onClick={onClose}>✕</button>
    </div>
  );
}
