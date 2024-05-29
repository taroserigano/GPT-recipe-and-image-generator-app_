"use client";
import {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dynamic from "next/dynamic";
import dotenv from "dotenv";

const RecipeList = dynamic(() => import("./components/RecipeList"), {
  ssr: false,
});

export default function Home() {
  // Interface for recipe search data
  interface Data {
    id: number;
    content: string;
    recipe: string;
  }

  let ref = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load up the initial data from localStorage
  const [data, setData] = useState<Data[]>(() => {
    // check if the code is running on the browser environment
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("data");
      return savedData
        ? JSON.parse(savedData)
        : [
            { id: 1, content: "Pizza 🍕", recipe: "" },
            { id: 2, content: "Pasta 🍝", recipe: "" },
          ];
    }
    return [
      { id: 1, content: "Pizza 🍕", recipe: "" },
      { id: 2, content: "Pasta 🍝", recipe: "" },
    ];
  });

  const [newData, setNewData] = useState<string>("");
  const [newRecipe, setNewRecipe] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editRecipe, setEditRecipe] = useState<string>("");

  // Load up the data from localStorage at initial rendering
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  // Focus on input at initial loading
  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, []);

  // Add debounce feature
  // Search will be triggered only after the wait time
  const debounce = (func: Function, wait: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(
      (...args: any[]) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          func(...args);
        }, wait);
      },
      [func, wait]
    );
  };

  // Search recipe from the API
  const searchRecipes = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
            query: query,
          },
        }
      );
      setRecipes(response.data.results);
      toast.success("Recipes fetched successfully!", { autoClose: 777 });
    } catch (error) {
      setError("Error fetching recipes");
      toast.error("Error fetching recipes", { autoClose: 777 });
    }
  };

  // Implement debounce feature with the searchRecipes
  const debouncedSearchRecipes = debounce(searchRecipes, 777);

  // Basic CRUD operations below
  const addData = (newData: string, newRecipe: string) => {
    // if newData is empty,
    if (!newData.trim()) {
      toast.error("Recipe data cannot be empty", { autoClose: 500 });
      return;
    }
    newData = newData[0].toUpperCase() + newData.slice(1);
    setData([...data, { id: Date.now(), content: newData, recipe: newRecipe }]);
    setNewData("");
    setNewRecipe("");
    toast.success("Recipe added!", { autoClose: 500 });
  };

  const startEditData = (id: number) => {
    const Data = data.find((t) => t.id === id);
    if (Data) {
      setEditId(id);
      setEditContent(Data.content);
      setEditRecipe(Data.recipe);
    }
  };

  const updateData = () => {
    if (editId !== null && editContent.trim()) {
      setData(
        data.map((Data) =>
          Data.id === editId
            ? { ...Data, content: editContent, recipe: editRecipe }
            : Data
        )
      );
      setEditId(null);
      setEditContent("");
      setEditRecipe("");
      toast.info("Recipe updated!", { autoClose: 500 });
    }
  };

  const deleteData = (id: number) => {
    setData(data.filter((Data) => Data.id !== id));
    toast.warning("Recipe deleted!", { autoClose: 500 });
  };

  // Support function for key press down
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addData(newData, newRecipe);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Taro's{" "}
        <span className="text-green-500">
          W<span className="text-green-500"></span>ild
        </span>
        💙 Recipe Generator
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          placeholder="Add new Menu"
          ref={ref}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          value={newRecipe}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewRecipe(e.target.value)}
          placeholder="Add recipe for the Menu"
          className="border p-2 rounded w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={() => addData(newData, newRecipe)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
        >
          Add
        </button>
      </div>
      {editId !== null && (
        <div className="mb-4">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit Data"
            className="border p-2 rounded w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <textarea
            rows={3}
            value={editRecipe}
            onChange={(e) => setEditRecipe(e.target.value)}
            placeholder="Edit recipe for Data"
            className="border p-2 rounded w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={updateData}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 w-full sm:w-auto"
          >
            Update
          </button>
        </div>
      )}
      <RecipeList
        data={data}
        editData={startEditData}
        deleteData={deleteData}
      />

      <div className="mb-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Browse Recipe</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={debouncedSearchRecipes}
          className="border p-2 rounded w-full mb-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
          placeholder="Search recipe menu"
        />
        <button
          onClick={searchRecipes}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded p-4"
          >
            <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
            <Link
              href={`/ai-suggestion?recipe=${recipe.title}`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-2 w-full text-center"
            >
              Get AI Suggestions
            </Link>
            <button
              onClick={() => addData(recipe.title, "")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 w-full sm:w-auto"
            >
              SAVE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
