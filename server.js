const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // put index.html in /public

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DB = "complaints.json";

const loadDB = () => fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB)) : [];
const saveDB = (data) => fs.writeFileSync(DB, JSON.stringify(data, null, 2));

app.get("/api/complaints", (req, res) => res.json(loadDB()));

app.post("/api/complaints", async (req, res) => {
  const { description, location, name, priority, lat, lng } = req.body;

  let aiResult = { category:"Other", priority:"medium", solution_steps:[], department:"General", estimated_time:"TBD", priority_reason:"" };

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content:
        `Classify this civic complaint. Reply ONLY with JSON.\nComplaint: "${description}"\nLocation: "${location}"\n{"category":"Road|Water|Garbage|Electricity|Other","priority":"urgent|medium|low","priority_reason":"","solution_steps":[],"estimated_time":"","department":""}`
      }]
    });
    let text = msg.content[0].text.replace(/```json|```/g,"").trim();
    aiResult = JSON.parse(text);
  } catch(e) { console.error("AI error:", e.message); }

  const complaints = loadDB();
  
  // Group similar complaints
  const findGroup = (category, locStr) => {
      const words = locStr.toLowerCase().split(/\s+/);
      const match = complaints.find(c => 
          c.type === category && 
          !c.resolved && 
          words.some(w => c.location.toLowerCase().includes(w) && w.length > 3)
      );
      return match ? (match.group_id || match.id) : uuidv4();
  };
  const groupId = findGroup(aiResult.category, location);

  const complaint = {
    id: uuidv4(), group_id: groupId, title: description.slice(0,70), description,
    location, name: name||"Anonymous", type: aiResult.category,
    priority: aiResult.priority, solution: aiResult.solution_steps.join(". "),
    department: aiResult.department, estimated_time: aiResult.estimated_time,
    upvotes: 1, resolved: false,
    created_at: new Date().toISOString(),
    lat: lat||11.0168, lng: lng||76.9558
  };
  complaints.unshift(complaint);
  saveDB(complaints);
  res.json({ success: true, complaint, ai: aiResult });
});

app.post("/api/complaints/:id/upvote", (req, res) => {
  const complaints = loadDB();
  const c = complaints.find(x => x.id === req.params.id);
  if (c) c.upvotes++;
  saveDB(complaints); res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 CivicAlert running → http://localhost:3000"));