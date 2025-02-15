"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const [userThoughts, setUserThoughts] = useState<string>("");
const router = useRouter();

// Inside your form or component
<textarea
  value={userThoughts}
  onChange={(e) => setUserThoughts(e.target.value)}
  placeholder="Share your thoughts..."
  className="w-full px-3 py-2 border rounded-md border-input bg-background"
  rows={4}
/>
