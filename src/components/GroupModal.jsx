import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
`;
const Card = styled(motion.div)`
  width: 94%;
  max-width: 900px;
  background: ${(p) => p.theme.surface};
  border-radius: 14px;
  padding: 20px;
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const Section = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;
const Column = styled.div`
  flex: 1;
  min-width: 0;
`;
const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 8px 30px rgba(74, 144, 226, 0.06);
    border-color: rgba(74, 144, 226, 0.12);
  }
`;
const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  min-height: 80px;
`;
const Small = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.muted};
  margin-top: 6px;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  &:hover {
    background: rgba(0, 0, 0, 0.02);
    cursor: pointer;
  }
`;

const ExpenseRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 8px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

// Simple zero-dependency id generator (sufficient for client-side localStorage ids)
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function GroupModal({
  open,
  onClose,
  activities = [],
  onCreate,
}) {
  const [groupName, setGroupName] = useState("");
  const [membersText, setMembersText] = useState("");
  const [selectedActivityIds, setSelectedActivityIds] = useState(new Set());
  const [customExpenses, setCustomExpenses] = useState([]);
  const [splitMode, setSplitMode] = useState("equal"); // equal | custom
  const [customSplits, setCustomSplits] = useState({}); // memberName -> amount

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function reset() {
    setGroupName("");
    setMembersText("");
    setSelectedActivityIds(new Set());
    setCustomExpenses([]);
    setSplitMode("equal");
    setCustomSplits({});
  }

  function toggleActivity(id) {
    setSelectedActivityIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  function addCustomExpense() {
    setCustomExpenses((prev) => [
      ...prev,
      {
        id: generateId(),
        title: "",
        notes: "",
        co2: "",
        cost: "",
        date: new Date().toISOString(),
      },
    ]);
  }

  function updateCustomExpense(id, key, value) {
    setCustomExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [key]: value } : e))
    );
  }

  function removeCustomExpense(id) {
    setCustomExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function membersArray() {
    return membersText
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
  }

  function totalFromSelected() {
    let totalCost = 0;
    let totalCo2 = 0;
    activities.forEach((a, idx) => {
      const key = a.id || a.created_at + a.title || idx;
      if (selectedActivityIds.has(key)) {
        totalCost += Number(a.cost || 0);
        totalCo2 += Number(a.co2 || 0);
      }
    });
    customExpenses.forEach((e) => {
      totalCost += Number(e.cost || 0);
      totalCo2 += Number(e.co2 || 0);
    });
    return { totalCost, totalCo2 };
  }

  function handleCreate(e) {
    e?.preventDefault?.();
    const members = membersArray();
    if (!groupName || members.length === 0) {
      alert(
        "Please add a group name and at least one member (comma-separated)."
      );
      return;
    }

    // Build expenses array
    const expenses = [];

    // Add selected existing activities as expenses
    activities.forEach((a, idx) => {
      const key = a.id || a.created_at + a.title || idx;
      if (selectedActivityIds.has(key)) {
        expenses.push({
          id: generateId(),
          title: a.title || "Activity",
          notes: a.notes || "",
          co2: Number(a.co2 || 0),
          cost: Number(a.cost || 0),
          payerIndex: 0, // default payer: first member
          created_at: a.created_at || new Date().toISOString(),
        });
      }
    });

    // Add custom expenses
    customExpenses.forEach((e) => {
      expenses.push({
        id: e.id || generateId(),
        title: e.title || "Expense",
        notes: e.notes || "",
        co2: Number(e.co2 || 0),
        cost: Number(e.cost || 0),
        payerIndex: 0,
        created_at: e.date || new Date().toISOString(),
      });
    });

    // Totals
    const totalCost = expenses.reduce((s, x) => s + Number(x.cost || 0), 0);
    const totalCO2 = expenses.reduce((s, x) => s + Number(x.co2 || 0), 0);

    // Compute per-member split
    let perMember = members.map(() => ({ shareCost: 0, shareCO2: 0 }));
    if (splitMode === "equal") {
      const costPer = members.length ? totalCost / members.length : 0;
      const co2Per = members.length ? totalCO2 / members.length : 0;
      perMember = members.map(() => ({
        shareCost: Number(costPer.toFixed(2)),
        shareCO2: Number(co2Per.toFixed(2)),
      }));
    } else {
      // custom: use customSplits amounts (object keyed by member name)
      const totalAssigned = members.reduce(
        (s, name) => s + Number(customSplits[name] || 0),
        0
      );
      members.forEach((name, i) => {
        const amt = Number(customSplits[name] || 0);
        const ratio =
          totalAssigned > 0 ? amt / totalAssigned : 1 / members.length;
        perMember[i] = {
          shareCost: Number((ratio * totalCost).toFixed(2)),
          shareCO2: Number((ratio * totalCO2).toFixed(2)),
        };
      });
    }

    const group = {
      id: Date.now(),
      groupName,
      members,
      expenses,
      totals: {
        totalCost: Number(totalCost.toFixed(2)),
        totalCO2: Number(totalCO2.toFixed(2)),
      },
      perMember,
      created_at: new Date().toISOString(),
    };

    // persist to localStorage
    const existing = JSON.parse(localStorage.getItem("sc_groups") || "[]");
    const updated = [group, ...existing];
    localStorage.setItem("sc_groups", JSON.stringify(updated));

    // callback
    onCreate && onCreate(group);
    onClose && onClose();
    reset();
  }

  if (!open) return null;

  const totals = totalFromSelected();

  return (
    <Backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Create Group</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="small" onClick={onClose}>
              Cancel
            </button>
            <button className="primary" onClick={handleCreate}>
              Create group
            </button>
          </div>
        </div>

        <Section>
          <Column>
            <label style={{ fontSize: 13, color: "#6B7280" }}>Group name</label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Roommates, Weekend Carpool"
            />
          </Column>

          <Column>
            <label style={{ fontSize: 13, color: "#6B7280" }}>
              Members (comma separated)
            </label>
            <Input
              value={membersText}
              onChange={(e) => setMembersText(e.target.value)}
              placeholder="Alice, Bob, Charlie"
            />
            <Small>
              Members will be used to split expenses and CO₂. You can edit
              splits after creation.
            </Small>
          </Column>
        </Section>

        <Section>
          <Column style={{ flex: 1.6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>Attach existing activities</strong>
              </div>
              <Small>{activities.length} available</Small>
            </div>

            <div
              style={{
                marginTop: 8,
                maxHeight: 180,
                overflowY: "auto",
                paddingRight: 6,
              }}
            >
              {activities.map((a, idx) => {
                const key = a.id || a.created_at + a.title || idx;
                const checked = selectedActivityIds.has(key);
                return (
                  <CheckboxRow key={key} onClick={() => toggleActivity(key)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleActivity(key)}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{a.title}</div>
                      <div style={{ fontSize: 13, color: "#6B7280" }}>
                        {a.notes}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>
                        ₹{Number(a.cost || 0).toFixed(0)}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {Number(a.co2 || 0).toFixed(1)} kg
                      </div>
                    </div>
                  </CheckboxRow>
                );
              })}
              {activities.length === 0 && (
                <Small>
                  No activities found. Add activities in Dashboard first.
                </Small>
              )}
            </div>
          </Column>

          <Column style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Add custom expenses</strong>
              <div>
                <button
                  className="small"
                  onClick={addCustomExpense}
                  type="button"
                >
                  + Add expense
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {customExpenses.map((ex) => (
                <ExpenseRow key={ex.id}>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Title"
                      value={ex.title}
                      onChange={(e) =>
                        updateCustomExpense(ex.id, "title", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Notes"
                      value={ex.notes}
                      onChange={(e) =>
                        updateCustomExpense(ex.id, "notes", e.target.value)
                      }
                      style={{ marginTop: 6 }}
                    />
                  </div>
                  <div style={{ width: 120 }}>
                    <Input
                      placeholder="₹ cost"
                      value={ex.cost}
                      onChange={(e) =>
                        updateCustomExpense(ex.id, "cost", e.target.value)
                      }
                    />
                    <Input
                      placeholder="kg CO₂"
                      value={ex.co2}
                      onChange={(e) =>
                        updateCustomExpense(ex.id, "co2", e.target.value)
                      }
                      style={{ marginTop: 6 }}
                    />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <button
                      className="small"
                      onClick={() => removeCustomExpense(ex.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </ExpenseRow>
              ))}
              {customExpenses.length === 0 && (
                <Small>No custom expenses added.</Small>
              )}
            </div>
          </Column>
        </Section>

        <Section style={{ alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                checked={splitMode === "equal"}
                onChange={() => setSplitMode("equal")}
              />
              <span style={{ fontSize: 13 }}>Equal split</span>
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                checked={splitMode === "custom"}
                onChange={() => setSplitMode("custom")}
              />
              <span style={{ fontSize: 13 }}>Custom split</span>
            </label>
          </div>

          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Selected total</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              ₹{totals.totalCost.toFixed(2)} • {totals.totalCo2.toFixed(1)} kg
              CO₂
            </div>
          </div>
        </Section>

        {splitMode === "custom" && (
          <Section style={{ marginTop: 14 }}>
            <Column>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                Assign custom amounts (per member)
              </div>
              {membersArray().map((m, i) => (
                <div
                  key={m + i}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 180 }}>{m}</div>
                  <Input
                    placeholder="₹ amount"
                    value={customSplits[m] || ""}
                    onChange={(e) =>
                      setCustomSplits((prev) => ({
                        ...prev,
                        [m]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
              {membersArray().length === 0 && (
                <Small>
                  Enter members (comma-separated) above to assign custom splits.
                </Small>
              )}
            </Column>
          </Section>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 14,
            gap: 8,
          }}
        >
          <button className="small" onClick={onClose}>
            Close
          </button>
          <button className="primary" onClick={handleCreate}>
            Create Group
          </button>
        </div>
      </Card>
    </Backdrop>
  );
}
