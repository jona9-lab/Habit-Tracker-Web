import express from 'express';
import cors from 'cors';
import { addHabit, logCompletion, editHabit, deleteHabit, viewStreaks, resetHabit } from './database.js';

const app = express();
const allowed_origin = "http://localhost:5173";

app.use(express.json());
app.use(cors({
    origin: allowed_origin
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

// Start the server
app.listen(5000, () => {
    console.log("Habit Tracker API is running on port 5000");
});

// Add a new habit
app.post("/api/habits", async (req, res) => {
    try {
        const { name, frequency, goal_days } = req.body;
        const habit = await addHabit(name, frequency, goal_days);
        res.status(201).send(habit);
    } catch (error) {
        res.status(500).send({ error: "Failed to add habit" });
    }
});

// Log habit completion
app.put("/api/habits/:id/complete", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await logCompletion(id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Habit not found" });
        }
        res.status(200).send({ success: "Habit successfully logged!" });
    } catch (error) {
        res.status(500).send({ error: "Failed to log habit completion" });
    }
});

// Edit a habit
app.put("/api/habits/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, frequency, goal_days } = req.body;
        const result = await editHabit(id, name, frequency, goal_days);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Habit not found" });
        }
        res.status(200).send({ success: "Habit successfully updated." });
    } catch (error) {
        res.status(500).send({ error: "Failed to update habit" });
    }
});

// Delete a habit
app.delete("/api/habits/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteHabit(id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Habit not found" });
        }
        res.status(200).send({ success: "Habit successfully deleted." });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete habit" });
    }
});

// View all habit streaks
app.get("/api/habits/streaks", async (req, res) => {
    try {
        const streaks = await viewStreaks();
        res.send(streaks);
    } catch (error) {
        res.status(500).send({ error: "Failed to retrieve habit streaks" });
    }
});

// Reset a habit
app.put("/api/habits/:id/reset", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await resetHabit(id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Habit not found" });
        }
        res.status(200).send({ success: "Habit successfully reset." });
    } catch (error) {
        res.status(500).send({ error: "Failed to reset habit" });
    }
});