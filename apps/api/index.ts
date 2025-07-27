// require("dotenv").config();
import jwt from "jsonwebtoken";
import express from "express";
const app = express();
import { prismaClient } from "store/client";
import { AuthInput } from "./types";
import { authMiddleware } from "./middleware";
import { config } from "dotenv";
import cors from "cors";
config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.post("/website", authMiddleware, async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      time_added: new Date(),
      user_id: req.userId!,
    },
  });

  res.json({
    id: website.id,
  });
});

app.get("/halfHour/:websiteId", authMiddleware, async (req, res) => {
  try {
    const lastHalfHour = new Date(Date.now() - 30 * 60 * 1000);

    const website = await prismaClient.website.findFirst({
      where: {
        user_id: req.userId!,
        id: req.params.websiteId,
      },
      include: {
        ticks: {
          where: {
            createdAt: {
              gte: lastHalfHour,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!website) {
      res.status(404).json({
        message: "Website not found",
      });
      return;
    }

    res.json({
      websiteId: website.id,
      url: website.url,
      ticks: website.ticks.map((tick) => ({
        timestamp: tick.createdAt,
        status: tick.status,
        responseTime: tick.response_time_ms,
      })),
    });
  } catch (error) {
    console.error("Error fetching ticks:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/user/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    console.log(data.error.toString());
    res.status(403).send("");
    return;
  }

  try {
    let user = await prismaClient.user.create({
      data: {
        username: data.data.username,
        password: data.data.password,
      },
    });
    res.json({
      id: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(403).send("");
  }
});

app.post("/user/signin", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.status(403).send("");
    return;
  }

  let user = await prismaClient.user.findFirst({
    where: {
      username: data.data.username,
    },
  });

  if (user?.password !== data.data.password) {
    res.status(403).send("");
    return;
  }

  let token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET!
  );

  res.json({
    jwt: token,
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

app.get("/websites", authMiddleware, async (req, res) => {
  const websites = await prismaClient.website.findMany({
    where: {
      user_id: req.userId!,
    },
    include: {
      ticks: {
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take: 1,
      },
    },
  });

  res.json(websites);
});

app.get("/oneDay/:websiteId", authMiddleware, async (req, res) => {
  try {
    // Get the last 24 hours timestamp
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const website = await prismaClient.website.findFirst({
      where: {
        id: req.params.websiteId,
        user_id: req.userId!,
      },
      include: {
        ticks: {
          where: {
            createdAt: {
              gte: last24Hours,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!website) {
      res.status(404).json({
        message: "Website not found",
      });
      return;
    }

    res.json({
      websiteId: website.id,
      url: website.url,
      ticks: website.ticks.map((tick) => ({
        timestamp: tick.createdAt,
        status: tick.status,
        responseTime: tick.response_time_ms,
      })),
    });
  } catch (error) {
    console.error("Error fetching ticks:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
