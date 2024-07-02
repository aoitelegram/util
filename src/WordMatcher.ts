class WordMatcher {
  private words: string[];

  /**
   * Creates an instance of WordMatcher.
   * @param words - The list of words to match against.
   */
  constructor(words: string[]) {
    this.words = words;
  }

  /**
   * Searches for the best match for the input word from the list of words.
   * @param inputWord - The word to search for.
   * @returns The word with the highest similarity or null if no match is found.
   */
  search(inputWord: string) {
    let bestMatch: { word: string; similarity: number } | null = null;

    for (const word of this.words) {
      const similarity = this.calculateSimilarity(inputWord, word);

      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { word, similarity };
      }
    }

    return bestMatch ? bestMatch.word : null;
  }

  /**
   * Calculates the similarity between two words.
   * @param word1 - The first word.
   * @param word2 - The second word.
   * @returns The similarity score between 0 and 1.
   */
  private calculateSimilarity(word1: string, word2: string) {
    const longerWord = word1.length > word2.length ? word1 : word2;
    const shorterWord = word1.length > word2.length ? word2 : word1;
    const longerLength = longerWord.length;

    if (longerLength === 0) {
      return 1.0;
    }

    return (
      (longerLength - this.calculateEditDistance(longerWord, shorterWord)) /
      longerLength
    );
  }

  /**
   * Calculates the edit distance (Levenshtein distance) between two words.
   * @param word1 - The first word.
   * @param word2 - The second word.
   * @returns The edit distance between the two words.
   */
  private calculateEditDistance(word1: string, word2: string) {
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    const costs: number[] = [];

    for (let i = 0; i <= word1.length; i++) {
      let lastValue = i;

      for (let j = 0; j <= word2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (word1.charAt(i - 1) !== word2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }

      if (i > 0) {
        costs[word2.length] = lastValue;
      }
    }

    return costs[word2.length];
  }
}

export { WordMatcher };
