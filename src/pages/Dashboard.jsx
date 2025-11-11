"use client";

import { useEffect, useState } from "react";
import ActivityModal from "../components/ActivityModal";
import BillScanner from "../components/BillScanner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;
const Metrics = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Metric = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.7)
  );
  padding: 12px;
  border-radius: 10px;
  flex: 1;
  min-width: 180px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  thead th {
    background: rgba(0, 0, 0, 0.02);
    padding: 12px;
    text-align: left;
    font-weight: 700;
    font-size: 13px;
    color: ${(p) => p.theme.muted};
  }
  tbody td {
    padding: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }
  tbody tr:hover {
    background: rgba(74, 144, 226, 0.02);
    transform: translateY(-1px);
    transition: var(--transition);
  }
`;

function formatDateLabel(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch (e) {
    return iso;
  }
}

function sampleChartData(activities) {
  const map = {};
  activities.forEach((a) => {
    const keyDate = a.created_at
      ? new Date(a.created_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    map[keyDate] = map[keyDate] || { dateKey: keyDate, co2: 0, cost: 0 };
    map[keyDate].co2 += Number(a.co2 || 0);
    map[keyDate].cost += Number(a.cost || 0);
  });
  return Object.values(map)
    .sort((x, y) => x.dateKey.localeCompare(y.dateKey))
    .map((item) => ({ ...item, day: formatDateLabel(item.dateKey) }));
}

export default function Dashboard({ onCelebrate }) {
  const [activities, setActivities] = useState(() =>
    JSON.parse(localStorage.getItem("sc_activities") || "[]")
  );
  const [openModal, setOpenModal] = useState(false);
  const [groups, setGroups] = useState(() =>
    JSON.parse(localStorage.getItem("sc_groups") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("sc_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    const onStorage = () => {
      setGroups(JSON.parse(localStorage.getItem("sc_groups") || "[]"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const data = sampleChartData(activities);
  const totalCO2 = activities.reduce((s, a) => s + Number(a.co2 || 0), 0);
  const totalCost = activities.reduce((s, a) => s + Number(a.cost || 0), 0);

  function addActivity(a) {
    setActivities((prev) => [a, ...prev]);
    if (onCelebrate && a.co2) {
      onCelebrate.celebrateCO2Save(a.co2);
    }
  }

  function deleteActivity(index) {
    const a = activities[index];
    const title = a?.title ? `${a.title}` : "this activity";
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`))
      return;
    setActivities((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div style={{ paddingTop: 18 }}>
      <Grid>
        <Card>
          <h3 style={{ marginTop: 0 }}>Summary</h3>
          <Metrics>
            <Metric>
              <div style={{ fontSize: 12, color: "#6B7280" }}>
                CO₂ this week
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {totalCO2.toFixed(1)} kg
              </div>
            </Metric>
            <Metric>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Spending</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                ₹{totalCost.toFixed(0)}
              </div>
            </Metric>
            <Metric>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Progress</div>
              <div
                style={{
                  height: 10,
                  background: "#eef2ff",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, 100 - totalCO2)}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#50E3C2,#4A90E2)",
                  }}
                />
              </div>
            </Metric>
          </Metrics>

          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="primary" onClick={() => setOpenModal(true)}>
                Add activity
              </button>
              <button
                className="small"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
              >
                View recent
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Charts</h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={{ height: 180 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    stroke="#4A90E2"
                    fill="rgba(74,144,226,0.08)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#50E3C2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>Recent activities</h3>
          <Table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>CO₂ (kg)</th>
                <th>Cost (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>
                    No activity yet
                  </td>
                </tr>
              )}
              {activities.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {a.notes}
                    </div>
                  </td>
                  <td>{a.created_at ? formatDateLabel(a.created_at) : "-"}</td>
                  <td>{Number(a.co2 || 0).toFixed(2)}</td>
                  <td>₹{Number(a.cost || 0).toFixed(0)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="link"
                        onClick={() => {
                          const copy = {
                            ...a,
                            created_at:
                              a.created_at || new Date().toISOString(),
                          };
                          setActivities((prev) => [
                            copy,
                            ...prev.filter((_, idx) => idx !== i),
                          ]);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Duplicate
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteActivity(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Bill Scanner</h3>
          <BillScanner onExtract={(item) => addActivity(item)} />
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Groups</h3>
          <div style={{ color: "#6B7280" }}>
            Manage groups on the Groups page
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              className="small"
              onClick={() => window.location.assign("/groups")}
            >
              Open Groups
            </button>
          </div>
        </Card>
      </Grid>

      <ActivityModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(a) => addActivity(a)}
      />
    </div>
  );
}
