import React, { useEffect, useState } from "react";
import SplitCOI from "../components/SplitCOI";
import styled from "styled-components";

const Page = styled.div`
  padding-top: 18px;
`;
const HeaderCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Groups() {
  const [activities, setActivities] = useState(() =>
    JSON.parse(localStorage.getItem("sc_activities") || "[]")
  );

  useEffect(() => {
    const onStorage = () =>
      setActivities(JSON.parse(localStorage.getItem("sc_activities") || "[]"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Page>
      <HeaderCard>
        <div>
          <h2 style={{ margin: 0 }}>Groups</h2>
          <div style={{ color: "#6B7280" }}>
            Create collaborative groups, add expenses, and split costs &
            emissions with friends.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="primary"
            onClick={() => {
              // Focus behavior delegated to the SplitCOI 'Create group' button in that component
              const btn = document.querySelector("button.primary");
              btn?.scrollIntoView({ behavior: "smooth", block: "center" });
              btn?.focus();
            }}
          >
            Create group
          </button>
        </div>
      </HeaderCard>

      <div style={{ marginTop: 18 }}>
        <SplitCOI activities={activities} />
      </div>
    </Page>
  );
}
