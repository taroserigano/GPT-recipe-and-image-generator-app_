"use server" 
import dotenv from 'dotenv';
import OpenAI from "openai" 

// Purpose: Interact with Chat GPT. 
// 1. Generate Recipe based on the search 
// 2. Generate Image based on the search 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// generate recipe. Options are: 1. search term, 2. words limit,  3. output language  (EN for default) 
export const generateChatResponse = async (chatMessages:string, limit:number, lang="English") => {
     const limitWords = limit || 222 
     console.log("limit", limitWords)
    try {
      console.log(process.env.OPENAI_API_KEY)
      const response = await openai.chat.completions.create({

        messages: [
          { role: 'system', content: 'you are a helpful assistant' },
          // ...chatMessages,
          {role: 'user', content: `How can you cook ${chatMessages} ? Tell me in around  
          ${limitWords} words in ${lang} language. `}
        ],
        model: 'gpt-4o',
        // temperature: 0, - for randomize value 
        max_tokens: 500,
      });

//      console.log(response) 
      return response.choices[0].message.content
    } catch(err){
      console.log(err)
    }
  };
  // generate image based on search 
  export const generateImage = async (search : string) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `a picture of ${search}`,
      n: 1,
      size: '512x512',
    });

    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};