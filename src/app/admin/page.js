"use client"

import { useState } from 'react';

export default function Admin() {
  const [userType, setUserType] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [examStatus, setExamStatus] = useState('');

  const createUser = async () => {
    const res = await fetch('/api/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'create', userType }),
    });

    const data = await res.json();
    setCredentials(data.credentials);
  };

  const startExam = async () => {
    const res = await fetch('/api/examStatus', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'started' }),
    });

    const data = await res.json();
    setExamStatus(data.message);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div>
        <select onChange={(e) => setUserType(e.target.value)} className="p-2 border rounded mb-4">
          <option value="">Select User Type</option>
          <option value="questionSetter">Question Setter</option>
          <option value="student">Student</option>
        </select>
        <button onClick={createUser} className="bg-green-500 text-white px-4 py-2 rounded">
          Create User
        </button>
      </div>
      {credentials && (
        <div className="mt-4">
          <h3 className="font-bold">New {userType} Credentials:</h3>
          <pre>{JSON.stringify(credentials, null, 2)}</pre>
        </div>
      )}

      <button onClick={startExam} className="bg-blue-500 text-white px-4 py-2 rounded mt-6">
        Start Exam
      </button>
      {examStatus && <p className="mt-4">{examStatus}</p>}
    </div>
  );
}
