import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "../utils/build-route-path.js";
const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { query } = req;
      const tasks = database.select("tasks");

      let filterTasks = tasks;
      if (query.title && query.description) {
        filterTasks = tasks.filter((task) => {
          return (
            task.title.includes(query.title) ||
            task.description.includes(query.description)
          );
        });
      }

      if (query.title && !query.description) {
        filterTasks = tasks.filter((task) => {
          return task.title.includes(query.title);
        });
      }

      if (query.description && !query.title) {
        filterTasks = tasks.filter((task) => {
          return task.description.includes(query.description);
        });
      }

      return res
        .setHeader("Content-Type", "application/json")
        .end(JSON.stringify(filterTasks));
    },
  },
  {},
];
