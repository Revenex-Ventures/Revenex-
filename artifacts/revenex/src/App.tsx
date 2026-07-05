import { Switch, Route, Router as WouterRouter } from "wouter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { LanguageProvider } from "@/lib/language-context";
  import { AuthProvider } from "@/lib/auth-context";
  import { CursorGlow } from "@/components/CursorGlow";
  import Home from "@/pages/Home";
  import About from "@/pages/About";
  import Security from "@/pages/Security";
  import OurStory from "@/pages/OurStory";
  import Contact from "@/pages/Contact";
  import BookDemo from "@/pages/BookDemo";
  import Founders from "@/pages/Founders";
  import Login from "@/pages/Login";
  import Signup from "@/pages/Signup";
  import ResetPassword from "@/pages/ResetPassword";
  import FeatureDetail from "@/pages/FeatureDetail";
  import PrivacyPolicy from "@/pages/PrivacyPolicy";
  import Terms from "@/pages/Terms";
  import NotFound from "@/pages/not-found";
  import Admin from "@/pages/Admin";

  const queryClient = new QueryClient();

  function Router() {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/security" component={Security} />
        <Route path="/our-story" component={OurStory} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-demo" component={BookDemo} />
        <Route path="/founders" component={Founders} />
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
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <CursorGlow />
              <Router />
            </WouterRouter>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  export default App;
  