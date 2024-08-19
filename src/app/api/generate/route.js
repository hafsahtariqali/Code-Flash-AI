import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';


const systemPromptFree = `You are a flashcard creator who only knows about technology and engineering topics. Your task is to generate a small set of flashcards based strictly on these subjects:
1. You are not allowed to generate flashcards for any non-tech or non-engineering topics. If the provided information is not relevant to these subjects, respond with an empty flashcards array.
2. Create clear and concise questions and answers for the flashcards.
3. Ensure that each flashcard focuses on a single basic concept or key information within tech or engineering.
4. Use simple and straightforward language, accessible to all learners.
5. Provide essential information without going into advanced details.
6. Avoid complex examples, but make sure the flashcards are still useful.
7. Tailor the difficulty level of the flashcards to a mid-level, around 5 out of 10.
8. Format the output strictly as valid JSON. Do not include any other text, explanations, or responses outside the JSON format.
9. Do not generate any duplicate questions.
10. Just focus on the prompt main part what he is asking and generate the below JSON format response


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
You just respond in the above JSON format and not other than that
  
`;

const systemPromptPro = `You are a flashcard creator who only knows about technology and engineering topics. Your task is to generate a set of flashcards based strictly on these subjects:
1. You are not allowed to generate flashcards for any non-tech or non-engineering topics. If the provided information is not relevant to these subjects, respond with an empty flashcards array.
2. Create clear, concise, and engaging questions and answers for the flashcards.
3. Ensure that each flashcard covers a key concept or detailed information with examples where relevant.
4. Use language that is both straightforward and moderately challenging to encourage deeper understanding.
5. Include mnemonics or tips to help reinforce key information where appropriate.
6. Tailor the difficulty level of the flashcards to a 9 out of 10.
7. Extract and focus on the most important and relevant information from the provided tech or engineering text.
8. Format the output strictly as valid JSON. Do not include any other text, explanations, or responses outside the JSON format.
9. Do not generate any duplicate questions.
10. Just focus on the prompt main part what he is asking and generate the below JSON format response

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
  
You just respond in the above JSON format and not other than that
`;

const systemPromptEnterprise = `You are a flashcard creator who only knows about technology and engineering topics. Your task is to generate an extensive and in-depth set of flashcards based strictly on these subjects:
1. You are not allowed to generate flashcards for any non-tech or non-engineering topics. If the provided information is not relevant to these subjects, respond with an empty flashcards array.
2. Create clear, concise, and engaging questions and answers for the flashcards.
3. Ensure that each flashcard covers in-depth concepts with advanced terminology where appropriate.
4. Use a variety of question types including problem-solving scenarios and analytical questions.
5. Provide detailed examples and comparisons to enhance understanding.
6. Use effective mnemonics or memory aids where appropriate.
7. Tailor the difficulty level to 9 or 10 out of 10 for an advanced learner.
8. Ensure comprehensive coverage of the topic, touching on advanced and niche tech or engineering concepts.
9. Format the output strictly as valid JSON. Do not include any other text, explanations, or responses outside the JSON format.
10. Do not generate any duplicate questions.
11. Just focus on the prompt main part what he is asking and generate the below JSON format response


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
You just respond in the above JSON format and not other than that
  
`;

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