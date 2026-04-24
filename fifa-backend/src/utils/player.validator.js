const validatePlayer = (data) => {
  const {
    name,
    team,
    position,
    version,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical
  } = data;

  // 1. Validar campos obligatorios
  if (
    !name || !team || !position || version === undefined ||
    pace === undefined || shooting === undefined ||
    passing === undefined || dribbling === undefined ||
    defending === undefined || physical === undefined
  ) {
    return {
      valid: false,
      message: 'Faltan datos obligatorios'
    };
  }

  // 2. Validar tipos numéricos
  const skills = [pace, shooting, passing, dribbling, defending, physical];

  for (let skill of skills) {
    if (isNaN(skill)) {
      return {
        valid: false,
        message: 'Las skills deben ser números'
      };
    }
  }

  // 3. Validar rango de skills (0–100)
  for (let skill of skills) {
    if (skill < 0 || skill > 100) {
      return {
        valid: false,
        message: 'Las skills deben estar entre 0 y 100'
      };
    }
  }

  // 4. Validar version (año FIFA)
  if (version < 2015 || version > 2030) {
    return {
      valid: false,
      message: 'Versión inválida'
    };
  }

  return { valid: true };
};

module.exports = {
  validatePlayer
};