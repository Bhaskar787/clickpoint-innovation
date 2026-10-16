import json
import psycopg2
from psycopg2.extras import RealDictCursor
from app.core.config import settings, clean_url

def parse_json(data):
    if not data:
        return {}
    if isinstance(data, dict):
        return data
    if isinstance(data, list):
        return data
    if isinstance(data, str):
        try:
            return json.loads(data)
        except Exception:
            return {}
    return {}

def format_stat(s):
    if not isinstance(s, dict):
        return str(s)
    label = s.get("label") or s.get("name") or ""
    val = s.get("value") or s.get("stat") or ""
    suffix = s.get("suffix") or ""
    sublabel = s.get("sublabel") or ""
    
    res = f"• {label}: {val}{suffix}".strip()
    if sublabel:
        res += f" ({sublabel})"
    return res

def read_all_content() -> list:
    """
    Connects to PostgreSQL and extracts granular single-entity content items across all Prisma content models & JSON blobs.
    Returns a flat list of dicts: [{ source_id, source_type, title, content, url }]
    """
    raw_dsn = clean_url(settings.DATABASE_URL)
    documents = []

    try:
        conn = psycopg2.connect(raw_dsn)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            
            # 1. Services Page & Individual Services (services_page)
            try:
                cur.execute("SELECT content FROM services_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    
                    cat_sec = data.get("catalogSection") or {}
                    if cat_sec:
                        documents.append({
                            "source_id": "services-catalog-header",
                            "source_type": "service",
                            "title": f"Services Catalog: {cat_sec.get('title', 'Core Engineering Disciplines')}",
                            "content": f"Tagline: {cat_sec.get('tag', '')}\nTitle: {cat_sec.get('title', '')}\nOverview of Clickpoint full-stack product engineering services.",
                            "url": "/services"
                        })
                    
                    proc_sec = data.get("processSection") or {}
                    if proc_sec:
                        p_steps = proc_sec.get("steps") or []
                        p_lines = [f"Step {s.get('step', idx+1)} — {s.get('title', '')}: {s.get('desc', '')} (Deliverable: {s.get('deliverable', '')})" for idx, s in enumerate(p_steps)]
                        documents.append({
                            "source_id": "services-agile-process",
                            "source_type": "service",
                            "title": f"Services Engineering Process: {proc_sec.get('title', 'Agile Pod Model')}",
                            "content": f"Title: {proc_sec.get('title', '')}\nSubtitle: {proc_sec.get('subtitle', '')}\nPhases:\n" + "\n".join(p_lines),
                            "url": "/services#process"
                        })

                    services = data.get("services") or data.get("servicesList", {}).get("items") or []
                    for idx, s in enumerate(services):
                        sid = s.get("id") or f"service-{idx}"
                        title = s.get("title") or s.get("name") or "Service Offering"
                        subtitle = s.get("subtitle") or ""
                        desc = s.get("desc") or s.get("description") or s.get("fullOverview") or ""
                        badge = s.get("heroBadge") or ""
                        features = s.get("features") or s.get("bullets") or []
                        use_cases = s.get("useCases") or []
                        workflow = s.get("workflow") or []
                        metrics = s.get("keyMetrics") or s.get("metrics") or []
                        tech = s.get("techStack") or s.get("tags") or []
                        
                        feat_str = "; ".join([f"• {f.get('title', '')}: {f.get('desc', '')}" if isinstance(f, dict) else f"• {f}" for f in features])
                        uc_str = ", ".join(use_cases) if isinstance(use_cases, list) else str(use_cases)
                        wf_str = "; ".join([f"Phase {w.get('step', i+1)} ({w.get('title', '')}): {w.get('desc', '')}" for i, w in enumerate(workflow)])
                        metric_str = ", ".join([format_stat(m) for m in metrics])
                        tech_str = ", ".join(tech) if isinstance(tech, list) else str(tech)

                        content_parts = [f"Service Name: {title}"]
                        if badge: content_parts.append(f"Badge: {badge}")
                        if subtitle: content_parts.append(f"Subtitle: {subtitle}")
                        if desc: content_parts.append(f"Overview: {desc}")
                        if feat_str: content_parts.append(f"Core Capabilities: {feat_str}")
                        if uc_str: content_parts.append(f"Primary Use Cases: {uc_str}")
                        if wf_str: content_parts.append(f"Delivery Workflow: {wf_str}")
                        if metric_str: content_parts.append(f"Performance Benchmarks: {metric_str}")
                        if tech_str: content_parts.append(f"Tech Stack: {tech_str}")

                        documents.append({
                            "source_id": sid,
                            "source_type": "service",
                            "title": f"Service Offering: {title}",
                            "content": "\n".join(content_parts),
                            "url": f"/services#{sid}"
                        })
            except Exception as e:
                print(f"Error reading services_page: {e}")

            # 2. Landing Page (landing_page)
            try:
                cur.execute("SELECT content FROM landing_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    
                    hero = data.get("hero") or {}
                    if hero:
                        pillars = hero.get("pillars") or []
                        p_str = "; ".join(pillars) if isinstance(pillars, list) else str(pillars)
                        documents.append({
                            "source_id": "landing-hero",
                            "source_type": "landing",
                            "title": "Clickpoint Landing Hero & Core Tagline",
                            "content": f"Badge: {hero.get('badge', '')}\nTitle: {hero.get('title', '')}\nSubtitle: {hero.get('subtitle', '')}\nPillars: {p_str}",
                            "url": "/"
                        })
                    
                    stats = data.get("stats") or data.get("metricsBar") or []
                    if stats:
                        stat_lines = [format_stat(s) for s in stats]
                        documents.append({
                            "source_id": "landing-stats",
                            "source_type": "landing",
                            "title": "Clickpoint Company Metrics & Achievements",
                            "content": "Key Metrics:\n" + "\n".join(stat_lines),
                            "url": "/#stats"
                        })

                    cta = data.get("ctaBanner") or {}
                    if cta:
                        documents.append({
                            "source_id": "landing-cta",
                            "source_type": "landing",
                            "title": "Clickpoint Consultation & Contact CTA",
                            "content": f"Title: {cta.get('title', '')}\nSubtitle: {cta.get('subtitle', '')}\nAction: {cta.get('buttonText', 'Book a Technical Audit')}",
                            "url": cta.get("buttonLink", "/contact")
                        })
            except Exception as e:
                print(f"Error reading landing_page: {e}")

            # 3. About Us Page (about_page)
            try:
                cur.execute("SELECT content FROM about_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    
                    # Hero & Tagline
                    hero = data.get("hero") or {}
                    if hero and isinstance(hero, dict):
                        documents.append({
                            "source_id": "about-hero",
                            "source_type": "about",
                            "title": f"About Clickpoint Innovation: {hero.get('title', 'Company Overview')}",
                            "content": f"Badge: {hero.get('badge', '')}\nTitle: {hero.get('title', '')}\nSubtitle: {hero.get('subtitle', '')}",
                            "url": "/about"
                        })

                    # Company Mission & Overview
                    mission = data.get("mission") or {}
                    if mission and isinstance(mission, dict):
                        bullets = mission.get("bullets") or []
                        b_str = "\n".join([f"• {b}" for b in bullets]) if isinstance(bullets, list) else str(bullets)
                        m_content = f"Heading: {mission.get('heading', '')}\n"
                        if mission.get("paragraph1"): m_content += f"Story: {mission.get('paragraph1')}\n"
                        if mission.get("paragraph2"): m_content += f"Scale & Impact: {mission.get('paragraph2')}\n"
                        if mission.get("cardTitle"): m_content += f"Delivery Model: {mission.get('cardTitle')} — {mission.get('cardDesc', '')}\n"
                        if b_str: m_content += f"Key Highlights:\n{b_str}\n"
                        if mission.get("statBox1Label"): m_content += f"• {mission.get('statBox1Label')}: {mission.get('statBox1Value')}\n"
                        if mission.get("statBox2Label"): m_content += f"• {mission.get('statBox2Label')}: {mission.get('statBox2Value')}\n"

                        documents.append({
                            "source_id": "about-mission",
                            "source_type": "about",
                            "title": f"Clickpoint Mission & Company Story: {mission.get('heading', 'About Us')}",
                            "content": m_content.strip(),
                            "url": "/about#mission"
                        })

                    # Leadership Team
                    leadership_sec = data.get("leadership") or {}
                    team = leadership_sec.get("team") if isinstance(leadership_sec, dict) else (data.get("team") or data.get("members") or [])
                    if isinstance(team, list):
                        for idx, m in enumerate(team):
                            if not isinstance(m, dict): continue
                            m_name = m.get("name") or m.get("title") or "Team Member"
                            m_role = m.get("role") or m.get("position") or ""
                            m_bio = m.get("bio") or m.get("description") or ""
                            m_exp = m.get("expertise") or []
                            exp_str = ", ".join(m_exp) if isinstance(m_exp, list) else str(m_exp)
                            
                            c_parts = [f"Name: {m_name}"]
                            if m_role: c_parts.append(f"Role: {m_role}")
                            if m_bio: c_parts.append(f"Executive Bio: {m_bio}")
                            if exp_str: c_parts.append(f"Key Expertise: {exp_str}")

                            documents.append({
                                "source_id": f"team-{m.get('id', idx)}",
                                "source_type": "about",
                                "title": f"Leadership Profile: {m_name} ({m_role})" if m_role else f"Leadership Profile: {m_name}",
                                "content": "\n".join(c_parts),
                                "url": "/about#team"
                            })

                    # Core Values
                    values_sec = data.get("values") or {}
                    val_items = values_sec.get("items") if isinstance(values_sec, dict) else (values_sec if isinstance(values_sec, list) else [])
                    if isinstance(val_items, list):
                        for idx, v in enumerate(val_items):
                            if not isinstance(v, dict): continue
                            v_title = v.get("title") or v.get("name") or "Core Value"
                            v_desc = v.get("description") or v.get("desc") or ""
                            documents.append({
                                "source_id": f"value-{v.get('id', idx)}",
                                "source_type": "about",
                                "title": f"Company Core Value: {v_title}",
                                "content": f"Value: {v_title}\nPrinciples: {v_desc}",
                                "url": "/about#values"
                            })

                    # About Stats
                    about_stats = data.get("stats") or []
                    if isinstance(about_stats, list) and about_stats:
                        stat_lines = [format_stat(s) for s in about_stats]
                        documents.append({
                            "source_id": "about-stats",
                            "source_type": "about",
                            "title": "Clickpoint Engineering Performance & Impact Stats",
                            "content": "Company Metrics:\n" + "\n".join(stat_lines),
                            "url": "/about#stats"
                        })
            except Exception as e:
                print(f"Error reading about_page: {e}")

            # 4. Journey Timeline & Events (journey_page)
            try:
                cur.execute("SELECT content FROM journey_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    
                    events = data.get("events") or []
                    if isinstance(events, list):
                        for idx, ev in enumerate(events):
                            if not isinstance(ev, dict): continue
                            ev_id = ev.get("id") or f"event-{idx}"
                            ev_title = ev.get("title", "")
                            ev_date = ev.get("date", "")
                            ev_cat = ev.get("category", "")
                            ev_loc = ev.get("location", "")
                            ev_sub = ev.get("subtitle", "")
                            ev_story = ev.get("fullStory", "")
                            ev_metric = ev.get("keyMetric", "")
                            ev_highlights = ev.get("highlights", [])
                            
                            h_str = "; ".join([h.get("title", "") if isinstance(h, dict) else str(h) for h in ev_highlights]) if isinstance(ev_highlights, list) else str(ev_highlights)
                            documents.append({
                                "source_id": f"journey-event-{ev_id}",
                                "source_type": "journey",
                                "title": f"Company Milestone Event: {ev_title} ({ev_date})",
                                "content": f"Event Title: {ev_title}\nDate: {ev_date}\nCategory: {ev_cat}\nLocation: {ev_loc}\nSubtitle: {ev_sub}\nKey Metric: {ev_metric}\nStory: {ev_story}\nHighlights: {h_str}",
                                "url": f"/journey#{ev_id}"
                            })

                    eras = data.get("eras") or data.get("timeline") or []
                    if isinstance(eras, list):
                        for idx, e in enumerate(eras):
                            if not isinstance(e, dict): continue
                            e_year = e.get("era") or e.get("year") or ""
                            e_title = e.get("title") or e.get("heading") or "Journey Era"
                            e_desc = e.get("description") or e.get("desc") or ""
                            bullets = e.get("bullets") or e.get("achievements") or []
                            b_str = "; ".join([b.get("title", "") if isinstance(b, dict) else str(b) for b in bullets]) if isinstance(bullets, list) else str(bullets)
                            documents.append({
                                "source_id": f"journey-era-{idx}",
                                "source_type": "journey",
                                "title": f"Clickpoint Journey Era ({e_year}): {e_title}",
                                "content": f"Era: {e_year} — {e_title}\nDescription: {e_desc}\nMilestones: {b_str}",
                                "url": "/journey"
                            })

                    ethos = data.get("ethosSection") or {}
                    pillars = ethos.get("pillars") or []
                    if isinstance(pillars, list):
                        for idx, p in enumerate(pillars):
                            if isinstance(p, dict):
                                p_title = p.get("title", f"Pillar {idx+1}")
                                p_desc = p.get("description", "")
                                documents.append({
                                    "source_id": f"journey-ethos-{idx}",
                                    "source_type": "journey",
                                    "title": f"Engineering Ethos Pillar: {p_title}",
                                    "content": f"Ethos Title: {p_title}\nDescription: {p_desc}",
                                    "url": "/journey#ethos"
                                })
            except Exception as e:
                print(f"Error reading journey_page: {e}")

            # 5. Industries Page (industries_page)
            try:
                cur.execute("SELECT content FROM industries_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    industries = data.get("industries") or []
                    if isinstance(industries, list):
                        for idx, ind in enumerate(industries):
                            if not isinstance(ind, dict): continue
                            iid = ind.get("id") or f"ind-{idx}"
                            title = ind.get("title") or ind.get("name") or "Industry Solution"
                            desc = ind.get("desc") or ind.get("description") or ""
                            sol = ind.get("solutions") or ind.get("features") or []
                            sol_str = "; ".join([f"{s.get('title', '')}: {s.get('desc', '')}" if isinstance(s, dict) else str(s) for s in sol]) if isinstance(sol, list) else str(sol)
                            documents.append({
                                "source_id": iid,
                                "source_type": "industry",
                                "title": f"Industry Solution: {title}",
                                "content": f"Industry: {title}\nDescription: {desc}\nCustom Solutions: {sol_str}",
                                "url": f"/industries#{iid}"
                            })
            except Exception as e:
                print(f"Error reading industries_page: {e}")

            # 6. Careers Page Culture & Perks (careers_page)
            try:
                cur.execute("SELECT content FROM careers_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    hero = data.get("hero") or {}
                    perk_sec = data.get("perksSection") or {}
                    perks = perk_sec.get("perks") if isinstance(perk_sec, dict) else (data.get("perks") or [])
                    perk_lines = [f"• {p.get('title', '')}: {p.get('description', p.get('desc', ''))}" if isinstance(p, dict) else f"• {p}" for p in perks]
                    
                    documents.append({
                        "source_id": "careers-culture-perks",
                        "source_type": "career",
                        "title": "Careers Culture, Benefits & Engineering Perks",
                        "content": f"Hero Title: {hero.get('title', 'Careers at Clickpoint')}\nSubtitle: {hero.get('subtitle', '')}\nPerks & Stipends:\n" + "\n".join(perk_lines),
                        "url": "/careers#culture"
                    })
            except Exception as e:
                print(f"Error reading careers_page: {e}")

            # 7. Active Job Vacancies (job_vacancies)
            try:
                cur.execute("""
                    SELECT v.id, v.title, v.type, v.location, v.experience, v.salary, v.summary, v.responsibilities, v.requirements, c.name as category
                    FROM job_vacancies v LEFT JOIN job_categories c ON v."categoryId" = c.id
                    WHERE v."isActive" = true;
                """)
                rows = cur.fetchall()
                for j in rows:
                    title = j.get("title", "")
                    cat = j.get("category") or "Engineering"
                    jtype = j.get("type", "Full-Time")
                    loc = j.get("location", "Remote")
                    exp = j.get("experience", "")
                    sal = j.get("salary", "")
                    summary = j.get("summary", "")
                    resp = parse_json(j.get("responsibilities"))
                    reqs = parse_json(j.get("requirements"))

                    content_parts = [f"Job Opening: {title}", f"Department: {cat}", f"Employment Type: {jtype}", f"Location: {loc}"]
                    if exp: content_parts.append(f"Experience Level: {exp}")
                    if sal: content_parts.append(f"Salary Benchmark: {sal}")
                    if summary: content_parts.append(f"Role Summary: {summary}")
                    if resp: content_parts.append(f"Responsibilities: {'; '.join(resp) if isinstance(resp, list) else resp}")
                    if reqs: content_parts.append(f"Requirements: {'; '.join(reqs) if isinstance(reqs, list) else reqs}")

                    documents.append({
                        "source_id": j["id"],
                        "source_type": "career",
                        "title": f"Career Opening: {title} ({loc})",
                        "content": "\n".join(content_parts),
                        "url": "/careers"
                    })
            except Exception as e:
                print(f"Error reading job_vacancies: {e}")

            # 8. Blog Posts (blog_posts)
            try:
                cur.execute("""
                    SELECT id, title, slug, excerpt, content, tags, author, "authorRole", "publishedAt"
                    FROM blog_posts
                    WHERE "publishedAt" <= NOW();
                """)
                rows = cur.fetchall()
                for b in rows:
                    title = b.get("title", "")
                    slug = b.get("slug", "")
                    excerpt = b.get("excerpt", "")
                    body = b.get("content", "")
                    tags = parse_json(b.get("tags"))
                    author = b.get("author", "")
                    author_role = b.get("authorRole", "")
                    
                    content_parts = [f"Blog Title: {title}"]
                    if author: content_parts.append(f"Author: {author} ({author_role})")
                    if excerpt: content_parts.append(f"Summary: {excerpt}")
                    if tags: content_parts.append(f"Tags: {', '.join(tags) if isinstance(tags, list) else tags}")
                    if body: content_parts.append(f"Article Body:\n{body[:1500]}")

                    documents.append({
                        "source_id": b["id"],
                        "source_type": "blogPost",
                        "title": f"Blog Article: {title}",
                        "content": "\n".join(content_parts),
                        "url": f"/blog/{slug}"
                    })
            except Exception as e:
                print(f"Error reading blog_posts: {e}")

            # 9. Case Studies (case_studies)
            try:
                cur.execute("""
                    SELECT id, title, slug, client, category, description, challenge, solution, results, metrics, "techStack"
                    FROM case_studies;
                """)
                rows = cur.fetchall()
                for c in rows:
                    title = c.get("title", "")
                    slug = c.get("slug", "")
                    client = c.get("client", "")
                    cat = c.get("category", "")
                    desc = c.get("description", "")
                    chall = c.get("challenge", "")
                    sol = c.get("solution", "")
                    res = c.get("results", "")
                    metrics = parse_json(c.get("metrics"))
                    tech = parse_json(c.get("techStack"))

                    content_parts = [f"Case Study Title: {title}", f"Client: {client}", f"Industry Category: {cat}"]
                    if desc: content_parts.append(f"Overview: {desc}")
                    if chall: content_parts.append(f"Engineering Challenge: {chall}")
                    if sol: content_parts.append(f"Technical Solution: {sol}")
                    if res: content_parts.append(f"Results: {res}")
                    if metrics: content_parts.append(f"Metrics Achieved: {json.dumps(metrics) if isinstance(metrics, (dict, list)) else metrics}")
                    if tech: content_parts.append(f"Tech Stack Used: {', '.join(tech) if isinstance(tech, list) else tech}")

                    documents.append({
                        "source_id": c["id"],
                        "source_type": "caseStudy",
                        "title": f"Case Study: {title} ({client})",
                        "content": "\n".join(content_parts),
                        "url": f"/case-studies/{slug}"
                    })
            except Exception as e:
                print(f"Error reading case_studies: {e}")

            # 10. Testimonials (testimonials)
            try:
                cur.execute("""
                    SELECT id, "clientName", "clientRole", company, content, rating
                    FROM testimonials WHERE "isApproved" = true;
                """)
                rows = cur.fetchall()
                for t in rows:
                    name = t.get("clientName", "")
                    role = t.get("clientRole", "")
                    comp = t.get("company", "")
                    text = t.get("content", "")
                    rating = t.get("rating", 5)

                    documents.append({
                        "source_id": t["id"],
                        "source_type": "testimonial",
                        "title": f"Testimonial from {name} ({comp})",
                        "content": f"Client Review: \"{text}\"\nReviewer: {name}, {role} at {comp}\nRating: {rating}/5 Stars",
                        "url": "/testimonials"
                    })
            except Exception as e:
                print(f"Error reading testimonials: {e}")

            # 11. FAQs (faqs & faq_categories)
            try:
                cur.execute("""
                    SELECT f.id, f.question, f.answer, c.name as category
                    FROM faqs f LEFT JOIN faq_categories c ON f."categoryId" = c.id;
                """)
                rows = cur.fetchall()
                for f in rows:
                    q = f.get("question", "")
                    a = f.get("answer", "")
                    cat = f.get("category") or "General"

                    documents.append({
                        "source_id": f["id"],
                        "source_type": "faq",
                        "title": f"FAQ: {q}",
                        "content": f"Category: {cat}\nQuestion: {q}\nAnswer: {a}",
                        "url": "/faqs"
                    })
            except Exception as e:
                print(f"Error reading faqs: {e}")

            # 12. Contact Information Page (contact_page)
            try:
                cur.execute("SELECT content FROM contact_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    info = data.get("contactInfo") or data.get("info") or data
                    email = info.get("email") or "info@clickpoint.com.np"
                    phone = info.get("phone") or "+977-9825630080"
                    address = info.get("address") or "New Baneshwor, Kathmandu, Nepal"
                    hours = info.get("hours") or ""
                    
                    c_text = f"Contact Email: {email}\nPhone Number: {phone}\nPhysical Address: {address}"
                    if hours: c_text += f"\nOffice Hours: {hours}"
                    
                    documents.append({
                        "source_id": "contact-main",
                        "source_type": "contact",
                        "title": "Clickpoint Official Contact Information",
                        "content": c_text,
                        "url": "/contact"
                    })
            except Exception as e:
                print(f"Error reading contact_page: {e}")

            # 13. Chatbot Page & Pre-configured QA nodes (chatbot_page)
            try:
                cur.execute("SELECT content FROM chatbot_page LIMIT 1;")
                row = cur.fetchone()
                if row and row.get("content"):
                    data = parse_json(row["content"])
                    
                    # Custom pricing packages
                    pricing_info = data.get("customPricingInfo") or {}
                    packages = pricing_info.get("packages") or []
                    for idx, pkg in enumerate(packages):
                        pid = pkg.get("id") or f"pkg-{idx}"
                        p_name = pkg.get("name", "Engagement Package")
                        p_type = pkg.get("websiteType", "")
                        p_time = pkg.get("timeline", "")
                        p_price = pkg.get("priceRange", "")
                        p_desc = pkg.get("description", "")
                        p_feats = pkg.get("features", [])
                        
                        f_str = ", ".join(p_feats) if isinstance(p_feats, list) else str(p_feats)
                        documents.append({
                            "source_id": f"pricing-pkg-{pid}",
                            "source_type": "service",
                            "title": f"Engagement Pricing Package: {p_name}",
                            "content": f"Package: {p_name}\nCategory: {p_type}\nTimeline: {p_time}\nPrice Range: {p_price}\nDescription: {p_desc}\nFeatures Included: {f_str}",
                            "url": "/contact"
                        })

                    # Bot nodes pre-configured answers
                    nodes = data.get("nodes") or {}
                    if isinstance(nodes, dict):
                        for node_key, node_val in nodes.items():
                            if not isinstance(node_val, dict): continue
                            bot_msg = node_val.get("bot") or ""
                            if bot_msg:
                                documents.append({
                                    "source_id": f"bot-node-{node_key}",
                                    "source_type": "faq",
                                    "title": f"Chatbot Knowledge Node: {node_key.replace('_', ' ').title()}",
                                    "content": f"Topic: {node_key}\nOfficial Guidance: {bot_msg}",
                                    "url": "/#chat"
                                })
            except Exception as e:
                print(f"Error reading chatbot_page: {e}")

        conn.close()
    except Exception as e:
        print(f"PostgreSQL connection error in db_reader: {e}")

    return documents
