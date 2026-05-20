function mapToFrontend(playerFifa) {
  if (!playerFifa) return null;
  const p = playerFifa.toJSON ? playerFifa.toJSON() : playerFifa;
  return {
    id: p.id,
    name: p.long_name,
    team: p.club_name || '',
    position: p.player_positions,
    version: p.fifa_version ? (isNaN(Number(p.fifa_version)) ? p.fifa_version : Number(p.fifa_version)) : null,
    pace: p.pace || 0,
    shooting: p.shooting || 0,
    passing: p.passing || 0,
    dribbling: p.dribbling || 0,
    defending: p.defending || 0,
    physical: p.physic || p.physical || 0,
    overall: p.overall || 0,
    potential: p.potential || 0,
    player_face_url: p.player_face_url || null,
    fifa_update: p.fifa_update || null,
    nationality_name: p.nationality_name || null,
    work_rate: p.work_rate || null,
    body_type: p.body_type || null,
    player_traits: p.player_traits || null
  };
}

function mapFromFrontend(body) {
  if (!body || typeof body !== 'object') return {};
  const result = {
    long_name: body.name,
    club_name: body.team,
    player_positions: body.position,
    fifa_version: body.version,
    fifa_update: body.fifa_update,
    player_face_url: body.player_face_url,
    nationality_name: body.nationality_name,
    work_rate: body.work_rate,
    body_type: body.body_type,
    player_traits: body.player_traits,
    overall: body.overall,
    potential: body.potential,
    value_eur: body.value_eur,
    wage_eur: body.wage_eur,
    age: body.age,
    height_cm: body.height_cm,
    weight_kg: body.weight_kg,
    preferred_foot: body.preferred_foot,
    weak_foot: body.weak_foot,
    skill_moves: body.skill_moves,
    international_reputation: body.international_reputation,
    pace: body.pace,
    shooting: body.shooting,
    passing: body.passing,
    dribbling: body.dribbling,
    defending: body.defending,
    physic: body.physic || body.physical,
    attacking_crossing: body.attacking_crossing,
    attacking_finishing: body.attacking_finishing,
    attacking_heading_accuracy: body.attacking_heading_accuracy,
    attacking_short_passing: body.attacking_short_passing,
    attacking_volleys: body.attacking_volleys,
    skill_dribbling: body.skill_dribbling,
    skill_curve: body.skill_curve,
    skill_fk_accuracy: body.skill_fk_accuracy,
    skill_long_passing: body.skill_long_passing,
    skill_ball_control: body.skill_ball_control,
    movement_acceleration: body.movement_acceleration,
    movement_sprint_speed: body.movement_sprint_speed,
    movement_agility: body.movement_agility,
    movement_reactions: body.movement_reactions,
    movement_balance: body.movement_balance,
    power_shot_power: body.power_shot_power,
    power_jumping: body.power_jumping,
    power_stamina: body.power_stamina,
    power_strength: body.power_strength,
    power_long_shots: body.power_long_shots,
    mentality_aggression: body.mentality_aggression,
    mentality_interceptions: body.mentality_interceptions,
    mentality_positioning: body.mentality_positioning,
    mentality_vision: body.mentality_vision,
    mentality_penalties: body.mentality_penalties,
    mentality_composure: body.mentality_composure,
    defending_marking: body.defending_marking,
    defending_standing_tackle: body.defending_standing_tackle,
    defending_sliding_tackle: body.defending_sliding_tackle,
    goalkeeping_diving: body.goalkeeping_diving,
    goalkeeping_handling: body.goalkeeping_handling,
    goalkeeping_kicking: body.goalkeeping_kicking,
    goalkeeping_positioning: body.goalkeeping_positioning,
    goalkeeping_reflexes: body.goalkeeping_reflexes,
    goalkeeping_speed: body.goalkeeping_speed
  };

  // Eliminar campos undefined para no sobrescribir valores en actualizaciones parciales.
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) delete result[key];
  });

  return result;
}

module.exports = { mapToFrontend, mapFromFrontend };
