import { Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

const todosRepo = require("../repo/todosRepo.ts");

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/todos", async (req: Request, res: Response) => {
  const todos = await todosRepo.get();
  res.json(todos);
});

const validId = (id: number) => {
  return /^\d+$/.test(String(id));
};

app.get("/api/todos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!validId(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const todo = await todosRepo.getById(id);
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(todo);
});

app.post("/api/todos", async (req: Request, res: Response) => {
  const todo = req.body;
  if (!todo.todo || todo.todo.trim() === "") {
    res.status(400).json({ error: "Todo is required" });
    return;
  }
  todo.completed = false;
  const result = await todosRepo.post(todo);
  res.json(result);
});

app.put("/api/todos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!validId(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const todo = await todosRepo.getById(id);
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  todo.completed = true;
  const result = await todosRepo.put(id, todo);
  res.json(result);
});

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!validId(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const result = await todosRepo.remove(id);
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(result);
});

const path = require("path");
app.use(express.static(path.resolve(__dirname, "../../client/build")));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
