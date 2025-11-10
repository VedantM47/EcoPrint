import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
`;
const ModalCard = styled(motion.div)`
  width: 92%;
  max-width: 800px;
  background: ${(p) => p.theme.surface};
  border-radius: 12px;
  padding: 18px;
  box-shadow: ${(p) => p.theme.cardShadow};
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;
const MemberBox = styled.div`
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
`;

export default function GroupDetail({ group, onClose }) {
  if (!group) return null;

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalCard
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 6, opacity: 0 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{group.groupName}</h3>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              {group.members.join(", ")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="small" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <Row>
          <div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Total cost</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              ₹{Number(group.totals?.totalCost || 0).toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Total CO₂</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {Number(group.totals?.totalCO2 || 0).toFixed(1)} kg
            </div>
          </div>
        </Row>

        <div style={{ marginTop: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Per-member split</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 8,
            }}
          >
            {group.members.map((m, i) => {
              const split = group.perMember?.[i] || {
                shareCost: 0,
                shareCO2: 0,
              };
              return (
                <MemberBox key={m}>
                  <div style={{ fontWeight: 700 }}>{m}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    ₹{Number(split.shareCost).toFixed(2)}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    {Number(split.shareCO2).toFixed(1)} kg CO₂
                  </div>
                </MemberBox>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <h4 style={{ marginBottom: 8 }}>Expenses</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.expenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    {exp.notes}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    ₹{Number(exp.cost || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {Number(exp.co2 || 0).toFixed(1)} kg
                  </div>
                </div>
              </div>
            ))}
            {group.expenses.length === 0 && (
              <div className="muted">No expenses added</div>
            )}
          </div>
        </div>
      </ModalCard>
    </ModalBackdrop>
  );
}
