import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ActivityForm from "./ActivityForm";

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.36);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 120;
  @media (min-width: 900px) {
    align-items: center;
  }
`;

const Drawer = styled(motion.div)`
  width: 100%;
  max-width: 720px;
  background: ${(p) => p.theme.surface};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${(p) => p.theme.cardShadow};
  margin: 16px;
`;

export default function ActivityModal({ open, onClose, onAdd }) {
  if (!open) return null;
  return (
    <Backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Drawer
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Add activity</h3>
          <button className="link" onClick={onClose}>
            Close
          </button>
        </div>

        <ActivityForm
          onAdd={(payload) => {
            onAdd(payload);
            onClose();
          }}
        />
      </Drawer>
    </Backdrop>
  );
}
