import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIservice {
  getAIResponse = async (
    roomId: string,
    secretWord: string,
    countLetter: number,
    language: string | null,
    temperature: number = 0.7
  ) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/messages/${roomId}`
      );
      const messages = response.data;

      const prompt = messages
        .map(
          (msg: any) =>
            `Task: Based on the message and chat history, output a single word that players try to guess by associations starting with a specific letter.

              Context: In a web-based game, players gather in a room and start a game against AI. A random word is chosen from a database. Players must guess 
              words starting with its first letter and try to make another player understand the word they are thinking of through associations. As the host (the model), 
              you must guess the word based on these messages.
              Examples:
              A player writes, "He's a famous cartoon character from the Soviet era." Given that the word starts with "Б" your response is, "уверенность в ответе: 100%; буратино"
              Another case: "we all write with it",Given that the word starts with "Р" you respond, "уверенность в ответе: 70%; Ручка"
              Persona: You are the most professional at guessing words based on their associations. You have unlimited access to verbs, nouns, adjectives, slang, etc., as this is a game about guessing words.

              Format: Provide your response in the format "confidence in answer: your percentage%; your word." Double-check that the word starts with the specified letter (initial) and that it fits the associations.

              Tone: Use a casual conversational tone. You are engaging and clever, using a rich vocabulary to interact with the players, enhancing their gaming experience by keeping the guesses interesting and accurate.
              Твоё слово должно начинаться на: ${secretWord.slice(
                0,
                countLetter
              )} 
              ; А вот настоящие сообщения игроков: ${
                msg.content
              }; Твой ответ должен быть на этом языке - ${language}`
        )
        .join("\n");

      const aiResponse: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a word guessing professional." },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: temperature,
      });

      let content = aiResponse.choices[0].message.content.trim();
      if (content.endsWith(".")) {
        content = content.slice(0, -1);
      }
      return content;
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw error;
    }
  };

  getAIResponseOnMessage = async (
    roomId: string,
    secretWord: string,
    countLetter: number,
    contentAskedUser: string,
    language: string,
    temperature: number = 0.7
  ) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/messages/${roomId}`
      );
      const messages = response.data;

      const prompt = messages
        .map(
          (msg: any) =>
            `Task: Based on the message and chat history, output a single word that players try to guess by associations starting with a specific letter.

              Context: In a web-based game, players gather in a room and start a game against AI. A random word is chosen from a database. Players must guess 
              words starting with its first letter and try to make another player understand the word they are thinking of through associations. As the host (the model), 
              you must guess the word based on these messages.
              Examples:
              A player writes, "He's a famous cartoon character from the Soviet era." Given that the word starts with "Б" your response is, "уверенность в ответе: 100%; буратино"
              Another case: "we all write with it",Given that the word starts with "Р" you respond, "уверенность в ответе: 70%; Ручка"
              Persona: You are the most professional at guessing words based on their associations. You have unlimited access to verbs, nouns, adjectives, slang, etc., as this is a game about guessing words.

              Format: Provide your response in the format "confidence in answer: your percentage%; your word." Double-check that the word starts with the specified letter (initial) and that it fits the associations.

              Tone: Use a casual conversational tone. You are engaging and clever, using a rich vocabulary to interact with the players, enhancing their gaming experience by keeping the guesses interesting and accurate.
              Твоё слово должно начинаться на: ${secretWord.slice(
                0,
                countLetter
              )} 
              Акцентируй своё внимание на сообщение, которое в данный момент угадывают другие игроки. Сделай всё возможное, чтобы отгадать его
              тоже. Вот сообщение, после которого люди поняли слово - ${contentAskedUser}
              ; А вот остальные сообщения из чата настоящих игроков: ${
                msg.content
              }; Твой ответ должен быть на этом языке - ${language}`
        )
        .join("\n");

      const aiResponse: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 150,
        temperature: temperature,
      });

      let content = aiResponse.choices[0].message.content.trim();
      if (content.endsWith(".")) {
        content = content.slice(0, -1);
      }
      return content;
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw error;
    }
  };

  createAISecretWord = async (areaOfVocab: string) => {
    try {
      const prompt = `Ты проглотил все словари мира. Твоя задача - дать самый креативные и разнообразные ответы, которые никто никаким образом не сможет предсказать!!!! ОЧЕНЬ ВАЖНО - ДАВАТЬ ОТВЕТ В ВИДЕ СУЩЕСТВИТЕЛЬНОГО ОДНИМ СЛОВОМ в области ${areaOfVocab}. "ИССКУСТВЕННЫЙ ИНТЕЛЕКТ" - ЗАПРЕЩЕН. ЛЮБЫЕ ЗНАКИ ПРЕПИНАНИЯ СТАВИТЬ НЕЛЬЗЯ.`;
      const temperature: number = 0.9;
      const aiResponse: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: temperature,
      });

      let aiSecretWord = aiResponse.choices[0].message.content.trim();
      if (aiSecretWord.startsWith('"') && aiSecretWord.endsWith('"')) {
        aiSecretWord = aiSecretWord.substring(1, aiSecretWord.length - 1);
      }

      return aiSecretWord;
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw error;
    }
  };
}

export default new OpenAIservice();
