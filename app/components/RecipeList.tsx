import React from 'react';
import Link from 'next/link';

// component to render recipe list 

interface Data {
  id: number;
  content: string;
  recipe: string;
}

interface Props {
  data: Data[];
  editData: (id: number) => void;
  deleteData: (id: number) => void;
}

// render out the list of recipe
const RecipeList: React.FC<Props> = ({ data: recipeData, editData, deleteData }) => {
  return (
    <ul className="space-y-4">
      {recipeData.map((data) => (
        <li
          key={data.id}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center"
        >
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {data.content} {data.recipe && ` - ${data.recipe.slice(0, 25)}...`}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => editData(data.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => deleteData(data.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
            <Link href={`/ai-suggestion?recipe=${data.content}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                Get the Recipe
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
