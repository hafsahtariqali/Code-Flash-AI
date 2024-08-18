import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

const systemPrompt = (difficulty) => `You are a flashcard creator. Your task is to generate a set of flashcards based on the given information:
1. Create clear and concise questions and answers for the flashcards.
2. Ensure that each flashcard focuses on a single concept or piece of information.
3. Use simple and straightforward language to make the flashcards accessible to a wide range of learners.
4. Include a variety of question types, such as definitions, examples, comparisons, and applications.
5. Avoid overly complex or ambiguous phrasing in both questions and answers.
6. When appropriate, use mnemonics or memory aids to help reinforce the information.
7. Tailor the difficulty level of the flashcards to the user's specified preferences, which is ${difficulty} out of 10.
8. Extract the most important and relevant information from the provided text for the flashcards.
9. Aim to create a balanced set of flashcards that comprehensively covers the topic.
10. Format the output strictly as valid JSON.
11. If asked about code or snippets, divide it into the number of flashcards instead of making a mess in response

Return the flashcards in the following JSON format:
{
  "flashcards": [
    {
      "front": "Question text here",
      "back": "Answer text here"
    }
    // Add more flashcards as needed
  ]
}
Strictly ensure that there is no other text than the flashcards array in JSON format`;

export async function POST(req) {
  try {
    const groq = new Groq({ apiKey: process.env.OPEN_AI_KEY });
    const { data, difficulty, plan } = await req.json(); // Plan comes from the client-side
    console.log('Received plan:', plan);

    let adjustedDifficulty = difficulty;
    let totalFlashcards = 10;

    if (plan === 'Pro') {
      adjustedDifficulty = Math.min(difficulty + 1, 10);
      totalFlashcards = 20;
    } else if (plan === 'Enterprise') {
      adjustedDifficulty = Math.min(difficulty + 2, 10);
      totalFlashcards = 60;
    }

    let flashcards = [];
    while (flashcards.length < totalFlashcards) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt(adjustedDifficulty) },
            { role: 'user', content: data },
          ],
          model: 'llama3-8b-8192',
          response_format: { type: 'json_object' },
        });

        const newFlashcards = JSON.parse(completion.choices[0].message.content).flashcards;
        flashcards = flashcards.concat(newFlashcards);

        if (flashcards.length >= totalFlashcards) break;
      } catch (innerError) {
        console.error("Error in Groq API request:", innerError);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
      }
    }

    flashcards = flashcards.slice(0, totalFlashcards);
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
