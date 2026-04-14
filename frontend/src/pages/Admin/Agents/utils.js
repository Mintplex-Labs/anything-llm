import strDistance from "js-levenshtein";

const LEVENSHTEIN_THRESHOLD = 3;

function skillMatchesSearch(skill, searchTerm) {
  if (!searchTerm) return true;

  const normalizedSearch = searchTerm.toLowerCase().trim();
  const titleLower = skill.title.toLowerCase();
  const descLower = skill.description.toLowerCase();

  if (titleLower.includes(normalizedSearch)) return true;
  if (descLower.includes(normalizedSearch)) return true;
  if (strDistance(titleLower, normalizedSearch) <= LEVENSHTEIN_THRESHOLD)
    return true;

  return false;
}

export function filterSkillCategories(skillCategories, searchTerm) {
  if (!searchTerm) return skillCategories;

  const filtered = {};
  for (const [key, category] of Object.entries(skillCategories)) {
    const matchingSkills = category.skills.filter((skill) =>
      skillMatchesSearch(skill, searchTerm)
    );
    if (matchingSkills.length > 0) {
      filtered[key] = { ...category, skills: matchingSkills };
    }
  }
  return filtered;
}
