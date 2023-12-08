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
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (database.findById("tasks", id) > -1) {
        database.delete("tasks", id);
        return res.writeHead(204).end();
      }

      const message = {
        message: "Couldn't find task",
      };

      return res.writeHead(404).end(JSON.stringify(message));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (database.findById("tasks", id) > -1) {
        if (title && description) {
          const data = {
            title,
            description,
            updated_at: new Date(),
          };
          database.update("tasks", id, data);
          return res.writeHead(204).end();
        } else {
          const message = {
            message: "Title and description are required",
          };
          return res.writeHead(400).end(JSON.stringify(message));
        }
      }

      const message = {
        message: "Couldn't find task",
      };

      return res.writeHead(404).end(JSON.stringify(message));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      if (database.findById("tasks", id) > -1) {
        const data = {
          completed_at: new Date(),
          updated_at: new Date(),
        };
        database.update("tasks", id, data);
        return res.writeHead(204).end();
      }

      const message = {
        message: "Couldn't find task",
      };

      return res.writeHead(404).end(JSON.stringify(message));
    },
  },
];
