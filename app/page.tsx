"use client";

import { useState } from "react";
import MainSidebar from "@/components/layout/MainSidebar";
import Header from "@/components/layout/Header";
import ChatArea from "@/components/chat/ChatArea";
import ReferencePanel from "@/components/reference/ReferencePanel";

export default function Home() {
  const [activeRefs, setActiveRefs] = useState<string[]>([]);
  const [auditScore, setAuditScore] = useState(78);
  const [anomalies, setAnomalies] = useState(3);

  const handleReferencesDetected = (refs: string[]) => {
    setActiveRefs(prev => Array.from(new Set([...prev, ...refs])));
    // Mock risk detection: decrement score if more references are found
    if (refs.length > 0) {
      setAuditScore(prev => Math.max(10, prev - 2));
      setAnomalies(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-display">
      <MainSidebar auditScore={auditScore} anomalies={anomalies} />
      <main className="flex-1 ml-64 mr-96 flex flex-col h-screen relative bg-white overflow-hidden">
        <Header />
        <ChatArea onReferencesDetected={handleReferencesDetected} />
      </main>
      <ReferencePanel activeReferences={activeRefs} />
    </div>
  );
}
