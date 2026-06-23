# Preseason Web Projects

---

Project Name: My First Backend
Project Submission: Submit file app.js (or equivalent single file)
Project Description: Build a simple backend application using a lightweight web framework: Express (JavaScript), Sinatra (Ruby), or Flask (Python). No database — use hardcoded data. Must run on port 8080 and bind to 0.0.0.0.
Examples: GET / returns random Frank Sinatra song (min 20 songs) | GET /birth_date returns birth date | GET /birth_city returns birth city | GET /wives returns wives comma-separated | GET /picture redirects to Sinatra image | GET /public returns "Everybody can see this page" | GET /protected requires HTTP Basic Auth username admin password admin returns "Welcome, authenticated client" or 401
Hints: Use app.listen(8080, '0.0.0.0') | For Basic Auth check the Authorization header | Use Math.random() for song selection
You can do: Routing | HTTP request and response handling | Status codes 200 and 401 | Basic authentication | Redirects | Random selection logic | Server configuration
You cannot do: Use a database | Use multiple files | Bind to localhost only
Project Technical Specification: Single file application. Must bind to 0.0.0.0 on port 8080. Basic Auth must return 401 with wrong credentials.
Common Mistakes: Not returning correct HTTP status codes | Forgetting to bind to 0.0.0.0 | Wrong authentication implementation | Incorrect route definitions | Not formatting responses correctly

---

Project Name: My Levenshtein
Project Submission: Submit the function file
Project Description: Implement a function that computes the difference between two strings. If lengths differ return -1. If equal length compare character by character and count differences.
Examples: GGACTGA vs GGACTGA returns 0 | ACCAGGG vs ACTATGG returns 2 | GGACGGATTCTG vs AGG returns -1 (different lengths)
Hints: Check string length first before any comparison | Use a loop with index-based access | Do not confuse this with the full Levenshtein distance algorithm which allows insertions and deletions
You can do: String iteration | Loops | Conditional logic | Index-based comparison
You cannot do: Use built-in distance functions | Return anything other than -1 for different lengths
Project Technical Specification: Function takes exactly 2 string arguments. Returns -1 if lengths differ. Returns count of character differences if same length.
Common Mistakes: Not checking string length first | Incorrect loop boundaries | Miscounting differences | Confusing with full Levenshtein algorithm

---

Project Name: My Spaceship
Project Submission: Submit the function or program file
Project Description: Simulate spaceship movement and track position and direction. Input is a string of instructions R L A. Start at position x 0 y 0 facing up. Return result as string in format {x: X, y: Y, direction: 'DIRECTION'}.
Examples: RAALALL returns {x: 2, y: -1, direction: 'down'} | AAAA returns {x: 0, y: -4, direction: 'up'} | empty string returns {x: 0, y: 0, direction: 'up'}
Hints: R turns right L turns left A moves forward in current direction | X increases going right X decreases going left | Y decreases going up Y increases going down | Track direction as a string: up down left right
You can do: State tracking for position and direction | Conditional logic | Iteration over string characters | Coordinate system handling
You cannot do: Use a graphical library | Return a non-string result
Project Technical Specification: Start at (0,0) facing up. R turns right. L turns left. A advances. Return must be a string not an object.
Common Mistakes: Wrong direction updates after turns | Mixing up X and Y movement | Not updating position correctly on A | Returning an object instead of a string

---

Project Name: My CSS Is Easy I
Project Submission: Submit files index.html and style.css
Project Description: Build a responsive webpage using HTML and CSS with Flexbox ONLY. Must support mobile layout under 640px and desktop layout above 640px. Use div elements not semantic tags.
Examples: Mobile layout stacks HEADER HERO CONTENT SIDEBAR FOOTER vertically | Desktop layout shows CONTENT and SIDEBAR side by side | Colors: Header #00B7EB | Hero #FF0000 | Content #00FF00 | Sidebar #800080 | Footer #444444
Hints: Use flex-direction column for mobile and row for content+sidebar on desktop | Add media query at 640px | Remove default body margin with margin 0
You can do: Flexbox | Media queries | Div elements | Padding for spacing
You cannot do: Use float | Use semantic tags like header footer nav | Use CSS Grid
Project Technical Specification: Must use flexbox only. Two files: index.html and style.css. Each section must display its name as text. Mobile breakpoint at 640px.
Common Mistakes: Using float instead of flexbox | Missing media queries | Not removing default body margin | Using semantic HTML tags | Incorrect section naming causes grading errors

---

Project Name: My Bouncing Box
Project Submission: Submit file index.html
Project Description: Animate a box moving diagonally and bouncing off screen edges using only JavaScript. Modify existing div with id my_bouncing_box. Replace text content with your login in lowercase.
Examples: Box starts at 0,0 | Hits right edge then goes left | Hits left edge then goes right | Hits bottom edge then goes up | Hits top edge then goes down | Use setInterval at speed 0.3 to 1 second
Hints: Use getElementById to get the div | Update style.left and style.top | Track direction with dx and dy variables | Check boundaries against window.innerWidth and window.innerHeight
You can do: DOM manipulation | getElementById | style.left and style.top | setInterval | Direction variables dx and dy | Boundary detection
You cannot do: Use CSS animations | Use jQuery | Use requestAnimationFrame only | Use CSS tricks for movement
Project Technical Specification: File is index.html only. Must use JavaScript for all movement. Must modify div id my_bouncing_box. Speed must be visible and not too slow or it fails the test.
Common Mistakes: Not updating both x and y | No direction tracking with dx and dy | Wrong boundary calculations | Moving too slow fails test | Infinite loop without visible movement

---

Project Name: My Moving Box Realtime
Project Submission: Submit file index.html
Project Description: Move a box from position 0,0 smoothly toward the bottom-right corner using only JavaScript. Must update position by exactly 1 pixel every 0.5 seconds. Must take approximately 35 seconds to reach destination.
Examples: Box starts top-left at 0,0 | Moves diagonally toward bottom-right | Updates 1 pixel per 0.5 seconds | No bouncing | No reversing direction
Hints: Use setInterval with 500ms interval | Increment x and y by 1 each tick | Stop when both reach target values | Target is window.innerWidth minus box width and window.innerHeight minus box height
You can do: setInterval | Incremental pixel movement | Deterministic motion toward target
You cannot do: Use bounce logic | Move more than 1 pixel per interval | Use CSS transitions | Reverse direction
Project Technical Specification: Must modify div with id my_box_realtime. Exactly 1px movement per 0.5 second interval. Journey must take approximately 35 seconds. No bouncing.
Common Mistakes: Using bounce logic | Moving too fast fails timing requirement | Updating position inconsistently | Not controlling step size to 1px | Ignoring the 35 second constraint
