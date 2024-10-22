"use client";

import { useState } from 'react';

//eg key: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
//eg iv: 1234567890abcdef1234567890abcdef

export default function QuestionSetter() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');

  const handleChangeOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const setterId = prompt("Enter your Question Setter ID");
    const key = prompt("Enter the encryption key");
    const iv = prompt("Enter the IV");

    const res = await fetch('/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options, setterId, key, iv }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Submit Questions</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
            className="p-2 border mb-4 w-full"
          />
        </div>
        {options.map((option, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleChangeOption(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="p-2 border mb-4 w-full"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Question
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}
