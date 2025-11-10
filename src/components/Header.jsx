import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeContext } from "styled-components";

const Bar = styled.header`
  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 1200px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: ${(p) => p.theme.surface};
  border-radius: 14px;
  box-shadow: ${(p) => p.theme.cardShadow};
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  z-index: 60;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
`;
const Nav = styled.nav`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const NavLink = styled(Link)`
  color: ${(p) => p.theme.text};
  opacity: 0.86;
  padding: 8px 10px;
  border-radius: 10px;
  font-weight: 600;
  &:hover {
    background: rgba(74, 144, 226, 0.08);
    transform: translateY(-2px);
    transition: var(--transition);
  }
`;

const Right = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const UserBadge = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(74, 144, 226, 0.08),
    rgba(123, 97, 255, 0.06)
  );
  color: ${(p) => p.theme.text};
  font-weight: 700;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  color: ${(p) => p.theme.text};
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
  }
`;

export default function Header({ user }) {
  const navigate = useNavigate();
  // Use the exported ThemeContext (don't use require in the browser)
  const theme = React.useContext(ThemeContext);

  function logout() {
    localStorage.removeItem("sc_user");
    navigate("/onboarding");
  }

  function toggleTheme() {
    // toggleTheme was injected into theme object in main Root's ThemeProvider
    if (theme && typeof theme.toggleTheme === "function") theme.toggleTheme();
  }

  const displayName = user?.name
    ? user.name.split(" ").slice(0, 2).join(" ")
    : "User";

  return (
    <Bar
      as={motion.header}
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Left>
        <Logo to="/dashboard">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <rect x="1" y="1" width="22" height="22" rx="6" fill="#4A90E2" />
            <path
              d="M6 12h12"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
          >
            <span style={{ fontSize: 14 }}>SplitCOI</span>
            <span style={{ fontSize: 11, color: theme?.muted }}>
              {/* theme.muted used here */}Split Carbon & Cost
            </span>
          </div>
        </Logo>

        <Nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/groups">Groups</NavLink>
        </Nav>
      </Left>

      <Right>
        <IconButton
          title="Toggle theme"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme && theme.bg === "#F9FAFB" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="#2E2E2E"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="#fff" />
            </svg>
          )}
        </IconButton>

        <UserBadge>Hi, {displayName}</UserBadge>
        <IconButton onClick={logout} title="Logout">
          Logout
        </IconButton>
      </Right>
    </Bar>
  );
}
