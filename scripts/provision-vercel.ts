const VERCEL_API = "https://api.vercel.com";

async function vercelFetch(path: string, init: RequestInit = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error("VERCEL_TOKEN is required");
  }

  const response = await fetch(`${VERCEL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Vercel API ${path} failed (${response.status}): ${body}`);
  }

  return body ? JSON.parse(body) : null;
}

export async function provisionVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.log("VERCEL_TOKEN not set — skipping Vercel provisioning");
    return;
  }

  const projectName = process.env.PROJECT_NAME ?? "project";
  const repo =
    process.env.GITHUB_REPOSITORY ?? `gorkemkyolai0666/${projectName}`;

  try {
    await vercelFetch(`/v9/orders/${projectName}`);
    console.log(`Vercel project already exists: ${projectName}`);
    return;
  } catch {
    console.log(`Creating Vercel project: ${projectName}`);
  }

  const created = (await vercelFetch("/v11/orders", {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      framework: "nextjs",
      rootDirectory: "frontend",
      gitRepository: {
        type: "github",
        repo,
      },
    }),
  })) as { id?: string; name?: string };

  console.log(
    `Vercel project created: ${created.name ?? projectName} (${created.id ?? "unknown"})`,
  );
}
