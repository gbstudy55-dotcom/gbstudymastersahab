export const API_BASE = 'https://mastersahab.studybeepro.site/api/ms';

async function apiPost(path: string, body: any) {
  // 1. Try relative URL first (Vercel edge rewrite proxy, zero CORS issues)
  try {
    const res = await fetch(`/api/ms${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const json = await res.json();
      return json?.decodedResponse?.data || json?.data || null;
    }
  } catch (_) {
    // Continue to direct endpoint fallback
  }

  // 2. Fallback to direct absolute endpoint
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const json = await res.json();
      return json?.decodedResponse?.data || json?.data || null;
    }
  } catch (err) {
    console.warn(`API call ${path} failed:`, err);
  }

  return null;
}

export async function fetchLiveCourses() {
  const data = await apiPost('/course/get_courses', {
    course_type: '5325',
    page: 1,
    sub_cat: 1,
    main_cat: 0
  });
  return data || [];
}

export async function fetchComboCourses(courseId: string) {
  const data = await apiPost('/course_deprecated/get_combo_course_list', {
    course_id: String(courseId),
    page: 1,
    search: ''
  });
  return data || [];
}

export async function fetchCourseDetail(courseId: string, parentId: string) {
  const data = await apiPost('/course_deprecated/get_course_detail', {
    course_id: String(courseId),
    parent_id: String(parentId)
  });
  if (!data) return null;

  const tiles = data?.tiles || [];
  const contentTile = tiles.find((t: any) => t.type === 'content') || tiles[0];
  return {
    courseDetail: data?.course_detail || {},
    subjects: contentTile?.meta?.list || [],
    tile: contentTile
  };
}

export async function fetchTopicItems(
  courseId: string,
  topicId: string,
  subjectId: string,
  parentId: string,
  tileId: string = '0'
) {
  const data = await apiPost('/course/get_master_data', {
    course_id: String(courseId),
    tile_id: String(tileId),
    type: 'content',
    revert_api: '1#0#0#1',
    topic_id: String(topicId),
    subject_id: String(subjectId),
    layer: 3,
    page: 1,
    parent_id: String(parentId)
  });
  return data?.list || [];
}
