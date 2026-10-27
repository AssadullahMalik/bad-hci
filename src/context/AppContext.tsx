import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  User, 
  ActiveSubscription, 
  Conversation, 
  DesignConcept, 
  UserRole,
  ListingStatus 
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_USERS, 
  CONNECTION_PLANS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_DESIGN_CONCEPTS 
} from '../data/mockData';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type CurrencyType = 'USD' | 'PKR';
export type AreaUnitType = 'sqft' | 'marla';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: UserRole) => void;
  users: User[];

  // Theme Management (Light, Dark, System)
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDarkMode: boolean;

  // Responsive Navigation Sidebar & Drawer
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  
  // Properties
  properties: Property[];
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => string;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  updatePropertyStatus: (id: string, status: ListingStatus) => void;
  
  // Favorites / Saved Properties (with genuine Undo action - Shneiderman's Rule 6)
  savedPropertyIds: string[];
  toggleFavorite: (propertyId: string) => void;
  restoreFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  
  // Recently Viewed Properties
  recentlyViewedIds: string[];
  addRecentlyViewed: (propertyId: string) => void;

  // Comparison
  comparePropertyIds: string[];
  toggleCompare: (propertyId: string) => void;
  isInCompare: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  
  // Currency & Area Unit Settings (HCI Localization)
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  areaUnit: AreaUnitType;
  setAreaUnit: (u: AreaUnitType) => void;
  formatPrice: (usdAmount: number, listingType?: 'sale' | 'rent') => string;
  formatArea: (sqft: number) => string;

  // AI Connect Subscription
  activeSubscription: ActiveSubscription | null;
  purchaseSubscription: (planId: string) => { success: boolean; message: string };
  cancelSubscription: () => void;
  toggleSubscriptionExpirySimulation: () => void;
  
  // Messaging
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => void;
  createOrOpenConversation: (propertyId: string, initialMessage?: string) => string;
  
  // Design Concepts
  designConcepts: DesignConcept[];
  saveDesignConcept: (concept: DesignConcept) => void;
  
  // Routing
  currentPath: string;
  navigate: (path: string) => void;
  
  // Feedback
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// USD to PKR conversion rate constant for prototype display (1 USD ≈ 278 PKR)
const USD_TO_PKR = 278;
// 1 Marla ≈ 225 sq ft
const SQFT_PER_MARLA = 225;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Alex Rivera (Buyer)
  
  // Localization: Currency & Area Units
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    try {
      return (localStorage.getItem('pp_currency') as CurrencyType) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [areaUnit, setAreaUnitState] = useState<AreaUnitType>(() => {
    try {
      return (localStorage.getItem('pp_area_unit') as AreaUnitType) || 'sqft';
    } catch {
      return 'sqft';
    }
  });

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    localStorage.setItem('pp_currency', c);
  };

  const setAreaUnit = (u: AreaUnitType) => {
    setAreaUnitState(u);
    localStorage.setItem('pp_area_unit', u);
  };

  // Theme Management (Light, Dark, System)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('pp_theme') as ThemeMode) || 'system';
    } catch {
      return 'system';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pp_theme') as ThemeMode;
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      let darkActive = false;
      if (theme === 'dark') {
        darkActive = true;
      } else if (theme === 'light') {
        darkActive = false;
      } else {
        darkActive = mediaQuery.matches;
      }
      setIsDarkMode(darkActive);
      if (darkActive) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem('pp_theme', t);
    } catch {}
    const themeLabel = t === 'system' ? 'System Default' : t === 'dark' ? 'Dark Theme' : 'Light Theme';
    addToast(`Theme set to ${themeLabel}.`, 'info');
  };

  // Responsive Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('pp_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Load saved properties from localStorage
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_favorites');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  // Recently Viewed Properties
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_recently_viewed');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2', 'prop-5'];
    } catch {
      return ['prop-1', 'prop-2', 'prop-5'];
    }
  });

  // Load comparison IDs
  const [comparePropertyIds, setComparePropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pp_compare');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  // Properties state
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem('pp_properties');
      return stored ? JSON.parse(stored) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  // Subscription state
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(() => {
    try {
      const stored = localStorage.getItem('pp_subscription');
      if (stored) return JSON.parse(stored);
      // Default: Active 30-day Pro Partner Pass for demonstration
      const now = new Date();
      const expiry = new Date();
      expiry.setDate(now.getDate() + 26);
      return {
        id: 'sub-active-demo',
        userId: 'user-buyer-1',
        planId: 'plan-pro',
        planName: 'Pro Partner Pass',
        price: 39,
        startDate: now.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        durationDays: 30,
        isActive: true,
        inquiriesRemaining: 'unlimited'
      };
    } catch {
      return null;
    }
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem('pp_conversations');
      return stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Design concepts
  const [designConcepts, setDesignConcepts] = useState<DesignConcept[]>(() => {
    try {
      const stored = localStorage.getItem('pp_design_concepts');
      return stored ? JSON.parse(stored) : INITIAL_DESIGN_CONCEPTS;
    } catch {
      return INITIAL_DESIGN_CONCEPTS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simple SPA routing with browser history and hash support
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pp_favorites', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('pp_recently_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem('pp_compare', JSON.stringify(comparePropertyIds));
  }, [comparePropertyIds]);

  useEffect(() => {
    localStorage.setItem('pp_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    if (activeSubscription) {
      localStorage.setItem('pp_subscription', JSON.stringify(activeSubscription));
    } else {
      localStorage.removeItem('pp_subscription');
    }
  }, [activeSubscription]);

  useEffect(() => {
    localStorage.setItem('pp_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('pp_design_concepts', JSON.stringify(designConcepts));
  }, [designConcepts]);

  const addToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'info',
    action?: { label: string; onClick: () => void }
  ) => {
    // Bad HCI demo: feedback timing and channel are inconsistent, and some
    // system responses are intentionally suppressed so they are hard to notice.
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const roll = Math.random();
    if (roll < 0.35) {
      // Silent failure: the action still happens but the user is not told.
      return;
    }
    setToasts((prev) => [...prev, { id, message, type, action }]);
    const lifetime = roll < 0.6 ? 1100 : action ? 6500 : 2600;
    setTimeout(() => {
      removeToast(id);
    }, lifetime);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      addToast('Browsing as a Guest user.', 'info');
      return;
    }
    const matched = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matched);
    addToast(`Switched active profile to ${matched.name} (${role.toUpperCase()})`, 'success');
  };

  // Bad HCI demo (Poor Feedback): saving/removing a property produces NO
  // confirmation at all - the state changes silently, users can't tell if the
  // click registered. Undo affordance was also removed (User Control failure).
  const toggleFavorite = (propertyId: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const restoreFavorite = (propertyId: string) => {
    setSavedPropertyIds((prev) => {
      if (prev.includes(propertyId)) return prev;
      return [...prev, propertyId];
    });
    addToast('Restored property to Saved Properties.', 'success');
  };

  const isFavorite = (propertyId: string) => savedPropertyIds.includes(propertyId);

  // Recently Viewed tracking
  const addRecentlyViewed = (propertyId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== propertyId);
      return [propertyId, ...filtered].slice(0, 8);
    });
  };

  const toggleCompare = (propertyId: string) => {
    setComparePropertyIds((prev) => {
      if (prev.includes(propertyId)) {
        addToast('ok.', 'info');
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 4) {
        addToast('Invalid input.', 'success');
        return prev;
      }
      addToast('Something happened.', 'error');
      return [...prev, propertyId];
    });
  };

  const isInCompare = (propertyId: string) => comparePropertyIds.includes(propertyId);

  const removeFromCompare = (propertyId: string) => {
    setComparePropertyIds((prev) => prev.filter((id) => id !== propertyId));
    addToast('Removed from comparison matrix.', 'info');
  };

  const clearCompare = () => {
    setComparePropertyIds([]);
    addToast('Cleared all compared properties.', 'info');
  };

  // Currency & Unit Formatters
  const formatPrice = (usdAmount: number, listingType: 'sale' | 'rent' = 'sale'): string => {
    const isPkr = currency === 'PKR';
    const amount = isPkr ? usdAmount * USD_TO_PKR : usdAmount;

    let formatted = '';
    if (isPkr) {
      if (amount >= 10000000) {
        // Crores
        const crores = (amount / 10000000).toFixed(2);
        formatted = `PKR ${crores} Crore`;
      } else if (amount >= 100000) {
        // Lacs
        const lacs = (amount / 100000).toFixed(2);
        formatted = `PKR ${lacs} Lac`;
      } else {
        formatted = `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
      }
    } else {
      formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(amount);
    }

    if (listingType === 'rent') {
      formatted += ' / mo';
    }
    return formatted;
  };

  const formatArea = (sqft: number): string => {
    if (areaUnit === 'marla') {
      const marlas = (sqft / SQFT_PER_MARLA).toFixed(1);
      return `${marlas} Marla (${sqft.toLocaleString()} sq ft)`;
    }
    return `${sqft.toLocaleString()} sq ft`;
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => {
    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...propertyData,
      id: newId,
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProperties((prev) => [newProperty, ...prev]);
    addToast('Data received.', 'info');
    return newId;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast('Operation unsuccessful.', 'error');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSavedPropertyIds((prev) => prev.filter((favId) => favId !== id));
    setComparePropertyIds((prev) => prev.filter((comp) => comp !== id));
    addToast('Property listing permanently removed.', 'info');
  };

  const updatePropertyStatus = (id: string, status: ListingStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast(`Status: ${status}`, 'info');
  };

  // Subscription simulated operations
  const purchaseSubscription = (planId: string) => {
    const plan = CONNECTION_PLANS.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid plan selected' };

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + plan.durationDays);

    const newSub: ActiveSubscription = {
      id: `sub-${Date.now()}`,
      userId: currentUser?.id || 'guest-user',
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      startDate: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      durationDays: plan.durationDays,
      isActive: true,
      inquiriesRemaining: plan.maxChats
    };

    setActiveSubscription(newSub);
    addToast(`Simulated purchase successful! Active for ${plan.durationDays} days until ${newSub.expiryDate}`, 'success');
    return { success: true, message: 'Simulated subscription activated' };
  };

  const cancelSubscription = () => {
    setActiveSubscription((prev) => (prev ? { ...prev, isActive: false } : null));
    addToast('Connection subscription cancelled.', 'info');
  };

  const toggleSubscriptionExpirySimulation = () => {
    setActiveSubscription((prev) => {
      if (!prev) {
        // Create an expired one
        const past = new Date();
        past.setDate(past.getDate() - 3);
        const start = new Date();
        start.setDate(start.getDate() - 33);
        addToast('Simulated expired subscription activated for testing.', 'info');
        return {
          id: 'sub-expired-test',
          userId: currentUser?.id || 'user-buyer-1',
          planId: 'plan-basic',
          planName: 'Basic Explorer',
          price: 19,
          startDate: start.toISOString().split('T')[0],
          expiryDate: past.toISOString().split('T')[0],
          durationDays: 7,
          isActive: false,
          inquiriesRemaining: 0
        };
      }
      const toggled = !prev.isActive;
      addToast(
        toggled ? 'AI Connect Plan simulated as ACTIVE.' : 'AI Connect Plan simulated as EXPIRED.',
        toggled ? 'success' : 'info'
      );
      return { ...prev, isActive: toggled };
    });
  };

  // Messaging operations
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser?.id || 'user-buyer-1',
      senderName: currentUser?.name || 'You',
      senderRole: currentUser?.role || 'buyer',
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Simulated automated seller reply after 2.2s for rich interactivity
    setTimeout(() => {
      const autoReplyText = "Thank you for reaching out! I have received your message and would be glad to share the official property documentation and arrange a private tour.";
      const sellerReply = {
        id: `msg-reply-${Date.now()}`,
        conversationId,
        senderId: 'seller-reply',
        senderName: 'Marcus Vance',
        senderRole: 'agent',
        text: autoReplyText,
        timestamp: 'Just now',
        isRead: false
      };

      setConversations((current) =>
        current.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: autoReplyText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, sellerReply],
              unreadCount: c.unreadCount + 1
            };
          }
          return c;
        })
      );
    }, 2200);
  };

  const createOrOpenConversation = (propertyId: string, initialMessage?: string): string => {
    const existing = conversations.find((c) => c.propertyId === propertyId);
    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      return existing.id;
    }

    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return '';

    const newConvId = `conv-${Date.now()}`;
    const firstMsg = initialMessage || `Hi ${prop.sellerName}, I am interested in ${prop.title} and would like to request more details.`;

    const newConv: Conversation = {
      id: newConvId,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyPrice: prop.price,
      propertyLocation: `${prop.location.city}, ${prop.location.state}`,
      propertyImage: prop.images[0] || '',
      otherPartyId: prop.sellerId,
      otherPartyName: prop.sellerName,
      otherPartyRole: `${prop.sellerRole === 'agent' ? 'Listing Agent' : 'Direct Owner'}`,
      otherPartyAvatar: prop.sellerAvatar,
      lastMessage: firstMsg,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderId: currentUser?.id || 'user-buyer-1',
          senderName: currentUser?.name || 'You',
          senderRole: currentUser?.role || 'buyer',
          text: firstMsg,
          timestamp: 'Just now',
          isRead: true
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    addToast('Contact flow initiated.', 'info');
    return newConvId;
  };

  const saveDesignConcept = (concept: DesignConcept) => {
    setDesignConcepts((prev) => [concept, ...prev]);
    addToast('Concept written to storage (probably).', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        theme,
        setTheme,
        isDarkMode,
        sidebarCollapsed,
        toggleSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        updatePropertyStatus,
        savedPropertyIds,
        toggleFavorite,
        restoreFavorite,
        isFavorite,
        recentlyViewedIds,
        addRecentlyViewed,
        comparePropertyIds,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        currency,
        setCurrency,
        areaUnit,
        setAreaUnit,
        formatPrice,
        formatArea,
        activeSubscription,
        purchaseSubscription,
        cancelSubscription,
        toggleSubscriptionExpirySimulation,
        conversations,
        sendMessage,
        createOrOpenConversation,
        designConcepts,
        saveDesignConcept,
        currentPath,
        navigate,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
