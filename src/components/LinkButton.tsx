import { Link } from "react-router-dom";
import React from "react";

interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string; // For passing color classes like bg-blue-600 etc.
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children, className = "" }) => {
  return (
    <Link
      to={to}
      className={`inline-block text-white px-6 py-3 rounded-xl shadow transition hover:brightness-90 ${className}`}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
