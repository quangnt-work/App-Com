import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: Request) {
  try {
    const { text, voice = 'ru-RU-DmitryNeural', rate = 'default', pitch = 'default' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }

    const tts = new EdgeTTS({
      voice,
      lang: 'ru-RU', // Default lang for voice
      rate,
      pitch,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });

    const tmpPath = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`);
    
    // Tạo file MP3
    await tts.ttsPromise(text, tmpPath);
    
    // Đọc file thành buffer
    const audioBuffer = fs.readFileSync(tmpPath);
    
    // Xoá file rác
    fs.unlinkSync(tmpPath);

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
