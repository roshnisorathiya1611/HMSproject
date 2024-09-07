import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import doctorRoutes from "./routes/doctor.js";
import patientRoutes from "./routes/patient.js";
// Import chat routes
import { sendMessage } from "./controllers/chat.js";

// connect bucket
import aws from "aws-sdk";
aws.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
});
const myBucket = new aws.S3();

import {
  isAdmin,
  isDoctor,
  isLoggedIn,
  isPatient,
} from "./middlewares/auth.js";

const PORT = 8001;
const app = express();

// configure env
dotenv.config();

// configure middlewared 
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5175"],
  })
);

// configure routes
app.use("/auth", authRoutes);
app.use("/admin", isLoggedIn, isAdmin, adminRoutes);
app.use("/doctor", isLoggedIn, isDoctor, doctorRoutes);
app.use("/patient", isLoggedIn, isPatient, patientRoutes);

// connect to database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    // start app
    const myapp = app.listen(PORT, () =>
      console.log("App started on PORT ", PORT)
    );

    // Create the socket server
    const io = new Server(myapp, {
      cors: {
        origin: ["http://localhost:5175"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client Connected to socket server", socket.id);

      socket.on("disconnect", () => {
        console.log("client disconnected ", socket.id);
      });

      socket.on("send-message", async (payload) => {
        // once the messae is stored in the db
        let chat = await sendMessage(
          payload.sender,
          payload.receiver,
          payload.message
        );
        console.log(
          "Messaeg Saved in db now emitting for all the clients",
          chat
        );
        // broadcast this message to all the users who are listening for combinedId
        io.emit(chat.combinedId, chat);
      });

      socket.on("send-file", async (payload) => {
        const sender = payload.sender;
        const receiver = payload.receiver;
        const file = payload.file;
        const filename = payload.filename;

        // upload the file to bucket
        const params = {
          Bucket: "aprilfullstack",
          Key: filename,
          Body: file,
        };
        myBucket.upload(params, async (err, data) => {
          if (err) {
            console.log("Failed to upload file", err);
          } else {
            const url = data.Location;
            let chat = await sendMessage(sender, receiver, url, true);
            console.log(chat);
            io.emit(chat.combinedId, chat);
          }
        });
      });
    });
  })
  .catch((err) => {
    console.log("Failed to connect to databse");
    process.exit();
  });
