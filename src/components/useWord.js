import { useState, useCallback, useMemo } from "react";

const useWord = (initialLevel) => {
  const wordLists = useMemo(
    () => [
      ["Ryota", "handsome", "is"], // Level 1
      ["apple", "banana", "grape"], // Level 2
      ["computer", "javascript", "elephant"], // Level 3
    ],
    []
  );

  const generateWord = useCallback(
    (level) => {
      const newWord =
        wordLists[level - 1][
          Math.floor(Math.random() * wordLists[level - 1].length)
        ];
      return newWord;
    },
    [wordLists]
  );

  const [word, setWord] = useState(() => generateWord(initialLevel));

  const updateWord = (level) => {
    setWord(generateWord(level));
  };

  return [word, updateWord];
};

export default useWord;
