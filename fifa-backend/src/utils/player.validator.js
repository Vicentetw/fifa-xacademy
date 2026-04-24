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

  if (
    !name || !team || !position || !version ||
    pace === null || shooting === null ||
    passing === null || dribbling === null ||
    defending === null || physical === null
  ) {
    return {
      valid: false,
      message: 'Datos inválidos o incompletos'
    };
  }

  return { valid: true };
};

module.exports = {
  validatePlayer
};