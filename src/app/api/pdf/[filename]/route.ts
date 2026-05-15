import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');
  
  // Await the params object in Next.js 15+
  const { filename } = await params;

  if (!fileUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
        return new NextResponse(`Error fetching PDF: ${response.statusText}`, { status: response.status });
    }
    
    const blob = await response.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching PDF', { status: 500 });
  }
}
