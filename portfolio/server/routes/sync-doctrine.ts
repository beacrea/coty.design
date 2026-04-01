import crypto from 'crypto';
import type { Request, Response } from 'express';
import { fetchAndWriteDoctrine, DOCTRINE_FILE_PATH } from '../lib/github-sync.js';

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function isDoctrineModified(body: Record<string, unknown>): boolean {
  const commits = body.commits as Array<{
    added?: string[];
    removed?: string[];
    modified?: string[];
  }> | undefined;

  if (!commits || !Array.isArray(commits)) return false;

  return commits.some((commit) => {
    const allFiles = [
      ...(commit.added ?? []),
      ...(commit.removed ?? []),
      ...(commit.modified ?? []),
    ];
    return allFiles.includes(DOCTRINE_FILE_PATH);
  });
}

export async function syncDoctrine(req: Request, res: Response): Promise<void> {
  const webhookSignature = req.headers['x-hub-signature-256'] as string | undefined;
  const manualSecret = req.headers['x-sync-secret'] as string | undefined;
  const githubEvent = req.headers['x-github-event'] as string | undefined;

  if (webhookSignature) {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[sync-doctrine] GITHUB_WEBHOOK_SECRET not configured');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    const rawBody = (req as Request & { rawBody?: string }).rawBody;
    if (!rawBody) {
      console.error('[sync-doctrine] Raw body not available for signature verification');
      res.status(400).json({ error: 'Raw body not available' });
      return;
    }

    if (!verifyWebhookSignature(rawBody, webhookSignature, webhookSecret)) {
      console.warn('[sync-doctrine] Invalid webhook signature');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    if (githubEvent === 'ping') {
      console.log('[sync-doctrine] Received GitHub ping event');
      res.json({ message: 'pong' });
      return;
    }

    if (githubEvent !== 'push') {
      console.log(`[sync-doctrine] Ignoring GitHub event: ${githubEvent}`);
      res.json({ message: `Ignored event: ${githubEvent}` });
      return;
    }

    const body = req.body as Record<string, unknown>;
    if (!isDoctrineModified(body)) {
      console.log('[sync-doctrine] Push event does not modify doctrine file, skipping');
      res.json({ message: 'No doctrine changes detected, skipping sync' });
      return;
    }

    console.log('[sync-doctrine] Webhook push with doctrine changes detected, syncing...');
  } else if (manualSecret) {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret || manualSecret !== webhookSecret) {
      console.warn('[sync-doctrine] Invalid manual sync secret');
      res.status(401).json({ error: 'Invalid secret' });
      return;
    }

    console.log('[sync-doctrine] Manual sync triggered');
  } else {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const result = await fetchAndWriteDoctrine();
    if (result.success) {
      console.log(`[sync-doctrine] ${result.message}`);
      res.json(result);
    } else {
      console.error(`[sync-doctrine] Sync failed: ${result.message}`);
      res.status(500).json(result);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sync-doctrine] Unexpected error: ${message}`);
    res.status(500).json({ success: false, message, timestamp: new Date().toISOString() });
  }
}
