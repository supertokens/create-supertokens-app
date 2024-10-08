import { Answers } from "./types";
import fs from "fs";

export async function executeSetupScript(path: string, answers: Answers): Promise<void> {
    // This deletes the setup script file
    await fs.unlink(path, (err) => {}); // This is a dummy function
}
