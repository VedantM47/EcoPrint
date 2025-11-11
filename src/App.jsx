"use client";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import CO2Calculator from "./pages/CO2Calculator";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  CelebrationToast,
  useCelebration,
} from "./components/CelebrationToast";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 24px;
  min-height: calc(100vh - 56px);
  padding-top: 80px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url("/images/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(2px);
    z-index: -1;
  }
`;

const MainContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

export default function App() {
  const user = JSON.parse(localStorage.getItem("sc_user") || "null");
  const location = useLocation();
  const celebration = useCelebration();

  return (
    <AppWrapper>
      <Header user={user} />
      <CelebrationToast
        toasts={celebration.toasts}
        onRemove={celebration.removeToast}
      />
      <MainContent>
        <div className="container">
          <Layout>
            <Sidebar />
            <main style={{ width: "100%" }}>
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      user ? <Navigate to="/dashboard" /> : <Onboarding />
                    }
                  />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PageTransition>
                        <Dashboard onCelebrate={celebration} />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/groups"
                    element={
                      user ? (
                        <PageTransition>
                          <Groups onCelebrate={celebration} />
                        </PageTransition>
                      ) : (
                        <Navigate to="/onboarding" />
                      )
                    }
                  />
                  <Route
                    path="/leaderboard"
                    element={
                      user ? (
                        <PageTransition>
                          <Leaderboard />
                        </PageTransition>
                      ) : (
                        <Navigate to="/onboarding" />
                      )
                    }
                  />
                  <Route
                    path="/calculator"
                    element={
                      user ? (
                        <PageTransition>
                          <CO2Calculator />
                        </PageTransition>
                      ) : (
                        <Navigate to="/onboarding" />
                      )
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      user ? (
                        <PageTransition>
                          <Profile onCelebrate={celebration} />
                        </PageTransition>
                      ) : (
                        <Navigate to="/onboarding" />
                      )
                    }
                  />
                  <Route path="*" element={<div>Not Found</div>} />
                </Routes>
              </AnimatePresence>
            </main>
          </Layout>
        </div>
      </MainContent>
      <Footer />
    </AppWrapper>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}
