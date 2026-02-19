"use client";

import Link from "next/link";

interface MainSidebarProps {
    auditScore?: number;
    anomalies?: number;
}

export default function MainSidebar({ auditScore = 78, anomalies = 3 }: MainSidebarProps) {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 border-r border-slate-800">
            <div className="p-6 flex flex-col gap-8">
                {/* Brand/Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-2xl">shield_person</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-white tracking-tight">พี่โล่ (Pee Lo)</h1>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">AI SME Assistant</p>
                    </div>
                </div>

                {/* Dashboard/Audit Score Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Dashboard</p>
                        <span className="material-symbols-outlined text-slate-500 text-sm">more_horiz</span>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-medium text-slate-400">Risk Score</span>
                            <span className={`text-[11px] font-bold ${auditScore < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {auditScore}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${auditScore < 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${auditScore}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="material-symbols-outlined text-amber-400 text-[14px]">warning</span>
                            <span className="text-[11px] text-slate-300">พบจุดผิดปกติ <span className="font-bold text-white">{anomalies}</span> รายการ</span>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-3">Menu</p>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary">grid_view</span>
                        <span className="text-sm font-medium">หน้าหลัก</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary">description</span>
                        <span className="text-sm font-medium">เอกสาร</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary">fact_check</span>
                        <span className="text-sm font-medium">ตรวจสอบบัญชี</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                        <span className="material-symbols-outlined text-xl">psychology</span>
                        <span className="text-sm font-bold">ที่ปรึกษา AI</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary">receipt_long</span>
                        <span className="text-sm font-medium">ยื่นภาษี</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary">storefront</span>
                        <span className="text-sm font-medium">ตลาดผู้สอบบัญชี</span>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6">
                <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-sm">verified</span>
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">Business Pro</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">ปรึกษาข้อกฎหมายและภาษีได้ไม่จำกัดด้วย AI ขั้นสูง</p>
                    <button className="w-full py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-blue-600 transition-all uppercase tracking-tight shadow-lg shadow-primary/20">จัดการการสมัครสมาชิก</button>
                </div>
            </div>
        </aside>
    );
}
