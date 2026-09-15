
import { Routes, Route, Navigate } from "react-router";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import useThemeStore from "./store/useThemeStore.js";

const App = () => {
  const {
    isLoading,
    authUser,
    isSignedIn,
    authError,
  } = useAuthUser();

  const { theme } = useThemeStore();

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <PageLoader />;
  }

  // =====================================================
  // CLERK NON CONNECTÉ
  // =====================================================

  if (!isSignedIn) {
    return (
      <div
        className="h-screen"
        data-theme={theme}
      >
        <Routes>

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

        <Toaster />
      </div>
    );
  }

  // =====================================================
  // CLERK CONNECTÉ MAIS MONGO NON SYNCHRONISÉ
  // =====================================================

  if (!authUser) {
    return <PageLoader />;
  }

  // =====================================================
  // UTILISATEUR CONNECTÉ
  // =====================================================

  const isOnboarded = Boolean(authUser.isOnboarded);

  return (
    <div
      className="h-screen"
      data-theme={theme}
    >

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={
            isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to="/onboarding"
                replace
              />
            )
          }
        />

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={
            <Navigate
              to={isOnboarded ? "/" : "/onboarding"}
              replace
            />
          }
        />

        {/* ================= SIGNUP ================= */}

        <Route
          path="/signup"
          element={
            <Navigate
              to={isOnboarded ? "/" : "/onboarding"}
              replace
            />
          }
        />

        {/* ================= ONBOARDING ================= */}

        <Route
          path="/onboarding"
          element={
            !isOnboarded ? (
              <OnboardingPage />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />

        {/* ================= NOTIFICATIONS ================= */}

        <Route
          path="/notifications"
          element={
            isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate
                to="/onboarding"
                replace
              />
            )
          }
        />

        {/* ================= CALL ================= */}

        <Route
          path="/call/:id"
          element={
            isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate
                to="/onboarding"
                replace
              />
            )
          }
        />

        {/* ================= CHAT ================= */}

        <Route
          path="/chat/:id"
          element={
            isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate
                to="/onboarding"
                replace
              />
            )
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                isOnboarded
                  ? "/"
                  : "/onboarding"
              }
              replace
            />
          }
        />

      </Routes>

      <Toaster />

    </div>
  );
};

export default App;

