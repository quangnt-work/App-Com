import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { rateLimit } from "@/lib/rate-limit";

const ttsRateLimit = rateLimit(50, 60000); // 50 req / 1 min


export async function POST(req: Request) {
  try {
    const { text, voice = 'ru-RU-DmitryNeural', rate = 'default', pitch = 'default' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }
    
    if (text.length > 500) {
      return NextResponse.json({ error: 'Text too long' }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success } = ttsRateLimit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }, { status: 429 });
    }


    const tts = new EdgeTTS({
      voice,
      lang: 'ru-RU', // Default lang for voice
      rate,
      pitch,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });

    const tmpPath = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`);
    
    let audioBuffer: Buffer;
    try {
      await tts.ttsPromise(text, tmpPath);
      audioBuffer = await fs.promises.readFile(tmpPath);
    } finally {
      try {
        await fs.promises.unlink(tmpPath);
      } catch (e) {
        // ignore if not exists
      }
    }


    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error) {
    console.error('Edge TTS Error:', error);
    return NextResponse.json({ error: 'Lỗi tạo âm thanh.' }, { status: 500 });
  }
}
