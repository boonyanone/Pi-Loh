"use client";

import { useState } from "react";
import MainSidebar from "@/components/layout/MainSidebar";
import Header from "@/components/layout/Header";
import ChatArea from "@/components/chat/ChatArea";
import ReferencePanel from "@/components/reference/ReferencePanel";

export default function Home() {
  const [activeRefs, setActiveRefs] = useState<string[]>([]);

  const handleReferencesDetected = (refs: string[]) => {
    // Add new references and remove duplicates
    setActiveRefs(prev => Array.from(new Set([...prev, ...refs])));
  };

  return (
    <div className="min-h-screen flex bg-white font-display">
      <MainSidebar />
      <main className="flex-1 ml-64 mr-96 flex flex-col h-screen relative bg-white overflow-hidden">
        <Header />
        <ChatArea onReferencesDetected={handleReferencesDetected} />
      </main>
      <ReferencePanel activeReferences={activeRefs} />
    </div>
  );
}
