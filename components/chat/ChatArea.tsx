"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

interface ChatAreaProps {
    onReferencesDetected?: (references: string[]) => void;
}

export default function ChatArea({ onReferencesDetected }: ChatAreaProps) {
    const { messages, input, handleInputChange, handleSubmit, status, error, setInput } = useChat({
        api: '/api/chat',
        onFinish: ({ message }) => {
            // Extract text from parts to find references
            const text = message.parts
                ? message.parts
                    .filter(p => p.type === 'text')
                    .map(p => (p as any).text)
                    .join('')
                : (message as any).content;
            findReferences(text);
        }
    });

    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const findReferences = (text: string) => {
        const regex = /\[(.*?)\]/g;
        const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
        if (matches.length > 0 && onReferencesDetected) {
            onReferencesDetected(matches);
        }
    };

    // handleSubmit is provided natively by useChat, so we don't manually append.
    const handleSuggestionClick = (text: string) => {
        setInput(text);
        // We can't immediately trigger handleSubmit natively without an event, 
        // but we can let the user click send, or we can use the form reference.
    };

    const setSuggestion = (text: string) => {
        handleSuggestionClick(text);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
                {messages.length === 0 && (
                    <>
                        {/* Initial Robot Welcome Message */}
                        <div className="flex gap-4 max-w-4xl">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                                <span className="material-symbols-outlined text-lg">robot_2</span>
                            </div>
                            <div className="space-y-4 pt-1">
                                <div className="text-sm font-bold text-slate-900">พี่โล่ AI Consultant</div>
                                <div className="text-slate-700 leading-relaxed text-[15px] space-y-4">
                                    <p>สวัสดีครับ ผมพี่โล่ ที่ปรึกษา AI ประจำตัวคุณ วันนี้มีคำถามเกี่ยวกับภาษี กฎหมายบัญชี หรือต้องการให้ช่วยวิเคราะห์เอกสารส่วนไหนไหมครับ?</p>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button
                                            onClick={() => setSuggestion('ขอแนวทางการบริหารภาษีมูลค่าเพิ่ม สำหรับธุรกิจบริการ')}
                                            className="text-left p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-all group"
                                        >
                                            <p className="text-xs font-bold text-primary mb-1 group-hover:underline">วางแผนภาษี</p>
                                            <p className="text-[13px] text-slate-500 leading-tight">ขอแนวทางการบริหารภาษีมูลค่าเพิ่ม สำหรับธุรกิจบริการ</p>
                                        </button>
                                        <button
                                            onClick={() => setSuggestion('การบันทึกค่าใช้จ่ายสวัสดิการพนักงานให้หักภาษีได้ 2 เท่า')}
                                            className="text-left p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-all group"
                                        >
                                            <p className="text-xs font-bold text-primary mb-1 group-hover:underline">กฎหมายแรงงาน</p>
                                            <p className="text-[13px] text-slate-500 leading-tight">การบันทึกค่าใช้จ่ายสวัสดิการพนักงานให้หักภาษีได้ 2 เท่า</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {messages.map((m: UIMessage) => (
                    <div key={m.id} className={`flex gap-4 max-w-4xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-primary text-white'}`}>
                            <span className="material-symbols-outlined text-lg">
                                {m.role === 'user' ? 'person' : 'robot_2'}
                            </span>
                        </div>
                        <div className={`space-y-2 pt-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                            <div className="text-sm font-bold text-slate-900">
                                {m.role === 'user' ? 'คุณอภิชาติ (Accountant)' : 'พี่โล่ AI Consultant'}
                            </div>
                            <div className={`${m.role === 'user' ? 'bg-slate-50 border border-slate-200 rounded-tr-none' : 'bg-white border border-slate-200'} p-4 rounded-2xl text-slate-800 text-[15px] shadow-sm whitespace-pre-wrap`}>
                                {renderContentWithHighlights((m as any).content || m.text || "")}
                            </div>
                        </div>
                    </div>
                ))}

                {error && (
                    <div className="flex gap-4 max-w-4xl">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-100 text-red-500 border border-red-200">
                            <span className="material-symbols-outlined text-lg">error</span>
                        </div>
                        <div className="space-y-2 pt-1">
                            <div className="text-sm font-bold text-red-900">System Error</div>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-[15px] shadow-sm whitespace-pre-wrap">
                                {error.message || JSON.stringify(error)}
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="absolute bottom-0 w-full p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-10">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <textarea
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 placeholder:text-slate-400"
                            placeholder="ถามคำถามเกี่ยวกับภาษี หรือ อัปโหลดเอกสารเพื่อวิเคราะห์..."
                            rows={1}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <span className="material-symbols-outlined">{isLoading ? 'hourglass_bottom' : 'send'}</span>
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[12px]">security</span> ข้อมูลของคุณได้รับการเข้ารหัสและมีความเป็นส่วนตัวสูงสุด
                    </p>
                </div>
            </div>
        </div>
    );
}

function renderContentWithHighlights(content: string) {
    const parts = content.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            return (
                <span key={i} className="text-blue-700 font-bold underline decoration-blue-200 underline-offset-4 cursor-pointer hover:bg-blue-50">
                    {part}
                </span>
            );
        }
        return part;
    });
}
