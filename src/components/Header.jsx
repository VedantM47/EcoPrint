"use client"

import React from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ThemeContext } from "styled-components"

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
  background: linear-gradient(135deg, ${(p) => p.theme.surface}, rgba(255, 255, 255, 0.9));
  border-radius: 14px;
  box-shadow: ${(p) => p.theme.cardShadow};
  backdrop-filter: blur(10px);
  border: 1px solid ${(p) => p.theme.borderColor};
  z-index: 60;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 6px;
  align-items: center;
`

const NavLink = styled(Link)`
  color: ${(p) => p.theme.text};
  opacity: 0.85;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(27, 94, 63, 0.08);
    opacity: 1;
    transform: translateY(-1px);
  }
`

const Right = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const UserBadge = styled.div`
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(45, 157, 123, 0.1), rgba(27, 94, 63, 0.06));
  color: ${(p) => p.theme.text};
  font-weight: 700;
  font-size: 13px;
  border: 1px solid rgba(27, 94, 63, 0.12);
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: ${(p) => p.theme.text};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(27, 94, 63, 0.08);
    transform: translateY(-2px);
  }
`

export default function Header({ user }) {
  const navigate = useNavigate()
  const theme = React.useContext(ThemeContext)

  function logout() {
    localStorage.removeItem("sc_user")
    navigate("/onboarding")
  }

  function toggleTheme() {
    if (theme && typeof theme.toggleTheme === "function") theme.toggleTheme()
  }

  const displayName = user?.name ? user.name.split(" ").slice(0, 2).join(" ") : "User"

  return (
    <Bar as={motion.header} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Left>
        <Logo to="/dashboard">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="1" y="1" width="22" height="22" rx="6" fill="#1B5E3F" />
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>SplitCOI</span>
            <span style={{ fontSize: 10, color: theme?.muted, fontWeight: 500 }}>Split Carbon & Cost</span>
          </div>
        </Logo>

        <Nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/groups">Groups</NavLink>
        </Nav>
      </Left>

      <Right>
        <IconButton title="Toggle theme" onClick={toggleTheme} aria-label="Toggle theme">
          {theme && theme.bg === "#F9FAFB" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#1B5E3F" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="#F5F5F5" />
              <path
                d="M12 1v6m0 6v6M23 12h-6m-6 0H1M20.5 3.5l-4.24 4.24m-8.52 8.52L3.5 20.5M3.5 3.5l4.24 4.24m8.52 8.52L20.5 20.5"
                stroke="#F5F5F5"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </IconButton>

        <UserBadge>Hi, {displayName}</UserBadge>
        <IconButton onClick={logout} title="Logout" style={{ fontWeight: 700, fontSize: 13 }}>
          Logout
        </IconButton>
      </Right>
    </Bar>
  )
}
