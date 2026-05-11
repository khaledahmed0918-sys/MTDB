import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuid } from "uuid";
import rateLimit from "express-rate-limit";
import fs from "fs-extra";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://powr.pages.dev",
      "https://powr-updates.pages.dev",
      "https://mtnews.pages.dev",
      "https://mtdb.pages.dev",
      "http://localhost:3000",
      "https://ais-dev-ezmz6bpzmrrdzuvlbczgzs-169754197855.europe-west2.run.app",
      "https://ais-pre-ezmz6bpzmrrdzuvlbczgzs-169754197855.europe-west2.run.app"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:*"],
      connectSrc: ["'self'", "https://dolabriform-fascinatedly-lecia.ngrok-free.dev", "https://challenges.cloudflare.com", "https:*"],
      frameSrc: ["'self'", "https://challenges.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" }
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100 // Increased slightly for multiple assets
});

const LIKES_DIR = path.join(MTDB_DIR, 'likes');
fs.ensureDirSync(LIKES_DIR);

/* Likes API */
async function getLikes(type, id) {
    const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, "");
    const safeType = String(type).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeId || !safeType) return 0;

    const filePath = path.join(LIKES_DIR, safeType, `${safeId}.json`);
    await fs.ensureDir(path.dirname(filePath));
    
    try {
        if (await fs.pathExists(filePath)) {
            const data = await fs.readJson(filePath);
            return data.likes || 0;
        }
    } catch (e) {
        console.error("Error reading likes:", e);
    }
    return 0;
}

async function updateLikes(type, id, delta) {
    const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, "");
    const safeType = String(type).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeId || !safeType) return 0;

    const filePath = path.join(LIKES_DIR, safeType, `${safeId}.json`);
    await fs.ensureDir(path.dirname(filePath));

    let data = { likes: 0 };
    try {
        if (await fs.pathExists(filePath)) {
            data = await fs.readJson(filePath);
        }
    } catch (e) {}

    data.likes = Math.max(0, (data.likes || 0) + delta);
    await fs.writeJson(filePath, data);
    return data.likes;
}

app.get('/api/likes/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const likes = await getLikes(type, id);
    res.json({ likes });
});

app.post('/api/likes/add', limiter, async (req, res) => {
    const { type, id } = req.body;
    const likes = await updateLikes(type, id, 1);
    res.json({ success: true, likes });
});

app.post('/api/likes/remove', limiter, async (req, res) => {
    const { type, id } = req.body;
    const likes = await updateLikes(type, id, -1);
    res.json({ success: true, likes });
});

const CF_SECRET_KEY = process.env.CF_SECRET_KEY || '0x4AAAAAADMldPRbXRH59PAWeAtp_4QZF98';
const MTDB_DIR = path.join(__dirname, 'mtdb');

fs.ensureDirSync(MTDB_DIR);

/* Turnstile Verification Middleware */
async function verifyTurnstile(req, res, next) {
    try {
        const { cfToken } = req.body;
        if (!cfToken) return res.status(403).json({ error: "Missing Cloudflare token" });

        const formData = new URLSearchParams();
        formData.append("secret", CF_SECRET_KEY);
        formData.append("response", cfToken);
        formData.append("remoteip", req.ip || "");

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (!data.success) {
            return res.status(403).json({ error: "Bot verification failed" });
        }
        next();
    } catch (err) {
        console.error("Turnstile verify error:", err);
        res.status(500).json({ error: "Validation service error" });
    }
}

/* Rate API */
app.post('/api/rate', limiter, verifyTurnstile, async (req, res) => {
    try {
        const { scenarioId, episodeId, newStars, oldStars } = req.body;

        if (!scenarioId || typeof newStars !== 'number' || newStars < 1 || newStars > 5) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const safeScenarioId = String(scenarioId).replace(/[^a-zA-Z0-9_-]/g, "");
        if (!safeScenarioId) return res.status(400).json({ error: "Invalid scenarioId" });

        const filePath = path.join(MTDB_DIR, `${safeScenarioId}.json`);
        console.log(`[Rate API] Loading file from: ${filePath}`);

        let data;
        try {
            if (await fs.pathExists(filePath)) {
                data = JSON.parse(await fs.readFile(filePath, 'utf8'));
            } else {
                data = {
                    scenarioId: safeScenarioId,
                    ratingsSum: 0,
                    votesCount: 0,
                    episodes: {},
                    ratingsBreakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
                };
            }
        } catch {
            data = {
                scenarioId: safeScenarioId,
                ratingsSum: 0,
                votesCount: 0,
                episodes: {},
                ratingsBreakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
            };
        }

        if (!data.ratingsBreakdown) {
            data.ratingsBreakdown = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        }

        const updateStats = (target, oldV, newV) => {
            // Remove old stars if it was a valid rating
            if (oldV >= 1 && oldV <= 5) {
                target.ratingsSum -= oldV;
                target.votesCount -= 1;
                target.ratingsBreakdown[oldV] = Math.max(0, (target.ratingsBreakdown[oldV] || 0) - 1);
            }
            // Add new stars
            target.ratingsSum += newV;
            target.votesCount += 1;
            target.ratingsBreakdown[newV] = (target.ratingsBreakdown[newV] || 0) + 1;
        };

        /* Episode rating */
        if (episodeId) {
            const safeEpisodeId = String(episodeId).replace(/[^a-zA-Z0-9_-]/g, "");

            if (!data.episodes[safeEpisodeId]) {
                data.episodes[safeEpisodeId] = {
                    ratingsSum: 0,
                    votesCount: 0,
                    ratingsBreakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
                };
            }

            updateStats(data.episodes[safeEpisodeId], oldStars, newStars);

            await fs.writeFile(filePath, JSON.stringify(data, null, 2));

            const episode = data.episodes[safeEpisodeId];
            const newRating = episode.votesCount > 0 ? episode.ratingsSum / episode.votesCount : 0;

            return res.json({
                success: true,
                newRating,
                ratingsBreakdown: episode.ratingsBreakdown,
                votesCount: episode.votesCount
            });
        }

        /* Scenario rating */
        updateStats(data, oldStars, newStars);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        const newRating = data.votesCount > 0 ? data.ratingsSum / data.votesCount : 0;

        res.json({
            success: true,
            newRating,
            ratingsBreakdown: data.ratingsBreakdown,
            votesCount: data.votesCount
        });

    } catch (err) {
        console.error("Rate API error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

/* Get Ratings API */
app.get('/api/ratings/:scenarioId', async (req, res) => {
    const { scenarioId } = req.params;
    const safeScenarioId = String(scenarioId).replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = path.join(MTDB_DIR, `${safeScenarioId}.json`);
    console.log(`[GetRatings API] Loading file from: ${filePath}`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        console.log(`[GetRatings API] Found data for ${safeScenarioId}:`, data);

        res.json({
            ratingsSum: data.ratingsSum,
            votesCount: data.votesCount,
            ratingsBreakdown: data.ratingsBreakdown,
            episodes: data.episodes
        });
    } catch (err) {
        console.error(`[GetRatings API] Error loading ${safeScenarioId}:`, err);
        res.json({
            ratingsSum: 0,
            votesCount: 0,
            ratingsBreakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            episodes: {}
        });
    }
});

/* Start Server */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});
