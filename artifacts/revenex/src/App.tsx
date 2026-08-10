import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth-context";
import { CursorGlow } from "@/components/CursorGlow";
import { Preloader } from "@/components/Preloader";
import Home from "@/pages/Home";
import About from "@/pages/About";
import OurStory from "@/pages/OurStory";
import Contact from "@/pages/Contact";
import BookDemo from "@/pages/BookDemo";
import OurTeam from "@/pages/OurTeam";
import Homework from "@/pages/Homework";
import StudentPortal from "@/pages/StudentPortal";
import Transport from "@/pages/Transport";
import Careers from "@/pages/Careers";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import FeatureDetail from "@/pages/FeatureDetail";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/Admin";
import AttendanceShowcase from "@/pages/showcase/Attendance";
import AdmissionsShowcase from "@/pages/showcase/Admissions";
import HomeworkShowcase from "@/pages/showcase/HomeworkShowcase";
import ReportCardsShowcase from "@/pages/showcase/ReportCards";
import FeeManagementShowcase from "@/pages/showcase/FeeManagement";
import StudentPortalShowcase from "@/pages/showcase/StudentPortalShowcase";
import TransportShowcase from "@/pages/showcase/TransportShowcase";
import CommunicationShowcase from "@/pages/showcase/Communication";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/our-story" component={OurStory} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-demo" component={BookDemo} />
        <Route path="/our-team" component={OurTeam} />
        <Route path="/homework" component={Homework} />
        <Route path="/student-portal" component={StudentPortal} />
        <Route path="/transport" component={Transport} />
        <Route path="/product/attendance" component={AttendanceShowcase} />
        <Route path="/product/admissions" component={AdmissionsShowcase} />
        <Route path="/product/homework" component={HomeworkShowcase} />
        <Route path="/product/report-cards" component={ReportCardsShowcase} />
        <Route path="/solutions/fee-management" component={FeeManagementShowcase} />
        <Route path="/solutions/student-portal" component={StudentPortalShowcase} />
        <Route path="/solutions/transport" component={TransportShowcase} />
        <Route path="/solutions/communication" component={CommunicationShowcase} />
        <Route path="/careers" component={Careers} />
        <Route path="/features/:slug" component={FeatureDetail} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            {loading && <Preloader />}
          </AnimatePresence>
          <ScrollToTop />
          <Router />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
