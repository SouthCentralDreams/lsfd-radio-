# LSFD Radio Desk

A black-and-red radio report generator for fictional Los Santos Fire Department roleplay on GTA World. No install, build, account, API key or dependency required.

## Open locally
Open `index.html` in your browser. Fill in any details, review the preview and click **Copy report**. If automatic clipboard access is unavailable, use Ctrl+C / Cmd+C on the selected report.

## GitHub Pages
1. Extract the ZIP.
2. Upload all extracted files to the root of your GitHub repository (including `report.js`). Do not upload just the ZIP or an enclosing folder.
3. In your repository's Settings → Pages, select Deploy from a branch, main, /(root), then Save.
4. Open the Pages URL GitHub displays after deployment.

## Features
- Every field is optional, including report type, age, gender, injury, vitals, treatment and ETA. Blank details emit no placeholders or empty clauses.
- Report type is exactly `EMS` or `Trauma`, or omitted.
- Add/remove patients. Empty patient cards are excluded, and included patients are numbered in order when there is more than one.
- Gender options: Female, Male, Non binary, or omitted.
- Vitals and treatment support editable presets and free text. Edit `PRESETS` in `app.js` to customize menus.
- All four supplied vitals profiles are included verbatim, plus short `WNL`.
- ETA can be free text or a preset. “at your doors now” is output directly.
- Clear all resets every field, including report type and gender.
- Load two-patient example demonstrates a Trauma report without an ETA.
- Blank reports cannot be copied. Entered ages must be whole numbers from 0 to 120; leaving age blank is allowed.
- No patient details are stored or transmitted. The tool works offline.

The footer retains Los Santos Fire Department branding and includes “TexAyXs's pet thingy majiggy”.

Unofficial fan tool. Vitals and treatments are fictional roleplay text, not clinical guidance.


## Unit status tab
Choose **Unit status**, enter a callsign once, and click Copy beside any of the eight statuses. The copied text contains only the unit and status, for example `RA-1, Enroute`. Descriptions are hints only. A blank callsign copies the status alone. You can also select each radio line manually. Switching tabs preserves the patient report and unit field. Upload `status.js` along with the other site files.
