-- Seed data from src/data/clinic.ts and component arrays

-- Categories (fixed UUIDs for seed references)
insert into service_categories (id, slug, label, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'skin', 'Skin Treatments', 1),
  ('11111111-1111-1111-1111-111111111102', 'hair', 'Hair Restoration', 2),
  ('11111111-1111-1111-1111-111111111103', 'aesthetic', 'Aesthetic Procedures', 3)
on conflict (slug) do nothing;

-- Clinic settings
insert into clinic_settings (id, name, name_short, tagline, address, hours, maps_embed_url, maps_open_url)
values (
  1,
  'Pokhara Skin and Hair Clinic',
  'Pokhara Skin & Hair Clinic',
  'Advanced dermatology and aesthetic care with medically trusted expertise and modern treatment technology.',
  '{"line1":"Nayabazar-8, Pokhara","line2":"Gandaki Province, Nepal","landmark":"Opposite GMC Hospital (GMC Medical College) Gate","area":"Prithvi Chowk area","short":"Nayabazar-8, Pokhara, Nepal","mapCaption":"Nayabazar-8 · Prithvi Chowk · Pokhara, Gandaki Province, Nepal"}'::jsonb,
  '{"daily":"8:00 AM – 7:00 PM","saturdayNote":"Saturday OPD available","summary":"Daily: 8AM–7PM"}'::jsonb,
  'https://maps.google.com/maps?q=Pokhara+Skin+and+Hair+Clinic%2C+Nayabazar+Rd%2C+Pokhara+33700%2C+Nepal&ll=28.211638,83.986859&z=17&hl=en&output=embed',
  'https://www.google.com/maps/place/Pokhara+Skin+and+Hair+Clinic/@28.211638,83.986859,17z'
)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  address = excluded.address,
  hours = excluded.hours;

-- Phones
insert into phones (number, role, label, sort_order) values
  ('9706929329', 'main', 'Main Contact', 1),
  ('9845815246', 'appointments', 'Appointments', 2),
  ('061-586227', 'landline', 'Clinic Line', 3),
  ('9851063249', 'additional', 'Additional', 4);

-- Social links
insert into social_links (platform, url, handle, sort_order) values
  ('instagram', 'https://www.instagram.com/pokharaskinandhairclinic/', '@pokharaskinandhairclinic', 1),
  ('facebook', 'https://www.facebook.com/profile.php?id=61561770561179', null, 2),
  ('tiktok', 'https://www.tiktok.com/@pokharaskinandhairclinic', '@pokharaskinandhairclinic', 3),
  ('whatsapp', 'https://wa.me/9779706929329', null, 4)
on conflict (platform) do nothing;

-- Doctor profile
insert into doctor_profile (id, name, title, title_short, bio, credentials)
values (
  1,
  'Dr. Prakash Acharya',
  'Board Certified Dermatologist',
  'Board Certified Dermatologist · MD',
  '["Dr. Prakash Acharya is a Board Certified Dermatologist with an MD in Dermatology and Venereology. He established Pokhara Skin and Hair Clinic with the vision of making internationally standard dermatological care accessible to patients across the Gandaki region of Nepal. He also practices in Kathmandu.","With clinical expertise spanning medical dermatology, trichology, and aesthetic procedures, Dr. Acharya brings a holistic, evidence-based perspective to every patient interaction. His approach combines the precision of clinical medicine with a genuine understanding of the emotional dimensions of skin and hair health."]'::jsonb,
  '[{"label":"Qualification","value":"MD, Dermatology & Venereology"},{"label":"Certification","value":"Board Certified Dermatologist"},{"label":"Specialization","value":"Clinical & Aesthetic Dermatology"},{"label":"Focus Areas","value":"Skin Repair & Regeneration, Melasma, Acne Scars, Hair Disorders, Advanced Dermatological Treatments"},{"label":"Clinic","value":"Pokhara Skin and Hair Clinic"},{"label":"Location","value":"Nayabazar-8, Pokhara, Nepal"}]'::jsonb
)
on conflict (id) do nothing;

-- Treatment options
insert into treatment_options (label, sort_order) values
  ('Skin Consultation', 1),
  ('Skin Analyzer / Skin Test', 2),
  ('Acne & Pigmentation', 3),
  ('Chemical Peel', 4),
  ('Microneedling', 5),
  ('Laser Treatment', 6),
  ('HydraFacial', 7),
  ('Nail Problems', 8),
  ('PRP Hair Therapy', 9),
  ('GFC Therapy', 10),
  ('Exosome Therapy', 11),
  ('Hair Fall Consultation', 12),
  ('Botox', 13),
  ('Dermal Fillers', 14),
  ('Anti-Aging Treatment', 15),
  ('Laser Hair Reduction', 16),
  ('General Dermatology', 17);

-- Skin services
insert into services (category_id, title, description, benefits, result, image_url, featured, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Acne & Pigmentation', 'Comprehensive medical treatment for acne, acne scars, melasma, post-acne marks, and nail problems using clinically proven protocols.', '["Reduces breakouts","Fades dark spots","Clears skin tone"]', 'Visibly clearer skin within 4 to 8 weeks', 'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', true, 1),
  ('11111111-1111-1111-1111-111111111101', 'Chemical Peels', 'Medical-grade peels tailored to your skin type, targeting texture, tone, and radiance with precision-controlled exfoliation.', '["Refines texture","Brightens complexion","Minimizes pores"]', 'Smoother, luminous skin in 1 to 3 sessions', 'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', true, 2),
  ('11111111-1111-1111-1111-111111111101', 'Skin Analyzer & Skin Tests', 'Advanced Skin Analyzer diagnostics and clinical skin tests to accurately assess your skin condition and build a personalized treatment roadmap.', '["Skin Analyzer scan","Accurate diagnosis","Customized plan"]', 'Clear treatment plan in a single consultation', 'https://images.pexels.com/photos/4586732/pexels-photo-4586732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', true, 3),
  ('11111111-1111-1111-1111-111111111101', 'Microneedling', 'Precision collagen induction therapy that stimulates natural skin regeneration for firmer, smoother, and more youthful-looking skin.', '["Boosts collagen","Reduces scars","Improves elasticity"]', 'Firmer, rejuvenated skin within 4 to 6 weeks', 'https://images.pexels.com/photos/32260064/pexels-photo-32260064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 4),
  ('11111111-1111-1111-1111-111111111101', 'Laser Procedures', 'Advanced laser technology for skin resurfacing, pigmentation correction, and targeted skin renewal with minimal downtime.', '["Targets pigmentation","Resurfaces skin","Long-lasting results"]', 'Clinically significant improvement after each session', 'https://images.pexels.com/photos/3985332/pexels-photo-3985332.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 5),
  ('11111111-1111-1111-1111-111111111101', 'HydraFacial & Rejuvenation', 'Multi-step medical facial treatment combining deep cleansing, exfoliation, extraction, and hydration for instantly radiant skin.', '["Deep cleansing","Instant radiance","Zero downtime"]', 'Visibly refreshed skin after first treatment', 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 6);

-- Hair services
insert into services (category_id, title, description, benefits, result, image_url, featured, sort_order) values
  ('11111111-1111-1111-1111-111111111102', 'PRP Therapy', 'Platelet-Rich Plasma therapy using your own blood growth factors to stimulate dormant hair follicles and promote natural regrowth.', '["Activates follicles","Thickens hair","Natural process"]', 'Noticeable density improvement in 3 to 6 months', 'https://images.pexels.com/photos/36963686/pexels-photo-36963686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 1),
  ('11111111-1111-1111-1111-111111111102', 'GFC Therapy', 'Growth Factor Concentrate therapy, a next-generation advancement over PRP with a higher concentration of targeted growth factors.', '["Higher efficacy","Concentrated factors","Faster results"]', 'Enhanced hair density within 2 to 4 months', 'https://images.pexels.com/photos/29648642/pexels-photo-29648642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 2),
  ('11111111-1111-1111-1111-111111111102', 'Exosome Therapy', 'Cutting-edge regenerative treatment using exosomes to signal cellular repair and accelerate hair follicle regeneration at the root.', '["Regenerative medicine","Cellular renewal","Minimal sessions"]', 'Visible improvement within 6 to 10 weeks', 'https://images.pexels.com/photos/7320791/pexels-photo-7320791.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 3),
  ('11111111-1111-1111-1111-111111111102', 'Hair Fall Consultation', 'Complete trichological evaluation for hair loss and hair care, including scalp health assessment, hormonal analysis review, and dietary guidance.', '["Root cause diagnosis","Scalp health","Treatment roadmap"]', 'Targeted treatment plan from first visit', 'https://images.pexels.com/photos/23349910/pexels-photo-23349910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 4),
  ('11111111-1111-1111-1111-111111111102', 'Hair Density Restoration', 'Multi-modal treatment combining medical therapy, nutritional support, and clinical procedures to restore optimal hair density.', '["Multi-modal approach","Proven protocols","Lasting results"]', 'Measurable density improvement in 3 to 6 months', 'https://images.pexels.com/photos/7320790/pexels-photo-7320790.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 5);

-- Aesthetic services
insert into services (category_id, title, description, benefits, result, image_url, featured, sort_order) values
  ('11111111-1111-1111-1111-111111111103', 'Botox', 'Precision botulinum toxin treatments for dynamic wrinkle reduction, facial contouring, and subtle natural rejuvenation.', '["Smooths wrinkles","Natural look","Quick procedure"]', 'Visible softening of lines within 7 to 14 days', 'https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 1),
  ('11111111-1111-1111-1111-111111111103', 'Dermal Fillers', 'Volume restoration and facial contouring using premium hyaluronic acid fillers for natural, balanced aesthetic enhancement.', '["Restores volume","Defines contours","Immediate results"]', 'Immediate visible enhancement, lasting 9 to 18 months', 'https://images.pexels.com/photos/32160039/pexels-photo-32160039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 2),
  ('11111111-1111-1111-1111-111111111103', 'Anti-Aging Procedures', 'Comprehensive rejuvenation protocols combining multiple modalities to restore youthful skin quality, tone, and texture.', '["Multi-modal","Comprehensive","Preventative"]', 'Progressive improvement with consistent treatment', 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 3),
  ('11111111-1111-1111-1111-111111111103', 'Laser Hair Reduction', 'Long-term hair reduction using safe, controlled laser energy to target hair follicles and inhibit regrowth across all body areas.', '["Permanent reduction","All skin types","Painless sessions"]', '70 to 90 percent reduction after complete treatment course', 'https://images.pexels.com/photos/4586726/pexels-photo-4586726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 4),
  ('11111111-1111-1111-1111-111111111103', 'Personalized Cosmetology', 'Bespoke aesthetic treatment plans combining evidence-based procedures for comprehensive skin, face, and body enhancement.', '["Tailored protocols","Combined therapies","Ongoing care"]', 'Holistic aesthetic improvement tailored to you', 'https://images.pexels.com/photos/3985332/pexels-photo-3985332.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400', false, 5);

-- Testimonials
insert into testimonials (name, location, treatment, rating, quote, initial, sort_order) values
  ('Priya S.', 'Pokhara', 'Acne & Pigmentation Treatment', 5, 'After years of struggling with hormonal acne, I finally found a clinic that approached my skin medically rather than cosmetically. Dr. Acharya created a treatment plan that addressed the root cause. Three months later, my skin is clearer than it has been in a decade.', 'P', 1),
  ('Sunita T.', 'Kaski', 'Chemical Peel & Skin Rejuvenation', 5, 'The clinic feels different from the moment you walk in. Clean, calm, and clinical in the best way. My skin tone is significantly more even after the peel series, and the team was genuinely attentive throughout every session.', 'S', 2),
  ('Manjula R.', 'Lekhnath', 'Laser Pigmentation Treatment', 5, 'I travelled from Lekhnath specifically for this clinic after reading about Dr. Acharya. Worth every kilometer. The laser treatment for my pigmentation was precise, painless, and the results were visible within two weeks.', 'M', 3),
  ('Deepa B.', 'Pokhara', 'Botox & Filler Consultation', 5, 'What I appreciated most was the honest, no-pressure consultation. Dr. Acharya advised me against a treatment I thought I wanted and suggested an alternative that has given me genuinely natural results. That kind of integrity is rare.', 'D', 4),
  ('Rohan M.', 'Pokhara', 'PRP Hair Restoration', 5, 'I was skeptical about PRP therapy but the consultation was thorough and honest — Dr. Acharya explained exactly what to expect and what not to expect. Four sessions in, my hair density has noticeably improved. The professionalism here is unlike any clinic I have visited.', 'R', 5),
  ('Aarav K.', 'Pokhara', 'GFC Hair Therapy', 5, 'GFC therapy at Pokhara Skin and Hair Clinic genuinely changed how I feel about my hair. I came in feeling resigned about my hairline. Three months after treatment, I feel confident again. The expertise here is real.', 'A', 6);

-- Results
insert into results (label, before_url, after_url, duration, category, sort_order) values
  ('Acne Treatment', 'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', '8 weeks of treatment', 'skin', 1),
  ('Pigmentation Correction', 'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', 'https://images.pexels.com/photos/15327096/pexels-photo-15327096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', '3 chemical peel sessions', 'skin', 2),
  ('Skin Rejuvenation', 'https://images.pexels.com/photos/6730032/pexels-photo-6730032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', 'https://images.pexels.com/photos/7479517/pexels-photo-7479517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', '6-session microneedling course', 'skin', 3),
  ('Hair Density Restoration', 'https://images.pexels.com/photos/7320791/pexels-photo-7320791.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', 'https://images.pexels.com/photos/23349910/pexels-photo-23349910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=480', '4 PRP sessions over 4 months', 'hair', 4);

-- Gallery
insert into gallery_items (image_url, label, tag, is_tall, sort_order) values
  ('https://images.pexels.com/photos/32260065/pexels-photo-32260065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Skin Treatment Session', 'Treatment', true, 1),
  ('https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Patient Consultation', 'Consultation', false, 2),
  ('https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Facial Care Procedure', 'Skin Care', false, 3),
  ('https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Glowing Skin Results', 'Results', false, 4),
  ('https://images.pexels.com/photos/36963686/pexels-photo-36963686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Hair Restoration Procedure', 'Hair Care', false, 5),
  ('https://images.pexels.com/photos/29648642/pexels-photo-29648642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Clinical Dermatology', 'Dermatology', true, 6),
  ('https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Laser Treatment', 'Laser', false, 7),
  ('https://images.pexels.com/photos/15327096/pexels-photo-15327096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600', 'Beautiful Skin Results', 'Results', false, 8);

-- Hero slides
insert into hero_slides (image_url, alt, sort_order) values
  ('https://images.pexels.com/photos/32260065/pexels-photo-32260065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 'Advanced skin care at Pokhara Skin and Hair Clinic', 1),
  ('https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 'Dermatology consultation', 2),
  ('https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920', 'Clinical skin treatment', 3);

-- Trust items (icons rendered in UI)
insert into trust_items (label, sub, sort_order) values
  ('Board Certified Dermatologist', 'MD Qualified Expert', 1),
  ('Modern Skin Analysis', 'Skin diagnostics · Hair care', 2),
  ('Personalized Treatments', 'Individual Care Plans', 3),
  ('Evidence-Based Medicine', 'Safe Clinical Procedures', 4),
  ('Hair Restoration', 'PRP · GFC · Exosome', 5);

-- About stats
insert into about_stats (value, label, sort_order) values
  ('5000+', 'Patients Treated', 1),
  ('15+', 'Aesthetic Procedures', 2),
  ('10+', 'Years Experience', 3),
  ('98%', 'Patient Satisfaction', 4);
