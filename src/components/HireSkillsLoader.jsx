import "./css/HireSkillsLoader.css";
import logoImg from "../assets/logo.png";

export default function HireSkillsLoader({ fullPage = false }) {
  return (
    <div className={fullPage ? "loader-overlay" : "loader-inline"}>
    <div className="loader-container">

        <div className="loader-orbit">
            <img
                src={logoImg}
                alt="ZOLO Systems"
                className="loader-logo"
            />
        </div>

        <h1 className="loader-text">
            ZOLO <span>SYSTEMS</span>
        </h1>

        <p className="loader-sub">
            Preparing your workspace...
        </p>

    </div>
</div>
  );
}