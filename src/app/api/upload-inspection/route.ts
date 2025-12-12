import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Required for static export
export const dynamic = 'force-static';

// Increase body size limit for this route
export const maxDuration = 300; // 5 minutes
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'video' or 'audio'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || (type !== 'video' && type !== 'audio')) {
      return NextResponse.json(
        { error: 'Invalid type. Must be video or audio' },
        { status: 400 }
      );
    }

    // Validate file type - be more permissive for recorded files
    const fileExtLower = path.extname(file.name).toLowerCase().replace('.', '');
    const isWebm = fileExtLower === 'webm';
    
    if (type === 'video') {
      const videoTypes = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
      const extnameOk = videoTypes.includes(fileExtLower);
      // Accept video/* mime type OR webm files (recorded videos are often video/webm)
      const mimeOk = /^video\//.test(file.type) || (isWebm && type === 'video');
      if (!mimeOk && !extnameOk) {
        return NextResponse.json(
          { error: `Invalid video file type. Extension: ${fileExtLower}, MIME: ${file.type}` },
          { status: 400 }
        );
      }
    } else if (type === 'audio') {
      const audioTypes = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm'];
      const extnameOk = audioTypes.includes(fileExtLower);
      // Accept audio/* mime type OR webm files (recorded audio can be video/webm)
      // When recording audio, browsers often create video/webm files
      const mimeOk = /^audio\//.test(file.type) || (isWebm && type === 'audio') || file.type === 'video/webm';
      if (!mimeOk && !extnameOk) {
        return NextResponse.json(
          { error: `Invalid audio file type. Extension: ${fileExtLower}, MIME: ${file.type}` },
          { status: 400 }
        );
      }
    }

    // Larger file size limit for videos (100MB) and audio (50MB)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size exceeds limit (${type === 'video' ? '100MB' : '50MB'})`,
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'inspections'
    );
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    // Return the file URL
    const fileUrl = `/uploads/inspections/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Check if it's a size limit error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('413') || errorMessage.includes('too large')) {
      return NextResponse.json(
        {
          error: 'File too large. Please check server configuration for body size limits.',
          details: 'The server may need nginx/client_max_body_size or Next.js body size limit increased.',
        },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}


