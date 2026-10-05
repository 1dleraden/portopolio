import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const commentsFilePath = path.join(process.cwd(), 'src', 'data', 'comments.json');

// Default initial empty list (no sample dummy comments)
const fallbackComments = [];

async function readComments() {
  try {
    const data = await fs.readFile(commentsFilePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return fallbackComments;
  }
}

async function writeComments(comments) {
  try {
    await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing comments file:', err);
    return false;
  }
}

export async function GET() {
  const comments = await readComments();
  return NextResponse.json(comments);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Pesan kritik/saran tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const validCategories = ['saran', 'kritik', 'apresiasi', 'umum'];
    const chosenCategory = validCategories.includes(category) ? category : 'saran';

    const newComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: (name && name.trim().length > 0) ? name.trim().slice(0, 50) : 'Pengunjung Anonim',
      category: chosenCategory,
      message: message.trim().slice(0, 600),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const currentComments = await readComments();
    const updatedComments = [newComment, ...currentComments];
    await writeComments(updatedComments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('API comments POST error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan komentar.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Parameter ID komentar tidak diberikan.' },
        { status: 400 }
      );
    }

    // Support clearing all comments
    if (id === 'all') {
      await writeComments([]);
      return NextResponse.json({ success: true, message: 'Semua komentar telah dihapus.' });
    }

    const currentComments = await readComments();
    const updatedComments = currentComments.filter((c) => c.id !== id);
    await writeComments(updatedComments);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('API comments DELETE error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus komentar.' },
      { status: 500 }
    );
  }
}
