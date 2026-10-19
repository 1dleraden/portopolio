import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const payload = await req.json().catch(() => ({}));
    const event = req.headers.get('x-github-event') || 'unknown';

    // Clear server in-memory cache immediately
    if (globalThis.__github_repos_cache) {
      globalThis.__github_repos_cache.data = null;
      globalThis.__github_repos_cache.lastFetched = 0;
    }

    // Revalidate Next.js cache for api/github/repos and homepage
    try {
      revalidatePath('/api/github/repos');
      revalidatePath('/');
    } catch (e) {
      // In dev mode or certain environments this might be no-op
    }

    return NextResponse.json({
      success: true,
      event,
      action: payload.action || 'push_or_sync',
      repository: payload.repository?.full_name || '1dleraden/repo',
      timestamp: new Date().toISOString(),
      message: 'GitHub cache cleared and revalidated successfully. Portfolio is now synchronized.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/github/webhook',
    target: '1dleraden',
    instructions: 'Pasang URL ini di GitHub: Repo/Account Settings -> Webhooks -> Add Webhook. Pilih events: push, repository, create.'
  });
}
