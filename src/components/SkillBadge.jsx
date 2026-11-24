import { Badge } from "react-bootstrap";

export default function SkillBadge({
  skill,
  level = "Intermediate",
  verified = false,
}) {
  const levelColor = {
    Beginner: "info",
    Intermediate: "warning",
    Advanced: "success",
  };

  return (
    <Badge
      pill
      bg={verified ? "success" : levelColor[level] || "secondary"}
      className="me-2 mb-2 px-3 py-2 d-inline-flex align-items-center gap-2 skill-badge"
      style={{ fontSize: "0.85rem" }}
    >
      <span>{skill}</span>

      <span style={{ fontSize: "0.7rem", opacity: 0.9 }}>
        • {level}
      </span>

      {verified && (
        <span title="Verified Skill" style={{ fontSize: "0.8rem" }}>
          ✔
        </span>
      )}
    </Badge>
  );
}
