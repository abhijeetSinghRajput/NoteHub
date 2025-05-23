import React, { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "sonner";

import Tiptap from "./components/editor/Tiptap";

//Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";

import { Loader } from "lucide-react";
import Dashboard from "./pages/dashboard";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import NotePage from "./pages/NotePage";
import { useRouteStore } from "./stores/useRouteStore";
import { useNoteStore } from "./stores/useNoteStore";
import NotFoundPage from "./pages/NotFoundPage";
import { useLocalStorage } from "./stores/useLocalStorage";
import PersonalDetails from "./pages/Settings/PersonalDetails";
import Personalization from "./pages/Settings/Personalization";
import Security from "./pages/Settings/Security";
import PhotoAndCover from "./pages/Settings/PhotoAndCover";
import { useContributionStore } from "./stores/useContributionStore";
import UserPage from "./pages/UserPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {getContributionCalendar} = useContributionStore();
  const { theme } = useLocalStorage();
  const { setRoutes } = useRouteStore();
  const { getNoteName, collections, isCollectionsLoading, setselectedNote } =
    useNoteStore();
  const location = useLocation();

  useEffect(()=>{
    getContributionCalendar();
  }, []);

  useEffect(() => {
    checkAuth();
    const radius = localStorage.getItem("radius") || 0.5;

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--radius", `${radius}rem`);
  }, [checkAuth]);

  useEffect(() => {
    let path = "/";
    setselectedNote(null);

    const segments = location.pathname.split("/").filter(Boolean);
    const routes = [{ name: "NoteHub", path: "/" }];
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      path += `${segment}/`;
      if (segment === "note") {
        const noteId = segments[++i];
        path += `${noteId}/`;
        let noteName = getNoteName(noteId);
        if (noteName === null) {
          noteName = "Not found";
        }
        routes.push({ name: noteName, path });
        setselectedNote(noteId);
      } else {
        const name = segment;
        routes.push({ name, path });
      }
    }
    setRoutes(routes);
  }, [location, collections, isCollectionsLoading]);

  if (isCheckingAuth && !authUser) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col gap-2 items-center justify-center h-screen">
          <div className="logo text-xl text-foreground/70">Notehub</div>
          <Loader className="animate-spin" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <div>
          <Routes>
            <Route
              path="/verify-email"
              element={
                !authUser?.isEmailVerified ? (
                  <EmailVerificationPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />

            {/* Nested routes inside Dashboard */}
            <Route
              path="/"
              element={authUser ? <Dashboard /> : <Navigate to="/login" />}
            >
              <Route index element={<HomePage />} />
              <Route path="note/:id" element={<NotePage />} />
              <Route path="note/:id/editor" element={<Tiptap />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="user/:username" element={<UserPage />} />

              <Route path="settings" element={<SettingsPage />}>
                <Route index element={<Personalization />} />
                
                <Route path="personal-details" element={<PersonalDetails />} />
                <Route path="personalization" element={<Personalization />} />
                <Route path="security" element={<Security />} />
                <Route path="photo-and-cover" element={<PhotoAndCover />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
