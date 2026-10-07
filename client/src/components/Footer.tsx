import React from 'react';
import Image from 'next/image';
import { Shield, Phone, Mail, MapPin, Heart, ArrowUpRight, Compass } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/SocialIcons';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#273623] bg-[#070A06] text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Institute Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white p-1 border-2 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/assets/images/logo.png"
                  alt="AIM Official Insignia"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-display font-black text-lg tracking-wider text-white uppercase leading-tight">
                  AIM PHYSICAL INSTITUTE
                </h3>
                <p className="text-xs text-amber-400 font-mono">Regimental Training Directorate • Purulia</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              Founded and commanded by <strong className="text-gray-200">ex-Army Havaldar Anup Kumar Mahato</strong>. Dedicated to building battlefield-resilient, disciplined, and patriotic youth across Bengal for defence and police recruitments with 100% free regimental welfare.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#121811] px-3 py-1.5 rounded border border-[#273623] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Free Regimental Welfare Initiative</span>
            </div>
          </div>

          {/* Col 2: Training Wings */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-white font-bold text-base mb-4 border-b border-[#273623] pb-2">
              Regimental Training Wings
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> Indian Army (Agniveer GD, Tech, Tradesman)
              </li>
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> West Bengal Police (Constable & SI Cadre)
              </li>
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> Kolkata Police Force (KP SI/Constable)
              </li>
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> Railway Protection Force (RPF & RPSF)
              </li>
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> Paramilitary Strike Wing (SSC GD / CAPF)
              </li>
              <li className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500">▸</span> Indian Navy (SSR/MR) & Indian Air Force (Vayu)
              </li>
            </ul>
          </div>

          {/* Col 3: Training Grounds & Hours */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-white font-bold text-base mb-4 border-b border-[#273623] pb-2">
              Parade Ground & Daily Routine Orders
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span>
                  J.K. College Ground Purulia District, Purulia, West Bengal - 723101
                </span>
              </div>
              <div className="bg-[#121811] p-3 rounded border border-[#273623] space-y-1 font-mono text-xs">
                <div className="text-amber-400 font-bold">DAILY ROUTINE ORDERS (DRO):</div>
                <div className="text-gray-300">Stand-To 05:00am hrs – 08:30am hrs IST (Pacing & Track)</div>
                <div className="text-gray-300">Evening Muster: 04:30pm hrs – 06:30pm hrs IST (Beam Bar)</div>
                <div className="text-lime-400">Sunday 05:30 min: 1600m Super-Timed BPET Trial</div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-white font-bold text-base mb-4 border-b border-[#273623] pb-2">
              Regimental Duty Room
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Duty Helpline: +91 8699261094
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>dutyroom@puruliaaim.in</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-[#273623] space-y-2">
              <span className="text-xs font-mono text-gray-400 block font-bold uppercase">Official Social Channels:</span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://www.facebook.com/Puruliaaim?mibextid=rS40aB7S9Ucbxw6v"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#121811] hover:bg-[#1A2415] text-blue-400 border border-[#273623] hover:border-blue-500/50 transition-all text-xs font-mono"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span className="text-[10px]">FB</span>
                </a>
                <a
                  href="https://www.instagram.com/puruliaaim?stkn=NGprY3V3OHRpZmJr"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram @puruliaaim"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#121811] hover:bg-[#1A2415] text-pink-400 border border-[#273623] hover:border-pink-500/50 transition-all text-xs font-mono"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span className="text-[10px]">Insta</span>
                </a>
                <a
                  href="https://youtube.com/@anupfaujipuruliaaimphysica4494?si=dQpEoma6CzzGkf88"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube @anupfaujipuruliaaim"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#121811] hover:bg-[#1A2415] text-rose-500 border border-[#273623] hover:border-rose-500/50 transition-all text-xs font-mono"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span className="text-[10px]">YT</span>
                </a>
              </div>
            </div>

            <div className="mt-3">
              <a
                href="https://wa.me/918699261094"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-display uppercase tracking-wider text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <span>Duty Room WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1A2415] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            © {new Date().getFullYear()} Purulia Aim Physical Institute (AIM). All rights reserved. 100% Free Regimental Welfare.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/events" className="text-amber-400 hover:underline">
              Events & Schedules
            </Link>
            <Link href="/gallery" className="text-amber-400 hover:underline">
              Regimental Gallery
            </Link>
            <Link href="/portal/student" className="text-gray-300 hover:text-amber-400">
              Cadet Dossier
            </Link>
            <Link href="/portal/trainer" className="text-gray-300 hover:text-amber-400">
              Drill Roster
            </Link>
            <Link href="/portal/admin" className="text-gray-300 hover:text-amber-400">
              Admin HQ
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">Regimental HQ</Link>
            <Link href="/programs" className="hover:text-gray-300 transition-colors">Training Wings</Link>
            <Link href="/calculator" className="hover:text-gray-300 transition-colors">BPET Standards</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Parade Ground</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
