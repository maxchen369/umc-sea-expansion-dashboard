# UMC Southeast Asia Expansion Dashboard

Static single-page dashboard for evaluating UMC expansion options in Southeast Asia across:

- Sales Office
- Foundry
- Advanced Packaging
- Customer Support Center

The app uses only HTML, CSS, and vanilla JavaScript. There is no backend, build step, package manager, or external library.

## Project Structure

```text
index.html
styles.css
app.js
data/countries.json
data/expansion_modes.json
data/case_studies.json
data/sources.json
README.md
```

## Run Locally

Because the app loads JSON files with `fetch`, run it through a local static server:

```powershell
cd C:\Users\maxch\GPT
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload the files in this folder to the repository root.
3. In GitHub, go to `Settings` > `Pages`.
4. Set source to `Deploy from a branch`.
5. Choose the `main` branch and `/root`.
6. Save and open the GitHub Pages URL after deployment finishes.

All paths are relative, so the app can run from GitHub Pages without configuration.

## Update JSON Data

- Edit `data/countries.json` to update country scores, summaries, risks, and recommended modes.
- Edit `data/expansion_modes.json` to update expansion-mode assumptions such as capex, complexity, and UMC relevance.
- Edit `data/case_studies.json` to add or revise peer case studies.
- Edit `data/sources.json` to replace placeholder URLs with verified sources.

Country scores use a 1-5 scale. The JavaScript weighting model converts them into 1-100 scores based on the active sliders or scenario preset.

## Methodology Notes

Scores are preliminary strategic estimates, not investment advice. Peer case studies are comparable evidence, not proof that UMC should repeat the same investment. Foundry expansion carries much higher capital intensity and execution risk than sales office or customer support operations.
