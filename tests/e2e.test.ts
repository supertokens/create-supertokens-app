import { describe, it, expect, afterEach, vi } from "vitest"; // Added vi for potential mocking/timers
import { execSync, spawn, ChildProcess } from "child_process"; // Added spawn, ChildProcess
import * as fs from "fs";
import * as path from "path";
import { rimraf } from "rimraf";
import kill from "tree-kill";
import fetch from "node-fetch";
import { chromium, Browser, Page } from "playwright"; // Import Playwright
import * as OTPAuth from "otpauth";

// Helper function to wait for server readiness
async function waitForServerReady(url: string, timeoutMs = 120000): Promise<void> {
    const startTime = Date.now();
    console.log(`Waiting for server at ${url} to be ready...`);
    while (Date.now() - startTime < timeoutMs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout for each attempt

        try {
            const response = await fetch(url, { method: "GET", signal: controller.signal });
            clearTimeout(timeoutId); // Clear timeout if fetch completes

            if (response.ok || response.status === 401 || response.status === 403) {
                // OK or auth-related status
                console.log(`Server at ${url} is ready (Status: ${response.status}).`);
                return;
            }
            // Log unexpected statuses but continue polling
            console.log(`Polling ${url}: Received status ${response.status}`);
        } catch (error: any) {
            clearTimeout(timeoutId); // Clear timeout if fetch fails
            // Ignore fetch errors (connection refused, timeout/abort) and retry
            if (error.code !== "ECONNREFUSED" && error.name !== "AbortError") {
                console.warn(`Polling ${url} encountered unexpected error: ${error.message}`);
            }
        }
        // Wait 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    throw new Error(`Server at ${url} did not become ready within ${timeoutMs / 1000} seconds.`);
}

// Define the test cases based on test-commands.md
const testCases = [
    // Single First Factor
    {
        desc: "React + Express + EmailPassword",
        frontend: "react",
        backend: "express",
        firstfactors: ["emailpassword"],
        appname: "test-app-ep",
    },
    {
        desc: "Angular + FastAPI + ThirdParty",
        frontend: "angular",
        backend: "fastapi",
        firstfactors: ["thirdparty"],
        appname: "test-app-tp",
    },
    {
        desc: "Vue + Nest + OTP Email",
        frontend: "vue",
        backend: "nest",
        firstfactors: ["otp-email"],
        appname: "test-app-pl-otp-email",
    },
    // Multiple First Factors
    {
        desc: "Solid + Flask + EP/TP",
        frontend: "solid",
        backend: "flask",
        firstfactors: ["emailpassword", "thirdparty"],
        appname: "test-app-ep-tp",
    },
    {
        desc: "React + Koa + TP/LinkPhone",
        frontend: "react",
        backend: "koa",
        firstfactors: ["thirdparty", "link-phone"],
        appname: "test-app-tp-pl-link-phone",
    },
    {
        desc: "Angular + Express + EP/OTP-Phone/OTP-Email",
        frontend: "angular",
        backend: "express",
        firstfactors: ["emailpassword", "otp-phone", "otp-email"],
        appname: "test-app-ep-pl-otp-both",
    },
    // MFA
    {
        desc: "React + Express + EP / OTP-Email",
        frontend: "react",
        backend: "express",
        firstfactors: ["emailpassword"],
        secondfactors: ["otp-email"],
        appname: "test-app-mfa-ep-otp-email",
    },
    {
        desc: "Vue + FastAPI + TP/EP / TOTP",
        frontend: "vue",
        backend: "fastapi",
        firstfactors: ["thirdparty", "emailpassword"],
        secondfactors: ["totp"],
        appname: "test-app-mfa-tp-ep-totp",
    },
    {
        desc: "Solid + Nest + EP / OTP-Phone/OTP-Email",
        frontend: "solid",
        backend: "nest",
        firstfactors: ["emailpassword"],
        secondfactors: ["otp-phone", "otp-email"],
        appname: "test-app-mfa-ep-otp-both",
    },
    {
        desc: "React + DRF + TP / TOTP",
        frontend: "react",
        backend: "drf",
        firstfactors: ["thirdparty"],
        secondfactors: ["totp"],
        appname: "test-app-mfa-tp-totp-drf",
    },
    {
        desc: "React + Go + EP",
        frontend: "react",
        backend: "go-http",
        firstfactors: ["emailpassword"],
        appname: "test-app-mfa-ep-otp-both-go",
    },
];

const rootDir = process.cwd(); // Assuming tests run from project root
describe("create-supertokens-app E2E Generation Tests", () => {
    let currentAppName: string | undefined; // Variable to track appname for cleanup
    let currentServerProcess: ChildProcess | undefined; // Variable to track server process

    afterEach(async () => {
        // Stop server process if it exists (using scoped variable)
        if (currentServerProcess && currentServerProcess.pid) {
            // Use non-null assertion as the if check guarantees it's defined
            const pid = currentServerProcess.pid!;
            console.log(`Stopping server process for ${currentAppName} (PID: ${pid})...`);
            await new Promise<void>((resolve) => {
                // Simplified promise
                kill(pid, "SIGKILL", (err) => {
                    // Use pid variable
                    if (err) {
                        console.error(
                            `Error stopping server process tree for ${currentAppName} (PID: ${pid}):`, // Use pid variable
                            err
                        );
                    } else {
                        console.log(`Successfully stopped server process tree for ${currentAppName}`);
                    }
                    resolve(); // Always resolve
                });
            });
        } else if (currentAppName) {
            console.log(`No server process found or PID missing for ${currentAppName}.`);
        }

        // Cleanup: Remove generated directory after each test (using scoped variable)
        if (currentAppName) {
            const projectPath = path.join(rootDir, currentAppName);
            console.log(`Cleaning up ${projectPath}...`);
            try {
                // Use rimraf for reliable cross-platform deletion (returns a promise)
                await rimraf(projectPath); // Await the promise directly
                console.log(`Successfully cleaned up ${projectPath}`);
            } catch (err) {
                console.error(`Error cleaning up ${projectPath}:`, err);
                // Log error but don't fail the test run just for cleanup issues (optional)
            }
        }
        // Reset scoped variables for next test
        currentAppName = undefined;
        currentServerProcess = undefined;
    });
    it.each(testCases)(
        "should generate $appname ($desc)",
        async (testCase) => {
            const { frontend, backend, firstfactors, secondfactors, appname } = testCase;
            currentAppName = appname; // Assign to scoped variable for cleanup
            currentServerProcess = undefined; // Reset server process at start of test

            let command = `npm run dev:debug -- --frontend ${frontend} --backend ${backend}`;
            if (firstfactors) {
                command += ` --firstfactors ${firstfactors.join(",")}`;
            }
            if (secondfactors) {
                command += ` --secondfactors ${secondfactors.join(",")}`;
            }
            command += ` --appname ${appname}`;

            console.log(`Running command: ${command}`);

            let success = false;
            try {
                // Execute the generation command synchronously
                // Increase timeout if generation takes longer (e.g., 5 minutes)
                execSync(command, { stdio: "inherit", timeout: 300000, env: { ...process.env, TEST_MODE: "testing" } });
                success = true;
                console.log(`Successfully generated ${appname}`);

                // Basic assertion: Check if project directory exists
                const projectPath = path.join(rootDir, appname);
                expect(fs.existsSync(projectPath)).toBe(true);

                // Install frontend dependencies
                console.log(`Installing frontend dependencies for ${appname}...`);
                execSync("npm install", { cwd: path.join(projectPath, "frontend"), stdio: "inherit", timeout: 300000 });
                console.log(`Frontend dependencies installed for ${appname}`);

                // Install backend dependencies (if applicable)
                if (["fastapi", "flask", "drf"].includes(backend)) {
                    console.log(`Installing python backend dependencies for ${appname}...`);
                    // Assuming pip and virtualenv are available
                    const backendPath = path.join(projectPath, "backend");
                    // Simplified: Install directly, assuming venv might be handled by start script or globally
                    try {
                        execSync("pip install -r requirements.txt", {
                            cwd: backendPath,
                            stdio: "inherit",
                            timeout: 300000,
                        });
                        console.log(`Python backend dependencies installed for ${appname}`);
                    } catch (pipError) {
                        console.warn(
                            `WARN: pip install failed for ${appname}. Backend might not run correctly. Error: ${pipError}`
                        );
                        // Decide if this should fail the test
                    }
                } else if (["express", "nest", "koa"].includes(backend)) {
                    console.log(`Installing node backend dependencies for ${appname}...`);
                    execSync("npm install", {
                        cwd: path.join(projectPath, "backend"),
                        stdio: "inherit",
                        timeout: 300000,
                    });
                    console.log(`Node backend dependencies installed for ${appname}`);
                }
                // Go backend usually doesn't need separate install step here

                // Start the servers
                console.log(`Starting servers for ${appname}...`);
                // Use spawn to run "npm start" non-blockingly
                const serverProcess = spawn("npm", ["start"], {
                    cwd: projectPath,
                    stdio: "inherit", // Pipe output to console (can be 'pipe' to capture)
                    detached: true, // Run in detached mode so it's not killed with the test runner easily
                    env: { ...process.env }, // Pass environment variables
                });

                // Assign to scoped variable instead of meta
                currentServerProcess = serverProcess;
                console.log(`Server process spawned for ${appname} (PID: ${serverProcess.pid})`);

                // Handle potential errors during spawn
                serverProcess.on("error", (err) => {
                    console.error(`Failed to start server process for ${appname}:`, err);
                    // Optionally fail the test here if server start is critical
                    success = false; // Mark test as failed if server doesn't start
                });
                const email = `test-${appname}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}@test.com`;
                const password = `Asdf12..`;

                // Wait for servers to be ready
                // TODO: Determine ports dynamically if they change based on framework
                const frontendPort = 3000;
                const backendPort = 3001; // Adjust if backend port differs
                const frontendUrl = `http://localhost:${frontendPort}`;
                const backendUrl = `http://localhost:${backendPort}/auth/jwt/jwks.json`;

                await waitForServerReady(frontendUrl);
                await waitForServerReady(backendUrl);

                // --- Playwright Test ---
                console.log(`Starting Playwright checks for ${appname}...`);
                let browser: Browser | undefined;
                try {
                    browser = await chromium.launch({ headless: true });
                    const context = await browser.newContext();
                    const page = await context.newPage();

                    // Check home route loads
                    console.log(`Navigating to ${frontendUrl}/`);
                    const homeResponse = await page.goto(frontendUrl + "/", { waitUntil: "domcontentloaded" });
                    expect(homeResponse?.ok(), `Home route ("/") should load successfully`).toBe(true);
                    console.log(`Home route loaded successfully.`);

                    // Find and click the auth link/button
                    // Using a generic selector - might need adjustment per framework
                    const authLinkSelector = 'a[href="/auth"], button:has-text("Sign In"), button:has-text("Sign Up")';
                    console.log(`Looking for auth link/button with selector: ${authLinkSelector}`);
                    const authLink = page.locator(authLinkSelector).first(); // Take the first match
                    // Wait for the element to be visible instead of using Playwright's expect
                    await authLink.waitFor({ state: "visible", timeout: 10000 }); // Throws error if not visible
                    console.log(`Auth link/button found. Clicking...`);
                    await authLink.click();

                    // Wait for navigation to the auth page
                    console.log(`Waiting for URL to include /auth...`);
                    await page.waitForURL(/.*\/auth.*/, { timeout: 10000 }); // Wait for URL containing /auth
                    console.log(`Navigated to ${page.url()}`);
                    expect(page.url(), "URL should include /auth after clicking link/button").toContain("/auth");

                    await page.waitForSelector("#supertokens-root", { timeout: 10000 });
                    const stContainer = await page.waitForSelector('[data-supertokens~="container"]');
                    expect(stContainer).toBeDefined();
                    if (firstfactors.includes("emailpassword")) {
                        // Switch to sign up mode
                        const switchToSignUpButton = await page.waitForSelector(
                            '[data-supertokens~=link]:has-text("Sign up")'
                        );
                        expect(switchToSignUpButton).toBeDefined();
                        await switchToSignUpButton.click();

                        await page.waitForTimeout(500);

                        await emailPasswordSignInOrUp(page, email, password);
                    } else if (firstfactors.includes("otp-email")) {
                        await startPasswordlessSignInUpEmail(page, email);
                        await completeOTP(page);
                    } else {
                        return;
                    }

                    const secondFactorId = secondfactors?.includes("otp-email")
                        ? "otp-email"
                        : secondfactors?.includes("otp-phone")
                        ? "otp-phone"
                        : secondfactors?.includes("totp")
                        ? "totp"
                        : undefined;

                    console.log("secondFactorId", JSON.stringify(secondfactors));
                    // If multiple second factors are configured, select one
                    if (secondfactors && secondfactors.length > 1) {
                        await page.waitForURL(/.*\/auth\/mfa/, { timeout: 10000 });
                        // Select the first available second factor
                        const factorButton = await page.waitForSelector(
                            `[data-supertokens~="factorChooserOption"][data-supertokens~="${secondFactorId}"]`
                        );
                        expect(factorButton).toBeDefined();
                        await factorButton.click();
                    }

                    if (secondFactorId?.startsWith("otp")) {
                        await page.waitForURL(/.*\/auth\/mfa\/otp-.*/, { timeout: 10000 });
                        await completeOTP(page);
                    } else if (secondFactorId === "totp") {
                        await page.waitForURL(/.*\/auth\/mfa\/totp/, { timeout: 10000 });
                        const secret = await getTOTPSecret(page);
                        if (!secret) {
                            throw new Error("TOTP secret not found");
                        }
                        await completeTOTP(page, secret);
                    } else {
                        return;
                    }
                    await page.waitForURL(/.*\/dashboard.*/, { timeout: 10000 });
                    expect(page.url(), "URL should include /dashboard after signing in").toContain("/dashboard");

                    console.log(`Playwright checks passed for ${appname}.`);
                } catch (pwError) {
                    console.error(`Playwright error for ${appname}:`, pwError);
                    success = false; // Mark test as failed on Playwright error
                } finally {
                    if (browser) {
                        await browser.close();
                    }
                }
                // --- End Playwright Test ---

                // If all checks passed and no errors occurred, success remains true (unless Playwright failed)
            } catch (error) {
                console.error(`Error during setup or fetch checks for ${appname}:`, error);
                success = false; // Ensure success is false if setup fails
            }

            // Assert that the command execution was successful
            expect(success).toBe(true);
        },
        310000
    ); // Increase test timeout slightly more than execSync timeout
});

async function startPasswordlessSignInUpEmail(page: Page, email: string) {
    const emailInput = await page.waitForSelector('input[name="email"]');
    expect(emailInput).toBeDefined();
    await emailInput.fill(email);
    const continueButton = await page.waitForSelector("[data-supertokens='button']");
    expect(continueButton).toBeDefined();
    await continueButton.click();
}

async function emailPasswordSignInOrUp(page: Page, email: string, password: string) {
    const emailInput = await page.waitForSelector('input[name="email"]');
    expect(emailInput).toBeDefined();
    await emailInput.fill(email);
    const passwordInput = await page.waitForSelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    await passwordInput.fill(password);
    const signUpButton = await page.waitForSelector('button:has-text("Sign up")');
    expect(signUpButton).toBeDefined();
    await signUpButton.click();
}

async function completeOTP(page: Page) {
    const otpInput = await page.waitForSelector('input[name="userInputCode"]');
    expect(otpInput).toBeDefined();
    await otpInput.fill("123456");
    const continueButton = await page.waitForSelector("[data-supertokens='button']");
    expect(continueButton).toBeDefined();
    await continueButton.click();
}

export async function getTOTPSecret(page: Page) {
    const showSecret = await page.waitForSelector("[data-supertokens~=showTOTPSecretBtn]");
    await showSecret.click();

    const secretDiv = await page.waitForSelector("[data-supertokens~=totpSecret]");
    const secret = await secretDiv.textContent();
    return secret;
}

export async function completeTOTP(page: Page, secret: string) {
    const totp = new OTPAuth.TOTP({ secret: secret, digits: 6 }).generate();
    const totpInput = await page.waitForSelector('input[name="totp"]');
    expect(totpInput).toBeDefined();
    await totpInput.fill(totp);
    const continueButton = await page.waitForSelector("[data-supertokens='button']");
    expect(continueButton).toBeDefined();
    await continueButton.click();
}
