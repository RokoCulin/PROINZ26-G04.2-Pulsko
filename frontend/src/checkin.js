// Raspoloženje (general_state u bazi): 5 = najbolje, 1 = najlošije.
export const MOODS = [
  [5, "Great"],
  [4, "Good"],
  [3, "Okay"],
  [2, "Low"],
  [1, "Unwell"],
];

export function moodLabel(value) {
  return MOODS.find(([key]) => key === value)?.[1] ?? null;
}

// Isti "danas" kao na backendu (Europe/Zagreb), u obliku YYYY-MM-DD.
export function todayInZagreb() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zagreb" });
}
