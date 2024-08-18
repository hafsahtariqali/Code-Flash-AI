import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const systemPromptFree = `You are a flashcard creator. Your task is to generate a small set of flashcards based on the given information:
1. Create clear and concise questions and answers for the flashcards.
2. Ensure that each flashcard focuses on a single concept or piece of information.
3. Use simple and straightforward language to make the flashcards accessible to a wide range of learners.
4. Include a variety of question types, such as definitions, examples, comparisons, and applications.
5. Avoid overly complex or ambiguous phrasing in both questions and answers.
6. Format the output strictly as valid JSON.

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
2. Ensure that each flashcard covers a key concept or piece of information, with a focus on enhancing understanding.
3. Use a mix of straightforward and moderately challenging language to cater to learners who want a bit more depth.
4. Include a variety of question types, such as definitions, examples, comparisons, applications, and problem-solving scenarios.
5. Use some mnemonics or memory aids to help reinforce key information.
6. Tailor the difficulty level of the flashcards to the user's specified preferences, which is {difficulty} out of 10.
7. Extract the most important and relevant information from the provided text for the flashcards.
8. Ensure the set is interesting and comprehensive, giving learners a solid grasp of the topic.
9. Format the output strictly as valid JSON.

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
2. Ensure that each flashcard delves into important concepts, with a focus on thorough understanding.
3. Use a range of language, including advanced terminology, to cater to learners looking for a deep dive into the topic.
4. Include a wide variety of question types, such as definitions, examples, comparisons, applications, problem-solving scenarios, and analytical questions.
5. Use effective mnemonics or memory aids where appropriate to reinforce the information.
6. Tailor the difficulty level of the flashcards to the user's specified preferences, which is {difficulty} out of 10.
7. Extract the most important and relevant information from the provided text for the flashcards, ensuring comprehensive coverage.
8. Aim to create an engaging and thorough set of flashcards that covers the topic extensively.
9. Format the output strictly as valid JSON.

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
    const { data, difficulty, plan } = await req.json();

    let adjustedDifficulty = difficulty;
    let totalFlashcards = 5;
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
