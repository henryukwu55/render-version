---------------

BACHELOR'S STUDENT QWASAR AND SEASON 02 SE PROJECT CONTEXT

---

Season 02 SE Project 1: My Bsq
Project Name: My Bsq

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Write a program called my_bsq that finds and prints the biggest square in a map. The board is represented by a file passed as the program's argument. The first line contains the number of lines on the board. . represents an empty place and o represents an obstacle. All lines will be the same length (except the first one). There will always be at least one line. Each line is terminated by \n. The program must print the board with some . replaced by x to represent the largest square found.

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file. For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

Examples:

Example 00 input:

text
5
.....
.o..o
.....
.o...
o...o

Example 00 output:

text
.....
.oxxo
..xx.
.o...
o...o

Example 01:

$>./my_bsq map10x10
..xx.
.oxxo
.....
.o...
o...o
$>

Hints: Watch out for memory leaks! You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address. To generate maps you can use the provided Perl script.

You can do: Use dynamic programming approach, optimize for speed and memory usage, implement OOP in C style.

You cannot do: Use any functions/syscalls not in the allowed list, use exit(), use multiline macros, include another .c file, use macros with logic (while/if/variables).

Project Technical Specification: Your code must be compiled with the flags -Wall -Wextra -Werror. You must create a Makefile. The output is the command itself.

Allowed functions: malloc(3), free(3), open(2), read(2), close(2), printf(3), write(2).

---

Season 02 SE Project 2: My Levenshtein Se
Project Name: My Levenshtein Se

Project Submission: Submit directory ex00 - Submit file my_levenshtein\*

Project Description: Write an algorithm that calculates the Qwasar version of a Levenshtein number between two words. The Qwasar version is a value that represents how similar two given strings are by comparing them and returning the difference between them. The function must take in 2 strings with the exact number of characters and return an integer representing the difference between them.

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file. For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work.

Examples:

Example 00: Input "GGACTGA" and "GGACTGA" → Return Value: 0

Example 01: Input "ACCAGGG" and "ACTATGG" → Return Value: 2

Example 02: Input "GGACGGATTCTG" and "AGG" → Return Value: -1

Example 03: Input "" and "" → Return Value: 0

Hints: For Rust, check documentation on std::iter::struct.Zip.html.

You can do: Iterate through each string and determine which characters are different.

You cannot do: Process strings of different sizes without returning -1.

Project Technical Specification: Complete in the language you are working on (JavaScript, Ruby, Python, Java, C++, Rust). If parameters are not the same size, return -1. Each time there is a difference, it counts as 1.

---

Season 02 SE Project 3: My Hamming Dna Se
Project Name: My Hamming Dna Se

Project Submission: Submit directory ex00 - Submit file my_hamming_dna\*

Project Description: Calculate the Hamming difference between two DNA strands. The Hamming distance is found by comparing two DNA strands and counting how many of the nucleotides are different from their equivalent in the other string. Given 2 strings with the exact number of characters, count how many characters are different at the same position.

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file.

Examples:

Example 00: Input "GGACTGA" and "GGACTGA" → Return Value: 0

Example 01: Input "ACCAGGG" and "ACTATGG" → Return Value: 2

Example 02: Input "GGACGGATTCTG" and "AGG" → Return Value: -1

Example 03: Input "" and "" → Return Value: 0

Hints: N/A

You can do: Count differences at the same position in two equal-length strings.

You cannot do: Process strings of different lengths without returning -1.

Project Technical Specification: Complete in the language you are working on. The function will return an integer. If the two arguments are not the same size, return -1.

---

Season 02 SE Project 4: My Roman Numerals Converter Se
Project Name: My Roman Numerals Converter Se

Project Submission: Submit directory ex00 - Submit file my_roman_numerals_converter\*

Project Description: Write a function to convert normal numbers to Roman Numerals. Romans wrote numbers using letters I, V, X, L, C, D, M. There is no need to convert numbers larger than about 3000. Modern Roman numerals are written by expressing each digit separately starting with the leftmost digit and skipping any digit with a value of zero.

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file.

Examples:

Example 00: Input 14 → Return Value: "XIV"

Example 01: Input 79 → Return Value: "LXXIX"

Example 02: Input 845 → Return Value: "DCCCXLV"

Example 03: Input 2022 → Return Value: "MMXXII"

Hints: Reference: http://www.novaroma.org/via_romana/numbers.html

You can do: Convert numbers up to 3000.

You cannot do: Convert numbers larger than 3000.

Project Technical Specification: Complete in the language you are working on. The function will return a string with the roman numeral.

---

Season 02 SE Project 5: My Bc
Project Name: My Bc

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Write a program called my_bc that evaluates arithmetic expressions. A valid expression must only contain the operators +, -, \*, /, and modulo (%), must only have integer values, can contain parentheses (properly closed), and can contain spaces. Divisions are euclidian keeping only the quotient.

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file.

Examples:

Example 00: $>./my_bc "312/0" → divide by zero

Example 01: $>./my_bc "321()" → parse error

Example 02: $>./my_bc "-(-((-4)+-6))" → -10

Hints: Watch out for memory leaks! Test with -g3 -fsanitize=address. Implement shunting-yard algorithm (reverse-polish notation).

You can do: Use malloc(3), free(3), printf(3), write(2).

You cannot do: Use any functions/syscalls not in the allowed list, use exit(), use multiline macros, include another .c file, use macros with logic.

Project Technical Specification: Your code must be compiled with -Wall -Wextra -Werror. Create a Makefile. Error handling: display on stderr and return exit failure. Parse error displays parse error. Divide by zero displays divide by zero.

---

Season 02 SE Project 6: My Mouse
Project Name: My Mouse

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Find the shortest path between entering and leaving a labyrinth while avoiding obstacles. A maze is given in a file passed as an argument. The first line contains: number of lines x columns, "full" character, "empty" character, "path" character, "entered labyrinth" character, "exit labyrinth" character. Replace "empty" characters with "path" characters to represent the shortest way. Movements are horizontal or vertical (not diagonal).

Project Instructions: Remember to git add && git commit && git push each exercise. We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file.

Examples:

If multiple solutions exist, choose the shortest one. In case of equality, choose the exit that is most up then leftmost. For the same output, choose solution order: up > left > right > down.

Valid map requirements: All lines respect sizes, only one entrance, only one exit, solution exists, labyrinth not more than 1000 square, each line ends with newline, only allowed characters present.

Invalid map: Print MAP ERROR on STDERR and proceed to next labyrinth.

Hints: Maps can be generated using the provided Ruby script.

You can do: Use BFS/shortest path algorithm.

You cannot do: Diagonal movements.

Project Technical Specification: Exits will always be located on "outside walls".

---

Season 02 SE Project 7: My Allocine Se
Project Name: My Allocine Se

Project Submission: Submit directory ex00 - Submit file my_allocine.rb

Project Description: Write SQL requests for a movie database. The database contains tables: actors, genres, directors, movies, movies_genres, directors_movies, reviews, movies_ratings_reviews, movies_actors.

Project Instructions: Remember to git add && git commit && git push each exercise. Write SQL requests inside my_allocine.rb formatted as requests[REQUEST_DESCRIPTION] = "SQL_REQUEST".

Examples:

Database schema includes:

actors: id, act_fname, act_lname, act_gender

genres: id, gen_title

directors: id, dir_fname, dir_lname

movies: id, mov_title, mov_year, mov_time, mov_lang, mov_dt_rel, mov_rel_country

movies_genres: mov_id, gen_id

directors_movies: dir_id, mov_id

reviews: id, rev_name

movies_ratings_reviews: mov_id, rev_id, rev_stars, num_o_rating

movies_actors: act_id, mov_id, role

Hints: Research keywords SELECT, \*, FROM, JOIN, WHERE. SQL requests have a semi-colon at the end. Download database with wget https://storage.googleapis.com/qwasar-public/track-claris/movies.db, connect with sqlite3 movies.db.

You can do: Write SELECT queries with joins, where clauses, ordering.

You cannot do: Use unsupported SQL syntax.

Project Technical Specification: Complete in the language you are working on. Use Sqlite3.

---

Season 02 SE Project 8: My Zsh
Project Name: My Zsh

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Write your own UNIX command interpreter (shell). A command interpreter runs inside a terminal with a loop: Read command from standard input, parse command string into program and arguments, execute parsed command, repeat. Implement builtins: echo, cd, setenv, unsetenv, env, exit, pwd, which.

Project Instructions: Remember to git add && git commit && git push each exercise. The interpreter displays a prompt format:
what_you_want>. Wait for command line ending with newline (enter). Parse and format to execute. Prompt displayed again after command execution.

Examples:

$>./my_zsh
GTN - my_zsh $>echo "hello"
hello
GTN - my_zsh $>pwd
/Users/gtn/
GTN - my_zsh $>cd /tmp
GTN - my_zsh $>exit
"$>"

Hints: Use fork() to create processes, execve() to execute binaries, wait() to wait for child process. Access environment through main's third argument.

You can do: Use allowed functions: malloc, free, exit, opendir, readdir, closedir, getcwd, chdir, fork, stat, lstat, fstat, open, close, getline, read, write, execve, isatty, wait, waitpid, wait3, wait4, signal, kill, getpid, strerror, perror.

You cannot do: Use pipes, redirections, or advanced features. Multiline macros forbidden. Include another .c forbidden. Macros with logic forbidden.

Project Technical Specification: Code compiled with -Wall -Wextra -Werror. No memory leaks allowed. Parser can split on spaces. Find binaries using PATH environment variable.

---

Season 02 SE Project 9: My Css Is Easy I Se
Project Name: My Css Is Easy I Se

Project Submission: Submit directory . - Submit files index.html - style.css

Project Description: Create an HTML page with CSS style using flexbox (float will be considered failed). The web page must be responsive for mobile view (screen width < 640px) and desktop view (screen width > 640px).

Project Instructions: Each section displays their names (header, hero, content, sidebar, footer). Use padding for smooth layout.

Examples:

Mobile view:
| HEADER |
| HERO |
| CONTENT |
| SIDEBAR |
| FOOTER |

Desktop view:
| HEADER |
| HERO |
| CONTENT | SIDEBAR |
| FOOTER |

Hints: Body margin reset: body { margin: 0px !important; }

You can do: Use flexbox for responsive alignment.

You cannot do: Use float (exercise will be considered failed). Use HTML5 tags (use div instead).

Project Technical Specification: Header background: #00B7EB, Hero background: #FF0000, Content background: #00FF00, Sidebar background: #800080, Footer background: #444444.

---

Season 02 SE Project 10: My Sqlite Se
Project Name: My Sqlite Se

Project Submission: Submit files my*sqlite_request.* - my*sqlite_cli.*

Project Description: Create a class called MySqliteRequest that behaves similarly to SQLite requests. All methods except run return an instance of my_sqlite_request. Each row must have an ID. Only 1 join and 1 where per request. Also create a CLI program using readline.

Project Instructions: Implement methods: from(table_name), select(column_name) or select([columns]), where(column_name, criteria), join(column_on_db_a, filename_db_b, column_on_db_b), order(order, column_name), insert(table_name), values(data), update(table_name), set(data), delete, run.

Examples:

ruby
request = MySqliteRequest.new
request = request.from('nba_player_data.csv')
request = request.select('name')
request = request.where('birth_state', 'Indiana')
request.run

# => [{"name" => "Andre Brown"]

CLI example:

my_sqlite_cli> SELECT \* FROM students;
Jane|me@janedoe.com|A|http://blog.janedoe.com
my_sqlite_cli>INSERT INTO students VALUES (John, john@johndoe.com, A, https://blog.johndoe.com);
my_sqlite_cli>quit
Hints: Study B-Tree, TRIE, Reverse Index concepts.

You can do: Save and load database from a file.

You cannot do: Use more than 1 join or 1 where per request.

Project Technical Specification: Complete in the language you are working on. CLI accepts SELECT, INSERT, UPDATE, DELETE, FROM, WHERE (max 1 condition), JOIN ON (max 1 condition). CSV data source: Nba Player Data.

---

Season 02 SE Project 11: My Curl
Project Name: My Curl

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Create a my_curl command (similar to UNIX curl) to get data from a server using HTTP. The command sends a URL as parameter and prints the HTML content of a web page. my_curl only supports HTTP and uses sockets.

Project Instructions: Remember to git add && git commit && git push each exercise.

Examples:

"
$>./my_curl http://www.columbia.edu/~fdc/sample.html

<!DOCTYPE HTML>
<html lang="en">
"...
</html>

Hints: HTTP Protocol is straightforward (RFC HTTP). Use socket file descriptors.

You can do: Use allowed functions: bind, connect, socket, write, read, close, select (optional).

You cannot do: Use non-HTTP protocols.

Project Technical Specification: Code compiled with -Wall -Wextra -Werror.

---

Season 02 SE Project 12: My Libasm
Project Name: My Libasm

Project Submission: Submit directory . - Submit files Makefile - _.c - _.S - \*.h

Project Description: Write assembly language functions for a library. Assembly is a low-level programming language for a specific processor type. This project uses nasm 64-bit. Understand how function calls work, parameter copying, return value storage, and stack operations.

Project Instructions: Remember to git add && git commit && git push each exercise.

Examples:

global \_main
extern \_puts

section .text
\_main: push rbx
lea rdi, [rel message]
call \_puts
pop rbx
ret

section .data
message: db "Hello, world", 0
Compile: OS X: nasm -fmacho64 hello.asm, Linux: nasm -felf hello.asm, then gcc hello.o -o hello

Hints: Variables are called registers in assembly.

You can do: Implement functions: my_strlen, my_strchr, my_memset, my_memcpy, my_strcmp, my_memmove, my_strncmp, my_strcasecmp, my_index, my_read, my_write.

You cannot do: Use high-level language constructs.

Project Technical Specification: Use nasm 64-bit. Functions must be implemented in assembly (.S files).

---

Season 02 SE Project 13: My Malloc
Project Name: My Malloc

Project Submission: Submit directory . - Submit files Makefile - _.c - _.h

Project Description: Create your own implementation of malloc family functions to allocate memory on the heap. Use mmap() syscall (sbrk() is deprecated on OS X). The goal is to minimize mmap calls by requesting large chunks and dividing them for reuse. Implement memory management with data structures to track allocated memory.

Project Instructions: Remember to git add && git commit && git push each exercise.

Examples:

void\* my_malloc(int size) {
return mmap(0, size, PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE, -1, 0);
}

Hints: Use a struct header stored in a linked list, hash table, or balanced tree (Red-Black Tree or AVL Tree) for faster searching. Hash tables are interview materials - study hash functions and collision handling.

You can do: Implement my_malloc, my_free, my_calloc, my_realloc.

You cannot do: Call mmap for every allocation (must reuse memory).

Project Technical Specification: Study different malloc implementations (dlmalloc, jemalloc). Use mmap with PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE.
