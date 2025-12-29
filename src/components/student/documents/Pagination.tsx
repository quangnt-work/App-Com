import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200" disabled>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button className="h-9 w-9 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold">1</Button>
      <Button variant="ghost" className="h-9 w-9 rounded-lg text-slate-600 font-medium hover:bg-slate-100">2</Button>
      <Button variant="ghost" className="h-9 w-9 rounded-lg text-slate-600 font-medium hover:bg-slate-100">3</Button>
      <span className="text-slate-400 px-1">...</span>
      <Button variant="ghost" className="h-9 w-9 rounded-lg text-slate-600 font-medium hover:bg-slate-100">12</Button>

      <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-sky-500">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}