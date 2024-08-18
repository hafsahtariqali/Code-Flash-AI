import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';


const systemPromptFree = `You are a flashcard creator. Your task is to generate a small set of flashcards based on the given information:
1. Create clear and concise questions and answers for the flashcards.
2. Ensure that each flashcard focuses on a single basic concept or key information.
3. Use simple and straightforward language, accessible to all learners.
4. Provide essential information without going into advanced details.
5. Avoid complex examples, but make sure the flashcards are still useful.
6. Tailor the difficulty level of the flashcards to a mid-level, around 5 out of 10.
7. Format the output strictly as valid JSON.

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
Strictly ensure that there is no other text than the flashcards array in JSON format.`;


const systemPromptPro = `You are a flashcard creator. Your task is to generate a set of flashcards based on the given information:
1. Create clear, concise, and engaging questions and answers for the flashcards.
2. Ensure that each flashcard covers a key concept or detailed information with examples where relevant.
3. Use language that is both straightforward and moderately challenging to encourage deeper understanding.
4. Include mnemonics or tips to help reinforce key information where appropriate.
5. Tailor the difficulty level of the flashcards to the user's preference, around 7 out of 10.
6. Extract and focus on the most important and relevant information from the provided text.
7. Format the output strictly as valid JSON.

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
Strictly ensure that there is no other text than the flashcards array in JSON format.`;

const systemPromptEnterprise = `You are a flashcard creator. Your task is to generate an extensive and in-depth set of flashcards based on the given information:
1. Create clear, concise, and engaging questions and answers for the flashcards.
2. Ensure that each flashcard covers in-depth concepts with advanced terminology where appropriate.
3. Use a variety of question types including problem-solving scenarios and analytical questions.
4. Provide detailed examples and comparisons to enhance understanding.
5. Use effective mnemonics or memory aids where appropriate.
6. Tailor the difficulty level to 9 or 10 out of 10 for an advanced learner.
7. Ensure comprehensive coverage of the topic, touching on advanced and niche concepts.
8. Format the output strictly as valid JSON.

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
Strictly ensure that there is no other text than the flashcards array in JSON format.`;

export async function POST(req) {
  try {
    const groq = new Groq({ apiKey: process.env.OPEN_AI_KEY });
    const { data, difficulty, plan } = await req.json(); // Plan comes from the client-side
    console.log('Received plan:', plan);

    let adjustedDifficulty = difficulty;
    let totalFlashcards = 8;
    let prompt = systemPromptFree;

    if (plan === 'Pro') {
      adjustedDifficulty = Math.min(difficulty + 1, 10);
      totalFlashcards = 20;
      prompt = systemPromptPro.replace("{difficulty}", adjustedDifficulty);
    } else if (plan === 'Enterprise') {
      adjustedDifficulty = Math.min(difficulty + 2, 10);
      totalFlashcards = 60;
      prompt = systemPromptEnterprise.replace("{difficulty}", adjustedDifficulty);
    }

    let flashcards = [];
    while (flashcards.length < totalFlashcards) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: prompt },
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

