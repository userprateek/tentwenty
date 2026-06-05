'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return parts[0]?.substring(0, 2).toUpperCase() || '??';
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = 'sessionToken=; Max-Age=0; Path=/';
    router.push('/login');
  };

  return (
    <header className="app-header">
      <div className="app-header-left">
        <Link href="/timesheets" className="brand-link">
          ticktock
        </Link>

        <Link href="/timesheets" className="nav-link">
          Timesheets
        </Link>
      </div>

      <div className="user-menu-wrapper" ref={menuRef}>
        <button
          type="button"
          className="user-menu"
          onClick={() =>
            setIsProfileMenuOpen((prev) => !prev)
          }
        >
          <span>
            {loading ? 'Loading...' : user?.name ?? 'User'}
          </span>

          <span className="chevron">
            {isProfileMenuOpen ? '▲' : '▼'}
          </span>
        </button>

        {isProfileMenuOpen && user && (
          <div className="profile-menu">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-initial">
                  {getInitials(user.name)}
                </span>
              </div>

              <div className="profile-info">
                <div className="profile-name">
                  {user.name}
                </div>

                <div className="profile-email">
                  {user.email}
                </div>

                <div className="profile-role">
                  {user.role}
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            <nav className="profile-nav">
              <Link
                href="/profile"
                className="profile-nav-item"
              >
                Profile
              </Link>

              <Link
                href="/settings"
                className="profile-nav-item"
              >
                Settings
              </Link>

              <Link
                href="/help"
                className="profile-nav-item"
              >
                Help
              </Link>

              <div className="profile-divider" />

              <button
                type="button"
                className="profile-nav-item logout-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}