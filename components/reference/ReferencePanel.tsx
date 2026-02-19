"use client";

import { TAX_KNOWLEDGE } from "@/lib/ai/knowledge";

interface ReferencePanelProps {
    activeReferences?: string[];
}

export default function ReferencePanel({ activeReferences = [] }: ReferencePanelProps) {
    const filteredKnowledge = TAX_KNOWLEDGE.filter(k =>
        activeReferences.some(ar => k.title.includes(ar) || ar.includes(k.id) || k.keywords.some(kw => ar.includes(kw)))
    );

    return (
        <aside className="w-96 border-l border-slate-200 flex flex-col bg-soft-bg fixed right-0 h-full z-20">
            <div className="p-6 overflow-y-auto space-y-8">
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">เอกสารอ้างอิงทางกฎหมาย</h3>
                    <div className="space-y-3">
                        {filteredKnowledge.length > 0 ? (
                            filteredKnowledge.map((k) => (
                                <div key={k.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black text-primary bg-blue-50 px-1.5 py-0.5 rounded">{k.source}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-primary">open_in_new</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">{k.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">"{k.content.substring(0, 100)}..."</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 text-center">
                                <p className="text-xs text-slate-400">ยังไม่มีข้อมูลอ้างอิงสำหรับการสนทนานี้</p>
                            </div>
                        )}

                        {/* Fallback mockup references only if nothing active */}
                        {filteredKnowledge.length === 0 && (
                            <>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-50 grayscale">
                                    <p className="text-[10px] text-slate-400">ตัวอย่าง: มาตรา 65 ตรี (13)</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Risk Score Area (Keep Static for now or mock data) */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">สถานะความเสี่ยง (Audit Score)</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-black text-slate-900">92/100</span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full">Low Risk</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                            <div className="bg-green-500 h-full w-[92%]"></div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-4 bg-navy-900 rounded-xl">
                        <span className="material-symbols-outlined text-primary">verified_user</span>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                            ระบบพี่โล่ปฏิบัติตามมาตรฐาน <strong>PDPA</strong> <br />และ <strong>Security Level 4</strong> (ISO/IEC 27001)
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
