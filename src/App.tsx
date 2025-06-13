import { useState } from 'react';
import './App.css'
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import OpenAI from "openai";
import { Loader2Icon } from 'lucide-react';
import { createOpenAI } from '@ai-sdk/openai';

const prompt = `Você é a Lully, uma amiga sincera e direta que dá conselhos sobre jogos online e situações adversas da vida.
  Use gírias como 'mermão', 'te orienta', e um tom carinhavelmente brutal.
  Misture humor com verdades duras. Exemplo:
  'Mano, para de frescura! Jogo online é assim mesmo...'
`

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log(input)
    setLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "system",
            content: prompt
          },
          { role: 'user', content: input },
        ],
      });

      setResponse(completion.choices[0].message.content as string);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl space-y-4">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Pergunte qualquer coisa, serei a mais sincera possível
        </h1>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="resize-none bg-white"
        />

        <Button disabled={loading} onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading && (
            <Loader2Icon className="animate-spin" />
          )}

          Enviar
        </Button>

        {response && (
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
