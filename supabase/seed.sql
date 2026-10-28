-- ============================================================================
-- RANKUP — DATABASE SEED SCRIPT (supabase/seed.sql)
-- Seeds 20 launch categories & 10 realistic paid demo listings
-- ============================================================================

-- 1. SEED 20 LAUNCH CATEGORIES
insert into categories (id, slug, name, description, icon_name, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'ai-agents', 'AI Agents & Automation', 'Autonomous agents, workflow automations, and LLM orchestration tools', 'Bot', 1),
  ('c1000000-0000-0000-0000-000000000002', 'ai-image-video', 'AI Image & Video', 'Generative art, video synthesis, voice cloning, and media tools', 'Sparkles', 2),
  ('c1000000-0000-0000-0000-000000000003', 'ai-writing', 'AI Writing & Content', 'AI copywriters, blogging assistants, and generative text platforms', 'FileText', 3),
  ('c1000000-0000-0000-0000-000000000004', 'developer-tools', 'AI Coding & Developer Tools', 'Code generation, developer APIs, CLI tools, and IDE extensions', 'Code', 4),
  ('c1000000-0000-0000-0000-000000000005', 'saas-productivity', 'SaaS & Productivity', 'Software as a service, task management, calendars, and workspace apps', 'Layers', 5),
  ('c1000000-0000-0000-0000-000000000006', 'marketing-ads', 'Marketing & Advertising', 'Ad optimization, email marketing, landing page builders, and attribution', 'Megaphone', 6),
  ('c1000000-0000-0000-0000-000000000007', 'seo-visibility', 'SEO & AI Visibility', 'Backlink monitoring, keyword research, rank tracking, and GEO/AEO optimization', 'Search', 7),
  ('c1000000-0000-0000-0000-000000000008', 'social-creator', 'Social Media & Creator Tools', 'Audience growth, social schedulers, YouTube/TikTok utilities, and monetization', 'Share2', 8),
  ('c1000000-0000-0000-0000-000000000009', 'sales-leads', 'Sales & Lead Generation', 'Cold outreach, email warmers, CRM integrations, and prospecting engines', 'TrendingUp', 9),
  ('c1000000-0000-0000-0000-000000000010', 'ecommerce-retail', 'Ecommerce & Retail', 'Shopify plugins, checkout optimization, dropshipping, and inventory systems', 'ShoppingBag', 10),
  ('c1000000-0000-0000-0000-000000000011', 'fintech-payments', 'Fintech & Payments', 'Invoicing, payment gateways, accounting automation, and crypto payroll', 'CreditCard', 11),
  ('c1000000-0000-0000-0000-000000000012', 'crypto-web3', 'Crypto & Web3', 'DeFi analytics, NFT tools, smart contract auditors, and on-chain explorers', 'Coins', 12),
  ('c1000000-0000-0000-0000-000000000013', 'education-learning', 'Education & Learning', 'EdTech platforms, interactive flashcards, AI tutors, and course creators', 'GraduationCap', 13),
  ('c1000000-0000-0000-0000-000000000014', 'health-fitness', 'Health & Fitness', 'Workout planners, nutrition tracking, wellness apps, and telemedicine', 'HeartPulse', 14),
  ('c1000000-0000-0000-0000-000000000015', 'hiring-jobs', 'Hiring & Jobs', 'Remote job boards, resume screening, technical assessment, and talent pools', 'Briefcase', 15),
  ('c1000000-0000-0000-0000-000000000016', 'design-creative', 'Design & Creative', 'UI/UX kits, vector generators, 3D modeling, and typography platforms', 'Palette', 16),
  ('c1000000-0000-0000-0000-000000000017', 'agencies-services', 'Agencies & Services', 'Design agencies, dev shops, growth studios, and consulting partners', 'Building', 17),
  ('c1000000-0000-0000-0000-000000000018', 'real-estate', 'Real Estate & Property', 'Proptech, virtual tours, mortgage calculators, and rental management', 'Home', 18),
  ('c1000000-0000-0000-0000-000000000019', 'travel-local', 'Travel & Local', 'Trip itineraries, flight trackers, city guides, and nomadic workspace finders', 'Compass', 19),
  ('c1000000-0000-0000-0000-000000000020', 'other', 'Other', 'Innovative products and uncategorized high-growth projects', 'Globe', 20)
on conflict (slug) do nothing;

-- 2. SEED 10 REALISTIC DEMO LISTINGS (#1 to #10)
insert into listings (id, destination_type, destination_url, x_handle, normalized_key, slug, title, short_description, favicon_url, category_id, status, first_paid_at, expires_at, click_count) values
  ('d1000000-0000-0000-0000-000000000001', 'website', 'https://supastarter.dev', null, 'web:supastarter.dev', 'supastarter', 'Supastarter — The Ultimate SaaS Boilerplate', 'Ship your next SaaS in days, not months. Built with Next.js, Supabase & Tailwind.', 'https://www.google.com/s2/favicons?domain=supastarter.dev&sz=128', 'c1000000-0000-0000-0000-000000000004', 'active', now() - interval '2 days', now() + interval '5 days', 184),
  ('d1000000-0000-0000-0000-000000000002', 'website', 'https://v0.dev', null, 'web:v0.dev', 'v0-dev', 'v0.dev — Generative UI by Vercel', 'Chat with an AI that builds production-ready React and Tailwind components instantly.', 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128', 'c1000000-0000-0000-0000-000000000001', 'active', now() - interval '1 day', now() + interval '6 days', 142),
  ('d1000000-0000-0000-0000-000000000003', 'website', 'https://raycast.com', null, 'web:raycast.com', 'raycast', 'Raycast — Supercharged Productivity on Mac & Windows', 'An extendable launcher that replaces Spotlight with AI, snippets, and app commands.', 'https://www.google.com/s2/favicons?domain=raycast.com&sz=128', 'c1000000-0000-0000-0000-000000000005', 'active', now() - interval '3 days', now() + interval '4 days', 97),
  ('d1000000-0000-0000-0000-000000000004', 'website', 'https://posthog.com', null, 'web:posthog.com', 'posthog', 'PostHog — Product Analytics Suite', 'Open-source product analytics, session replay, feature flags, and heatmaps.', 'https://www.google.com/s2/favicons?domain=posthog.com&sz=128', 'c1000000-0000-0000-0000-000000000005', 'active', now() - interval '4 hours', now() + interval '7 days', 85),
  ('d1000000-0000-0000-0000-000000000005', 'website', 'https://linear.app', null, 'web:linear.app', 'linear', 'Linear — Purpose-Built Issue Tracking', 'Streamlined software projects, sprints, tasks, and roadmaps for modern tech teams.', 'https://www.google.com/s2/favicons?domain=linear.app&sz=128', 'c1000000-0000-0000-0000-000000000005', 'active', now() - interval '18 hours', now() + interval '6 days', 76),
  ('d1000000-0000-0000-0000-000000000006', 'website', 'https://midjourney.com', null, 'web:midjourney.com', 'midjourney', 'Midjourney — Next-Gen AI Art Generation', 'State of the art text-to-image synthesis tool empowering global creators.', 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128', 'c1000000-0000-0000-0000-000000000002', 'active', now() - interval '2 days', now() + interval '5 days', 61),
  ('d1000000-0000-0000-0000-000000000007', 'website', 'https://cursor.com', null, 'web:cursor.com', 'cursor', 'Cursor — The AI-First Code Editor', 'Built for pair-programming with LLMs. Edit, chat, and generate code with one keypress.', 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128', 'c1000000-0000-0000-0000-000000000004', 'active', now() - interval '12 hours', now() + interval '6 days', 53),
  ('d1000000-0000-0000-0000-000000000008', 'website', 'https://dub.co', null, 'web:dub.co', 'dub-co', 'Dub.co — The Open-Source Link Management Platform', 'Modern link shortener with detailed click analytics, geo-targeting, and custom domains.', 'https://www.google.com/s2/favicons?domain=dub.co&sz=128', 'c1000000-0000-0000-0000-000000000006', 'active', now() - interval '1 day', now() + interval '6 days', 48),
  ('d1000000-0000-0000-0000-000000000009', 'website', 'https://resend.com', null, 'web:resend.com', 'resend', 'Resend — Email for Developers', 'The modern API for sending transactional and marketing emails with React templates.', 'https://www.google.com/s2/favicons?domain=resend.com&sz=128', 'c1000000-0000-0000-0000-000000000004', 'active', now() - interval '3 days', now() + interval '4 days', 39),
  ('d1000000-0000-0000-0000-000000000010', 'website', 'https://cal.com', null, 'web:cal.com', 'cal-com', 'Cal.com — Open Scheduling Infrastructure', 'Self-hosted and cloud scheduling infrastructure for individuals, teams, and enterprises.', 'https://www.google.com/s2/favicons?domain=cal.com&sz=128', 'c1000000-0000-0000-0000-000000000005', 'active', now() - interval '5 days', now() + interval '2 days', 28)
on conflict (slug) do nothing;

-- 3. SEED LISTING SPEND (Strictly ordered to match ranks #1 to #10)
insert into listing_spend (listing_id, all_time_total, today_total, today_date, last_paid_at) values
  ('d1000000-0000-0000-0000-000000000001', 102, 26, current_date, now() - interval '2 hours'), -- #1 ($102 all-time, $26 today)
  ('d1000000-0000-0000-0000-000000000002', 88, 18, current_date, now() - interval '4 hours'),  -- #2 ($88 all-time, $18 today)
  ('d1000000-0000-0000-0000-000000000003', 75, 12, current_date, now() - interval '6 hours'),  -- #3 ($75 all-time, $12 today)
  ('d1000000-0000-0000-0000-000000000004', 62, 10, current_date, now() - interval '1 hour'),   -- #4 ($62 all-time)
  ('d1000000-0000-0000-0000-000000000005', 50, 0, current_date, now() - interval '18 hours'),  -- #5 ($50 all-time)
  ('d1000000-0000-0000-0000-000000000006', 42, 0, current_date, now() - interval '2 days'),    -- #6 ($42 all-time)
  ('d1000000-0000-0000-0000-000000000007', 35, 8, current_date, now() - interval '3 hours'),   -- #7 ($35 all-time)
  ('d1000000-0000-0000-0000-000000000008', 25, 0, current_date, now() - interval '1 day'),     -- #8 ($25 all-time)
  ('d1000000-0000-0000-0000-000000000009', 18, 0, current_date, now() - interval '3 days'),    -- #9 ($18 all-time)
  ('d1000000-0000-0000-0000-000000000010', 10, 0, current_date, now() - interval '5 days')     -- #10 ($10 all-time)
on conflict (listing_id) do update set
  all_time_total = excluded.all_time_total,
  today_total = excluded.today_total;
