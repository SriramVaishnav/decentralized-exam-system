"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin'); // Default user type
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/${userType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      // Navigate based on user type
      if (userType === 'admin') {
        router.push('/admin');
      } else if (userType === 'questionSetter') {
        router.push('/questionSetter'); // Redirect to question setter page
      } else if (userType === 'student') {
        router.push('/student'); // Redirect to student page
      }
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="p-6 border rounded">
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="questionSetter">Question Setter</option>
          <option value="student">Student</option>
        </select>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
