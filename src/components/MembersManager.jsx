"use client";

import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InviteSection = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(45, 157, 123, 0.08),
    rgba(27, 94, 63, 0.04)
  );
  border: 1.5px solid rgba(27, 94, 63, 0.1);
`;

const InviteForm = styled.form`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: rgba(27, 94, 63, 0.3);
    box-shadow: 0 0 0 3px rgba(27, 94, 63, 0.08);
  }
`;

const MembersListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
`;

const MemberCard = styled(motion.div)`
  padding: 14px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(27, 94, 63, 0.1);
    border-color: rgba(27, 94, 63, 0.1);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  background: linear-gradient(135deg, #2d9d7b, #1b5e3f);
  flex-shrink: 0;
`;

const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;

  .member-name {
    font-weight: 700;
    font-size: 14px;
    color: ${(p) => p.theme.text};
    margin-bottom: 4px;
  }

  .member-role {
    font-size: 12px;
    color: ${(p) => p.theme.muted};
    display: flex;
    gap: 4px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    rgba(45, 157, 123, 0.15),
    rgba(27, 94, 63, 0.1)
  );
  color: #1b5e3f;
  border: 1px solid rgba(27, 94, 63, 0.15);
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.4);
  }
`;

const PendingInvite = styled(motion.div)`
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.08),
    rgba(217, 119, 6, 0.04)
  );
  border: 1.5px dashed rgba(217, 119, 6, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .invite-email {
    font-weight: 600;
    font-size: 13px;
    color: ${(p) => p.theme.text};
  }

  .invite-status {
    font-size: 12px;
    color: #f59e0b;
    font-weight: 600;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${(p) => p.theme.muted};
  font-size: 14px;
`;

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MembersManager({ group, onAddMember, onRemoveMember }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [pendingInvites, setPendingInvites] = useState([]);
  const [inviteSent, setInviteSent] = useState(false);

  function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newInvite = {
      id: Date.now(),
      email: inviteEmail,
      role: inviteRole,
      sentAt: new Date().toISOString(),
      status: "pending",
    };

    setPendingInvites((prev) => [newInvite, ...prev]);
    setInviteEmail("");
    setInviteSent(true);

    setTimeout(() => setInviteSent(false), 3000);
  }

  function cancelInvite(id) {
    setPendingInvites((prev) => prev.filter((inv) => inv.id !== id));
  }

  return (
    <Container>
      {/* Invite Section */}
      <InviteSection>
        <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          Invite Members
        </div>

        <InviteForm onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="member@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="member">Member</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="primary"
            style={{ whiteSpace: "nowrap" }}
          >
            Send Invite
          </button>
        </InviteForm>

        {inviteSent && (
          <div style={{ marginTop: 10, fontSize: 13, color: "#10b981" }}>
            Invite sent successfully!
          </div>
        )}
      </InviteSection>

      {/* Members List */}
      {group.members && group.members.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Group Members ({group.members.length})
          </div>
          <MembersListContainer>
            <AnimatePresence>
              {group.members.map((member) => (
                <MemberCard
                  key={member}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Avatar>{getInitials(member)}</Avatar>
                  <MemberInfo>
                    <div className="member-name">{member}</div>
                    <div className="member-role">
                      <Badge>Member</Badge>
                      <Badge>Active</Badge>
                    </div>
                  </MemberInfo>
                  <ActionButton
                    onClick={() => onRemoveMember && onRemoveMember(member)}
                  >
                    Remove
                  </ActionButton>
                </MemberCard>
              ))}
            </AnimatePresence>
          </MembersListContainer>
        </>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 16 }}>
            Pending Invites ({pendingInvites.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AnimatePresence>
              {pendingInvites.map((invite) => (
                <PendingInvite
                  key={invite.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div>
                    <div className="invite-email">{invite.email}</div>
                    <div className="invite-status">
                      {invite.status === "pending"
                        ? "Awaiting response..."
                        : "Sent"}
                    </div>
                  </div>
                  <ActionButton onClick={() => cancelInvite(invite.id)}>
                    Cancel
                  </ActionButton>
                </PendingInvite>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {!group.members?.length && pendingInvites.length === 0 && (
        <EmptyState>No members yet. Invite people to get started.</EmptyState>
      )}
    </Container>
  );
}
