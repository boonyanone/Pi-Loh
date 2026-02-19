"use client";

import Link from "next/link";

export default function MainSidebar() {
    return (
        <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col fixed h-full z-20">
            <div className="p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-2xl">shield_person</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-white tracking-tight">พี่โล่ (Pee Lo)</h1>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">AI AI SME Assistant</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">grid_view</span>
                        <span className="text-sm font-medium">หน้าหลัก</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">description</span>
                        <span className="text-sm font-medium">เอกสาร</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">fact_check</span>
                        <span className="text-sm font-medium">ตรวจสอบบัญชี</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 sidebar-active">
                        <span className="material-symbols-outlined text-xl">psychology</span>
                        <span className="text-sm font-bold">ที่ปรึกษา AI</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">receipt_long</span>
                        <span className="text-sm font-medium">ยื่นภาษี</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">storefront</span>
                        <span className="text-sm font-medium">ตลาดผู้สอบบัญชี</span>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6">
                <div className="bg-navy-800 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-sm">verified</span>
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">Business Pro</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">ปรึกษาข้อกฎหมายและภาษีได้ไม่จำกัดด้วย AI ขั้นสูง</p>
                    <button className="w-full py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-all uppercase tracking-tight">จัดการการสมัครสมาชิก</button>
                </div>
            </div>
        </aside>
    );
}
