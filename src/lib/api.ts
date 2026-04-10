// In production, API is on the same origin. In dev, use localhost:3002
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3002';

export interface AttendeeInfo {
  name: string;
  photo?: string;
}

export interface GroupAttendance {
  count: number;
  attendees: AttendeeInfo[];
}

export interface ToggleResult extends GroupAttendance {
  isAttending: boolean;
}

export async function fetchAllAttendance(): Promise<Record<string, GroupAttendance>> {
  const res = await fetch(`${API_URL}/api/attendance`);
  if (!res.ok) return {};
  return res.json();
}

export async function subscribe(chatId: number, name: string): Promise<void> {
  try {
    await fetch(`${API_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, name }),
    });
  } catch {
    // non-critical, silently ignore
  }
}

export interface PostReaction { likes: number; shares: number; }

export async function fetchReactions(): Promise<Record<string, PostReaction>> {
  try {
    const res = await fetch(`${API_URL}/api/reactions`);
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export async function likePost(postId: string, delta: 1 | -1): Promise<PostReaction> {
  const res = await fetch(`${API_URL}/api/reactions/${postId}/like`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta }),
  });
  return res.json();
}

export async function sharePost(postId: string): Promise<PostReaction> {
  const res = await fetch(`${API_URL}/api/reactions/${postId}/share`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function toggleAttendance(
  groupId: string,
  userId: string,
  name: string,
  photo?: string,
): Promise<ToggleResult> {
  const res = await fetch(`${API_URL}/api/attendance/${groupId}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name, photo }),
  });
  return res.json();
}
