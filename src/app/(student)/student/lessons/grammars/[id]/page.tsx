// src/app/(student)/student/lessons/[id]/page.tsx
import { notFound } from "next/navigation";
import { GrammarRepository } from "@/repositories/GrammarRepository";
import { GrammarHeader } from "@/components/student/lessons/grammars/grammar-detail/GrammarHeader";
import { GrammarMainView } from "@/components/student/lessons/grammars/grammar-detail/GrammarMainView";
import { Grammar } from "@/types/grammar";


interface GrammarDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function GrammarDetailPage(props: GrammarDetailPageProps) {
  const params = await props.params;
  const response = await GrammarRepository.getById(params.id);
  const grammar: Grammar | null = response?.data;


  if (!grammar) {
    notFound();
  }


  return (
    // Đổi màu nền nền cho giống thiết kế
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
      <GrammarHeader grammar={grammar} />


      <div className="container mx-auto px-4 max-w-7xl mt-6">
        <GrammarMainView grammar={grammar} />
      </div>
    </div>
  );
}