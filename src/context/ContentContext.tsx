import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteData {
  navbar: {
    logo: string;
    name: string;
    resumeUrl?: string;
    items: { name: string; href: string }[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    profileImage?: string;
    intro?: string;
    primaryBtn: string;
    primaryBtnUrl?: string;
    secondaryBtn: string;
    secondaryBtnUrl?: string;
    colors: {
      accent: string;
      gradient: string[];
    };
  };
  projects: {
    title: string;
    category: string;
    image: string;
    youtubeEmbedUrl: string;
    description?: string;
  }[];
  services: {
    title: string;
    description: string;
    price: string;
    icon: string;
  }[];
  skills: {
    name: string;
    level: number;
    color: string;
    icon: string;
  }[];
  experience: {
    year: string;
    role: string;
    company: string;
    description: string;
  }[];
  contact: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

interface ContentContextType {
  data: SiteData | null;
  updateData: (newData: SiteData) => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const updateData = async (newData: SiteData) => {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    if (res.ok) {
      setData(newData);
    }
  };

  return (
    <ContentContext.Provider value={{ data, updateData, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
