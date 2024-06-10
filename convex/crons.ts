import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("deleted all files in the trash",
  { minutes: 3 }, 
  internal.files.deleteAllFiles,
);

export default crons
