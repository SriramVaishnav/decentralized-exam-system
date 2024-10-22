"use client";

import { useState, useEffect } from 'react';

export default function Student() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [timer, setTimer] = useState(300);  // 5 minutes timer
  const [result, setResult] = useState(null);

  useEffect(() => {
    const studentId = prompt('Enter your Student ID');
    
    // Fetch the exam status and questions for the student
    const fetchQuestions = async () => {
      const res = await fetch(`/api/student?studentId=${studentId}`);
      const data = await res.json();

      if (data.message === 'Test not started yet') {
        setMessage(data.message);
      } else {
        setQuestions(data.questions);
        setExamStarted(true);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval;
    if (examStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);

      if (timer === 0) {
        handleSubmit();
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [examStarted, timer]);

  const handleChange = (questionIdx, optionIdx) => {
    const newAnswers = [...answers];
    newAnswers[questionIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const studentId = prompt('Enter your Student ID again for confirmation');
    const res = await fetch('/api/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers, studentId }),
    });

    const data = await res.json();
    setResult(data);
  };

  if (result) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Exam Finished</h1>
        <p>Score: {result.score}</p>
        <p>Rank: {result.rank}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl">Take the Exam</h1>
      {message && <p>{message}</p>}
      {examStarted && (
        <>
          <div className="mb-4">Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</div>
          <form onSubmit={(e) => e.preventDefault()}>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-lg">{q.question}</h2>
                {q.options.map((opt, optionIdx) => (
                  <div key={optionIdx}>
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      onChange={() => handleChange(idx, optionIdx)}
                    />
                    <label className="ml-2">{opt}</label>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
              Submit Exam
            </button>
          </form>
        </>
      )}
    </div>
  );
}
