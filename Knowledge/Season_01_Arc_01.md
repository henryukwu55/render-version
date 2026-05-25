-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 01 ARC 01 PROJECT CONTEXT
---

There are five (5) Season 01 Arc01 Projects;

=================

# Season 01 Arc01 Project 1: My Square

=================
My Square
Submit directory ex00
Submit file my_square.c
Description
Create a program which displays a beautiful square.

my_square(5,3) should display:

$>./a.out 5 3
o---o
|   |
o---o
$>
my_square(5, 1) should display:

$>./a.out 5 1
o---o
$>
my_square(1, 1) should display:

$>./a.out 1 1
o
$>
my_square(1, 5) should display:

$>./a.out 1 5
o
|
|
|
o
$>
my_square(4, 4) should display:

$>./a.out 4 4
o--o
|  |
|  |
o--o
$>
Tips:

0.  $>gcc my_file.c
$>./a.out

1.  int main(int ac, char \*\*av);

2.  int x = atoi(av[1]);
    int y = atoi(av[2]);

3.  Be careful segfault. :-)
    From docode you can download the qwasar_my_square by executing this command to compare your output with ours:

curl -s https://storage.googleapis.com/qwasar-public/qwasar_my_square.tgz | tar zxvf - -C ./
It works exactly like yours should be working:

$>./qwasar_my_square 4 4
o--o
|  |
|  |
o--o
$>

=================
Season 01 Arc01 Project 2: My Cat S1a1
=================
My Cat
Submit directory ex00
Submit file my_cat.c
Description
It's your turn to code the software cat!

Create a program called my_cat which does the same thing as the system's cat command used in the command-line.

Your program should read the content of each files which are received as an argument to your software. Unlike the real Cat command, you don't have to handle any options. :-)

[[examples]] language = "Javascript"

$>node my_cat file1
content_file_1
content_file_2
$>
Example Python

$>python my_cat file1 file2
content_file_1
content_file_2
$>
Example Ruby

$>ruby my_cat file1 file2
content_file_1
content_file_2
$>
Example java

$>java my_cat file1 file2
content_file_1
content_file_2
$>
Example Rust <3

$>./my_cat file1 file2
content_file_1
content_file_2
$>
Tips

Google: man cat
Google: YOURCODINGLANGUAGE open file
Google: YOURCODINGLANGUAGE read file
Google: YOURCODINGLANGUAGE close file (don't forget to close.)
For javascript folks:

Google Why does Node.js' fs.readFile() return a buffer instead of string :-)

Season 01 Arc01 Project 3:

My Ngram

My Ngram
Submit directory .
Submit files Makefile - _.c - _.h
Description
SPECIFICATIONS
Write a program my_ngram; It will count the number of occurrences per character.

NAME
my_ngram

SYNOPSIS
my_ngram text [text2, text3]

DESCRIPTION
In computational linguistics and probability, an n-gram is a contiguous sequence of n items from a given sample of text or speech. The items can be phonemes, syllables, letters, words or base pairs according to the application. The n-grams typically are collected from a text or speech corpus. When the items are words, n-grams may also be called shingles.

Google Inc. has used this technique to improve the completion of its Search Engine. The program was developed by Jon Orwant and Will Brockman and released in mid-December 2010.

My Ngram will take 1 or multiple strings as arguments.

It will display, one per line, each character and the numbers of times it appears.

Order will be alphanumerical.

Example 00

$>./my_ngram "abcdef"
a:1
b:1
c:1
d:1
e:1
f:1
$>
Example 01

$>./my_ngram "        "
 :8
$>
8 spaces :-)

Example 02

$>./my_ngram "aaabb" "abc"
a:4
b:3
c:1
$>
Technical information:
(If you are doing this as project) you must create a Makefile, and the output is the command itself
You can use:
printf(3)
write(2)
You can NOT use:
Any functions/syscalls which does not appear in the previous list
Yes, it includes exit
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Your makefile must have a clean & fclean rules.
Example of some rules for Makefiles:

all : $(TARGET)

$(TARGET) : $(OBJ)
gcc $(CFLAGS) -o $(TARGET) $(OBJ)

$(OBJ) : $(SRC)
gcc $(CFLAGS) -c $(SRC)

clean:
rm -f \*.o

fclean: clean
rm -f $(TARGET)

re: fclean all
Warnings
It's a bad practice to submit "object/binary files". Gandalf will reject your project if you submit your binary. (with the following message: "pushed file wrong format")

Ganfalf issue
Gandalf is sending an extra '"', please add a if != from '"' in order to pass the project.

=================
Season 01 Arc01 Project 4:
=================

My Mastermind

My Mastermind
Submit directory .
Submit files Makefile - _.c - _.h
Description
SPECIFICATIONS
Write a program called mastermind; it will be an implementation of the famous game.

NAME
my_mastermind

SYNOPSIS
my_mastermind [-ct]

DESCRIPTION
Mastermind is a game composed of 9 pieces of different colors. A secret code is then composed of 4 distinct pieces.

The player has 10 attempts to find the secret code. After each input, the game indicates to the player the number of well placed pieces and the number of misplaced pieces.

Pieces will be '0' '1' '2' '3' '4' '5' '6' '7' '8'.

If the player finds the code, he wins, and the game stops. A misplaced piece is a piece that is present in the secret code butthat is not in a good position.

You must read the player's input from the standard input.

Your program will also receive the following parameters: -c [CODE]: specifies the secret code. If no code is specified, a random code will be generated. -t [ATTEMPTS]: specifies the number of attempts; by default, the playerhas 10 attempts.

Example 00

PROMPT>./my_mastermind -c "0123"
Will you find the secret code?
Please enter a valid guess

---

Round 0

> 1456
> Well placed pieces: 0

## Misplaced pieces: 1

Round 1

> tata
> Wrong input!
> 4132
> Well placed pieces: 1

## Misplaced pieces: 2

Round 2

> 0123
> Congratz! You did it!
> Technical information
> you must create a Makefile, and the ouput is the command itself It will contain rule all/clean/fclean (re => fclean + all)

You can use:

printf(3)
write(2)
read(2)
rand() (/ srand())
time()
atoi()
strcmp()
You can NOT use:
Any functions/syscalls which does not appear in the previous list
Yes, it includes exit
Consider writing a README.md to describe your project and how it works.

Your mastermind needs to handle the sequence Ctrl + d. It's End Of File. It's consider as a normal execution.

read() is a syscall difficult to apprehend, you will have time to deal more with it in a later project. In this project, you should read 1 character by 1 (use read(0, &c, 1)) and add them one by one to a buffer until you encounter a newline.

Example:

[/tmp/]bash
bash-3.2$ exit
[/tmp/]
In this example, bash exited successfully and also printed "exit".

Output formats
When your program starts, you must display:
Will you find the secret code?
Please enter a valid guess
When the user wins, you must display:
Congratz! You did it!
When the user enters an invalid code, you must respect the following format:
Well placed pieces: X
Misplaced pieces: Y
X and Y are two digits with the correct values.

Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Multiline macros are forbidden
You should have multiple file .c but it's forbidden to include them (#include another_file.c) use your Makefile to compile them together.
Macros with logic (while/if/variables/...) are forbidden
Advanced Testing
Gandalf tests using a synthax similar to this one:

echo "1234
2345
3456" | ./my_mastermind -c 3456
It will hightlight that you are not using read() well.

Hint(s)
man 2 read
man rand
Makefile, case sensitivity is important.

=================
Season 01 Arc01 Project 5:
=================

My Printf

My Printf
Submit directory .
Submit file my_printf.c
Description
NAME
int my_printf(char \* restrict format, ...);

Prolog
The very first thing we do when learning a programming language is to write "Hello World !" on the screen. Well guess what ? This custom comes from a notebook called ... Programming in C: A Tutorial !

Unfortunately for you, this project will bring you back in the 1970s, before the existence of this book, and you will have to write your own function to greet the world.

Fortunately for you, you will strengthen your programming skills and learn new programming concepts: variadic functions and variable argument lists. Recoding printf is also a good exercise to learn to have a well structured code organisation. Modularity is the key here since printf has a lot of different options that you will have to recode yourself. Adding a new option feature should be easy and smooth if the code is well designed !

DESCRIPTION
The my_printf() function produce output according to a format as described below. The my_printf() functions write output to stdout, the standard output stream;

This function writes the output under the control of a format string that specifies how subsequent arguments (or arguments accessed via the variable-length argument facilities of stdarg(3)) are converted for output.

The format string is composed of zero or more directives: ordinary characters (not PERCENT), which are copied unchanged to the output stream; and conversion specifications, each of which results in fetching zero or more subsequent arguments.

Each conversion specification is introduced by the PERCENT character. The arguments must correspond properly (after type promotion) with the conversion specifier. After the PERCENT, the following appear in sequence:

doux The int (or appropriate variant) argument is converted to signed decimal (d). unsigned octal (o), unsigned decimal (u), unsigned hexadecimal (x).
c The int argument is converted to an unsigned char, and the resulting character is written.
s The char _ argument is expected to be a pointer to an array of character type (pointer to a string). Characters from the array are written up to (but not including) a terminating NUL character.
p The void _ pointer argument is printed in hexadecimal.
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Hint(s)
• man printf

• man 3 stdarg

• Watch out for memory leaks !

• You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address

• Global variables are strictly FORBIDDEN

• Static variables are strictly FORBIDDEN

Authorized function(s)
• write(2)
• malloc
• free
• va_start, va_arg, va_copy, va_end (see man 3 stdarg)
(Obvious) Unauthorized functions
printf and co. (fprintf, sprintf, snprintf, asprintf, dprintf, vprintf, vfprintf, vsprintf, vsnprintf, vasprintf, vdprintf)
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
Epilogue
Don't forget you can ask questions on the chat !

Good luck!
