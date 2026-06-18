import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

export async function provisionRailway() {
  const token = process.env.RAILWAY_API_TOKEN;
  if (!token) {
    console.log("RAILWAY_API_TOKEN not set — skipping Railway provisioning");
    return;
  }

  const projectName = process.env.PROJECT_NAME ?? "project";
  const configPath = "backend/.railway/config.json";

  if (existsSync(configPath)) {
    console.log(`Railway config already exists at ${configPath}`);
    return;
  }

  execSync(
    `RAILWAY_PROJECT_NAME=${projectName} RAILWAY_SERVICE_NAME=${projectName}-backend bash scripts/provision-railway.sh ${configPath}`,
    {
      stdio: "inherit",
      env: { ...process.env, RAILWAY_API_TOKEN: token },
    },
  );
}
