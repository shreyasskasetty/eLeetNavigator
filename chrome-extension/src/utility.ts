export function formatProblemString(input: string): string {
    // Function to check if a word is a Roman numeral
    function isRomanNumeral(word: string): boolean {
      return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(word);
    }
  
    return input
      .replace(/-/g, " ") // Replace hyphens with spaces
      .split(" ") // Split into words
      .map((word: string) => {
        // If word is a Roman numeral, make all letters uppercase
        if (isRomanNumeral(word)) {
          return word.toUpperCase();
        }
        // Otherwise, capitalize only the first letter of the word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" "); // Join words back into a string
  }