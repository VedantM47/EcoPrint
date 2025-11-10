import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrap = styled.aside`
  height: calc(100vh - 110px);
  position: sticky;
  top: 92px;
  padding-top: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  @media (max-width: 900px) {
    display: none;
  }
`;

const Col = styled.div`
  width: 72px;
  background: ${(p) => p.theme.surface};
  border-radius: 12px;
  padding: 12px;
  box-shadow: ${(p) => p.theme.cardShadow};
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const IconBtn = styled(NavLink)`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  opacity: 0.9;
  &:hover {
    background: rgba(74, 144, 226, 0.06);
    transform: translateY(-4px);
    transition: var(--transition);
  }
  &.active {
    background: linear-gradient(
      90deg,
      rgba(74, 144, 226, 0.12),
      rgba(123, 97, 255, 0.06)
    );
  }
`;

export default function Sidebar() {
  return (
    <Wrap>
      <Col as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <IconBtn to="/dashboard" title="Dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8V11h-8v10zm0-18v6h8V3h-8z"
              fill="currentColor"
            />
          </svg>
        </IconBtn>

        <IconBtn to="/groups" title="Groups">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 12a5 5 0 100-10 5 5 0 000 10zm8 9v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2h16z"
              fill="currentColor"
            />
          </svg>
        </IconBtn>

        <IconBtn to="#" title="Analytics">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M3 3v18h18"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M7 13v6M12 7v12M17 10v9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </IconBtn>

        <IconBtn to="#" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"
              fill="currentColor"
            />
            <path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 114.27 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.27 4.27A2 2 0 116.1 2.44l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 114 0v.09c.04.6.37 1.12 1 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 1119.73 4.1l-.06.06a1.65 1.65 0 00-.33 1.82V7a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
              fill="currentColor"
            />
          </svg>
        </IconBtn>
      </Col>
    </Wrap>
  );
}
