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
            `Ты профессионал в угадывании слов по их ассоциациям. 
          Твоя цель - понять и написать слово, которое по твоему мнению загадал пользователь. 
          На данный момент ты являешься ведущим игры. Ты получаешь сообщения от всех пользователей в комнате.
           Их цель в обратном - сделать всё возможное, чтобы другие игроки поняли их слово кроме тебя через их ассоциации. 
           В виде ответа пришли текст, который начинается так: "уверенность в ответе: ", после двоеточия должен быть процент 
           того, насколько ты уверен, что ты отгадал загаданное слово. Запомни, что пользователи загадывает не одно,
            а несколкьо слов, а также тебе будет дано с какой буквы или букв должно начинаться это слово. Например: 
            "слово начинается на "Ав". Пользователь1: "синий челик, который живет на Пандоре". Ты высчитываешь насколько
             процентов ты уверен в правильности ответа и присылаешь следующее: "уверенность в ответе: 90%; аватар" 
             и отправлешь ответ в виде текста. Твоя задача отвечать только на последнее сообщение, так как все до
              него являются полноценной историей чата для полного понимания контекста. Знай, что предыдущие сообщения 
              могут быть нерелевантными, так как они могут относиться к предыдущим словам, которые уже были отгаданы. По этой причине при любых ситуациях после
              "уверенность в ответе: х%;" пиши только одно слово. Например, 
              уверенность в ответе: 60%; аватар
                уверенность в ответе: 90%; карандаш
                уверенность в ответе: 40%; ручка
              Твоё слово должно начинаться на: ${secretWord.slice(
                0,
                countLetter
              )} 
              ; А вот настоящие сообщения: ${msg.content}`
        )
        .join("\n");

      const aiResponse: any = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a word guessing professional." },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: temperature,
      });

      return aiResponse.choices[0].message.content.trim();
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
            `Ты профессионал в угадывании слов по их ассоциациям. 
          Твоя цель - понять и написать слово, которое по твоему мнению загадал пользователь. 
          На данный момент ты являешься ведущим игры. Ты получаешь сообщения от всех пользователей в комнате.
           Их цель в обратном - сделать всё возможное, чтобы другие игроки поняли их слово кроме тебя через их ассоциации. 
           В виде ответа пришли текст, который начинается так: "уверенность в ответе: ", после двоеточия должен быть процент 
           того, насколько ты уверен, что ты отгадал загаданное слово. Запомни, что пользователи загадывает не одно,
            а несколкьо слов, а также тебе будет дано с какой буквы или букв должно начинаться это слово. Например: 
            "слово начинается на "Ав". Пользователь1: "синий челик, который живет на Пандоре". Ты высчитываешь насколько
             процентов ты уверен в правильности ответа и присылаешь следующее: "уверенность в ответе: 90%; аватар" 
             и отправлешь ответ в виде текста. Твоя задача отвечать только на последнее сообщение, так как все до
              него являются полноценной историей чата для полного понимания контекста. Знай, что предыдущие сообщения 
              могут быть нерелевантными, так как они могут относиться к предыдущим словам, которые уже были отгаданы. По этой причине при любых ситуациях после
              "уверенность в ответе: х%;" пиши только одно слово. Например, 
              уверенность в ответе: 60%; аватар
                уверенность в ответе: 90%; карандаш
                уверенность в ответе: 40%; ручка
              Твоё слово должно начинаться на: ${secretWord.slice(
                0,
                countLetter
              )} 
              Акцентируй своё внимание на сообщение, которое в данный момент угадывают другие игроки. Сделай всё возможное, чтобы отгадать его
              тоже. Вот сообщение, после которого люди поняли слово - ${contentAskedUser}
              ; А вот настоящие сообщения из чата: ${msg.content}`
        )
        .join("\n");

      const aiResponse: any = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a word guessing professional." },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: temperature,
      });

      return aiResponse.choices[0].message.content.trim();
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
        model: "gpt-3.5-turbo",
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
