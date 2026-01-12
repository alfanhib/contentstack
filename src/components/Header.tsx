'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavItem {
  title: string;
  url: string;
}

interface HeaderProps {
  logo?: {
    url: string;
    title: string;
  };
  navigation?: NavItem[];
}

export default function Header({ logo, navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNav: NavItem[] = [
    { title: 'Markets', url: '/markets' },
    { title: 'Trading', url: '/trading' },
    { title: 'Learn', url: '/learn' },
    { title: 'About', url: '/about-us' },
  ];

  const navItems = navigation || defaultNav;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">ST</span>
          StockTrade
        </Link>

        <nav>
          <ul className="nav-links">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
