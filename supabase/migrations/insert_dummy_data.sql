-- First, insert some users
INSERT INTO public.users (id, name, created_at) 
VALUES
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', NOW() - INTERVAL '30 days'),
  ('c4f25fb3-1a42-4c4b-8785-f908c335c3c2', 'Emma Wilson', NOW() - INTERVAL '28 days'),
  ('f8b4d491-c12b-4d5e-8c2a-962f3965cc31', 'Michael Chen', NOW() - INTERVAL '25 days'),
  ('a2c76ef2-39d1-4f3a-8c4b-c8f8e2b9d5a1', 'Sarah Johnson', NOW() - INTERVAL '20 days'),
  ('e5d32f18-6a7c-4b9d-bc3e-f1d8a4c7e2b9', 'David Brown', NOW() - INTERVAL '15 days');

-- Then, insert check-ins for these users
INSERT INTO public.check_ins (user_id, user_name, mood, stress_level, productivity_level, notes, created_at)
VALUES
  -- John Smith's check-ins
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', 'happy', 3, 8, 'Great day at work, completed all tasks!', NOW() - INTERVAL '20 days'),
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', 'neutral', 5, 6, 'Regular day, some challenges but managing well', NOW() - INTERVAL '15 days'),
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', 'happy', 4, 7, 'Productive team meeting today', NOW() - INTERVAL '10 days'),
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', 'sad', 8, 4, 'Difficult project deadline approaching', NOW() - INTERVAL '5 days'),
  ('d7095994-b8e2-4273-9901-0a73a8f65b8e', 'John Smith', 'neutral', 6, 6, 'Getting back on track', NOW() - INTERVAL '1 day'),

  -- Emma Wilson's check-ins
  ('c4f25fb3-1a42-4c4b-8785-f908c335c3c2', 'Emma Wilson', 'happy', 2, 9, 'Excellent progress on new feature!', NOW() - INTERVAL '18 days'),
  ('c4f25fb3-1a42-4c4b-8785-f908c335c3c2', 'Emma Wilson', 'happy', 3, 8, 'Great collaboration with team', NOW() - INTERVAL '13 days'),
  ('c4f25fb3-1a42-4c4b-8785-f908c335c3c2', 'Emma Wilson', 'neutral', 5, 7, 'Moderate day, some technical challenges', NOW() - INTERVAL '8 days'),
  ('c4f25fb3-1a42-4c4b-8785-f908c335c3c2', 'Emma Wilson', 'happy', 4, 8, 'Solved a complex bug today!', NOW() - INTERVAL '3 days'),

  -- Michael Chen's check-ins
  ('f8b4d491-c12b-4d5e-8c2a-962f3965cc31', 'Michael Chen', 'neutral', 6, 5, 'Dealing with legacy code issues', NOW() - INTERVAL '16 days'),
  ('f8b4d491-c12b-4d5e-8c2a-962f3965cc31', 'Michael Chen', 'happy', 3, 9, 'Successfully deployed new features', NOW() - INTERVAL '11 days'),
  ('f8b4d491-c12b-4d5e-8c2a-962f3965cc31', 'Michael Chen', 'sad', 8, 3, 'Production issues causing stress', NOW() - INTERVAL '6 days'),
  ('f8b4d491-c12b-4d5e-8c2a-962f3965cc31', 'Michael Chen', 'neutral', 5, 6, 'Making progress on bug fixes', NOW() - INTERVAL '1 day'),

  -- Sarah Johnson's check-ins
  ('a2c76ef2-39d1-4f3a-8c4b-c8f8e2b9d5a1', 'Sarah Johnson', 'happy', 2, 9, 'Great team collaboration day!', NOW() - INTERVAL '14 days'),
  ('a2c76ef2-39d1-4f3a-8c4b-c8f8e2b9d5a1', 'Sarah Johnson', 'happy', 3, 8, 'Productive client meeting', NOW() - INTERVAL '9 days'),
  ('a2c76ef2-39d1-4f3a-8c4b-c8f8e2b9d5a1', 'Sarah Johnson', 'neutral', 5, 6, 'Working on documentation', NOW() - INTERVAL '4 days'),
  ('a2c76ef2-39d1-4f3a-8c4b-c8f8e2b9d5a1', 'Sarah Johnson', 'happy', 4, 7, 'Good progress on sprint goals', NOW() - INTERVAL '1 day'),

  -- David Brown's check-ins
  ('e5d32f18-6a7c-4b9d-bc3e-f1d8a4c7e2b9', 'David Brown', 'neutral', 5, 6, 'Getting used to new project', NOW() - INTERVAL '12 days'),
  ('e5d32f18-6a7c-4b9d-bc3e-f1d8a4c7e2b9', 'David Brown', 'happy', 3, 8, 'Great mentoring session today', NOW() - INTERVAL '7 days'),
  ('e5d32f18-6a7c-4b9d-bc3e-f1d8a4c7e2b9', 'David Brown', 'sad', 7, 4, 'Challenging deadline pressure', NOW() - INTERVAL '2 days'),
  ('e5d32f18-6a7c-4b9d-bc3e-f1d8a4c7e2b9', 'David Brown', 'neutral', 5, 6, 'Back to normal workflow', NOW() - INTERVAL '1 day'); 