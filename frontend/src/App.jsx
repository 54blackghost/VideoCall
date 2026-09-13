import { useEffect, useState } from 'react'

import { Routes,Route, Navigate} from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';



//import { Routes, Route, Navigate } from "react-router";
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
  } = useAuthUser();

  const { theme } = useThemeStore();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const isAuthenticated =
    Boolean(isSignedIn) && Boolean(authUser);

  const isOnboarded =
    Boolean(authUser?.isOnboarded);


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <PageLoader />;
  }


  // =====================================================
  // APP
  // =====================================================

  return (
    <div
      className="h-screen"
      data-theme={theme}
    >

      <Routes>

        {/* ========================================= */}
        {/* HOME */}
        {/* ========================================= */}

        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={
                  !isAuthenticated
                    ? "/login"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* LOGIN */}
        {/* ========================================= */}

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate
                to={
                  isOnboarded
                    ? "/"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* SIGN UP */}
        {/* ========================================= */}

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate
                to={
                  isOnboarded
                    ? "/"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* ONBOARDING */}
        {/* ========================================= */}

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate
                  to="/"
                  replace
                />
              )
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* NOTIFICATIONS */}
        {/* ========================================= */}

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate
                to={
                  !isAuthenticated
                    ? "/login"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* CALL */}
        {/* ========================================= */}

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate
                to={
                  !isAuthenticated
                    ? "/login"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* CHAT */}
        {/* ========================================= */}

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate
                to={
                  !isAuthenticated
                    ? "/login"
                    : "/onboarding"
                }
                replace
              />
            )
          }
        />


        {/* ========================================= */}
        {/* FALLBACK */}
        {/* ========================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                !isAuthenticated
                  ? "/login"
                  : !isOnboarded
                    ? "/onboarding"
                    : "/"
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