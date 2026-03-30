"""
CivicAlert v2 — Full Featured Flask Backend
Features: AI Classification, SMS/Email Notifications, SLA Tracking,
Officer Assignment, Leaderboard, Rewards, Comments, Before/After Photos
"""

from flask import Flask, request, jsonify, send_from_directory, session, redirect
from flask_cors import CORS
import anthropic
import json, os, uuid, smtplib, threading, hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()
app = Flask(__name__, static_folder="public", static_url_path="")
app.secret_key = os.getenv("SECRET_KEY", "civicalert-secret-2026-xk9")
CORS(app, supports_credentials=True)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

DB_FILE       = "complaints.json"
OFFICERS_FILE = "officers.json"
USERS_FILE    = "users.json"

# ── SLA rules (hours) ─────────────────────────────────────
SLA_RULES = {"urgent": 24, "medium": 72, "low": 168}

# ── DB helpers ────────────────────────────────────────────
def load(file, default=[]):
    if not os.path.exists(file):
        return default
    with open(file) as f:
        return json.load(f)

def save(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=2)

def seed_officers():
    if os.path.exists(OFFICERS_FILE):
        return
    officers = [
        {"id": "O001", "name": "Officer Priya", "dept": "Water Board", "email": "", "phone": "", "resolved": 47, "ontime": 98, "score": 940, "active": True},
        {"id": "O002", "name": "Officer Rajan",  "dept": "PWD",         "email": "", "phone": "", "resolved": 39, "ontime": 91, "score": 820, "active": True},
        {"id": "O003", "name": "Officer Kumar",  "dept": "Sanitation",  "email": "", "phone": "", "resolved": 31, "ontime": 85, "score": 710, "active": True},
        {"id": "O004", "name": "Officer Meena",  "dept": "TNEB",        "email": "", "phone": "", "resolved": 27, "ontime": 88, "score": 650, "active": True},
    ]
    save(OFFICERS_FILE, officers)

seed_officers()

# ══════════════════════════════════════════════════════════
# ROUTES — COMPLAINTS
# ══════════════════════════════════════════════════════════

# ── Auth helpers ──────────────────────────────────────────
def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def get_user_by_email(email):
    users = load(USERS_FILE, [])
    return next((u for u in users if u.get("email") == email), None)

# ── Pages ─────────────────────────────────────────────────
@app.route("/")
def landing():
    return send_from_directory("public", "index.html")

@app.route("/login")
def login_page():
    if session.get("user"):
        return redirect("/app")
    return send_from_directory("public", "login.html")

@app.route("/app")
def app_page():
    if not session.get("user"):
        return redirect("/login")
    return send_from_directory("public", "app.html")

# ── Auth API ──────────────────────────────────────────────
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    pw    = data.get("password", "")
    if not all([name, email, pw]):
        return jsonify({"error": "All fields required"}), 400
    if len(pw) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if get_user_by_email(email):
        return jsonify({"error": "Email already registered"}), 409
    users = load(USERS_FILE, [])
    user = {
        "id":      str(uuid.uuid4())[:8],
        "name":    name,
        "email":   email,
        "password": hash_pw(pw),
        "points":  0,
        "role":    "citizen",
        "joined":  datetime.now().isoformat(),
        "history": []
    }
    users.append(user)
    save(USERS_FILE, users)
    session["user"] = {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}
    return jsonify({"success": True, "user": session["user"]})

@app.route("/api/login", methods=["POST"])
def login_api():
    data  = request.json
    email = data.get("email", "").strip().lower()
    pw    = data.get("password", "")
    user  = get_user_by_email(email)
    if not user or user["password"] != hash_pw(pw):
        return jsonify({"error": "Invalid email or password"}), 401
    session["user"] = {"id": user["id"], "name": user["name"], "email": user["email"], "role": user.get("role", "citizen")}
    return jsonify({"success": True, "user": session["user"]})

@app.route("/api/logout", methods=["POST"])
def logout_api():
    session.clear()
    return jsonify({"success": True})

@app.route("/api/me", methods=["GET"])
def me():
    if session.get("user"):
        # Also return points
        users = load(USERS_FILE, [])
        u = next((x for x in users if x["id"] == session["user"]["id"]), None)
        pts = u.get("points", 0) if u else 0
        return jsonify({**session["user"], "points": pts})
    return jsonify({"error": "Not logged in"}), 401


@app.route("/api/complaints", methods=["GET"])
def get_complaints():
    complaints = load(DB_FILE)
    # Add SLA breach flag
    now = datetime.now()
    for c in complaints:
        if not c.get("resolved"):
            created = datetime.fromisoformat(c.get("created_at", now.isoformat()))
            hours_elapsed = (now - created).total_seconds() / 3600
            sla_hours = SLA_RULES.get(c["priority"], 72)
            c["hours_elapsed"] = round(hours_elapsed, 1)
            c["sla_breached"]  = hours_elapsed > sla_hours
            c["sla_percent"]   = min(100, round(hours_elapsed / sla_hours * 100))
    return jsonify(complaints)

@app.route("/api/complaints/<cid>", methods=["GET"])
def get_complaint(cid):
    complaints = load(DB_FILE)
    c = next((x for x in complaints if x["id"] == cid), None)
    return jsonify(c) if c else (jsonify({"error": "Not found"}), 404)

@app.route("/api/complaints", methods=["POST"])
def submit_complaint():
    data = request.json
    desc     = data.get("description", "")
    location = data.get("location", "")
    name     = data.get("name", "Anonymous")
    contact  = data.get("contact", "")

    if not desc:
        return jsonify({"error": "Description required"}), 400

    # ── AI Classification ──────────────────────────────────
    ai = classify_with_ai(desc, location)

    # ── Auto-group similar complaints ─────────────────────
    complaints = load(DB_FILE)
    group_id   = find_group(complaints, ai["category"], location)

    cid = f"CA-{datetime.now().year}-{str(len(complaints)+1).zfill(4)}"

    complaint = {
        "id":            cid,
        "title":         desc[:70] + ("..." if len(desc) > 70 else ""),
        "description":   desc,
        "location":      location,
        "name":          name,
        "contact":       contact,
        "type":          ai["category"],
        "priority":      ai["priority"],
        "priority_reason": ai.get("priority_reason", ""),
        "solution_steps":  ai.get("solution_steps", []),
        "solution":      ". ".join(ai.get("solution_steps", [])),
        "department":    ai.get("department", "General Admin"),
        "estimated_time": ai.get("estimated_time", "TBD"),
        "upvotes":       1,
        "group_id":      group_id,
        "resolved":      False,
        "status":        "pending",       # pending|assigned|in_progress|resolved
        "assigned_to":   None,
        "comments":      [],
        "before_photos": data.get("photos", []),
        "after_photos":  [],
        "reward_points": 10,
        "lat":           data.get("lat", 11.0168),
        "lng":           data.get("lng", 76.9558),
        "created_at":    datetime.now().isoformat(),
        "resolved_at":   None,
    }

    complaints.insert(0, complaint)
    save(DB_FILE, complaints)

    # ── Award citizen points ───────────────────────────────
    award_points(name, contact, 10, f"Reported {ai['category']} issue")

    # ── Send notification (async) ──────────────────────────
    if contact:
        threading.Thread(target=send_notification, args=(contact, cid, ai["category"], ai["priority"]), daemon=True).start()

    return jsonify({"success": True, "complaint": complaint, "ai": ai})

@app.route("/api/complaints/<cid>/upvote", methods=["POST"])
def upvote(cid):
    complaints = load(DB_FILE)
    for c in complaints:
        if c["id"] == cid:
            c["upvotes"] = c.get("upvotes", 0) + 1
            break
    save(DB_FILE, complaints)
    return jsonify({"success": True})

@app.route("/api/complaints/<cid>/comment", methods=["POST"])
def add_comment(cid):
    data = request.json
    complaints = load(DB_FILE)
    for c in complaints:
        if c["id"] == cid:
            c.setdefault("comments", []).append({
                "id":     str(uuid.uuid4())[:8],
                "author": data.get("author", "Citizen"),
                "text":   data.get("text", ""),
                "time":   datetime.now().strftime("%I:%M %p"),
                "role":   data.get("role", "citizen"),  # citizen|authority
            })
            break
    save(DB_FILE, complaints)
    return jsonify({"success": True})

@app.route("/api/complaints/<cid>/assign", methods=["POST"])
def assign_complaint(cid):
    data = request.json
    officer_name = data.get("officer")
    complaints = load(DB_FILE)
    for c in complaints:
        if c["id"] == cid:
            c["assigned_to"] = officer_name
            c["status"]      = "assigned"
            c["assigned_at"] = datetime.now().isoformat()
            break
    save(DB_FILE, complaints)
    return jsonify({"success": True})

@app.route("/api/complaints/<cid>/resolve", methods=["POST"])
def resolve_complaint(cid):
    data = request.json
    complaints = load(DB_FILE)
    for c in complaints:
        if c["id"] == cid:
            c["resolved"]    = True
            c["status"]      = "resolved"
            c["resolved_at"] = datetime.now().isoformat()
            if data.get("after_photos"):
                c["after_photos"] = data["after_photos"]
            # Award extra points to reporter
            award_points(c.get("name",""), c.get("contact",""), 25, f"Complaint {cid} resolved")
            # Update officer score
            if c.get("assigned_to"):
                update_officer_score(c["assigned_to"], c)
            # Notify citizen
            if c.get("contact"):
                threading.Thread(
                    target=send_resolution_notification,
                    args=(c["contact"], cid, c["title"]),
                    daemon=True
                ).start()
            break
    save(DB_FILE, complaints)
    return jsonify({"success": True})

@app.route("/api/complaints/<cid>/update-status", methods=["POST"])
def update_status(cid):
    data = request.json
    complaints = load(DB_FILE)
    for c in complaints:
        if c["id"] == cid:
            c["status"] = data.get("status", c["status"])
            break
    save(DB_FILE, complaints)
    return jsonify({"success": True})

# ══════════════════════════════════════════════════════════
# ROUTES — OFFICERS & LEADERBOARD
# ══════════════════════════════════════════════════════════

@app.route("/api/officers", methods=["GET"])
def get_officers():
    return jsonify(load(OFFICERS_FILE, []))

@app.route("/api/leaderboard/officers", methods=["GET"])
def officer_leaderboard():
    officers = sorted(load(OFFICERS_FILE, []), key=lambda o: o["score"], reverse=True)
    return jsonify(officers[:10])

@app.route("/api/leaderboard/citizens", methods=["GET"])
def citizen_leaderboard():
    users = load(USERS_FILE, [])
    top   = sorted(users, key=lambda u: u.get("points", 0), reverse=True)[:10]
    return jsonify(top)

# ══════════════════════════════════════════════════════════
# ROUTES — STATS & ANALYTICS
# ══════════════════════════════════════════════════════════

@app.route("/api/stats", methods=["GET"])
def stats():
    complaints = load(DB_FILE)
    now = datetime.now()
    sla_breached = 0
    for c in complaints:
        if not c.get("resolved"):
            try:
                created = datetime.fromisoformat(c["created_at"])
                hours   = (now - created).total_seconds() / 3600
                if hours > SLA_RULES.get(c["priority"], 72):
                    sla_breached += 1
            except:
                pass

    return jsonify({
        "total":       len(complaints),
        "urgent":      sum(1 for c in complaints if c["priority"]=="urgent" and not c["resolved"]),
        "resolved":    sum(1 for c in complaints if c["resolved"]),
        "pending":     sum(1 for c in complaints if not c["resolved"] and not c.get("assigned_to")),
        "in_progress": sum(1 for c in complaints if not c["resolved"] and c.get("assigned_to")),
        "sla_breached": sla_breached,
        "by_type":     {t: sum(1 for c in complaints if c["type"]==t) for t in ["Road","Water","Garbage","Electricity","Other"]},
        "by_priority": {p: sum(1 for c in complaints if c["priority"]==p) for p in ["urgent","medium","low"]},
        "by_status":   {s: sum(1 for c in complaints if c["status"]==s) for s in ["pending","assigned","in_progress","resolved"]},
    })

@app.route("/api/transparency", methods=["GET"])
def transparency():
    complaints = load(DB_FILE)
    wards = {}
    for c in complaints:
        loc = c.get("location","Unknown")
        if loc not in wards:
            wards[loc] = {"total":0,"resolved":0}
        wards[loc]["total"] += 1
        if c.get("resolved"):
            wards[loc]["resolved"] += 1
    result = []
    for ward, data in wards.items():
        score = round(data["resolved"] / max(data["total"],1) * 100)
        result.append({"ward": ward, "score": score, **data})
    return jsonify(sorted(result, key=lambda x: x["score"], reverse=True))

@app.route("/api/export/report", methods=["GET"])
def export_report():
    complaints = load(DB_FILE)
    lines = [
        "="*60,
        "CIVICALERT — COMPLAINT REPORT",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "="*60, "",
        f"TOTAL: {len(complaints)}",
        f"URGENT: {sum(1 for c in complaints if c['priority']=='urgent')}",
        f"RESOLVED: {sum(1 for c in complaints if c['resolved'])}", "",
        "-"*60, "COMPLAINTS", "-"*60
    ]
    for c in complaints:
        lines.append(f"\n[{c['id']}] {c['title']}")
        lines.append(f"  Type: {c['type']} | Priority: {c['priority'].upper()}")
        lines.append(f"  Location: {c['location']}")
        lines.append(f"  Status: {c['status']} | Assigned: {c.get('assigned_to','Unassigned')}")
        lines.append(f"  Created: {c.get('created_at','?')[:10]}")
        lines.append(f"  Solution: {c['solution'][:120]}")
    return "\n".join(lines), 200, {"Content-Type":"text/plain","Content-Disposition":"attachment;filename=CivicAlert_Report.txt"}

# ══════════════════════════════════════════════════════════
# ROUTES — CHATBOT
# ══════════════════════════════════════════════════════════

@app.route("/api/chat", methods=["POST"])
def chat():
    data     = request.json
    messages = data.get("messages", [])
    complaints = load(DB_FILE)

    system = f"""You are CivicBot, an AI assistant for CivicAlert — a Smart City complaint system for Coimbatore, India.

Current stats: {len(complaints)} total complaints, {sum(1 for c in complaints if c['priority']=='urgent' and not c['resolved'])} urgent active, {sum(1 for c in complaints if c['resolved'])} resolved.

Recent complaint types: {', '.join(set(c['type'] for c in complaints[:5]))}.

Help citizens: report issues, track complaints (they need a CA-XXXX-XXXX ID), understand the civic system, learn about departments (PWD for roads, Water Board for leaks, Sanitation for garbage, TNEB for electricity).

Be concise (2-3 sentences max), warm, and helpful. If they describe a civic problem, acknowledge it and guide them to the Report Issue section."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system=system,
            messages=messages[-10:]
        )
        return jsonify({"reply": response.content[0].text})
    except Exception as e:
        return jsonify({"reply": "I'm having trouble connecting right now. Please try again!", "error": str(e)})

# ══════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════

def classify_with_ai(desc, location):
    """Classify complaint using Claude AI"""
    default = {"category":"Other","priority":"medium","priority_reason":"Manual submission","solution_steps":["Review","Assign to department","Schedule repair"],"estimated_time":"TBD","department":"General Admin"}
    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=800,
            messages=[{"role":"user","content":
                f"""Classify this Indian civic complaint. Reply ONLY with valid JSON.

Complaint: "{desc}"
Location: "{location}"

{{"category":"Road|Water|Garbage|Electricity|Other","priority":"urgent|medium|low","priority_reason":"one sentence why","solution_steps":["step1","step2","step3"],"estimated_time":"e.g. 2-4 hours","department":"e.g. PWD"}}"""
            }]
        )
        txt = msg.content[0].text.replace("```json","").replace("```","").strip()
        return json.loads(txt)
    except Exception as e:
        print(f"AI classify error: {{e}}")
        # Fallback keyword classification
        keywords = {"Road":["pothole","road","pavement","bridge","tar"],"Water":["water","pipe","leak","drain","flood"],"Garbage":["garbage","waste","trash","bin","dump"],"Electricity":["light","electric","power","wire","dark"]}
        for cat, words in keywords.items():
            if any(w in desc.lower() for w in words):
                default["category"] = cat
                break
        return default

def find_group(complaints, category, location):
    """Group complaints by type + area similarity"""
    loc_words = set(location.lower().split())
    for c in complaints:
        if c["type"] == category and not c.get("resolved"):
            existing_words = set(c["location"].lower().split())
            if loc_words & existing_words:  # any word overlap
                return c.get("group_id", str(uuid.uuid4()))
    return str(uuid.uuid4())

def award_points(name, contact, points, reason):
    """Award civic points to a user"""
    if not name or name == "Anonymous":
        return
    users = load(USERS_FILE, [])
    user  = next((u for u in users if u["name"] == name or u.get("contact") == contact), None)
    if user:
        user["points"] = user.get("points", 0) + points
        user.setdefault("history", []).append({"pts": points, "reason": reason, "time": datetime.now().isoformat()})
    else:
        users.append({"id": str(uuid.uuid4())[:8], "name": name, "contact": contact, "points": points, "history": [{"pts": points, "reason": reason, "time": datetime.now().isoformat()}]})
    save(USERS_FILE, users)

def update_officer_score(officer_name, complaint):
    """Update officer performance metrics after resolving"""
    officers = load(OFFICERS_FILE, [])
    for o in officers:
        if o["name"] == officer_name:
            o["resolved"] = o.get("resolved", 0) + 1
            # Check if resolved within SLA
            try:
                created  = datetime.fromisoformat(complaint["created_at"])
                resolved = datetime.fromisoformat(complaint.get("resolved_at", datetime.now().isoformat()))
                hours    = (resolved - created).total_seconds() / 3600
                sla      = SLA_RULES.get(complaint["priority"], 72)
                on_time  = hours <= sla
                # Rolling average for on-time %
                prev_rate   = o.get("ontime", 100) / 100
                prev_count  = o.get("resolved", 1) - 1
                new_rate    = (prev_rate * prev_count + (1 if on_time else 0)) / max(o["resolved"], 1)
                o["ontime"] = round(new_rate * 100)
                o["score"]  = o["resolved"] * 20 + round(o["ontime"] * 0.5)
            except:
                pass
            break
    save(OFFICERS_FILE, officers)

def send_notification(contact, complaint_id, category, priority):
    """Send email notification to citizen (configure SMTP in .env)"""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if not all([smtp_host, smtp_user, smtp_pass]):
        print(f"[NOTIFY] No SMTP configured. Would notify: {{contact}} about {{complaint_id}}")
        return

    if "@" in contact:  # Email
        try:
            msg = MIMEMultipart()
            msg["From"]    = smtp_user
            msg["To"]      = contact
            msg["Subject"] = f"CivicAlert: Your complaint {{complaint_id}} has been received"
            body = f'''Dear Citizen,

Your complaint has been successfully submitted to CivicAlert.

Complaint ID: {{complaint_id}}
Category: {{category}}
Priority: {{priority.upper()}}

You can track your complaint at: http://localhost:5000

Your complaint has been AI-classified and routed to the appropriate department.
You will receive updates as the status changes.

Thank you for helping improve our city!
— CivicAlert Team'''
            msg.attach(MIMEText(body, "plain"))
            with smtplib.SMTP_SSL(smtp_host, 465) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, contact, msg.as_string())
            print(f"[NOTIFY] Email sent to {{contact}} for {{complaint_id}}")
        except Exception as e:
            print(f"[NOTIFY] Email failed: {{e}}")

def send_resolution_notification(contact, complaint_id, title):
    """Notify citizen when complaint is resolved"""
    print(f"[NOTIFY] Resolution notification for {{contact}}: {{complaint_id}} — {{title}}")
    # Add SMS integration here (Twilio / MSG91)

if __name__ == "__main__":
    print("🚀 CivicAlert v2 Backend starting...")
    print("📍 Open: http://localhost:5000")
    app.run(debug=True, port=5000)