"use client";

import Image from "next/image";

export default function Header() {
    return (
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/95 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-4">
                <nav className="flex text-xs text-slate-500 font-medium">
                    <span>หน้าหลัก</span>
                    <span className="mx-2 text-slate-300">/</span>
                    <span className="text-slate-900 font-bold">ที่ปรึกษา AI</span>
                </nav>
                <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[14px]">gavel</span>
                    Tax & Legal Compliance
                </span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-500 hover:text-primary cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-xl">history</span>
                    <span className="text-xs font-semibold">ประวัติการคุย</span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 ring-2 ring-slate-50 relative">
                    <Image
                        alt="User Profile"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpJeqnURYJaYOSttnsW0G5yCL8ruaaTTbjpWcBdrYByaGRd-xwghJkBf0BxdnOwo6UnEsPB3dKrJBnmBwUHdOXKKzzSN1LwA0JDjumRmMLxfU-MpA5XqyeCTzGOUlySs7_G36eXIWvssethXyo1q42-ktdC0uQZmwkY_Kk5VQTJE-b_Ug9tokUkFM0p41HOdS-pWOKNfDFys1WvP-Ae_rOneNtW77XvaQoCvHY8SpgY-RntHbaq82Brf8bDVwFlMlAK9K2iC2o_ss"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
