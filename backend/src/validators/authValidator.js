export const registerValidator = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.toString().trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  if (!email || email.toString().trim() === '') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please use a valid email');
  }

  if (!password || password.toString().trim() === '') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    console.log('Validation errors:', errors);
    return res.status(400).json({ success: false, errors });
  }
  next();
};

export const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please use a valid email');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

export default { registerValidator, loginValidator };