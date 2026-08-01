import { Switch, Route } from "wouter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { LanguageProvider } from "@/lib/language-context";
  import { AuthProvider } from "@/lib/auth-context";
  import { CursorGlow } from "@/components/CursorGlow";
  import Home from "@/pages/Home";
  import About from "@/pages/About";
  import OurStory from "@/pages/OurStory";
  import Contact from "@/pages/Contact";
  import BookDemo from "@/pages/BookDemo";
  import OurTeam from "@/pages/OurTeam";
  import Login from "@/pages/Login";
  import Signup from "@/pages/Signup";
  import ResetPassword from "@/pages/ResetPassword";
  import FeatureDetail from "@/pages/FeatureDetail";
  import PrivacyPolicy from "@/pages/PrivacyPolicy";
  import Terms from "@/pages/Terms";
  import NotFound from "@/pages/not-found";
  import Admin from "@/pages/Admin";
  import { ScrollToTop } from "@/components/ScrollToTop";

  const queryClient = new QueryClient();

  function Router() {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/our-story" component={OurStory} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-demo" component={BookDemo} />
        <Route path="/our-team" component={OurTeam} />
        <Route path="/features/:slug" component={FeatureDetail} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  export default App;
  