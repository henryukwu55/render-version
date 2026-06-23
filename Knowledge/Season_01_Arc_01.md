# Season 01 Arc 01 Projects

---

Project Name: My Square
Project Submission: Submit directory ex00 | Submit file my_square.c
Project Description: Create a C program that displays a square in the terminal. Takes width and height as command line arguments. Uses corners marked with o, horizontal edges with -, and vertical edges with |.
Examples: ./a.out 5 3 displays o---o on top then |   | in middle then o---o at bottom | ./a.out 5 1 displays just o---o | ./a.out 1 1 displays just o | ./a.out 1 5 displays o then three | lines then o | ./a.out 4 4 displays o--o top two |  | middle rows then o--o bottom
Hints: int main(int ac, char **av) | Use atoi to convert av[1] and av[2] to integers | Careful about segfault when no arguments | Download qwasar_my_square binary to compare output: curl -s https://storage.googleapis.com/qwasar-public/qwasar_my_square.tgz | tar zxvf - -C ./
You can do: printf | putchar | write | atoi | argc and argv handling
You cannot do: Use any other standard library functions not listed
Project Technical Specification: Compile with gcc my_file.c then run ./a.out. Must handle edge cases like 1x1 and 1xN and Nx1.
Common Mistakes: Segfault when no arguments provided | Wrong number of dashes for width | Incorrect number of pipe rows for height | Off-by-one errors on edges

---

Project Name: My Cat
Project Submission: Submit directory ex00 | Submit file my_cat.c
Project Description: Implement the cat command. Program reads content of each file received as argument and prints it to stdout. No options needed unlike real cat.
Examples: node my_cat file1 prints content of file1 | python my_cat file1 file2 prints both files | ./my_cat file1 file2 in C prints both files
Hints: Google man cat | Google how to open file in your language | Google how to read file | Google how to close file | For JavaScript: research why fs.readFile returns a buffer instead of string
You can do: Open files | Read files | Write to stdout | Close files | Handle multiple file arguments
You cannot do: Use cat system command | Handle options like -n or -A
Project Technical Specification: Must read each file argument in order and print contents. Must close files after reading.
Common Mistakes: Forgetting to close files | Not handling multiple file arguments | Buffer vs string confusion in JavaScript | Not reading all bytes from file

---

Project Name: My Ngram
Project Submission: Submit directory . | Submit files Makefile and .c and .h files
Project Description: Write program my_ngram that counts number of occurrences per character across one or multiple string arguments. Displays each character and its count one per line in alphanumerical order.
Examples: ./my_ngram "abcdef" prints a:1 b:1 c:1 d:1 e:1 f:1 | ./my_ngram "        " prints space:8 | ./my_ngram "aaabb" "abc" prints a:4 b:3 c:1
Hints: Gandalf sends an extra double-quote character so add a check to skip it | Sort output alphanumerically | Count across all string arguments combined
You can do: printf(3) | write(2)
You cannot do: exit | Any functions not in the allowed list | Multiline macros | Include another .c file | Macros with logic
Project Technical Specification: Must create a Makefile with all clean fclean and re rules. Compile with -Wall -Wextra -Werror. Do not submit binary files or Gandalf will reject with wrong format message.
Allowed Functions: printf(3) | write(2)
Common Mistakes: Submitting binary files | Not handling alphanumerical sort | Not combining counts across multiple arguments | Forgetting the Gandalf double-quote workaround

---

Project Name: My Mastermind
Project Submission: Submit directory . | Submit files Makefile and .c and .h files
Project Description: Implement the Mastermind game. Secret code is 4 distinct pieces from digits 0-8. Player has 10 attempts by default. After each guess show well placed and misplaced pieces. Supports -c flag for custom code and -t flag for custom attempt count.
Examples: ./my_mastermind -c "0123" | Player guesses 1456 gets Well placed: 0 Misplaced: 1 | Player guesses 4132 gets Well placed: 1 Misplaced: 2 | Player guesses 0123 gets Congratz! You did it!
Hints: Use read(0, &c, 1) to read one character at a time | Handle Ctrl+D as EOF which is normal execution | man 2 read | man rand | Makefile case sensitivity is important
You can do: printf(3) | write(2) | read(2) | rand() and srand() | time() | atoi() | strcmp()
You cannot do: exit | Any functions not in the allowed list | Multiline macros | Include another .c file | Macros with logic
Project Technical Specification: Must create Makefile with all clean fclean re rules. Start message: Will you find the secret code? Please enter a valid guess. Win message: Congratz! You did it! Invalid input message: Wrong input! Compile with -Wall -Wextra -Werror.
Allowed Functions: printf(3) | write(2) | read(2) | rand() | srand() | time() | atoi() | strcmp()
Common Mistakes: Using getline or fgets instead of read | Not handling Ctrl+D | Wrong output format for well placed and misplaced | Not handling invalid input gracefully | Makefile case sensitivity errors

---

Project Name: My Printf
Project Submission: Submit directory . | Submit file my_printf.c
Project Description: Implement your own my_printf function that produces formatted output to stdout. Must handle conversion specifiers d o u x c s p. Uses variadic functions with stdarg.
Examples: my_printf("%d", 42) prints 42 | my_printf("%s", "hello") prints hello | my_printf("%x", 255) prints ff | my_printf("%c", 65) prints A | my_printf("%p", ptr) prints hex address
Hints: man printf | man 3 stdarg | Watch for memory leaks | Compile with -g3 -fsanitize=address to test | d is signed decimal | o is unsigned octal | u is unsigned decimal | x is unsigned hex | c is unsigned char | s is string | p is pointer in hex
You can do: write(2) | malloc | free | va_start | va_arg | va_copy | va_end
You cannot do: printf fprintf sprintf snprintf asprintf dprintf vprintf vfprintf vsprintf vsnprintf vasprintf vdprintf | Global variables | Static variables | Multiline macros | Include another .c file | Macros with logic
Project Technical Specification: Function signature is int my_printf(char * restrict format, ...). Must compile with -Wall -Wextra -Werror. No global or static variables allowed.
Allowed Functions: write(2) | malloc | free | va_start | va_arg | va_copy | va_end
Common Mistakes: Memory leaks from allocated strings | Not handling all format specifiers | Using global or static variables | Not returning correct character count | Pointer printing format errors
