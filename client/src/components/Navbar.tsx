'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  FileText,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/SocialIcons';
import { Button, Badge, KineticButton } from '@/components/ui';
import { AuthModal } from '@/components/AuthModal';
import { getCurrentUser, logoutUser } from '@/lib/api';

interface NavbarProps {
  onApplyClick?: () => void;
  onLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleOpenLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="border-b border-[#273623] bg-[#070B06]/95 backdrop-blur-md sticky top-0 z-40 w-full">
        {/* Main Spacious Tactical Command Bar */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2 sm:gap-4 xl:gap-6">
            {/* Official AIM Logo & Regimental Directorate Identity */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group flex-shrink-0">
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-white p-0.5 overflow-hidden border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all">
                <Image
                  src="/assets/images/logo.png"
                  alt="AIM Physical Institute Official Insignia"
                  width={56}
                  height={56}
                  className="object-contain scale-125 transform transition-transform duration-300 group-hover:scale-135"
                  priority
                />
              </div>

              <div className="flex flex-col flex-shrink-0">
                <div className="font-display font-black text-xs sm:text-sm lg:text-base xl:text-lg tracking-wider text-white uppercase leading-tight group-hover:text-amber-300 transition-colors whitespace-nowrap">
                  AIM PHYSICAL INSTITUTE
                </div>
                <div className="text-[9px] sm:text-[10px] text-amber-400 font-mono tracking-tight flex items-center gap-1 font-semibold whitespace-nowrap">
                  <span className="text-amber-300">PURULIA HQ</span>
                  <span className="text-gray-600 xs:inline">•</span>
                  <span className="text-gray-400 xs:inline">HAV. ANUP KR. MAHATO</span>
                </div>
              </div>
            </Link>

            {/* Desktop Tactical Navigation Links */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-display uppercase tracking-wider text-[11px] xl:text-xs font-bold text-gray-300">
              <Link href="/about" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Regimental HQ
              </Link>
              <Link href="/programs" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Training Wings
              </Link>
              <Link href="/calculator" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                BPET Standards
              </Link>
              <Link href="/bulletin" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Recruitment Orders
              </Link>
              <Link href="/events" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <span>Events</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              </Link>
              <Link href="/wall-of-fame" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Roll of Honour
              </Link>
              <Link href="/gallery" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Gallery
              </Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors whitespace-nowrap">
                Parade Ground
              </Link>
            </nav>

            {/* Action CTAs + Social Media Links */}
            <div className="hidden sm:flex items-center gap-2.5 xl:gap-3 flex-shrink-0">
              {/* Verified Social Media Channels */}
              <div className="flex items-center gap-1  py-1.5 rounded-xl">
                <a
                  href="https://www.facebook.com/Puruliaaim?mibextid=rS40aB7S9Ucbxw6v"
                  target="_blank"
                  rel="noreferrer"
                  title="Official Facebook Page"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-[#1A2415] transition-all"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/puruliaaim?stkn=NGprY3V3OHRpZmJr"
                  target="_blank"
                  rel="noreferrer"
                  title="Official Instagram @puruliaaim"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-[#1A2415] transition-all"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@anupfaujipuruliaaimphysica4494?si=dQpEoma6CzzGkf88"
                  target="_blank"
                  rel="noreferrer"
                  title="Official YouTube Channel @anupfaujipuruliaaim"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-[#1A2415] transition-all"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>

              {/* Command Portals Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141C10] border border-[#273623] hover:border-amber-500/60 text-gray-200 hover:text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="uppercase tracking-wider">Portals</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {portalDropdownOpen && (
                  <div
                    onMouseLeave={() => setPortalDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-60 bg-[#0E140C] border border-[#273623] rounded-xl shadow-2xl p-2 z-50 font-mono text-xs space-y-1"
                  >
                    <Link
                      href="/portal/student"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-[#161F15] transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white uppercase">Cadet Service Dossier</div>
                        <div className="text-[10px] text-gray-500">Stopwatch & Evaluation Report</div>
                      </div>
                    </Link>

                    <Link
                      href="/portal/trainer"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-[#161F15] transition-colors"
                    >
                      <Shield className="w-4 h-4 text-lime-400" />
                      <div>
                        <div className="font-bold text-white uppercase">Drill Ustad Roster</div>
                        <div className="text-[10px] text-gray-500">Attendance, Events & Media</div>
                      </div>
                    </Link>

                    <Link
                      href="/portal/admin"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-[#161F15] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white uppercase">Quartermaster / Admin HQ</div>
                        <div className="text-[10px] text-gray-500">Cadet Enlistment & Dossiers</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Authentication Status / Login Trigger - Positioned at Right-Most End */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-[#121811] border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-bold max-w-[110px] truncate">{currentUser.name}</span>
                    <Badge variant="saffron" size="sm" className="text-[9px] uppercase px-1 py-0">
                      {currentUser.role === 'TRAINER' ? 'Ustad' : currentUser.role === 'SUPER_ADMIN' ? 'Admin' : 'Cadet'}
                    </Badge>
                  </div>
                  <button
                    onClick={logoutUser}
                    title="Sign Out"
                    className="text-gray-400 hover:text-rose-400 transition-colors ml-1 p-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenLogin}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#182415] to-[#121811] border border-amber-500/60 hover:border-amber-400 text-amber-300 hover:text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1A2415] border border-[#273623]"
                aria-label="Toggle military navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#273623] bg-[#070B06]/98 backdrop-blur-2xl px-5 pt-3 pb-8 space-y-2.5 font-display uppercase tracking-widest text-sm max-h-[85vh] overflow-y-auto no-scrollbar touch-pan-y">
            {/* Social Icons on Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2415]">
              <span className="text-xs font-mono text-gray-400">Official Social Media:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/Puruliaaim?mibextid=rS40aB7S9Ucbxw6v"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#121811] text-blue-400 border border-[#273623]"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/puruliaaim?stkn=NGprY3V3OHRpZmJr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#121811] text-pink-400 border border-[#273623]"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@anupfaujipuruliaaimphysica4494?si=dQpEoma6CzzGkf88"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#121811] text-rose-500 border border-[#273623]"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* User status on mobile */}
            {currentUser ? (
              <div className="flex items-center justify-between py-2 border-b border-[#1A2415] font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <User className="w-4 h-4" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={logoutUser}
                  className="text-rose-400 font-bold uppercase hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenLogin();
                }}
                className="w-full py-2.5 rounded-xl bg-[#121811] text-amber-400 border border-[#273623] flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase mb-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Cadet / Ustad Login</span>
              </button>
            )}

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              Regimental HQ
            </Link>
            <Link
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              PET/PST Training Wings
            </Link>
            <Link
              href="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              BPET Standards Calculator
            </Link>
            <Link
              href="/bulletin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              Recruitment Orders & SRO
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415] flex items-center justify-between"
            >
              <span>Events & Rallies</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold bg-[#141C10] px-2 py-0.5 rounded border border-amber-500/40">NEW</span>
            </Link>
            <Link
              href="/wall-of-fame"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              Roll of Honour (Veer Gatha)
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              Regimental Gallery
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-200 hover:text-amber-400 border-b border-[#1A2415]"
            >
              Parade Ground & Stand-To
            </Link>

            <div className="pt-4 flex flex-col gap-2.5 font-mono text-xs">
              <Link
                href="/portal/student"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center">
                  Cadet Service Dossier (Telemetry)
                </Button>
              </Link>
              <Link
                href="/portal/trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center text-xs">
                  Drill Ustad Command Roster
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenAdmission={() => {
          setAuthModalOpen(false);
          if (onApplyClick) onApplyClick();
        }}
      />
    </>
  );
};
