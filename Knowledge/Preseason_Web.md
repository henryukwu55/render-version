-----------------------------------
BACHELOR'S STUDENT QWASAR AND PRESEASON WEB PROJECT CONTEXT
---

=================
Preseason Web Project 1: My First Backend
=================

Goal of My First Backend Project:
This is a bachelor's program preseason project question. Build a simple backend application using a lightweight web framework:

- Express (JavaScript) OR
- Sinatra (Ruby) OR
- Flask (Python)

Core Requirements for My First Backend Project:

- No database (use hardcoded data)
- Single file: app.js (or equivalent)
- Must run on port 8080 and bind to 0.0.0.0

FEATURES TO IMPLEMENT in My First Backend project:

1. Root Route:
   GET /
   → Return a random Frank Sinatra song (minimum 20 songs)

2. Additional Routes:
   GET /birth_date → return birth date  
   GET /birth_city → return birth city  
   GET /wives → return list of wives (comma-separated)  
   GET /picture → redirect to Sinatra image

3. Access Control:
   GET /public → "Everybody can see this page"

GET /protected:
→ Requires HTTP Basic Auth
→ Username: admin
→ Password: admin
→ Եթե correct → "Welcome, authenticated client"
→ Եթե wrong → 401 Unauthorized

KEY CONCEPTS STUDENT MUST LEARN in My First Backend project:

- Routing in backend frameworks
- Handling HTTP requests and responses
- Status codes (200, 401, etc.)
- Basic authentication
- Redirects
- Random selection logic
- Server configuration (port, host)

COMMON STUDENT MISTAKES in My First Backend project

- Not returning correct HTTP status codes
- Incorrect route definitions
- Forgetting to bind to 0.0.0.0
- Wrong authentication implementation
- Not formatting responses correctly

---

## Preseason Web PROJECT 2: My Levenshtein Web

=================
Preseason Web Project 2 Name: My Levenshtein
=================

Goal of My Levenshtein Project:
Implement a function that computes the difference between two strings.

Core Rules of My Levenshtein Project:

- Function takes 2 strings
- If lengths differ → return -1
- If equal length → compare character by character
- Count differences

Examples of My Levenshtein Project:
"GGACTGA" vs "GGACTGA" → 0  
"ACCAGGG" vs "ACTATGG" → 2  
"GGACGGATTCTG" vs "AGG" → -1

Key Concepts of My Levenshtein Project:

- String iteration
- Loops
- Conditional logic
- Index-based comparison

Common Mistakes in My Levenshtein Project:

- Not checking string length first
- Incorrect loop boundaries
- Miscounting differences
- Confusing with full Levenshtein algorithm

---

## Preseason Web PROJECT 3: My Spaceship

Preseason Web Project 3 Name: My Spaceship

Goal of My Spaceship Project:
Simulate spaceship movement and track position + direction

Core Rules for My Spaceship Project:

- Input: string of instructions (R, L, A)
- Start at (0,0), facing up
- Return: "{x: X, y: Y, direction: 'DIRECTION'}"

Movement Logic for My Spaceship Project:

- R → turn right
- L → turn left
- A → move forward in current direction

Directions for My Spaceship Project:

- up, down, left, right

Coordinates for My Spaceship Project:

- X increases → right
- X decreases → left
- Y decreases → up
- Y increases → down

Examples for My Spaceship Project:
"RAALALL" → {x: 2, y: -1, direction: 'down'}  
"AAAA" → {x: 0, y: -4, direction: 'up'}  
"" → {x: 0, y: 0, direction: 'up'}

Key Concepts of My Spaceship Project:

- State tracking (position + direction)
- Conditional logic
- Iteration over string
- Coordinate system handling

Common Mistakes done in My Spaceship Project:

- Wrong direction updates after turns
- Mixing up X and Y movement
- Not updating position correctly on "A"
- Returning wrong format (must be string)

---

## Preseason Web PROJECT 4: My CSS Is Easy I

=================
Preseason Web Project 4: My CSS Is Easy I
=================

Goal of My CSS Is Easy I Project:
Build a responsive webpage using HTML + CSS (Flexbox ONLY)

Core Requirements for My CSS Is Easy I Project:

- Files: index.html + style.css
- MUST use flexbox (NO float)
- Must support mobile and desktop layouts

Layout of My CSS Is Easy I Project:
Mobile (<640px):
HEADER
HERO
CONTENT
SIDEBAR
FOOTER

Desktop (>640px):
HEADER
HERO
CONTENT | SIDEBAR
FOOTER

Styling Rules for My CSS Is Easy I Project:

- Use div (NOT semantic tags like header/footer)
- Each section must display its name
- Add padding for spacing
- Remove default body margin

Colors for My CSS Is Easy I Project:

- Header → #00B7EB
- Hero → #FF0000
- Content → #00FF00
- Sidebar → #800080
- Footer → #444444

Key Concepts of My CSS Is Easy I Project:

- Flexbox (flex-direction, row/column)
- Responsive design (media queries)
- Layout structuring
- CSS styling

Common Mistakes done in My CSS Is Easy I Project:

- Using float instead of flexbox
- Not handling mobile vs desktop layout
- Missing media queries
- Not removing default body margin
- Incorrect section naming (causes grading errors)

---

## Preseason Web project 5: My Bouncing Box

=================
Preseason Web Project 5: My Bouncing Box
=================

Goal of My Bouncing Box Project:
Animate a box moving diagonally and bouncing off screen edges

Core Requirements for My Bouncing Box Project:

- File: index.html
- Use ONLY JavaScript (NO CSS tricks, NO jQuery)
- Modify existing div (id="my_bouncing_box")
- Replace text with your login (lowercase)

Movement Rules for My Bouncing Box Project:

- Start at (0,0)
- Move diagonally (x and y change together)
- Bounce on edges:
  - Hit right → go left
  - Hit left → go right
  - Hit bottom → go up
  - Hit top → go down

Timing for My Bouncing Box Project:

- Use setInterval
- Speed: ~0.3–1 sec

Key Concepts for My Bouncing Box Project:

- DOM manipulation (getElementById)
- Updating style.left and style.top
- setInterval (animation loop)
- Direction variables (dx, dy)
- Boundary detection

Common Mistakes done in My Bouncing Box Project:

- Not updating both x and y
- No direction tracking (dx/dy)
- Wrong boundary calculations
- Moving too slow (fails test)
- Infinite loop without visible movement

---

## Preseason Web PROJECT 6: My Moving Box Realtime

=================
Preseason Web Project 6 Name: My Moving Box Realtime
=================

Goal of My Moving Box Realtime Project:
Move a box smoothly to bottom-right corner (0,0 → bottom-right)

Core Rules for My Moving Box Realtime Project:

- Use ONLY JavaScript
- Modify div with id: my_box_realtime
- Move box diagonally toward bottom-right target
- MUST update position by ONLY 1 pixel every 0.5 seconds
- Must take ~35 seconds to reach destination

Movement Logic for My Moving Box Realtime Project:

- No bouncing
- No reversing direction
- Always move toward target (bottom + right)
- Increment x and y gradually until reaching target

Key Concepts for My Moving Box Realtime Project:

- Time-based animation (not event-based)
- Incremental movement
- setInterval timing control
- Deterministic motion toward target
- Pixel-by-pixel updates

Common Mistakes for My Moving Box Realtime Project:

- Using bounce logic (wrong)
- Moving too fast (fails timing requirement)
- Updating position inconsistently
- Not controlling step size (must be 1px per interval)
- Ignoring 35-second constraint

---
