"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CheckInPage = () => {
  const [userThoughts, setUserThoughts] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    // Submit check-in logic...

    // Navigate to employee health page with thoughts
    router.push(`/employee-health?thoughts=${encodeURIComponent(userThoughts)}`);
  };

  return (
    <div>
      <textarea
        value={userThoughts}
        onChange={(e) => setUserThoughts(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full px-3 py-2 border rounded-md border-input bg-background"
        rows={4}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CheckInPage;
