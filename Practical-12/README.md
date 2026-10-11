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

   The deliberate failure exercise was also checked locally: changing the expected GET status from `200` to `201` makes Jest fail with `Expected: 201 / Received: 200`. Restoring `200` makes the test pass.

## CI workflow

The workflow uses Node.js 20 and a MongoDB 7 service container. It runs from `Practical-12/backend`, installs packages with `npm install`, then runs `npm test`. MongoDB and a test-only JWT secret are configured in the workflow, so no repository secret or local `.env` file is required for CI.

GitHub only discovers Actions workflows under `.github/workflows` at the repository root; do not move the workflow into this practical's folder.

## Demonstrate a failed run and recovery

To reproduce the red-X/green-check exercise after the baseline passing workflow is on GitHub:

1. In `backend/tests/tasks.test.js`, deliberately change the successful list request assertion from `expect(response.status).toBe(200)` to `expect(response.status).toBe(201)`.
2. Run `npm test` locally to see the assertion fail, then commit and push that temporary broken expectation to `main`. Open the repository's **Actions** tab and wait for the `Backend tests` job to fail.
3. Capture a screenshot of the failed run summary and failed assertion for the lab journal.
4. Restore the expected value to `200`, run `npm test`, commit, and push the fix to `main`.
5. Capture the successful run summary showing the green check.

Do not leave the intentionally failing assertion in the final branch. Save screenshots from the GitHub Actions pages in the lab journal; their run URLs and timestamps are specific to the repository.

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
