"use client";

import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const FilterButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid
    ${(p) => (p.active ? "rgba(27, 94, 63, 0.3)" : "rgba(0, 0, 0, 0.06)")};
  background: ${(p) => (p.active ? "rgba(27, 94, 63, 0.08)" : "transparent")};
  color: ${(p) => (p.active ? "#1B5E3F" : "#6B7280")};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.active ? 700 : 600)};
  transition: all 0.2s;

  &:hover {
    border-color: rgba(27, 94, 63, 0.2);
    background: rgba(27, 94, 63, 0.05);
  }
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 6px;
`;

const ActivityItem = styled(motion.div)`
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border-left: 3px solid #2d9d7b;
  display: flex;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(27, 94, 63, 0.06);
  }
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(45, 157, 123, 0.2),
    rgba(27, 94, 63, 0.1)
  );
  color: #1b5e3f;
  font-size: 16px;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;

  .activity-title {
    font-weight: 700;
    font-size: 13px;
    color: ${(p) => p.theme.text};
    margin-bottom: 3px;
  }

  .activity-meta {
    font-size: 12px;
    color: ${(p) => p.theme.muted};
    display: flex;
    justify-content: space-between;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: ${(p) => p.theme.muted};
`;

export default function ActivityFeed({ group }) {
  const [filterBy, setFilterBy] = useState("all"); // all | cost | emissions

  if (!group?.expenses) return null;

  const activities = group.expenses.map((exp, idx) => ({
    id: exp.id || idx,
    title: exp.title,
    notes: exp.notes,
    cost: exp.cost,
    co2: exp.co2,
    timestamp: exp.created_at || new Date().toISOString(),
    type: "expense",
  }));

  let filtered = activities;
  if (filterBy === "cost") {
    filtered = activities.sort((a, b) => b.cost - a.cost);
  } else if (filterBy === "emissions") {
    filtered = activities.sort((a, b) => b.co2 - a.co2);
  }

  return (
    <Container>
      <FilterBar>
        <FilterButton
          active={filterBy === "all"}
          onClick={() => setFilterBy("all")}
        >
          All Activities
        </FilterButton>
        <FilterButton
          active={filterBy === "cost"}
          onClick={() => setFilterBy("cost")}
        >
          Highest Cost
        </FilterButton>
        <FilterButton
          active={filterBy === "emissions"}
          onClick={() => setFilterBy("emissions")}
        >
          Highest Emissions
        </FilterButton>
      </FilterBar>

      {filtered.length > 0 ? (
        <FeedList>
          <AnimatePresence>
            {filtered.map((activity, idx) => {
              const date = new Date(activity.timestamp);
              const timeStr = date.toLocaleDateString();
              const icon = activity.type === "expense" ? "📊" : "✓";

              return (
                <ActivityItem
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ActivityIcon>{icon}</ActivityIcon>
                  <ActivityContent>
                    <div className="activity-title">{activity.title}</div>
                    {activity.notes && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginBottom: 4,
                        }}
                      >
                        {activity.notes}
                      </div>
                    )}
                    <div className="activity-meta">
                      <span>
                        {activity.cost > 0 && `₹${activity.cost.toFixed(2)}`}
                        {activity.cost > 0 && activity.co2 > 0 && " • "}
                        {activity.co2 > 0 &&
                          `${activity.co2.toFixed(1)} kg CO₂`}
                      </span>
                      <span>{timeStr}</span>
                    </div>
                  </ActivityContent>
                </ActivityItem>
              );
            })}
          </AnimatePresence>
        </FeedList>
      ) : (
        <EmptyState>No activities recorded</EmptyState>
      )}
    </Container>
  );
}
