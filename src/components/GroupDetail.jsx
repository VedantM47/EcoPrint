"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ActivityFeed from "./ActivityFeed";
import MembersManager from "./MembersManager";
import ExpenseSplitTracker from "./ExpenseSplitTracker";
import GroupAnalytics from "./GroupAnalytics";

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  background: ${(p) => p.theme.surface};
  border-radius: 14px;
  padding: 24px;
  box-shadow: ${(p) => p.theme.cardShadow};
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Title = styled.div`
  h3 {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 800;
    color: ${(p) => p.theme.text};
  }

  .subtitle {
    font-size: 13px;
    color: ${(p) => p.theme.muted};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 250, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);
  text-align: center;

  .metric-label {
    font-size: 12px;
    color: ${(p) => p.theme.muted};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .metric-value {
    font-size: 20px;
    font-weight: 800;
    color: ${(p) => p.theme.text};
  }

  .metric-unit {
    font-size: 12px;
    color: ${(p) => p.theme.muted};
    margin-top: 2px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;

  h4 {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${(p) => p.theme.text};
  }
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

const MemberCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(45, 157, 123, 0.08),
    rgba(27, 94, 63, 0.04)
  );
  border: 1.5px solid rgba(27, 94, 63, 0.1);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(27, 94, 63, 0.2);
    box-shadow: 0 4px 12px rgba(27, 94, 63, 0.08);
  }

  .member-name {
    font-weight: 700;
    color: ${(p) => p.theme.text};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .member-stat {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 4px;

    .label {
      color: ${(p) => p.theme.muted};
    }

    .value {
      font-weight: 600;
      color: ${(p) => p.theme.text};
    }
  }
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 250, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .expense-title {
    font-weight: 700;
    color: ${(p) => p.theme.text};
    font-size: 13px;

    .expense-notes {
      font-size: 12px;
      color: ${(p) => p.theme.muted};
      font-weight: 400;
      margin-top: 2px;
    }
  }

  .expense-amounts {
    display: flex;
    gap: 16px;
    text-align: right;

    .amount {
      display: flex;
      flex-direction: column;
      font-size: 12px;

      .value {
        font-weight: 700;
        color: ${(p) => p.theme.text};
      }

      .label {
        color: ${(p) => p.theme.muted};
        font-size: 11px;
      }
    }
  }
`;

const BadgeRole = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    rgba(27, 94, 63, 0.1),
    rgba(45, 157, 123, 0.08)
  );
  color: ${(p) => p.theme.text};
  border: 1px solid rgba(27, 94, 63, 0.15);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getEmissionColor(current, max) {
  const ratio = max ? current / max : 0;
  if (ratio > 0.7) return "#ef4444"; // red
  if (ratio > 0.4) return "#f59e0b"; // amber
  return "#10b981"; // green
}

export default function GroupDetail({ group, onClose }) {
  const [tab, setTab] = useState("overview"); // overview | members | activity | split | analytics | expenses

  if (!group) return null;

  const totalCost = group.totals?.totalCost || 0;
  const totalCO2 = group.totals?.totalCO2 || 0;
  const avgCostPerMember = group.members.length
    ? (totalCost / group.members.length).toFixed(2)
    : 0;
  const avgCO2PerMember = group.members.length
    ? (totalCO2 / group.members.length).toFixed(2)
    : 0;

  const maxCO2 = Math.max(
    ...group.members.map((_, i) => group.perMember?.[i]?.shareCO2 || 0)
  );

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalCard
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 6, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Header>
          <Title>
            <h3>{group.groupName}</h3>
            <div className="subtitle">{group.members.length} members</div>
          </Title>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className={tab === "overview" ? "small" : "small"}
              onClick={() => setTab("overview")}
              style={{
                fontWeight: tab === "overview" ? 700 : 500,
                opacity: tab === "overview" ? 1 : 0.6,
              }}
            >
              Overview
            </button>
            <button
              className={tab === "members" ? "small" : "small"}
              onClick={() => setTab("members")}
              style={{
                fontWeight: tab === "members" ? 700 : 500,
                opacity: tab === "members" ? 1 : 0.6,
              }}
            >
              Members
            </button>
            <button
              className={tab === "activity" ? "small" : "small"}
              onClick={() => setTab("activity")}
              style={{
                fontWeight: tab === "activity" ? 700 : 500,
                opacity: tab === "activity" ? 1 : 0.6,
              }}
            >
              Activity
            </button>
            <button
              className={tab === "analytics" ? "small" : "small"}
              onClick={() => setTab("analytics")}
              style={{
                fontWeight: tab === "analytics" ? 700 : 500,
                opacity: tab === "analytics" ? 1 : 0.6,
              }}
            >
              Analytics
            </button>
            <button
              className={tab === "split" ? "small" : "small"}
              onClick={() => setTab("split")}
              style={{
                fontWeight: tab === "split" ? 700 : 500,
                opacity: tab === "split" ? 1 : 0.6,
              }}
            >
              Split
            </button>
            <button
              className={tab === "expenses" ? "small" : "small"}
              onClick={() => setTab("expenses")}
              style={{
                fontWeight: tab === "expenses" ? 700 : 500,
                opacity: tab === "expenses" ? 1 : 0.6,
              }}
            >
              Expenses
            </button>
          </div>
        </Header>

        {/* Overview Tab */}
        {tab === "overview" && (
          <>
            <MetricsGrid>
              <MetricCard>
                <div className="metric-label">Total Cost</div>
                <div className="metric-value">₹{totalCost.toFixed(0)}</div>
              </MetricCard>

              <MetricCard>
                <div className="metric-label">Total CO₂</div>
                <div className="metric-value">{totalCO2.toFixed(1)}</div>
                <div className="metric-unit">kg</div>
              </MetricCard>

              <MetricCard>
                <div className="metric-label">Avg per Member</div>
                <div className="metric-value">₹{avgCostPerMember}</div>
                <div className="metric-unit">cost</div>
              </MetricCard>

              <MetricCard>
                <div className="metric-label">Avg CO₂ per Member</div>
                <div className="metric-value">{avgCO2PerMember}</div>
                <div className="metric-unit">kg</div>
              </MetricCard>
            </MetricsGrid>

            <Section>
              <h4>Member Split Breakdown</h4>
              <MembersGrid>
                {group.members.map((member, i) => {
                  const split = group.perMember?.[i] || {
                    shareCost: 0,
                    shareCO2: 0,
                  };
                  const emissionColor = getEmissionColor(
                    split.shareCO2,
                    maxCO2
                  );

                  return (
                    <MemberCard key={member}>
                      <div className="member-name">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: "6px",
                            background: `linear-gradient(135deg, rgba(45, 157, 123, 0.2), rgba(27, 94, 63, 0.1))`,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#1B5E3F",
                          }}
                        >
                          {getInitials(member)}
                        </div>
                        {member}
                      </div>

                      <div className="member-stat">
                        <span className="label">Cost:</span>
                        <span className="value">
                          ₹{split.shareCost.toFixed(2)}
                        </span>
                      </div>

                      <div className="member-stat">
                        <span className="label">CO₂:</span>
                        <span
                          className="value"
                          style={{ color: emissionColor }}
                        >
                          {split.shareCO2.toFixed(1)} kg
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <BadgeRole>Member</BadgeRole>
                      </div>
                    </MemberCard>
                  );
                })}
              </MembersGrid>
            </Section>
          </>
        )}

        {/* Members Tab */}
        {tab === "members" && (
          <Section>
            <MembersManager group={group} />
          </Section>
        )}

        {/* Activity Tab */}
        {tab === "activity" && (
          <Section>
            <ActivityFeed group={group} />
          </Section>
        )}

        {/* Split Tab */}
        {tab === "split" && (
          <Section>
            <ExpenseSplitTracker group={group} />
          </Section>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <Section>
            <GroupAnalytics group={group} />
          </Section>
        )}

        {/* Expenses Tab */}
        {tab === "expenses" && (
          <Section>
            <h4>Expenses & Activities</h4>
            {group.expenses.length > 0 ? (
              <ExpenseList>
                {group.expenses.map((exp) => (
                  <ExpenseItem key={exp.id}>
                    <div className="expense-title">
                      {exp.title}
                      {exp.notes && (
                        <div className="expense-notes">{exp.notes}</div>
                      )}
                    </div>
                    <div className="expense-amounts">
                      <div className="amount">
                        <span className="label">COST</span>
                        <span className="value">
                          ₹{Number(exp.cost || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="amount">
                        <span className="label">CO₂</span>
                        <span className="value">
                          {Number(exp.co2 || 0).toFixed(1)} kg
                        </span>
                      </div>
                    </div>
                  </ExpenseItem>
                ))}
              </ExpenseList>
            ) : (
              <div
                style={{
                  color: "#6B7280",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No expenses added
              </div>
            )}
          </Section>
        )}

        {/* Action Buttons */}
        <ActionButtons>
          <button className="small" onClick={onClose}>
            Close
          </button>
        </ActionButtons>
      </ModalCard>
    </ModalBackdrop>
  );
}
