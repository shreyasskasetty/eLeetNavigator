export function toTitleCase(str: string) {
    return str
        .split('-')  // Split the string by dashes
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
        .join(' ');  // Join the words with a space
};

export function normalizeDashes(str: string) {
    return str.replace(/[-]+/g, '-').replace(/[()]/g, '');
}

interface DifficultyColors {
    [key: string]: string;
  }
  
  const difficultyColors: DifficultyColors = {
    easy: "#00AC5F",   // Yellow
    medium: "#B0872A", // Green
    hard: "#EE2F56"    // Red
  };
  
  export function convertDifficultyLevelToColor(difficulty: string): string {
    const color = difficultyColors[difficulty.toLowerCase()];
    return color || "#000"; // Return a default color if no matching difficulty is found
  }