/*
# Seed Realistic Campus Demo Data
- 10 Student Profiles (verified students with departments, colleges, contact methods)
- 6 Student-Founded Startups (verified startups with founders, logos, taglines, ratings)
- 12 Realistic Products (electronics, textbooks, dorm decor, guitars, backpacks, calculated prices & distances)
- 12 Realistic Services (tutoring, web dev, photography, moving, design, music, fitness with packages)
- Realistic verified Pexels photo assets
*/

-- Fixed test user IDs for referential integrity in seeds
DO $$
DECLARE
  -- Student UUIDs
  s1 uuid := '11111111-1111-4111-a111-111111111111';
  s2 uuid := '22222222-2222-4222-a222-222222222222';
  s3 uuid := '33333333-3333-4333-a333-333333333333';
  s4 uuid := '44444444-4444-4444-a444-444444444444';
  s5 uuid := '55555555-5555-4555-a555-555555555555';
  s6 uuid := '66666666-6666-4666-a666-666666666666';
  s7 uuid := '77777777-7777-4777-a777-777777777777';
  s8 uuid := '88888888-8888-4888-a888-888888888888';
  s9 uuid := '99999999-9999-4999-a999-999999999999';
  s10 uuid := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

  -- Startup UUIDs
  st1 uuid := 'b1111111-1111-4111-b111-111111111111';
  st2 uuid := 'b2222222-2222-4222-b222-222222222222';
  st3 uuid := 'b3333333-3333-4333-b333-333333333333';
  st4 uuid := 'b4444444-4444-4444-b444-444444444444';
  st5 uuid := 'b5555555-5555-4555-b555-555555555555';
  st6 uuid := 'b6666666-6666-4666-b666-666666666666';

  -- Product UUIDs
  p1 uuid := 'c1111111-1111-4111-c111-111111111111';
  p2 uuid := 'c2222222-2222-4222-c222-222222222222';
  p3 uuid := 'c3333333-3333-4333-c333-333333333333';
  p4 uuid := 'c4444444-4444-4444-c444-444444444444';
  p5 uuid := 'c5555555-5555-4555-c555-555555555555';
  p6 uuid := 'c6666666-6666-4666-c666-666666666666';
  p7 uuid := 'c7777777-7777-4777-c777-777777777777';
  p8 uuid := 'c8888888-8888-4888-c888-888888888888';
  p9 uuid := 'c9999999-9999-4999-c999-999999999999';
  p10 uuid := 'caaaaaaa-aaaa-4aaa-caaa-aaaaaaaaaaaa';
  p11 uuid := 'cbbbbbbb-bbbb-4bbb-cbbb-bbbbbbbbbbbb';
  p12 uuid := 'cccccccc-cccc-4ccc-cccc-cccccccccccc';

  -- Service UUIDs
  v1 uuid := 'd1111111-1111-4111-d111-111111111111';
  v2 uuid := 'd2222222-2222-4222-d222-222222222222';
  v3 uuid := 'd3333333-3333-4333-d333-333333333333';
  v4 uuid := 'd4444444-4444-4444-d444-444444444444';
  v5 uuid := 'd5555555-5555-4555-d555-555555555555';
  v6 uuid := 'd6666666-6666-4666-d666-666666666666';
  v7 uuid := 'd7777777-7777-4777-d777-777777777777';
  v8 uuid := 'd8888888-8888-4888-d888-888888888888';
  v9 uuid := 'd9999999-9999-4999-d999-999999999999';
  v10 uuid := 'daaaaaaa-aaaa-4aaa-daaa-aaaaaaaaaaaa';
  v11 uuid := 'dbbbbbbb-bbbb-4bbb-dbbb-bbbbbbbbbbbb';
  v12 uuid := 'dccccccc-cccc-4ccc-dccc-cccccccccccc';
BEGIN

  -- 1. SEED 10 STUDENTS
  INSERT INTO profiles (id, name, username, email, avatar, bio, location, campus, college, department, year, is_verified, verified, verification_status, account_type, contact_whatsapp, contact_email, contact_instagram, show_contact, rating, review_count)
  VALUES
  (s1, 'Alex Johnson', 'alexj', 'alex.j@campus.edu', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300', 'Senior Math & CS major. Passionate calculus tutor and peer mentor.', 'North Quad', 'Main Campus', 'Stanford University', 'Mathematics', 'Senior (Year 4)', true, true, 'verified', 'student', '+1 555-0191', 'alex.j@campus.edu', 'alexj_math', true, 4.9, 28),
  (s2, 'Maya Chen', 'mayachen', 'maya.c@campus.edu', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fine Arts Junior. Campus event photographer, portraits and club shoots.', 'Arts District', 'West Campus', 'UC Berkeley', 'Fine Arts', 'Junior (Year 3)', true, true, 'verified', 'student', '+1 555-0192', 'maya.chen@campus.edu', 'mayachen.photos', true, 5.0, 34),
  (s3, 'David Wu', 'davidwu', 'david.w@campus.edu', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300', 'CS Sophomore. Fullstack developer building web apps & student MVPs.', 'Tech Hub', 'Main Campus', 'MIT', 'Computer Science', 'Sophomore (Year 2)', true, true, 'verified', 'startup', '+1 555-0193', 'david@nexustech.io', 'davidwu_dev', true, 4.8, 19),
  (s4, 'Ryan Cooper', 'ryancooper', 'ryan.c@campus.edu', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300', 'Business Freshman with a spacious truck. Stress-free dorm moves and logistics.', 'South Hall', 'East Campus', 'UT Austin', 'Business Administration', 'Freshman (Year 1)', true, true, 'verified', 'student', '+1 555-0194', 'ryan.c@campus.edu', 'ryancoop_moves', true, 4.7, 15),
  (s5, 'Sophia Lane', 'sophialane', 'sophia.l@campus.edu', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300', 'Psychology Senior. Career coach specializing in tech resumes & interview prep.', 'Tower Hall', 'North Campus', 'Columbia University', 'Psychology', 'Senior (Year 4)', true, true, 'verified', 'student', '+1 555-0195', 'sophia.lane@campus.edu', 'sophialane_careers', true, 5.0, 42),
  (s6, 'Leo Martinez', 'leom', 'leo.m@campus.edu', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300', 'Music Junior. Guitarist, audio producer, and theory instructor.', 'Music Hall', 'Arts Campus', 'NYU Tisch', 'Music Production', 'Junior (Year 3)', true, true, 'verified', 'student', '+1 555-0196', 'leo.m@campus.edu', 'leomartinez_music', true, 4.9, 21),
  (s7, 'Sarah Mitchell', 'sarahm', 'sarah.m@campus.edu', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300', 'Design Dept Year 3. UI/UX designer and branding consultant for student startups.', 'Design Studios', 'Central Campus', 'RISD / Brown', 'Industrial Design', 'Junior (Year 3)', true, true, 'verified', 'startup', '+1 555-0197', 'sarah@pulsedesign.co', 'sarahmitchell_ux', true, 4.9, 39),
  (s8, 'James Kim', 'jamesk', 'james.k@campus.edu', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300', 'Engineering Junior. STEM tutor and electronics enthusiast.', 'Engg Block B', 'West Campus', 'Georgia Tech', 'Electrical Engineering', 'Junior (Year 3)', true, true, 'verified', 'student', '+1 555-0198', 'james.k@campus.edu', 'jameskim_stem', true, 4.8, 16),
  (s9, 'Elena Rostova', 'elenar', 'elena.r@campus.edu', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300', 'Arts Senior. Visual artist and mural painter for dorms and local clubs.', 'East Studios', 'Arts Campus', 'UCLA', 'Visual Arts', 'Senior (Year 4)', true, true, 'verified', 'student', '+1 555-0199', 'elena.r@campus.edu', 'elena_artcraft', true, 4.8, 18),
  (s10, 'Marc Bernard', 'marcb', 'marc.b@campus.edu', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300', 'Psychology Sophomore. Certified fitness trainer & personal health coach.', 'Campus Rec Center', 'South Campus', 'University of Michigan', 'Kinesiology & Psych', 'Sophomore (Year 2)', true, true, 'verified', 'student', '+1 555-0200', 'marc.b@campus.edu', 'marc_fitnessfit', true, 4.9, 25)
  ON CONFLICT (id) DO UPDATE SET
    account_type = EXCLUDED.account_type,
    college = EXCLUDED.college,
    department = EXCLUDED.department,
    year = EXCLUDED.year,
    is_verified = EXCLUDED.is_verified,
    contact_whatsapp = EXCLUDED.contact_whatsapp,
    contact_email = EXCLUDED.contact_email,
    contact_instagram = EXCLUDED.contact_instagram;

  -- 2. SEED 6 STARTUPS
  INSERT INTO startups (id, owner_id, name, slug, logo_url, cover_url, tagline, description, category, college, team_size, website, contact_whatsapp, contact_email, contact_instagram, show_contact, is_verified, rating, review_count)
  VALUES
  (st1, s3, 'TechNexus Labs', 'technexus-labs', 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Fullstack MVPs and web applications built by MIT CS students.', 'We build high-performance mobile apps, SaaS web platforms, and automated tools for university organizations and campus ventures.', 'Development', 'MIT', 4, 'https://technexus.dev', '+1 555-0193', 'contact@technexus.dev', 'technexus_labs', true, true, 4.9, 24),
  (st2, s7, 'PulseDesign Studio', 'pulsedesign-studio', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Strategic brand identities, pitch decks, and Figma prototypes for founders.', 'An award-winning student design agency specializing in pitch deck presentations, mobile app UI/UX, and visual identities.', 'Design', 'RISD / Brown', 3, 'https://pulsedesign.co', '+1 555-0197', 'hello@pulsedesign.co', 'pulsedesign_co', true, true, 5.0, 38),
  (st3, s2, 'GradLens Media', 'gradlens-media', 'https://images.pexels.com/photos/598917/pexels-photo-598917.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Campus graduation photography, club media, and cinematic reels.', 'Student photographers and videographers delivering high-resolution graduation sessions, club celebrations, and professional headshots.', 'Photography', 'UC Berkeley', 5, 'https://gradlens.media', '+1 555-0192', 'bookings@gradlens.media', 'gradlensmedia', true, true, 4.9, 31),
  (st4, s4, 'DormMove Express', 'dormmove-express', 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/4506249/pexels-photo-4506249.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Affordable, reliable moving & summer storage for campus residents.', 'Equipped with multiple transport vans and dollies. We load, haul, store, and unpack dorm rooms and off-campus apartments seamlessly.', 'Labor', 'UT Austin', 6, 'https://dormmove.co', '+1 555-0194', 'help@dormmove.co', 'dormmove_express', true, true, 4.8, 45),
  (st5, s1, 'Apex STEM Mentors', 'apex-stem-mentors', 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Top 1% student peer tutors in Math, Physics, and Organic Chemistry.', '1-on-1 tutoring sessions tailored to your college syllabus, exam prep guides, and problem-solving workshops.', 'Tutoring', 'Stanford University', 8, 'https://apexstem.org', '+1 555-0191', 'mentors@apexstem.org', 'apexstem_mentors', true, true, 4.9, 52),
  (st6, s6, 'BeatCrafters Audio', 'beatcrafters-audio', 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Music production, podcast mixing, and custom audio tracks for creators.', 'Full-suite audio production by NYU sound engineers. Lessons, instrumental backing tracks, vocal tuning, and mixing.', 'Music', 'NYU Tisch', 3, 'https://beatcrafters.fm', '+1 555-0196', 'sound@beatcrafters.fm', 'beatcrafters_audio', true, true, 4.8, 17)
  ON CONFLICT (slug) DO NOTHING;

  -- 3. SEED 12 REALISTIC PRODUCTS
  INSERT INTO listings (id, seller_id, type, owner_type, startup_id, title, description, category, condition, status, price_type, base_price, images, location, campus, rating, review_count, views)
  VALUES
  (p1, s3, 'product', 'startup', st1, 'MacBook Air M1 — 16GB RAM / 256GB SSD', 'Great condition space gray M1 MacBook Air. Battery health is at 94%. Comes with original 30W charger, box, and USB-C sleeve. Ideal for CS and design courses.', 'Electronics', 'Like New', 'featured', 'fixed', 650.00, ARRAY['https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800'], 'North Quad', 'Main Campus', 4.9, 14, 420),
  (p2, s1, 'product', 'profile', NULL, 'Calculus II Master Study Guide & Practice Exams', 'Comprehensive handwritten + LaTeX summaries of integrals, series, polar coords, and Taylor expansions. Includes 8 solved past exams.', 'Textbooks', 'Like New', 'live', 'fixed', 25.00, ARRAY['https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Math Building', 'Main Campus', 5.0, 19, 310),
  (p3, s7, 'product', 'profile', NULL, 'Minimalist LED Desk Lamp with USB-C Port', 'Adjustable 3-tier color temperature lamp with touch dimmer and 15W fast USB-C phone charger in the base. Only used 1 semester.', 'Dorm', 'Like New', 'live', 'fixed', 25.00, ARRAY['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Design Studios', 'Central Campus', 4.8, 9, 215),
  (p4, s8, 'product', 'profile', NULL, 'TI-84 Plus CE Graphing Calculator', 'Color screen graphing calculator in Mint green. Rechargeable battery, charging cable included. Approved for SAT, ACT, and AP calculus/stats exams.', 'Electronics', 'Like New', 'live', 'fixed', 60.00, ARRAY['https://images.pexels.com/photos/220301/pexels-photo-220301.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Engg Block B', 'West Campus', 4.9, 18, 540),
  (p5, s9, 'product', 'profile', NULL, 'Sony WH-1000XM4 Noise Cancelling Headphones', 'Industry-leading ANC headphones in Black. Exceptional battery life (30h+). Case and 3.5mm cable included. Perfect for library deep-work.', 'Electronics', 'Like New', 'featured', 'fixed', 180.00, ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'], 'East Studios', 'Arts Campus', 5.0, 22, 680),
  (p6, s4, 'product', 'profile', NULL, 'Fjällräven Kånken Backpack - Navy', 'Classic 16L durable Vinylon backpack in Navy Blue. Fits 13-14 inch laptops and notebooks. Clean interior, gently used for campus walking.', 'Other', 'Gently Used', 'live', 'fixed', 45.00, ARRAY['https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800'], 'South Hall', 'East Campus', 4.7, 8, 190),
  (p7, s5, 'product', 'profile', NULL, 'Campbell Biology 12th Edition (Hardcover)', 'Essential textbook for Bio 101/102 and pre-med curriculum. No torn pages, minor highlighting in chapters 1-4. Includes access code scratch card.', 'Textbooks', 'Good', 'live', 'fixed', 55.00, ARRAY['https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Tower Hall', 'North Campus', 4.9, 12, 280),
  (p8, s10, 'product', 'profile', NULL, 'Hydro Flask 32oz Wide Mouth (Pacific Blue)', 'Double-wall vacuum insulated stainless steel water bottle with straw lid. Keeps ice cold for 24+ hours. Minor cosmetic scratches on bottom.', 'Other', 'Good', 'live', 'fixed', 20.00, ARRAY['https://images.pexels.com/photos/4000093/pexels-photo-4000093.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Campus Rec Center', 'South Campus', 4.8, 6, 140),
  (p9, s6, 'product', 'profile', NULL, 'Yamaha FG800 Acoustic Guitar + Padded Case', 'Solid spruce top dreadnought guitar. Rich, warm acoustic tone. Recently restrung with D''Addario light strings. Comes with gig bag and capo.', 'Music', 'Like New', 'live', 'fixed', 120.00, ARRAY['https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Music Hall', 'Arts Campus', 5.0, 11, 395),
  (p10, s4, 'product', 'startup', st4, 'Compact 1.7 cu.ft Mini Fridge with Freezer Compartment', 'Quiet, energy-efficient dorm mini fridge. Keeps snacks cold and ice cream frozen. Cleaned and sanitized, ready for pickup or delivery.', 'Dorm', 'Like New', 'live', 'fixed', 80.00, ARRAY['https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Dorm Row', 'East Campus', 4.8, 17, 310),
  (p11, s1, 'product', 'profile', NULL, 'Intro to Psychology 10th Ed — Worth Publishers', 'Clean hardcover textbook with study flashcards included. No missing pages, very clean condition.', 'Textbooks', 'Like New', 'live', 'fixed', 35.00, ARRAY['https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=800'], 'North Quad', 'Main Campus', 4.8, 7, 185),
  (p12, s7, 'product', 'startup', st2, 'Ergonomic Breathable Mesh Desk Chair', 'Lumbar support, 3D adjustable armrests, and pneumatic height adjustment. Comfortable for 8+ hour study and coding sessions.', 'Dorm', 'Like New', 'live', 'fixed', 95.00, ARRAY['https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Design Studios', 'Central Campus', 4.9, 13, 270)
  ON CONFLICT (id) DO NOTHING;

  -- 4. SEED 12 REALISTIC SERVICES
  INSERT INTO listings (id, seller_id, type, owner_type, startup_id, title, description, category, status, price_type, base_price, delivery_days, images, location, campus, rating, review_count, views)
  VALUES
  (v1, s1, 'service', 'startup', st5, 'Calculus I & II Mastery Tutoring', 'Senior math major with 4+ years of tutoring experience. Flexible scheduling around your lectures. I help students break down complex problems into simple, manageable steps.', 'Tutoring', 'featured', 'hourly', 25.00, 1, ARRAY['https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=800'], 'North Quad', 'Main Campus', 4.9, 32, 780),
  (v2, s2, 'service', 'startup', st3, 'Graduation & Campus Event Photography', 'Capturing your milestone campus moments with Sony full-frame cinema cameras and prime lenses. Edited high-res digital gallery delivered in 48-72 hours.', 'Photography', 'featured', 'starting_at', 45.00, 3, ARRAY['https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Arts District', 'West Campus', 5.0, 41, 920),
  (v3, s3, 'service', 'startup', st1, 'Custom Website & Mobile App Development', 'Turning student startup ideas into high-performance web applications. Tech stack: React, Next.js, Node, Supabase, Tailwind, TypeScript. From MVP to launch.', 'Development', 'featured', 'fixed', 150.00, 7, ARRAY['https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Tech Hub', 'Main Campus', 4.8, 19, 640),
  (v4, s4, 'service', 'startup', st4, 'Efficient Dorm Moving & Campus Packing', 'I''ve got a covered van, heavy-duty hand trucks, blankets, and strong hands to help you move across dorms or off-campus apartments completely stress-free.', 'Labor', 'live', 'hourly', 20.00, 1, ARRAY['https://images.pexels.com/photos/4506249/pexels-photo-4506249.jpeg?auto=compress&cs=tinysrgb&w=800'], 'South Hall', 'East Campus', 4.7, 28, 430),
  (v5, s5, 'service', 'profile', NULL, 'Resume & Career Prep Workshops', 'Expert feedback to help you land that dream tech or finance internship. ATS resume optimization, LinkedIn overhaul, and behavioral mock interviews.', 'Coaching', 'featured', 'starting_at', 35.00, 2, ARRAY['https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Tower Hall', 'North Campus', 5.0, 47, 850),
  (v6, s6, 'service', 'startup', st6, 'Guitar & Music Theory Lessons', 'Learn your favorite songs and the theoretical foundations behind them in a fun, relaxed setting. Acoustic, electric, blues, fingerstyle, and songwriting.', 'Music', 'live', 'hourly', 30.00, 1, ARRAY['https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Music Hall', 'Arts Campus', 4.9, 16, 310),
  (v7, s7, 'service', 'startup', st2, 'UI/UX Prototyping & Mobile App Design', 'Pixel-perfect Figma prototypes, design systems, and user flows for founders pitching to investors or university demo days. Fast 48h turnaround available.', 'Design', 'featured', 'starting_at', 60.00, 3, ARRAY['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Design Studios', 'Central Campus', 5.0, 36, 730),
  (v8, s8, 'service', 'profile', NULL, 'Python & Data Structures Algorithm Prep', 'Ace your CS Midterms and Technical LeetCode screens. We cover binary trees, dynamic programming, graphs, Big-O analysis, and practical coding exercises.', 'Development', 'live', 'hourly', 28.00, 1, ARRAY['https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Engg Block B', 'West Campus', 4.8, 14, 290),
  (v9, s9, 'service', 'profile', NULL, 'Custom Dorm Wall Murals & Digital Art Prints', 'Custom illustrative artwork, stylized pet portraits, and aesthetic canvas paintings to personalize your dorm walls. Physical and digital formats.', 'Design', 'live', 'fixed', 40.00, 4, ARRAY['https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800'], 'East Studios', 'Arts Campus', 4.8, 12, 220),
  (v10, s10, 'service', 'profile', NULL, '1-on-1 Fitness Training & Dorm Nutrition Plan', 'Certified student trainer providing structured gym routines, proper lifting form coaching, and campus dining hall meal plans tailored to your fitness goals.', 'Coaching', 'live', 'hourly', 25.00, 1, ARRAY['https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Campus Rec Center', 'South Campus', 4.9, 21, 340),
  (v11, s5, 'service', 'profile', NULL, 'Campus Social Media Growth & Marketing Kit', 'Custom TikTok/Instagram strategy, student club flyers, promotional reels, and viral outreach blueprints for campus events and clubs.', 'Marketing', 'live', 'fixed', 50.00, 3, ARRAY['https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Tower Hall', 'North Campus', 4.8, 15, 260),
  (v12, s8, 'service', 'startup', st5, 'Organic Chemistry & Biochemistry Intensive', 'Pre-med student tutor breaking down reaction mechanisms, arrow pushing, synthesis routes, and NMR spectroscopy. Pass Orgo with confidence.', 'Tutoring', 'live', 'hourly', 32.00, 1, ARRAY['https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Science Library', 'West Campus', 4.9, 25, 410)
  ON CONFLICT (id) DO NOTHING;

  -- 5. SEED SERVICE PACKAGES (Basic, Standard, Premium for Services)
  -- For v1: Calculus Tutoring
  INSERT INTO service_packages (listing_id, tier, title, price, delivery_days, revisions, features)
  VALUES
  (v1, 'basic', 'Single 60-min Session', 25.00, 1, 1, '["1-hour 1-on-1 session", "Exam problem walkthrough", "PDF of notes included"]'::jsonb),
  (v1, 'standard', 'Midterm Prep Package (3 Sessions)', 70.00, 7, 2, '["3 x 60-min targeted sessions", "Custom practice exam with solutions", "Priority WhatsApp Q&A before exam"]'::jsonb),
  (v1, 'premium', 'Full Semester Exam Mastery (8 Sessions)', 175.00, 30, 5, '["8 x 60-min deep-dive sessions", "Weekly homework review", "Direct 24/7 exam emergency support", "Full formula cheat sheets"]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- For v3: Website Dev
  INSERT INTO service_packages (listing_id, tier, title, price, delivery_days, revisions, features)
  VALUES
  (v3, 'basic', 'Landing Page MVP', 150.00, 3, 2, '["Responsive single-page website", "Tailwind CSS styling", "Contact form with email alerts", "Deployed on Vercel/Netlify"]'::jsonb),
  (v3, 'standard', 'Full Web App with Database', 350.00, 7, 4, '["Up to 5 pages / routes", "Supabase authentication & database", "CRUD functionality & mobile responsive", "Free domain setup assistance"]'::jsonb),
  (v3, 'premium', 'Complete Founder Venture Suite', 700.00, 14, 8, '["End-to-end fullstack platform", "Payments integration (Stripe)", "Custom admin dashboard", "30 days post-launch technical support"]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- For v2: Photography
  INSERT INTO service_packages (listing_id, tier, title, price, delivery_days, revisions, features)
  VALUES
  (v2, 'basic', 'Mini Session (30 mins)', 45.00, 2, 1, '["30-minute campus shoot", "10 edited high-resolution photos", "Digital gallery access"]'::jsonb),
  (v2, 'standard', 'Standard Portrait Session (60 mins)', 80.00, 3, 2, '["60-minute session at 2 locations", "25 retouched photos", "Cap & gown + casual outfit change", "Full print rights"]'::jsonb),
  (v2, 'premium', 'Graduation Squad / Club Package (120 mins)', 150.00, 4, 3, '["2-hour session up to 6 people", "50+ magazine-grade retouched photos", "Cinematic drone/video clips included", "24h rush preview delivery"]'::jsonb)
  ON CONFLICT DO NOTHING;

END $$;
