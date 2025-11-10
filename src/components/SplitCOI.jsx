import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import GroupModal from "./GroupModal";
import GroupDetail from "./GroupDetail";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

const GroupCard = styled(motion.div)`
  padding: 12px;
  border-radius: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
`;

export default function SplitCOI({ activities = [] }) {
  const [groups, setGroups] = useState(() =>
    JSON.parse(localStorage.getItem("sc_groups") || "[]")
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);

  useEffect(() => {
    localStorage.setItem("sc_groups", JSON.stringify(groups));
  }, [groups]);

  function openCreate() {
    setModalOpen(true);
  }

  function onCreate(group) {
    setGroups((prev) => [group, ...prev]);
  }

  function deleteGroup(id) {
    if (!window.confirm("Delete group?")) return;
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <Wrap>
      <Toolbar>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="primary" onClick={openCreate}>
            Create group
          </button>
          <button
            className="small"
            onClick={() => {
              // quick import: create groups from recent activities (example)
              const sample = {
                id: Date.now(),
                groupName: "Imported group",
                members: ["You"],
                expenses: [],
                totals: { totalCost: 0, totalCO2: 0 },
                perMember: [],
                created_at: new Date().toISOString(),
              };
              setGroups((prev) => [sample, ...prev]);
            }}
          >
            Quick sample
          </button>
        </div>
      </Toolbar>

      <CardGrid>
        <AnimatePresence>
          {groups.map((g) => (
            <GroupCard
              key={g.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div onClick={() => setDetailGroup(g)} style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{g.groupName}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    {g.members.join(", ")}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    ₹{Number(g.totals?.totalCost || 0).toFixed(0)}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {Number(g.totals?.totalCO2 || 0).toFixed(1)} kg
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button className="small" onClick={() => setDetailGroup(g)}>
                  Open
                </button>
                <button
                  className="small"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(`${location.origin}/groups#${g.id}`)
                      .then(() => alert("Group link copied (demo)"));
                  }}
                >
                  Share
                </button>
                <button className="small" onClick={() => deleteGroup(g.id)}>
                  Delete
                </button>
              </div>
            </GroupCard>
          ))}
        </AnimatePresence>
      </CardGrid>

      <AnimatePresence>
        {modalOpen && (
          <GroupModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            activities={activities}
            onCreate={onCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailGroup && (
          <GroupDetail
            group={detailGroup}
            onClose={() => setDetailGroup(null)}
          />
        )}
      </AnimatePresence>
    </Wrap>
  );
}
