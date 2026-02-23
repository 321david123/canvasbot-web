const PER_PAGE = 100;

interface CanvasApiOptions {
  canvasUrl: string;
  accessToken: string;
}

async function canvasFetch(opts: CanvasApiOptions, path: string, params?: Record<string, string>) {
  const url = new URL(`/api/v1${path}`, opts.canvasUrl);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  url.searchParams.set("per_page", String(PER_PAGE));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Canvas API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  enrollments?: { type: string }[];
}

export interface CanvasAssignment {
  id: number;
  name: string;
  due_at: string | null;
  points_possible: number | null;
  html_url: string;
  submission?: {
    workflow_state: string;
    score: number | null;
    submitted_at: string | null;
  };
  submission_types?: string[];
}

export interface CanvasDiscussion {
  id: number;
  title: string;
  message: string | null;
  posted_at: string | null;
  html_url: string;
}

export async function fetchCourses(opts: CanvasApiOptions): Promise<CanvasCourse[]> {
  const data = await canvasFetch(opts, "/courses", {
    enrollment_state: "active",
    include: "total_scores",
  });
  return (data as CanvasCourse[]).filter(
    (c) => c.name && !c.name.includes("Training") && !c.name.includes("Sandbox")
  );
}

export async function fetchAssignments(opts: CanvasApiOptions, courseId: number): Promise<CanvasAssignment[]> {
  try {
    return await canvasFetch(opts, `/courses/${courseId}/assignments`, {
      include: "submission",
      order_by: "due_at",
    });
  } catch {
    return [];
  }
}

export async function fetchAnnouncements(opts: CanvasApiOptions, courseIds: number[]): Promise<CanvasDiscussion[]> {
  if (courseIds.length === 0) return [];
  try {
    const params: Record<string, string> = {
      "context_codes[]": courseIds.map((id) => `course_${id}`).join(","),
      latest_only: "false",
    };
    // Canvas announcements endpoint needs context_codes as repeated params
    const url = new URL("/api/v1/announcements", opts.canvasUrl);
    for (const id of courseIds) {
      url.searchParams.append("context_codes[]", `course_${id}`);
    }
    url.searchParams.set("per_page", String(PER_PAGE));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${opts.accessToken}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function testConnection(opts: CanvasApiOptions): Promise<{ ok: boolean; userName?: string; error?: string }> {
  try {
    const data = await canvasFetch(opts, "/users/self");
    return { ok: true, userName: data.name };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
