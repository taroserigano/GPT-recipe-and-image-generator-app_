"use client";

// ai-suggestion/page.tsx

// Purpose: ChatGPT will generate the recipe for the selected food menu
// Options: language, word limit,

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateChatResponse } from "@/utils/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AiSuggestion = () => {
  // grab the search params
  const searchParams = useSearchParams();
  const router = useRouter();
  let recipe = searchParams.get("recipe");

  const handleGoBack = () => {
    router.back();
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState("");
  const [wordLimit, setWordLimit] = useState<number>(100);
  const [language, setLanguage] = useState<string>("en"); // default to English

  const searchRecipe = async (recipe: any, limit: number, lang: string) => {
    setLoading(true);

    // search for the recipe with chatGPT
    try {
      const response = await generateChatResponse(recipe, limit, lang);
      setData(response ?? "");
      setSuggestions(response ? response.split("\n") : []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching AI suggestions");
      setLoading(false);
    }
  };

  // if condition changed, do the search again
  useEffect(() => {
    // if already result was generated, skip the repeated search again
    if (suggestions.length === 0 || suggestions === null) {
      searchRecipe(recipe, wordLimit, language);
    } else {
      setLoading(false);
    }
  }, [recipe, suggestions]);

  // save the generated recipe, add to the selected food
  const saveRecipe = () => {
    if (typeof window !== "undefined") {
      // load up from local storage
      const recipeData = JSON.parse(localStorage.getItem("data") || "[]");
      // find the corresponding menu and add that recipe to the menu
      const updatedrecipeData = recipeData.map((recipeData: any) =>
        recipeData.content === recipe
          ? { ...recipeData, recipe: data }
          : recipeData
      );
      localStorage.setItem("data", JSON.stringify(updatedrecipeData));
      toast.success("Recipe saved to recipeData!", { autoClose: 500 });
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white transition duration-300">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Recipe Screen for {recipe} 😉
      </h1>

      <div className="text-center mb-6">
        <label htmlFor="wordLimit" className="mr-2">
          Word Limit:
        </label>
        <input
          id="wordLimit"
          type="number"
          value={wordLimit}
          onChange={(e) => setWordLimit(parseInt(e.target.value))} // set word limit
          className="w-20 p-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <label htmlFor="language" className="mr-2 ml-4">
          Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className=" border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="en">English</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="it">Italian</option>
          <option value="es">Spanish</option>
          <option value="pl">Polish</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading suggestions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <h4 className="text-lg mb-4">{data}</h4>
      )}

      <div className="flex justify-center space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={handleGoBack}
        >
          Go Back
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => searchRecipe(recipe, wordLimit, language)}
        >
          Search
        </button>
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mt-4 mx-auto block"
        onClick={saveRecipe}
      >
        Save Recipe
      </button>
    </div>
  );
};

// export default AiSuggestion;

export default function AiSuggestionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AiSuggestion />
    </Suspense>
  );
}
