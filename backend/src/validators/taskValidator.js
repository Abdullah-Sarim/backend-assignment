export const createTaskValidator = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  } else if (title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

export const updateTaskValidator = (req, res, next) => {
  const { title, description, status } = req.body;
  const errors = [];

  if (title !== undefined && title.trim() === '') {
    errors.push('Title cannot be empty');
  } else if (title && title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    errors.push('Invalid status. Must be pending, in-progress, or completed');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

export default { createTaskValidator, updateTaskValidator };