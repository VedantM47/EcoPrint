"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const Toast = styled(motion.div)`
  min-width: 320px;
  max-width: 400px;
  padding: 16px 20px;
  border-radius: 16px;
  background: ${(p) => {
    if (p.type === "achievement")
      return "linear-gradient(135deg, #2d9d7b, #1b5e3f)";
    if (p.type === "milestone")
      return "linear-gradient(135deg, #3b82f6, #2563eb)";
    return "linear-gradient(135deg, #10b981, #059669)";
  }};
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: all;
  cursor: pointer;
  animation: ${slideIn} 0.5s ease;

  &.exit {
    animation: ${slideOut} 0.5s ease;
  }
`;

const IconWrapper = styled.div`
  font-size: 32px;
  animation: bounce 0.6s ease infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.1);
    }
  }
`;

const Content = styled.div`
  flex: 1;

  .title {
    font-weight: 800;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .message {
    font-size: 13px;
    opacity: 0.95;
    line-height: 1.4;
  }

  .reward {
    font-size: 12px;
    font-weight: 700;
    margin-top: 4px;
    opacity: 0.9;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Confetti = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: ${(p) => p.color};
  border-radius: 50%;
  animation: confetti 1s ease-out forwards;

  @keyframes confetti {
    0% {
      transform: translate(-50%, -50%) translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) translateY(-100px)
        rotate(${(p) => p.rotation}deg);
      opacity: 0;
    }
  }
`;

let toastId = 0;

export function CelebrationToast({ toasts = [], onRemove }) {
  return (
    <Container>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => onRemove(toast.id)}
          >
            <IconWrapper>{toast.icon}</IconWrapper>
            <Content>
              <div className="title">{toast.title}</div>
              <div className="message">{toast.message}</div>
              {toast.reward && <div className="reward">{toast.reward}</div>}
            </Content>
            <CloseButton onClick={() => onRemove(toast.id)}>×</CloseButton>

            {/* Confetti effect */}
            {toast.type === "achievement" && (
              <>
                {[...Array(8)].map((_, i) => (
                  <Confetti
                    key={i}
                    color={["#fbbf24", "#ef4444", "#8b5cf6", "#10b981"][i % 4]}
                    rotation={i * 45}
                    style={{ left: `${20 + i * 10}%` }}
                  />
                ))}
              </>
            )}
          </Toast>
        ))}
      </AnimatePresence>
    </Container>
  );
}

// Hook to manage celebration toasts
export function useCelebration() {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const newToast = { ...toast, id: ++toastId };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const celebrateCO2Save = (co2Amount) => {
    addToast({
      type: "co2",
      icon: "🎉",
      title: "Great Job!",
      message: `You tracked ${co2Amount.toFixed(2)} kg of CO₂ emissions!`,
      reward: "+5 XP",
    });
  };

  const celebrateAchievement = (achievement) => {
    addToast({
      type: "achievement",
      icon: achievement.icon || "🏆",
      title: `Achievement Unlocked!`,
      message: achievement.name,
      reward: "+10 XP",
    });
  };

  const celebrateMilestone = (milestone) => {
    addToast({
      type: "milestone",
      icon: milestone.icon || "🎖️",
      title: `Milestone Reached!`,
      message: milestone.title,
      reward: milestone.reward,
    });
  };

  return {
    toasts,
    removeToast,
    celebrateCO2Save,
    celebrateAchievement,
    celebrateMilestone,
  };
}
