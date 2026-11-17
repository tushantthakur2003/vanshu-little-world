import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { siteContent as fallbackContent } from './data/content';
import { getPublishedContent } from './services/contentService';
import { isAuthenticated } from './utils/auth';
import { loadStoredData, saveStoredData } from './utils/storage';
import { FloatingElements } from './components/FloatingElements';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/sections/Dashboard';
import { SpecialDatesSection } from './components/sections/SpecialDatesSection';
import { SecretSurpriseSection } from './components/sections/SecretSurpriseSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { PinkBow } from './components/illustrations/ScrapbookDecorations';
import { playHarpFlourish } from './utils/soundEffects';

const checkIsAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || path === '/admin/' || hash === '#admin';
};

export const App = () => {
  // Route state (/admin vs public website)
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminRoute);
  const [authVersion, setAuthVersion] = useState(0);

  // Published site content state (Vanshu strictly sees published content)
  const [content, setContent] = useState(() =>
    loadStoredData('vanshu_cms_published_content', fallbackContent)
  );

  // Welcome screen view state
  const [welcomePassed, setWelcomePassed] = useState(() =>
    loadStoredData('welcome_passed', false)
  );

  // Opened cards state (map: { card1: true, card2: true, ... })
  const [openedCards, setOpenedCards] = useState(() =>
    loadStoredData('opened_cards', {})
  );

  // Load published content from service
  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const res = await getPublishedContent();
        if (res?.content) {
          setContent(res.content);
        }
      } catch (err) {
        console.warn('Error fetching published content:', err);
      }
    };
    fetchPublished();
  }, []);

  // Listen for browser navigation changes (/admin <-> /)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateToHome = () => {
    if (window.history.pushState) {
      window.history.pushState(null, '', '/');
    } else {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
  };

  const totalCardsCount = 6;
  const openedCardsCount = Object.values(openedCards).filter(Boolean).length;

  const handleOpenWorld = () => {
    setWelcomePassed(true);
    saveStoredData('welcome_passed', true);
  };

  const handleReturnToWelcome = () => {
    setWelcomePassed(false);
    saveStoredData('welcome_passed', false);
  };

  const handleMarkCardOpened = (cardKey) => {
    if (!openedCards[cardKey]) {
      const updated = { ...openedCards, [cardKey]: true };
      setOpenedCards(updated);
      saveStoredData('opened_cards', updated);

      const nextCount = Object.values(updated).filter(Boolean).length;
      if (nextCount === totalCardsCount) {
        // Unlock celebration!
        setTimeout(() => {
          playHarpFlourish();
          try {
            confetti({
              particleCount: 80,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#FF758F', '#FFA3B5', '#FFCCD5', '#E8D7F1', '#BAE6FD'],
            });
          } catch (e) {}
        }, 500);
      }
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Do you want to reset your explored memories progress back to 0/6? (Your custom text will remain intact)")) {
      const empty = {};
      setOpenedCards(empty);
      saveStoredData('opened_cards', empty);
      setWelcomePassed(false);
      saveStoredData('welcome_passed', false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN CMS ROUTE (/admin)
  // -------------------------------------------------------------
  if (isAdminRoute) {
    const authed = isAuthenticated();
    if (!authed) {
      return (
        <AdminLogin
          onLoginSuccess={() => setAuthVersion((v) => v + 1)}
          onNavigateHome={navigateToHome}
        />
      );
    }

    return (
      <AdminDashboard
        key={authVersion}
        onNavigateHome={navigateToHome}
      />
    );
  }

  // -------------------------------------------------------------
  // PUBLIC WEBSITE (for Vanshika / Vanshu)
  // Completely pristine, adorable Sanrio scrapbook with zero admin clutter!
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent selection:bg-pastel-pink-soft selection:text-pastel-pink-deep">
      {/* Gentle Floating Elements (hearts, sparkles, flower petals) */}
      <FloatingElements />

      {/* Welcome Screen Overlay */}
      {!welcomePassed && (
        <WelcomeScreen
          content={content}
          onOpenWorld={handleOpenWorld}
        />
      )}

      {/* Public Scrapbook Header */}
      <Header
        content={content}
        onResetProgress={handleResetProgress}
        onReturnToWelcome={handleReturnToWelcome}
      />

      {/* Main Page Body */}
      <main className="flex-1 pb-16 z-10">
        {/* Section 1: 6 Interactive Scrapbook Cards */}
        <Dashboard
          content={content}
          openedCards={openedCards}
          onMarkCardOpened={handleMarkCardOpened}
          onUpdateContent={() => {}}
        />

        {/* Section 2: Special Anniversary & Milestone Dates with Live Countdown */}
        <SpecialDatesSection
          data={{
            sectionTitle: content.specialDates?.sectionTitle || "Our Special Dates ♡",
            subtitle: content.specialDates?.subtitle || "The milestones that make my heart so grateful.",
            anniversary: content.anniversaryInfo || content.specialDates?.anniversary || {
              title: "Our Anniversary",
              date: "2024-05-18",
              caption: "The best day ever. Counting down to our next milestone! ✨",
            },
            datesList: Array.isArray(content.specialDates)
              ? content.specialDates
              : content.specialDates?.datesList || [],
          }}
          onSaveDates={() => {}}
        />

        {/* Section 3: Secret Final Surprise (Locked until 6/6 cards visited) */}
        <SecretSurpriseSection
          data={content.finalSecretSurprise || content.secretSurprise}
          openedCardsCount={openedCardsCount}
          totalCardsCount={totalCardsCount}
          onSaveMessage={() => {}}
        />
      </main>

      {/* Scrapbook Footer */}
      <footer className="relative z-10 border-t border-pastel-pink/30 bg-white/70 backdrop-blur-sm py-8 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <PinkBow className="w-6 h-6 mb-2" />
          <p className="font-handwriting font-bold text-xl text-gray-700">
            "You make every single day feel a little more magical."
          </p>
          <span className="text-xs font-cute text-pastel-pink-deep mt-1 flex items-center gap-1">
            Handcrafted with love for Vanshika Handoo (Vanshu) ♡
          </span>
          <p className="text-[10px] font-cute text-gray-400 mt-3">
            Designed like a digital love scrapbook • All memories saved with love
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
