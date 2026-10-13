/**
 * TaskFlow Data Types & Schema Definitions
 */

/**
 * @typedef {Object} Task
 * @property {string|number} id
 * @property {string} title
 * @property {string} [description]
 * @property {string|number} [category]
 * @property {'TODO'|'IN_PROGRESS'|'COMPLETED'} status
 * @property {'LOW'|'MEDIUM'|'HIGH'|'URGENT'} priority
 * @property {string} [due_date]
 * @property {number} [estimated_hours]
 * @property {number} [assigned_to]
 * @property {string[]} [tags]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Category
 * @property {string|number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} color
 * @property {string} icon
 * @property {string} [description]
 */

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};
