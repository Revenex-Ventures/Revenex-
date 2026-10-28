import { useState, useCallback, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth-context";
import { Preloader } from "@/components/Preloader";
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const OurStory = lazy(() => import("@/pages/OurStory"));
const Contact = lazy(() => import("@/pages/Contact"));
const BookDemo = lazy(() => import("@/pages/BookDemo"));
const OurTeam = lazy(() => import("@/pages/OurTeam"));
const Homework = lazy(() => import("@/pages/Homework"));
const StudentPortal = lazy(() => import("@/pages/StudentPortal"));
const Transport = lazy(() => import("@/pages/Transport"));
const Careers = lazy(() => import("@/pages/Careers"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const FeatureDetail = lazy(() => import("@/pages/FeatureDetail"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Admin = lazy(() => import("@/pages/Admin"));
const AttendanceShowcase = lazy(() => import("@/pages/showcase/Attendance"));
const AdmissionsShowcase = lazy(() => import("@/pages/showcase/Admissions"));
const HomeworkShowcase = lazy(
  () => import("@/pages/showcase/HomeworkShowcase"),
);
const ReportCardsShowcase = lazy(() => import("@/pages/showcase/ReportCards"));
const FeeManagementShowcase = lazy(
  () => import("@/pages/showcase/FeeManagement"),
);
const StudentPortalShowcase = lazy(
  () => import("@/pages/showcase/StudentPortalShowcase"),
);
const TransportShowcase = lazy(
  () => import("@/pages/showcase/TransportShowcase"),
);
const CommunicationShowcase = lazy(
  () => import("@/pages/showcase/Communication"),
);
const MotionShowcase = lazy(() => import("@/pages/MotionShowcase"));
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
        <Route
          path="/solutions/fee-management"
          component={FeeManagementShowcase}
        />
        <Route
          path="/solutions/student-portal"
          component={StudentPortalShowcase}
        />
        <Route path="/solutions/transport" component={TransportShowcase} />
        <Route
          path="/solutions/communication"
          component={CommunicationShowcase}
        />
        <Route path="/motion-showcase" component={MotionShowcase} />
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

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            {loading && <Preloader onComplete={finishLoading} />}
          </AnimatePresence>
          <ScrollToTop />
          <Suspense
            fallback={
              <div
                className="min-h-screen flex items-center justify-center text-[#17375D]"
                role="status"
              >
                Loading…
              </div>
            }
          >
            <Router />
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
