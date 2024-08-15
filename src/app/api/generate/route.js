import { NextResponse } from 'next/server'
import Groq from "groq-sdk";


const systemPrompt=(difficulty) =>`You are a flashcard creator, Your task is to generate 10 concise and effective flashcards based on the give information:
1. Create clear and concise questions for the flashcards
2. Provide accurate and informative answers for the back of the flashcards
3. Ensure that each flashcard focuses  on a single concept or a piece of information.
4. Use simple language to make the flashcards accessible to a wide ranfge of learners.
5. Include  a variety of question types, such as definitions , examples, comparisons, and applications.
6. Avoid overly complex or ambigous phrasing in both questions and answers.
7. when appropriate,use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.which is ${difficulty} out of 10.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10.Aim to create a blanced set of flashcards that covers the topic comprehensively.

Remember , the goal is to facilitate effective learning and retention of information through these flash.

Return in the following JSON format
{
  "flashcards": [{
       "front": str,
       "back": str
}]
}
Ensure that the output is valid JSON. Do not include any text outside of the JSON object.

`


export async function POST(req) {
   
  try {
    const groq = new Groq({ apiKey: process.env.OPEN_AI_KEY });

   
    const { data, difficulty } = await req.json();

 
    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt(difficulty) },
            { role: 'user', content: data },  
        ],
        model: 'llama3-8b-8192',
        response_format: { type: 'json_object' },
    });

    const flashcards = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(flashcards.flashcards);

} catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
}

}