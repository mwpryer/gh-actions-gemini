import { Hono } from "hono";

const app = new Hono();

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

let nextUserId = 4;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/users", (c) => {
  // TODO: Add authentication middleware
  return c.json(users);
});

app.get("/users/:id", (c) => {
  // TODO: Add authentication middleware
  const id = parseInt(c.req.param("id"));
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

app.post("/users", async (c) => {
  // TODO: Add authentication middleware
  const body = await c.req.json();

  if (!body.name || !body.email) {
    return c.json({ error: "Name and email are required" }, 400);
  }

  const newUser: User = {
    id: nextUserId++,
    name: body.name,
    email: body.email,
  };

  users.push(newUser);
  return c.json(newUser, 201);
});

app.put("/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return c.json({ error: "User not found" }, 404);
  }

  const body = await c.req.json();

  if (!body.name || !body.email) {
    return c.json({ error: "Name and email are required" }, 400);
  }

  users[userIndex] = {
    ...users[userIndex],
    name: body.name,
    email: body.email,
  };
  return c.json(users[userIndex]);
});

app.delete("/users/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return c.json({ error: "User not found" }, 404);
  }

  users.splice(userIndex, 1);
  return c.json({ message: "User deleted successfully" });
});

export default app;
