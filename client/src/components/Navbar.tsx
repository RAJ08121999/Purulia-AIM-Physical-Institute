'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Menu, X, UserCheck, PhoneCall, ChevronDown, Compass, Award, Calendar, FileText, Target } from 'lucide-react';
import { Button, Badge, KineticButton } from '@/components/ui';

interface NavbarProps {
  onApplyClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  return (
    <header className="border-b border-[#273623] bg-[#070B06]/95 backdrop-blur-md sticky top-0 z-50 w-full">
      {/* Main Spacious Tactical Command Bar - Full Screen Width Utilization */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2 sm:gap-4 xl:gap-6">
          {/* Official AIM Logo & Regimental Directorate Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group flex-shrink-0">
            {/* Zoomed-in High-Impact Insignia Container */}
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
                <span className="text-gray-600 hidden xs:inline">•</span>
                <span className="text-gray-400 hidden xs:inline">HAV. ANUP KR. MAHATO</span>
              </div>
            </div>
          </Link>

          {/* Desktop Tactical Navigation Links - Spaced Wisely */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 font-display uppercase tracking-wider text-[11px] xl:text-xs font-bold text-gray-300">
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

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3.5 flex-shrink-0">
            {/* Unified Portals Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141C10] border border-[#273623] hover:border-amber-500/60 text-gray-200 hover:text-white font-mono text-xs font-bold transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider">Command Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
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
                      <div className="text-[10px] text-gray-500">Stopwatch Telemetry & Muster Roll</div>
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
                      <div className="text-[10px] text-gray-500">Squad Attendance & Trial Marks</div>
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

            {/* Kinetic Enlistment Trigger */}
            <div onClick={onApplyClick}>
              <KineticButton size="md">
                Enlist Cadet (₹0)
              </KineticButton>
            </div>
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
            <Link
              href="/portal/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="outline" className="w-full justify-center text-xs">
                Quartermaster / Admin HQ
              </Button>
            </Link>
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                if (onApplyClick) onApplyClick();
              }}
              className="pt-2"
            >
              <KineticButton className="w-full justify-center">
                Enlist Cadet (100% Free)
              </KineticButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
