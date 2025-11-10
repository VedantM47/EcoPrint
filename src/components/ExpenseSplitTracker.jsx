"use client";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SplitHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(27, 94, 63, 0.04),
    rgba(45, 157, 123, 0.02)
  );
  border: 1px solid rgba(27, 94, 63, 0.1);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(p) => p.theme.muted};
`;

const SplitGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 4px;
`;

const SplitRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(27, 94, 63, 0.06);
  }
`;

const SplitLabel = styled.div`
  font-weight: 700;
  color: ${(p) => p.theme.text};
  font-size: 13px;

  .badge {
    display: inline-block;
    margin-top: 4px;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    background: linear-gradient(
      135deg,
      rgba(45, 157, 123, 0.15),
      rgba(27, 94, 63, 0.1)
    );
    color: #1b5e3f;
    border: 1px solid rgba(27, 94, 63, 0.15);
  }
`;

const Amount = styled.div`
  font-weight: 700;
  color: ${(p) => p.color || p.theme.text};
  font-size: 13px;
  text-align: right;

  .unit {
    display: block;
    font-size: 10px;
    color: ${(p) => p.theme.muted};
    font-weight: 500;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: linear-gradient(
    135deg,
    rgba(27, 94, 63, 0.08),
    rgba(45, 157, 123, 0.06)
  );
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(27, 94, 63, 0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #2d9d7b, #e8b04b);
  width: ${(p) => p.percentage}%;
  border-radius: 999px;
  transition: width 0.3s ease;
`;

const SettleUpContainer = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08),
    rgba(37, 99, 235, 0.04)
  );
  border: 1.5px solid rgba(59, 130, 246, 0.15);
`;

const SettleUpItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  }

  .text {
    color: ${(p) => p.theme.text};
    font-weight: 600;
  }

  .amount {
    color: #ef4444;
    font-weight: 700;
  }
`;

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ExpenseSplitTracker({ group }) {
  if (!group?.members) return null;

  const totalCost = group.totals?.totalCost || 0;
  const totalCO2 = group.totals?.totalCO2 || 0;
  const maxCost = Math.max(
    ...group.members.map((_, i) => group.perMember?.[i]?.shareCost || 0),
    0.01
  );
  const maxCO2 = Math.max(
    ...group.members.map((_, i) => group.perMember?.[i]?.shareCO2 || 0),
    0.01
  );

  // Generate settle-up suggestions
  const settleUpSuggestions = [];
  const balances = {};

  group.members.forEach((member, i) => {
    const share = group.perMember?.[i] || { shareCost: 0, shareCO2: 0 };
    balances[member] = share.shareCost;
  });

  // Simple settle-up: who owes whom
  const creditors = Object.entries(balances).filter(
    ([, amt]) => amt < totalCost / group.members.length
  );
  const debtors = Object.entries(balances).filter(
    ([, amt]) => amt > totalCost / group.members.length
  );

  return (
    <Container>
      {/* Cost Split Table */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
          Cost & Emission Split
        </div>

        <SplitHeader>
          <div>Member</div>
          <div>Cost Share</div>
          <div>CO₂ Share</div>
          <div>Progress</div>
        </SplitHeader>

        <SplitGrid>
          {group.members.map((member, i) => {
            const split = group.perMember?.[i] || { shareCost: 0, shareCO2: 0 };
            const costPct = maxCost > 0 ? (split.shareCost / maxCost) * 100 : 0;
            const co2Pct = maxCO2 > 0 ? (split.shareCO2 / maxCO2) * 100 : 0;

            return (
              <SplitRow
                key={member}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SplitLabel>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "6px",
                        background:
                          "linear-gradient(135deg, rgba(45, 157, 123, 0.2), rgba(27, 94, 63, 0.1))",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#1B5E3F",
                      }}
                    >
                      {getInitials(member)}
                    </div>
                    {member}
                  </div>
                </SplitLabel>

                <Amount>
                  ₹{split.shareCost.toFixed(2)}
                  <span className="unit">Cost</span>
                </Amount>

                <Amount>
                  {split.shareCO2.toFixed(1)}
                  <span className="unit">kg CO₂</span>
                </Amount>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ProgressBar>
                    <ProgressFill percentage={Math.max(costPct, co2Pct)} />
                  </ProgressBar>
                </div>
              </SplitRow>
            );
          })}
        </SplitGrid>
      </div>

      {/* Settle Up Suggestions */}
      {settleUpSuggestions.length > 0 || debtors.length > 0 ? (
        <SettleUpContainer>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
            Settlement Suggestions
          </div>
          {debtors.map(([debtor], idx) => (
            <SettleUpItem key={`${debtor}-${idx}`}>
              <span className="text">{debtor} owes others</span>
              <span className="amount">
                ₹
                {(group.members.length > 0
                  ? totalCost / group.members.length
                  : 0
                ).toFixed(2)}
              </span>
            </SettleUpItem>
          ))}
          {debtors.length === 0 && creditors.length > 0 && (
            <div
              style={{ color: "#10b981", textAlign: "center", padding: "10px" }}
            >
              All payments are settled!
            </div>
          )}
        </SettleUpContainer>
      ) : null}
    </Container>
  );
}
