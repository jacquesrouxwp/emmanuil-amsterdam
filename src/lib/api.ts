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

export async function cacheShare(params: {
  title: string;
  body: string;
  photoUrl?: string;
  lang?: string;
}): Promise<{ key: string }> {
  const res = await fetch(`${API_URL}/api/share/cache`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('cache failed');
  return res.json();
}

export async function prepareShare(params: {
  userId: number;
  title: string;
  body: string;
  photoUrl?: string;
  lang?: string;
}): Promise<{ preparedId: string }> {
  const res = await fetch(`${API_URL}/api/share/prepare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('prepare failed');
  return res.json();
}

export interface PostComment {
  id: string;
  userId: string;
  name: string;
  photo?: string;
  text: string;
  createdAt: string;
}

export async function fetchComments(postId: string): Promise<PostComment[]> {
  try {
    const res = await fetch(`${API_URL}/api/comments/${postId}`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function addComment(postId: string, params: {
  userId: string;
  name: string;
  photo?: string;
  text: string;
}): Promise<PostComment> {
  const res = await fetch(`${API_URL}/api/comments/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('comment failed');
  return res.json();
}

// --- Posts API ---

export interface ApiPost {
  _id: string;
  churchId?: string;
  date: string;
  tags: string[];
  photos: string[];
  videos?: string[];
  title: { ua: string; ru: string; en: string; nl?: string; es?: string };
  body: { ua: string; ru: string; en: string; nl?: string; es?: string };
}

// CHURCH_ID for this instance — each church sets this env var
export const CHURCH_ID = import.meta.env.VITE_CHURCH_ID || 'emmanuil-amsterdam';

// churchId='*' → all churches (world feed); churchId=X → that church only
export async function fetchPosts(churchId?: string): Promise<ApiPost[]> {
  try {
    const id = churchId ?? CHURCH_ID;
    const url = id === '*'
      ? `${API_URL}/api/posts`
      : `${API_URL}/api/posts?churchId=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function createPost(secret: string, data: Omit<ApiPost, '_id'>): Promise<ApiPost> {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('create failed');
  return res.json();
}

export async function updatePost(secret: string, id: string, data: Partial<ApiPost>): Promise<ApiPost> {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('update failed');
  return res.json();
}

export async function deletePost(secret: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-secret': secret },
  });
  if (!res.ok) throw new Error(`delete failed (${res.status})`);
}

// Real admin auth check — uses dedicated endpoint that requires secret
export async function checkAdminAuth(secret: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/admin/auth`, {
      headers: { 'x-admin-secret': secret },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Returns caller's churchId (or '*' for founder) + isGlobal flag
export async function getAdminInfo(secret: string): Promise<{ churchId: string; isGlobal: boolean } | null> {
  try {
    const res = await fetch(`${API_URL}/api/admin/auth`, {
      headers: { 'x-admin-secret': secret },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { churchId: data.churchId, isGlobal: !!data.isGlobal };
  } catch {
    return null;
  }
}

// ── Churches directory ─────────────────────────────────────────────────────

export interface ApiChurch {
  slug: string;
  name: string;
  city: string;
  country: string;
  address?: string;
  lat: number;
  lng: number;
  schedule?: string;
  telegram?: string;
  instagram?: string;
  website?: string;
  denomination?: string;
  pastor?: string;
  pastorBio?: string;
  language?: string[];
  coverPhoto?: string;
  description?: string;
  members?: number;
  founded?: number;
  verified?: boolean;
  founder?: boolean;
  invitedBy?: string | null;
  createdAt?: string;
}

export async function fetchChurches(): Promise<ApiChurch[]> {
  try {
    const res = await fetch(`${API_URL}/api/churches`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchChurch(slug: string): Promise<ApiChurch | null> {
  try {
    const res = await fetch(`${API_URL}/api/churches/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function seedChurches(secret: string, churches: any[]): Promise<{ inserted: number }> {
  const res = await fetch(`${API_URL}/api/churches/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify({ churches }),
  });
  if (!res.ok) throw new Error('seed churches failed');
  return res.json();
}

// ── Invitations ────────────────────────────────────────────────────────────

export interface Invitation {
  _id: string;
  token: string;
  invitedBy: string;
  note: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  usedBy: string | null;
}

export interface InvitationInfo {
  valid: boolean;
  invitedBy: string;
  inviter: { slug: string; name: string; city: string; country: string; pastor?: string } | null;
  expiresAt: string;
}

export async function createInvitation(secret: string, note?: string): Promise<{ token: string; url: string; expiresAt: string }> {
  const res = await fetch(`${API_URL}/api/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify({ note: note || '' }),
  });
  if (!res.ok) throw new Error('create invitation failed');
  return res.json();
}

export async function fetchInvitationInfo(token: string): Promise<InvitationInfo | { error: string }> {
  try {
    const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(token)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      return { error: err.error || 'Invalid' };
    }
    return res.json();
  } catch {
    return { error: 'Network error' };
  }
}

export interface RedeemPayload {
  slug: string;
  name: string;
  city: string;
  country: string;
  address?: string;
  lat: number;
  lng: number;
  denomination?: string;
  pastor: string;
  pastorBio: string;       // required: where he served, ministry history
  pastorEmail: string;     // required: for recovery
  language?: string[];
  telegram?: string;
  instagram?: string;
  website?: string;
  schedule?: string;
  coverPhoto?: string;
  description?: string;
}

export async function redeemInvitation(
  token: string,
  payload: RedeemPayload,
): Promise<{ church: ApiChurch; adminSecret: string }> {
  const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(token)}/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || 'redeem failed');
  }
  return res.json();
}

export async function listMyInvitations(secret: string): Promise<Invitation[]> {
  try {
    const res = await fetch(`${API_URL}/api/invitations`, {
      headers: { 'x-admin-secret': secret },
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function seedPosts(secret: string, posts: ApiPost[]): Promise<{ inserted: number }> {
  const res = await fetch(`${API_URL}/api/posts/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify({ posts }),
  });
  if (!res.ok) throw new Error('seed failed');
  return res.json();
}

export async function sendPostToUser(params: {
  userId: number;
  title: string;
  body: string;
  photoUrl?: string;
  lang?: string;
}): Promise<{ ok: boolean; messageId?: number }> {
  const res = await fetch(`${API_URL}/api/share/send-to-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('send failed');
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

// ── Events ──────────────────────────────────────────────────
export async function fetchApiEvents(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
export async function createEvent(secret: string, data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`create event failed (${res.status})`);
  return res.json();
}
export async function updateEvent(secret: string, id: string, data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`update event failed (${res.status})`);
  return res.json();
}
export async function deleteEvent(secret: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'DELETE', headers: { 'x-admin-secret': secret },
  });
  if (!res.ok) throw new Error(`delete event failed (${res.status})`);
}

// ── Stats ───────────────────────────────────────────────────
export async function fetchStats(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_URL}/api/stats`);
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}
export async function updateStats(secret: string, data: Record<string, number>): Promise<any> {
  const res = await fetch(`${API_URL}/api/stats`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`update stats failed (${res.status})`);
  return res.json();
}

// ── Home Groups ─────────────────────────────────────────────
export async function fetchApiHomeGroups(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/homegroups`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
export async function createHomeGroup(secret: string, data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/homegroups`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`create group failed (${res.status})`);
  return res.json();
}
export async function updateHomeGroup(secret: string, id: string, data: any): Promise<any> {
  const res = await fetch(`${API_URL}/api/homegroups/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`update group failed (${res.status})`);
  return res.json();
}
export async function deleteHomeGroup(secret: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/homegroups/${id}`, {
    method: 'DELETE', headers: { 'x-admin-secret': secret },
  });
  if (!res.ok) throw new Error(`delete group failed (${res.status})`);
}

// ── verifyInvitation (with TEST mode) ───────────────────────
export async function verifyInvitation(token: string): Promise<{
  valid: boolean; invitedBy?: string; reason?: string;
}> {
  try {
    if (token === 'TEST-INVITE-2024') {
      return { valid: true, invitedBy: 'Emmanuil Amsterdam (тест)' };
    }
    const res = await fetch(`${API_URL}/api/invitations/${encodeURIComponent(token)}`);
    if (!res.ok) return { valid: false, reason: 'Запрошення не знайдено' };
    return res.json();
  } catch {
    return { valid: false, reason: 'Помилка з\'єднання' };
  }
}
