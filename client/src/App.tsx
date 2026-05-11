import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { Button } from "./components/ui/button";
import { ShoppingCart, Menu, Globe } from "lucide-react";
import Logo from "./components/Logo";

function Header() {
  const [location, navigate] = useLocation() as any;
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <Logo className="h-10" />
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/categories/ndt")}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            {t('header.categories')}
          </button>
          
          {/* Language Toggle */}
          <div className="flex items-center gap-2 border-l border-border pl-6">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'tr'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              EN
            </button>
          </div>
          
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('header.cart')}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Language Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                language === 'tr'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                language === 'en'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              EN
            </button>
          </div>
          
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-background rounded-lg"
          >
            <ShoppingCart className="w-5 h-5 text-accent" />
          </button>
          <button className="p-2 hover:bg-background rounded-lg">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/categories/:categoryId"} component={Categories} />
      <Route path={"/product/:productId"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Header />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
