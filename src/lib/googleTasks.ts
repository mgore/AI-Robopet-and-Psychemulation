/**
 * Google Tasks API Client Integration
 * Scopes required: https://www.googleapis.com/auth/tasks
 */

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
  selfLink?: string;
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  updated?: string;
  selfLink?: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  position?: string;
}

const TASKS_BASE_URL = 'https://tasks.googleapis.com/tasks/v1';

export async function listTaskLists(accessToken: string): Promise<GoogleTaskList[]> {
  const res = await fetch(`${TASKS_BASE_URL}/users/@me/lists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Task lists (${res.status})`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createTaskList(accessToken: string, title: string): Promise<GoogleTaskList> {
  const res = await fetch(`${TASKS_BASE_URL}/users/@me/lists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task list (${res.status})`);
  }

  return await res.json();
}

export async function listTasks(accessToken: string, taskListId: string): Promise<GoogleTaskItem[]> {
  const res = await fetch(`${TASKS_BASE_URL}/lists/${taskListId}/tasks?showCompleted=true&showHidden=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list tasks (${res.status})`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createTask(
  accessToken: string,
  taskListId: string,
  task: { title: string; notes?: string; due?: string }
): Promise<GoogleTaskItem> {
  const res = await fetch(`${TASKS_BASE_URL}/lists/${taskListId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task (${res.status})`);
  }

  return await res.json();
}

export async function updateTaskStatus(
  accessToken: string,
  taskListId: string,
  taskId: string,
  isCompleted: boolean
): Promise<GoogleTaskItem> {
  const res = await fetch(`${TASKS_BASE_URL}/lists/${taskListId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: isCompleted ? 'completed' : 'needsAction',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update task (${res.status})`);
  }

  return await res.json();
}

export async function deleteTask(
  accessToken: string,
  taskListId: string,
  taskId: string
): Promise<void> {
  const res = await fetch(`${TASKS_BASE_URL}/lists/${taskListId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete task (${res.status})`);
  }
}

/**
 * High-level helper: Sync an entire assembly roadmap to a dedicated Google Tasks list
 */
export async function syncRobotRoadmapToGoogleTasks(
  accessToken: string,
  projectName: string,
  roadmapSteps: Array<{ title: string; description?: string }>,
  existingListId?: string
): Promise<{ list: GoogleTaskList; createdTasks: GoogleTaskItem[] }> {
  let targetList: GoogleTaskList;

  if (existingListId) {
    const lists = await listTaskLists(accessToken);
    const found = lists.find(l => l.id === existingListId);
    if (found) {
      targetList = found;
    } else {
      targetList = await createTaskList(accessToken, `🤖 ${projectName} Build Roadmap`);
    }
  } else {
    targetList = await createTaskList(accessToken, `🤖 ${projectName} Build Roadmap`);
  }

  const createdTasks: GoogleTaskItem[] = [];
  for (let i = 0; i < roadmapSteps.length; i++) {
    const step = roadmapSteps[i];
    const task = await createTask(accessToken, targetList.id, {
      title: `Step ${i + 1}: ${step.title}`,
      notes: step.description ? `AI RoboPet Guidance:\n${step.description}` : undefined,
    });
    createdTasks.push(task);
  }

  return { list: targetList, createdTasks };
}
