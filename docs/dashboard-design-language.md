# Dashboard design language

This describes the department dashboard and the Decision View that opens from it. It sits on top of the Material Design 3 rules. Those rules still apply. This document is the set of choices that turn them into this page: a neutral clinical surface, outlined white cards, filter chips, and a small set of chart and transcript patterns.

The older full-page dashboard is not this language. Do not copy its navy headers, sharp corners, uppercase table headers, or colored summary tiles.

## Intent

The page is a reading surface for observational communication data. Hierarchy comes from type, whitespace, and a hairline outline, not from purple surfaces or drop shadows. Color is reserved for meaning: a selected filter, a chart series, a behavior on the map, or an error.

One department is in view. Filters narrow that view. Charts tell the story in a fixed order. An episode opens in a Decision View underneath the charts, not on a new route.

## Color

Accent roles stay on the Material baseline so series stay distinguishable. Surfaces are replaced with neutral greys. Do not use the purple-tinted baseline page (`#FEF7FF` and the lavender containers).

Light surfaces:

| Role | Value | Use |
|---|---|---|
| `surface`, `background` | `#F7F7F7` | Page |
| `on-surface`, `on-background` | `#1A1A1A` | Body text, chart labels, logo |
| `on-surface-variant` | `#5E5E5E` | Secondary text, kickers, axis text |
| `surface-container-lowest`, `surface-container-low` | `#FFFFFF` | Cards, transcript, map pane |
| `surface-container` | `#F3F3F3` | Hover, table header, choice region on the map |
| `surface-container-high` | `#EEEEEE` | Selected row, info-mark rest state |
| `surface-container-highest` | `#E6E6E6` | Bar-chart track |
| `outline` | `#6F6F6F` | Field borders, strong chart strokes |
| `outline-variant` | `#E0E0E0` | Card borders, row dividers, axis lines |

Accent roles, unchanged from the baseline, and what they mean on this page:

| Role | On the dashboard |
|---|---|
| `primary` `#6750A4` | Filled action, sankey, first risk series, question bars, clinician icon |
| `secondary` `#625B71` | Third risk series, burden ticks |
| `secondary-container` | Selected segment, Communication opportunities band |
| `tertiary` `#7D5260` | Second risk series, framing dots, benefit ticks, patient icon |
| `error` `#B3261E` | Missed-risk bars, risk ticks, gap icons |
| `on-primary-container`, `on-tertiary-container`, `on-secondary-container`, `on-error-container` | Later risk series, preference and question ticks |

One extra series color is allowed because nine risk categories need nine hues: `#0B6E4F`. It is the last bubble only.

Dark theme overrides the same tokens with the Material dark scheme, including dark surfaces. It is not a second neutral palette. The toggle is an icon button in the app bar, stored as `m3-cockpit-theme` in `localStorage`, and shared with the Decision View. Respect `prefers-color-scheme` only when nothing is stored.

Do not communicate state by recoloring a control. Hover is an 8% `on-surface` state layer (`color-mix`). Selected filter chips use the Material filter-chip selected treatment. Disabled content is 38% opacity.

## Type

Roboto, loaded at 400, 500, and 700. Brand and plain faces are both Roboto. Icons are Material Symbols Outlined, 24px, weight 400, fill 0, and fill 1 only for a selected state.

Use the Material type scale. The sizes this page actually leans on:

| Use | Scale |
|---|---|
| Dialog title | headline-small, 24/32, weight 400 |
| Chart title | Same size as headline-small: 24px / 32px, weight 400. Sentence case, no letter-spacing |
| Card and list titles | title-medium, 16/24, weight 500 |
| Body and supporting copy | body-medium, 14/20, weight 400 |
| Filter row labels, table headers | label-large or label-medium |
| Chart hints | body-medium, color `on-surface-variant` |
| Axis and chart annotation | 11–12px, weight 500, color `on-surface-variant` |
| Section kicker | 12px / 16px, weight 800, uppercase, letter-spacing `0.22em`, color `on-surface-variant` |

The kicker is the one uppercase style on the page. It labels a section (`Risk discussion coverage`, `Decision View`). It is not used for buttons, chips, table headers, or chart titles. Everywhere else is sentence case.

Chart SVG text uses Roboto. Axis titles may use a modest letter-spacing (`0.06em` to `0.14em`). They stay sentence case.

Direct quotes, when shown, are italic and wrapped in quotation marks. The transcript body itself is roman. Turn numbers are italic, 10px, tabular, right-aligned in a 4ch column.

## Shape, elevation, and lines

Corners follow the Material scale: cards and panes 12px, menus and the analysis sheet 28px, buttons and tracks fully round, fields 4px, selected transcript rows 4px.

Cards are outlined, not elevated. A card is white (`surface-container-lowest`), a 1px `outline-variant` border, 12px radius, and 16px padding. Do not add a shadow to separate it from the page. The page color is already different from the card.

The analysis sheet is the exception: `surface-container-high`, 28px radius, no extra shadow, over a 32% scrim.

Dividers are 1px `outline-variant`. Do not combine a divider with a large gap.

## Page structure

Top to bottom, one column, page margin 16px and 24px from 600px wide:

1. Sticky app bar, at least 80px, page-colored, no elevation. Left: logo, then an outlined Department select. Right: refresh icon button, then the theme icon button. No title text next to the logo. The logo is a mask of the wordmark, colored with `on-surface`, about 148×40.
2. Filter block. Four rows, each a label plus a chip set: Time, Source, Clinician, Intervention. The label is at least 112px wide, `on-surface-variant`, label-large. Rows wrap. Gap inside a row is 8px; gap between rows is 12px.
3. Chart stack, in this order, each chart in its own outlined card with 16px between cards:
   - Alternatives discussion flow
   - How discussion of alternatives varies across procedures
   - How often risk categories are not discussed
   - Communication Quality by Clinician, only while Compare variation is set to Clinician variation
   - Two cards side by side when the width allows: Most Frequent Core Risks Not Discussed, and Common Patient Questions & Concerns
4. Episode list, an outlined card, collapsed until the heading is clicked. The heading is a full-width button, at least 48px, with the count and an expand icon.
5. Decision View, an outlined card below the list, hidden until an episode is opened. Its bar is 64px with the kicker `Decision View` on the left and a text button `Close` on the right. The episode itself is a full-height frame inside that card.

There is no navigation rail, no bottom bar, and no FAB. The primary action on the dashboard is opening an episode. Refresh is an icon button, not a filled button.

A thin indeterminate linear progress bar sticks to the top of the viewport while data loads. Pair `hidden` with `display: none`, because the component's own display wins over the hidden attribute.

## Components

Prefer `@material/web` elements. The ones this page uses:

| Element | Where |
|---|---|
| `md-outlined-select` + `md-select-option` | Department in the app bar. Procedure in the analysis sheet. Menus use the popover so they are not clipped. |
| `md-filter-chip` inside `md-chip-set` | Every filter, including clinician names. One selected chip per group. Clicking the selected chip clears it back to All. |
| `md-icon-button` + `md-icon` | Refresh and theme. Icon-only buttons have an accessible name. |
| `md-linear-progress` | Page load. |
| `md-filled-button` | At most one per dialog, for the real commit action. |

Filters are chips, not menus. A menu is for choosing one value from a short named list that is not a filter of the charts (department, procedure on a form).

The analysis sheet is a custom dialog, not `md-dialog`: scrim, extra-large sheet, headline-small title, body-medium explanation, outlined fields, text button on the left (`Cancel`), filled primary button on the right (`Run Gemini and Jev`). Fields in one form are outlined, 56px tall. On a wide window the fields sit in two columns.

Buttons are 40px, fully round, label-large, sentence case, specific verbs. Text buttons are primary-colored with no container. The filled button is the only high-emphasis action in that dialog.

## Small controls that are not Material elements

**Info mark.** An 18px circle, `surface-container-high`, italic Georgia `i` at 11px. Hover or focus turns it inverse (`on-surface` fill, `surface` glyph) and shows a tooltip: inverse surface, inverse on-surface, 12px, 4px radius. The mark beside Compare variation is also a button. Hover still shows the explanation. Click opens the analysis sheet.

**Compare variation.** A fully round outlined segment of two text buttons, 40px tall: Intervention variation and Clinician variation. The active segment is `secondary-container` / `on-secondary-container`. This is the only segmented control. It is not a chip row.

**Rank bars.** Label, 8px fully round track on `surface-container-highest`, fill in `primary`. The missed-risk card uses `error` for the fill. The number sits at the end in `on-surface-variant`. Question bars are the percent of the track, not scaled so the longest bar is full.

**Episode table.** Full width, 8×12px cell padding, hairline `outline-variant` under each row. Header is label-medium, `on-surface-variant`, sticky, sentence case. A row is a button: pointer, 8% state layer on hover, 3px secondary inset ring on keyboard focus. The open row is `surface-container-high`. A saved episode adds the word Saved in label-medium, `on-surface-variant`, after the patient name. No colored badge.

## Charts

Charts read as part of the page, not as a second product. Axes are `outline-variant`. Tick labels are 11px `on-surface-variant`. Annotation is 11–12px. Gridlines are dashed `outline-variant`. There is no chart chrome, legend box, or extra caption under a plot unless one sentence is required to use it.

**Flow.** A sankey. Ribbons are `primary` at 28% opacity. The root node is `on-surface`. Branch and category nodes are `primary`, 8px corner radius. Labels are 12px weight 500. The root reads `All interventions (N episodes)` or the selected intervention and its count. The chart follows the Intervention chips. There is no second procedure menu on the chart.

**Framing comparison.** One dot color for every intervention: `tertiary` (`#7D5260`) at 75% opacity. A dashed line marks 50%. Do not label that line. Confidence intervals are `outline`. Procedure names are 12.5px weight 700, `on-surface`, wrapped rather than truncated. End captions are sentence case: “Less comparative discussion” and “More comparative discussion”.

**Risk bubbles.** One bubble per category. X is how often it is missed. Y is variation across interventions, or across clinicians when that segment is on. Area encodes the number of applicable episodes, radius from 8 to 36. Fill is the category color at 75% opacity. The y scale starts at 0, but the lowest bubble sits fully above the axis with about 18px of clearance. The zero tick stays at the bubble’s center, and a short spine connects that tick to the axis. Category names keep their slashes, wrapped as “Bleeding /” then “vascular complication”. The only instruction under the title is “Click any bubble to split by intervention.” (or “clinician”). Clicking splits that bubble. Clicking empty space contracts it. A selected intervention or clinician skips the split and opens episodes.

Risk colors, in category order: primary, tertiary, secondary, error, on-primary-container, on-tertiary-container, on-secondary-container, on-error-container, then `#0B6E4F`.

**Clinician boxes.** Shown only in clinician mode. One box per clinician inside each discussion lane. The filter dims the others to 38% rather than removing them. Outlier dots remain visible.

## Decision View

The frame uses the same tokens, type, and outlined cards. It is a fixed viewport: identity and summary on top, map and transcript filling the rest, opportunities along the bottom. Below 840px it stacks and the transcript gets a 70vh pane.

**Identity.** An outlined card. Label-medium `on-surface-variant` over title-medium values: Clinician, Patient, Start date, End date. The last row spans the card and is centered: the label is `MRN`, the value is `0123456`. These are display stand-ins, the same on every episode.

**Summary.** An outlined card the same height as the identity card. Title-medium decision name, body-medium summary, and a label-large line `Option selected · …` in `on-surface-variant` when an option was chosen.

**Map.** An outlined pane, 12px padding, as wide as its columns. Seven columns, 28px each, with a 40px turn gutter. Column letters are label-small, weight 500, in the series color. Ticks are 14px wide bars of that color.

| Column | Short | Color |
|---|---|---|
| Option | Opt | primary |
| Benefit | Ben | tertiary |
| Burden | Bur | secondary |
| Risk | Rsk | error |
| Recommendation | Rec | on-surface |
| Preference | Prf | on-tertiary-container |
| Question | Qst | on-primary-container |

A legend of those colors sits above the map: a 12×4 fully round swatch and a label-medium name.

Repeated mentions of the same option, benefit, burden, risk, or question draw only the first turn. Clicking that tick reveals later turns as ghosts at 28% opacity. Recommendation does not do this. Only the first detected recommendation turn is drawn, and a click does not reveal the others.

The selected map row is `surface-container-high`. Hover on a row is an 8% `on-surface` layer. After the choice turn, the rest of the track is `surface-container`, cut by a dashed `outline` line. Century marks and joins between adjacent ticks are `outline-variant`.

**Transcript.** An outlined pane. Core risks sit in the header as two groups that share the row by how many risks they hold. Observed risks get a 6% green wash. Missing risks get a 6% `error` wash. Each risk is a transparent chip, 32px, 8px radius, with an 18px icon: check, error, or help. A missing risk’s icon is `error` colored. The selected chip is `surface-container-high` with an `outline` border.

Turns are full-width buttons, 4px radius, 4×8px padding. Each row is the turn number, a 16px speaker icon, a label-small speaker name, and body-medium text. The clinician icon is `stethoscope` in primary. The patient icon is `person` in tertiary. Icons rest at 60% opacity. Any clinician role in the source, including Surgeon, is shown as Clinician. Parsing still sees the original speaker line. Patient, family, and caregiver stay distinguishable.

Clicking a tick scrolls that turn to the center of the pane. The row gets `surface-container-high` and the icon fills to 100%. There is no quote card and no gray bar on related turns.

**Opportunities.** A band, not a card: `secondary-container` background, 12px radius, 16px padding. The heading is headline-small in `on-secondary-container`. Findings are outlined white cards in a wrapping row, at least 240px each. Title-small heading, body-medium explanation. No button on a finding.

## Interaction

- Keyboard focus is a 3px secondary outline, 2px offset. Do not remove it.
- Escape closes the analysis sheet.
- Charts and the transcript scroll inside the page. The app bar stays put.
- Motion, where used, is 200–300ms with the Material emphasized decelerate curve, and 0ms when `prefers-reduced-motion` is set. Do not animate layout.
- Tooltips wait on hover and focus. They are not the only name of an icon button.
- Empty states are one sentence in body-medium, `on-surface-variant`. They do not include an illustration.

## Copy

Sentence case. No period on a heading or a button. Chart titles say what the picture answers. Kickers name the section in two or three words. Hints are one line. Info tooltips can be longer and should say what the axes mean and what a click does.

Use intervention, not procedure, in labels a person sees. Use clinician, not surgeon, as the displayed role. Keep risk-category slashes. Saved work is labeled Saved, not given a colored chip.

## What this page refuses

- Purple or lavender page and card fills.
- More than one filled button in view.
- Uppercase on anything except the section kicker.
- A second control that repeats a filter already on the page.
- Shadows used as the way to separate regions.
- Color as the only sign of selection, error, or a missed risk.
- A quote card, a highlight on every related turn, or extra recommendation ticks after the first one.
- Native `<select>` elements. Menus are outlined Material selects. Filters are chips.
