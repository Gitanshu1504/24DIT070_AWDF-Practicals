# Practical 12: GitHub Actions CI for the Task Management API

This practical adds a GitHub Actions workflow at the repository-level `.github/workflows/ci.yml`. On every push to `main`, the workflow installs the Practical 12 backend dependencies and runs the automated Jest/Supertest suite. GitHub Actions reports a visible pass or fail for the job.

## Run the test locally

1. Start MongoDB locally on port `27017`.
2. Open a terminal in `Practical-12/backend` and install dependencies:

   ```bash
   npm install
   ```

3. Run the integration test:

   ```bash
   npm test
   ```

   The test registers and authenticates a temporary user, creates a task, and verifies `GET /tasks` returns `200` with that user's task. It uses a dedicated `task_management_practical12_test` database by default and removes the created test data afterwards.

   The deliberate failure exercise was checked locally and in GitHub Actions: changing the expected GET status from `200` to `201` makes Jest fail with `Expected: 201 / Received: 200`. Restoring `200` makes the test pass.

## CI workflow

The workflow uses Node.js 20 and a MongoDB 7 service container. It runs from `Practical-12/backend`, installs packages with `npm install`, then runs `npm test`. MongoDB and a test-only JWT secret are configured in the workflow, so no repository secret or local `.env` file is required for CI.

GitHub only discovers Actions workflows under `.github/workflows` at the repository root; do not move the workflow into this practical's folder.

## Failed and passing Actions runs

The workflow was pushed to `main` with the deliberate `201` expectation first, then fixed in the next commit:

| Demonstration | Commit | GitHub Actions result |
| --- | --- | --- |
| Deliberately incorrect expected status (`201`; API returned `200`) | `743a510` | [Failed run #1](https://github.com/Gitanshu1504/24DIT070_AWDF-Practicals/actions/runs/38128448973) |
| Corrected expected status (`200`) | `29925a8` | [Passing run #2](https://github.com/Gitanshu1504/24DIT070_AWDF-Practicals/actions/runs/38128491735) |

The failed run showed a red X on `Backend tests`; the corrected run completed with a green check. Screenshots of both Actions run summaries are included with the practical demonstration. Do not leave the intentionally failing assertion in the final branch.

## Test scope and endpoints

The integration test exercises:

| Method | Endpoint | Check |
| --- | --- | --- |
| POST | `/auth/register` | Creates a test account |
| POST | `/auth/login` | Returns a JWT |
| POST | `/tasks` | Creates a test task |
| GET | `/tasks` | Returns status `200` and the authenticated user's task |

The Express application is exported from `backend/app.js` so Supertest can exercise the real routes without starting a separate HTTP listener. `backend/server.js` remains the production entry point and connects to MongoDB before listening.

## View results

After pushing to `main`, open the GitHub repository **Actions** tab, select **Task Management CI**, then open the latest run to inspect the `Backend tests` job and its Jest output. Each run has a clear success or failure state.
