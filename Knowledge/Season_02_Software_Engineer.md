-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 02 SE PROJECT CONTEXT
---

=================
Season02 SE
=================

Season 02 SE Project 1:

My Bsq

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Bsq
Submit directory .
Submit files Makefile - _.c - _.h
Description
Command Name
Write a programm called my_bsq. Following the specifications of this man page.

Description
my_bsq -- finds and prints the biggest square in a map

SYNOPSIS
my_bsq [file.txt]

DESCRIPTION
This is an algorithm project!! Make it fast or low memory usage or both!

You must find the largest possible square on a board while avoiding obstacles. The board is represented by a file passed as the program’s argument, respecting those constraints:

• Its first line contains the number of lines on the board (and only that), • . (representing an empty place) and "o" (representing an obstacle) are the only two allowed characters for the other lines • All of the lines will be the same length (except the first one) • There will always be at least one line • Each line is terminated by \n.

You program must print the board, with some "." replaced by "x" to represent the largest square you found.

Example 00
input:

5
.....
.o..o
.....
.o...
o...o
output:

.....
.oxxo
..xx.
.o...
o...o
Example 01
$>./my_bsq map10x10
..xx.
.oxxo
.....
.o...
o...o
$>
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Hint(s)
Watch out for memory leaks !
You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address
Technical specification
you must create a Makefile, and the ouput is the command itself
You can use:
malloc(3)
free(3)
open(2)
read(2)
close(2)
printf(3)
write(2)
You can NOT use:
Any functions / syscalls which does not appear in the previous list
Yes, it includes exit
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
We are looking for speed, memory optimisation and code architecture. Dynamic programming OOP in C?

You should try with differents size of map 10x10... 100x100? :-)

To generate map you can use this perl script:

#!/usr/bin/perl -w

if ((scalar @ARGV) != 3)
{
print "program x y density\n";
exit;
}

my $x = $ARGV[0];
my $y = $ARGV[1];
my $density = $ARGV[2];
my $i = 0;
my $j = 0;

print $y . "\n";

while ($i < $y)
{
  $j = 0;
  while ($j < $x)
  {
    if (int(rand($y)\*2) < $density)
{
print "o";
}
else
{
print ".";
}
$j++;
}
print "\n";
$i++;
}

Season 02 SE Project 2:

My Levenshtein Se

My Levenshtein
Submit directory ex00
Submit file my_levenshtein\*
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
Description
Your job is to write an algorithm that calculates the Qwasar version of a Levenshtein number between two words.

The Qwasar version of a Levenshtein number is simple: it's a value that represents how similar two given strings are. It is found by comparing two strings and returning the difference between them. (For information, the Levenshtein number is a real concept but we've simplified it a bit for the purposes of this exercise.)

Let’s look at the following example:

abc
dbc
^
The Levenshtein difference between these two strings is 1. The two strings are almost identical, other than one letter. That letter, 'd’, is close to the example, 'a’, meaning the Levenshtein value will be small.

Instructions
Your function must take in 2 strings with the exact number of characters and return an integer representing the difference between them.

If your parameters are not the same size then your function will return -1.

If the two strings are the same size, you must then iterate through each string and determine which characters are different. Each time there is a difference, it counts as 1.

fn my_levenshtein(s1: &String, s2: &String) -> i32 {
...
}
TIPS (only for Rust) https://doc.rust-lang.org/std/iter/struct.Zip.html

Example 00

Input: "GGACTGA" && "GGACTGA"
Output:
Return Value: 0
Example 01

Input: "ACCAGGG" && "ACTATGG"
Output:
Return Value: 2
Example 02

Input: "GGACGGATTCTG" && "AGG"
Output:
Return Value: -1
Example 03

Input: "" && ""
Output:
Return Value: 0

Season 02 SE Project 3:

My Hamming Dna Se

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Hamming Dna
Submit directory ex00
Submit file my_hamming_dna\*
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
Description
Calculate the Hamming difference between two DNA strands.

A mutation is simply a mistake that occurs during the creation or copying of a nucleic acid, in particular DNA. Because nucleic acids are vital to cellular functions, mutations tend to cause a ripple effect throughout the cell. Although mutations are technically mistakes, a very rare mutation may equip the cell with a beneficial attribute. In fact, the macro effects of evolution are attributable by the accumulated result of beneficial microscopic mutations over many generations.

The simplest and most common type of nucleic acid mutation is a point mutation, which replaces one base with another at a single nucleotide.

By counting the number of differences between two homologous DNA strands taken from different genomes with a common ancestor, we get a measure of the minimum number of point mutations that could have occurred on the evolutionary path between the two strands.

This is called the 'Hamming distance'.

It is found by comparing two DNA strands and counting how many of the nucleotides are different from their equivalent in the other string.

GAGCCTACTAACGGGAT
CATCGTAATGACGGCCT
^ ^ ^ ^ ^ ^^
The Hamming distance between these two DNA strands is 7.

Your function will return an integer

Given 2 strings with the exact number of characters, count how many characters are different at the same position. if they don't share the exact number of characters, return -1.

if the two arguments are not the same size, you will return -1

Example 00

Input: "GGACTGA" && "GGACTGA"
Output:
Return Value: 0
Example 01

Input: "ACCAGGG" && "ACTATGG"
Output:
Return Value: 2
Example 02

Input: "GGACGGATTCTG" && "AGG"
Output:
Return Value: -1
Example 03

Input: "" && ""
Output:
Return Value: 0

Season 02 SE Project 4:

My Roman Numerals Converter Se

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Roman Numerals Converter
Submit directory ex00
Submit file my_roman_numerals_converter\*
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
Description
Write a function to convert normal numbers to Roman Numerals.

The Romans wrote numbers using letters - I, V, X, L, C, D, M. (notice these letters have lots of straight lines and are hence easy to carve into stone tablets).

1 => I
10 => X
7 => VII
There is no need to be able to convert numbers larger than about 3000. (The Romans themselves didn't tend to go any higher)

Wikipedia says: Modern Roman numerals ... are written by expressing each digit separately starting with the left most digit and skipping any digit with a value of zero.

To see this in practice, consider the number 1990.

In Roman numerals 1990 is MCMXC:

1000=M 900=CM 90=XC

2008 is written as MMVIII:

2000=MM 8=VIII

See also: http://www.novaroma.org/via_romana/numbers.html

It will return a string with the roman numeral.

Example 00

Input: 14
Output:
Return Value: "XIV"
Example 01

Input: 79
Output:
Return Value: "LXXIX"
Example 02

Input: 845
Output:
Return Value: "DCCCXLV"
Example 03

Input: 2022
Output:
Return Value: "MMXXII"

Season 02 SE Project 5:

My Bc

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Bc
Submit directory .
Submit files Makefile - _.c - _.h
Description
Command Name
Write a programm called my_bc. Following the specifications of this man page.

SYNOPSIS
my_bc "1 + 2 \* (3 - 42) / 5"

DESCRIPTION
A valid expression:

• must only contain the operators +, -, \*, /, and modulo (percent)
• must only have integer values
• can contain parentheses, but each group must be properly closed
• can contain spaces
Since we are doing whole number arithmetic, divisions are euclidian keeping only the quotient, while the remainder can be obtained with a modulo operation.

Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Hint(s)
Watch out for memory leaks !
You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address
Technical Information
you must create a Makefile, and the ouput is the command itself
You can use:
• malloc(3)
• free(3)
• printf(3)
• write(2)
You can NOT use:
• Any functions / syscalls which does not appear in the previous list
• Yes, it includes exit
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
Errors handling: You will display them on stderr and return exit failure status code.
If you can't parse the expression you will display: parse error
Divide by zero is an error that you will display: divide by zero
Algorithm: You will implement those algorithms shunting-yard (or called the reverse-polish) :-)
Example 00
$>./my_bc "312/0"
divide by zero
$>
Example 01
$>./my_bc "321()"
parse error
$>
Example 02
$>./my_bc "-(-((-4)+-6))"
-10
$>

Season 02 SE Project 6:

My Mouse

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Mouse
Submit directory .
Submit files Makefile - _.c - _.h
Description

Walk in a labyrinth : ◦ This project is about finding the shortest path between entering and leaving a labyrinth while avoiding obstacles. ◦ A maze is given to you in a file to be passed as an argument to the program (Maze generator in Appendix). ◦ The first line of the labyrinth contains the information to read the map: ∗ The number of labyrinth lines then the number of columns (LINExCOL); ∗ The "full" character ∗ The "empty" character ∗ The character "path" ∗ The character "entered labyrinth" ∗ The character "exit labyrinth". ◦ The maze is composed of "empty" characters, "full" characters, characters "entering the labyrinth" and characters "exiting the labyrinth". ◦ The purpose of the program is to replace "empty" characters with "path" characters to represent the shortest way to cross the labyrinth. ◦ Movements can only be horizontally or vertically, not diagonally. ◦ In the case where several solutions exist, one will choose to represent the shortest one. In case of equality, it will be the one whose exit where the solution is the most up then the leftmost. If there are 2 solutions for the same output, when crossing from the start we will choose the solutions in this order: up> left> right> down So if you have a choice between going up or right, you have to take the solution that goes up.

◦ Definition of a valid map : ∗ All lines must respect the sizes given in the first line (LINExCOL). ∗ There can only be one entrance. ∗ There must be only one exit. ∗ There must be a solution to the labyrinth. ∗ The labyrinth will not be more than a thousand square. ∗ At the end of each line, there is a new line. ∗ The characters present in the map must be only those shown on the first line. ∗ If there is an invalid map, you will print MAP ERROR on STDERR followed by a new line. The program will then proceed to the next labyrinth treatment.

Exit(s) will always be located on "outside walls"
Example 00

$>cat -e 01.map
10x10* o12$
**\*1\*\*\*\***$

-       **$
- - \*\* \*$
-        *$
  \*_ \*\* \*\* _$
-       **$
-      ***$
  \*\* \*$
-        *$
  **\*2\*\*\*\***$
$>./my_mouse 01.map
  10x10\* o12
  **\*1\*\*\*\***
- o \*\*
- _o \*\* _
- oo _
  **o** \*\* _
- oo \*\*
- o **\*
  ** o \*
- o \*
  **\*2\*\*\*\***
  10 STEPS!
  Example 01

$>cat -e 02.map
10x10* o12$
**1**\*****$

-      * *$
- - \*\*\*$
- - \*$
- - \*$
-        *$
- -      *$
-     *  *$
  **\* \***$
****2*****$
  $>./my_mouse 02.map
  10x10\* o12
  **1**\*****
- o \* \*
- o\* \*\*\*
- oo \* \*
- o\* \*
- oo \*
- - o \*
- o \* \*
  **_ o _** \***\*2\*\*\***
  10 STEPS
  Example 02

$>./my_mouse bug.map
MAP ERROR
$>
01.map 02.map 03.map

Tips To generate maps:

#!/usr/bin/env ruby
if ARGV.count < 3 || ARGV[2].length < 5
puts "./usage height width characters"
else
height, width, chars, gates = ARGV[0].to_i, ARGV[1].to_i, ARGV[2], ARGV[3].to_i
entry = rand(width - 4) + 2
entry2 = rand(width - 4) + 2

# exit2 = rand(width - 4) + 2

    puts("#{height}x#{width}#{ARGV[2]}")
    height.times do |y|
    	width.times do |x|
    		if y == 0 && x == entry
    			print chars[3].chr
    		elsif y == height - 1 && x == entry2
    			print chars[4].chr
    		elsif y.between?(1, height - 2) && x.between?(1, width - 2) && rand(100) > 20
    			print chars[1].chr

# elsif y == exit2 && x == width - 1

# print chars[4].chr

    		else
    			print chars[0].chr
    		end
    	end
    	puts
    end

end
ruby maze_generator.rb 10 10 "\* o12"
class MouseResolver
attr_accessor :data
attr_accessor :header_line
attr_accessor :last_line
attr_accessor :map_height, :map_width
attr_accessor :chars

    def initialize
        self.data = []
        self.chars = ""
        self.map_height = 0
        self.map_width = 0
    end

    def load(data)
        index = 0

        data.each do |line|
            if index == 0
                self.setHeaderLine(line)
            elsif index <= self.map_height
                self.data << line
            else
                self.setLastLine(line)
            end
            index += 1
        end
    end

    def setHeaderLine(header_line)
        @header_line    = header_line
        self.map_height = header_line.to_i
        x_pos = header_line.index('x')
        raise "Invalid header, expected HEIGHTxWIDTH* o12 got #{header_line}" if x_pos == nil
        self.map_width  = header_line[x_pos+1..-1].to_i
        self.chars = header_line[(self.map_height.to_s.size + self.map_width.to_s.size) + 1..-1].strip
    end

    def setLastLine(last_line)
        @last_line = last_line
    end

    def print
        p self.map_height
        p self.map_width
        p self.data
        p self.chars
    end

    def print_map
        self.data.each do |line|
            puts line
        end
    end

    def _find_entrance
        y = 0
        x = 0
        while y < self.data.size
            while x < self.data[y].size
                if self.data[y][x] == '1'
                    return [y, x]
                end
                x += 1
            end
            y += 1
        end
        [-1, -1]
    end

    def _where_to(y, x)
        [[y - 1, x], [y, x - 1], [y, x + 1], [y + 1, x]].each do |future_y, future_x|
            next if future_y < 0 or future_x < 0
            next if future_y > self.map_height
            next if future_x > self.map_width

            if [self.chars[2], self.chars[4]].include?(self.data[future_y][future_x])
                return [future_y, future_x]
            end
        end
        [-1, -1]
    end

    def resolve
        y, x = _find_entrance
        step = 0

        loop do
            self.print_map
            if self.data[y][x] == self.chars[4]
                return step
            end
            if y == -1 or x == -1
                break
            end
            self.data[y][x] = '+'
            y, x = _where_to(y, x)
            step += 1
        end
        -1
    end


    def self.resolve(str_map)
      mr = MouseResolver.new
      mr.load(str_map.split("

"))
nbr_step = mr.resolve
raise 'Exit not reached, invalid solution' if nbr_step == -1
nbr_step
end
end

def get_argf
data = []
ARGF.each do |line|
data << line.strip
end
data
end

data = get_argf

p MouseResolver.resolve(data.join("\n"))
./my_mouse 01.map | ruby my_mouse_checker

Season 02 SE Project 7:

My Allocine Se

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Allocine
Submit directory ex00
Submit file my_allocine.rb
Description
This project will tackle one of the main tool to work with Data. You've probably heard of this tool: SQL.

SQL (Structured Query Language) is a standardized programming language that's used to manage relational databases and perform various operations on the data in them. Initially created in the 1970s, SQL is regularly used not only by database administrators, but also by developers writing data integration scripts and data analysts looking to set up and run analytical queries.

The uses of SQL include modifying database table and index structures; adding, updating and deleting rows of data; and retrieving subsets of information from within a database for transaction processing and analytics applications. Queries and other SQL operations take the form of commands written as statements -- commonly used SQL statements include select, add, insert, update, delete, create, alter and truncate.

SQL became the de facto standard programming language for relational databases after they emerged in the late 1970s and early 1980s. Also known as SQL databases, relational systems comprise a set of tables containing data in rows and columns. Each column in a table corresponds to a category of data -- for example, customer name or address -- while each row contains a data value for the intersecting column.

The sample database represents some of the data storage and retrieval about a movie related industry. Most of the people loves to watch movie, and for all of them we are providing a sample information about the movie related questions coming to their mind. This design of database will make it easier to the movie lovers to know the curiosities about the movies.

In this project, you will have to work with a database containing multiple tables. Here a description of all the tables:

Description of tables:

actors: id – this is a unique ID for each actor act_fname – this is the first name of each actor act_lname – this is the last name of each actor act_gender – this is the gender of each actor

genres: id – this is a unique ID for each genres gen_title – this is the description of the genres

directors: id – this is a unique ID for each director dir_fname – this is the first name of the director dir_lname – this is the last name of the director

movies: id – this is the unique ID for each movie mov_title – this column represents the name of the movie mov_year – this is the year of making the movie mov_time – duration of the movie i.e. how long it was running mov_lang – the language in which movie was casted mov_dt_rel – this is the release date of the movie mov_rel_country – this is the name of the country(s) where the movie was released

movies_genres: mov_id – this is the ID of the movie, which is referencing the mov_id column of the table movies gen_id – this is the ID of each genres, which is referencing the gen_id column of the table genres

directors_movies: dir_id – this is the ID for each director, which is referencing the dir_id column of the table directors mov_id – this is the ID of the movie, which is referencing the mov_id column of the table movies

reviews: id – this is the unique ID for each reviewer rev_name – this is the name of the reviewer

movies_ratings_reviews: mov_id –this is the ID of the movie, which is referencing the mov_id column of the table movies rev_id – this is the ID of the reviewer, which is referencing the rev_id column of the table reviews rev_stars – this is indicates how many stars a reviewer rated for a review of a movie num_o_rating – this indicates how many ratings a movie achieved

movies_actors: act_id – this is ID of actor, which is referencing the act_id column of actors table mov_id – this is the ID of the movie, which is referencing the mov_id column of the table movies role – this is the name of a character in the movie, an actor acted for that character

Objectives Write SQL requests. Simple, and some more complicated ;-)

Submit your work For automatic tests purposes, you will write your SQL requests inside a file named: my_allocine.rb. It will be formatted like this:

requests[REQUEST_DESCRIPTION_1] = "SQL_REQUEST_1"
requests[REQUEST_DESCRIPTION_2] = "SQL_REQUEST_2"
We are providing the file with all the description, your mission will be to write all the corresponding sql request.

Here is the file:

requests['Display all actors'] = "SELECT \* FROM actors;"
requests['Display all genres'] = ""
requests['Display the name and year of the movies'] = ""
requests['Display reviewer name from the reviews table'] = ""

requests["Find the year when the movie American Beauty released"] = ""
requests["Find the movie which was released in the year 1999"] = ""
requests["Find the movie which was released before 1998"] = ""
requests["Find the name of all reviewers who have rated 7 or more stars to their rating order by reviews rev_name (it might have duplicated names :-))"] = ""
requests["Find the titles of the movies with ID 905, 907, 917"] = ""
requests["Find the list of those movies with year and ID which include the words Boogie Nights"] = ""
requests["Find the ID number for the actor whose first name is 'Woody' and the last name is 'Allen'"] = ""

requests["Find the actors with all information who played a role in the movies 'Annie Hall'"] = ""
requests["Find the first and last names of all the actors who were cast in the movies 'Annie Hall', and the roles they played in that production"] = ""

requests["Find the name of movie and director who directed a movies that casted a role as Sean Maguire"] = ""
``requests["Find all the actors who have not acted in any movie between 1990 and 2000 (select only actor first name, last name, movie title and release year)"] = "" `

**Tools**
It's the time to improve your skills with Sqlite.

1# Download the database:

wget https://storage.googleapis.com/qwasar-public/track-claris/movies.db

2# Connect to the database with Sqlite:

$>sqlite3 movies.db SQLite version 3.32.3 2020-06-18 14:16:19 Enter ".help" for usage hints. sqlite>

3# Type in the command line to perform sql queries:

sqlite> SELECT \* FROM genres; 1001|Action 1002|Adventure 1003|Animation 1004|Biography 1005|Comedy 1006|Crime 1007|Drama 1008|Horror 1009|Music 1010|Mystery 1011|Romance 1012|Thriller 1013|War sqlite>

4# exit with: Ctrl + D

**TIPS**
Research keywords SELECT, \*, FROM, JOIN, WHERE, ...
SQL requests have a semi colon at the end.

Season 02 SE Project 8:

My Zsh

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Zsh
Submit directory .
Submit files Makefile - _.c - _.h
Description
Introduction
There are programs out there that everyone uses, and it’s easy to put their developers on a pedestal. Although developing large software projects isn’t easy, many times the basic idea of that software is quite simple. Implementing it yourself is a fun way to show that you have what it takes to be a real programmer.

Write your own Shell, is it possible? Let's do it! :-)

Zsh - tcsh - bash - sh are command interpreters. A command interpreter is run inside a terminal.

What is a UNIX command interpreter? If we have to make it simple: It's a loop.

What is it made of ?

->
| Read: Read the command from standard input.
| Parse: Separate the command string into a program and arguments.
| Execute: Run the parsed command.
|-- (repeat)
Each one of those 3 parts leave us with more questions: I# How to read? II# How to parse? III# How to run?

I Read line
You should be able to do it ;-)

II Parse
You should also be able to google / do it :-) (A little voice in my head is whispering Lexer - AST?)

III Execution
3.0 Binary vs shell builtins
In the shell, there is a difference between ls - cat - tail - head - ... and pwd - env - setenv - cd - ...

$>which ls
/bin/ls
$>
$>which pwd
pwd: shell built-in command
$>
This difference creates two types of execution:

builtins are function inside your Shell
binary have to be exec in your shell
3.1 To execute a binary, the exec*() functions.
This is the way to start a binary (example: ls) Exec*() have different interface you can use. For this project you will have to use: execve().

But all exec functions have a similar behaviour, they kill their own process after their execution. It means you can run one ls and then your shell will die.

How to solve this problem? You will have to create another process, using a function called: fork():

3.2 How to fork()?
Here is an example of code:

int executor(char \*\*args)
{
pid_t pid, wpid;
int status;

pid = fork();
// after this function, execution has now two processes: a parent and a child.
// how to determine which one is which?
if (pid == 0) {
// Child process
if (execvp(args[0], args) == -1) { // Executing the command.
perror("lsh");
}
exit(EXIT_FAILURE);
} else {
// Parent process
do {
wpid = waitpid(pid, &status, WUNTRACED);
} while (!WIFEXITED(status) && !WIFSIGNALED(status));
// Wait for process child to be done.
}

return 1;
}
Scheme of Fork() - execve() - wait()

3.3 Where to find the different binary?
This is a great question! We are using the variable PATH from the environment.

$>echo $PATH
...
$>
3.4 How to access the environment?
You might learn something new here: main() function in C actually receives 3 arguments!

int main(int ac, char **av, char** env) // <- hehe
Technical specifications
Your interpreter will display a prompt respecting this format: [what_you_want]> example with pwd as what_you_want:
[/home/gaetan/]>ls
...
[/home/gaetan/]>
You will have to wait for a command line to be written (ending by a newline character (enter))

You will have to parse the command line and format it in order to execute it.

The prompt must be displayed again only after the command execution.

For the execution you must use execve.

Only basic command lines are expected to be executed; no pipes, redirections or any other advanced features. The executables should be those found in the path, as indicated in the PATH variable.

If the executable cannot be found, you must display an error message and display the prompt again. Errors must be dealt with and must display the appropriate message on the error output. You must correctly handle the PATH and the environment (by copying and restoring the initial env).

You must implement the following builtins: echo, cd, setenv, unsetenv, env, exit, pwd and which.

Example
$>./my_zsh
GTN - my_zsh $>echo "hello"
hello
GTN - my_zsh $>ls -l
Applications		Downloads		Library			Past			Public			Desktop			Dropbox
Movies			Pictures		Sites      Documents
Music			Project			bin			go
GTN - my_zsh $>pwd
/Users/gtn/
GTN - my_zsh $>cd /tmp
GTN - my_zsh $>pwd
/tmp/
GTN - my_zsh $>./my_segfault_program
Segfault
GTN - my_zsh $>cd -
/Users/gtn/
GTN - my_zsh $>exit
$>
Authorized functions
malloc, free, exit, opendir, readdir, closedir, getcwd, chdir
fork, stat, lstat, fstat, open, close, getline
read, write, execve, isatty, wait, waitpid
wait3, wait4, signal, kill, getpid, strerror, perror.
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
No memory leaks are allowed.
Parser can be a split on spaces.
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden

Season 02 SE Project 9:

My Css Is Easy I Se

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Css Is Easy I
Submit directory .
Submit files index.html - style.css
Description
Create a html page (named: index.html) with a css style (named: style.css).

It is required to use flexbox. If you use float, this exercise will be considered as failed.

Flexbox is very powerful in order to align responsively elements.

Your web page will be responsive, which means your page will handle a mobile view and a desktop view.

Mobile view:

---

## | HEADER |

## | HERO |

## | CONTENT|

## | SIDEBAR|

## | FOOTER |

Desktop view:

---

## | HEADER |

## | HERO |

## | CONTENT | SIDEBAR |

## | FOOTER |

Example:

Each section will have their names displayed (ex: in the header component you will have the word header, hero for hero, etc.)
Use some padding to make it smooth.
Header will have a background color: 00B7EB
Hero will have a background color: FF0000
Content will have a background color: 00FF00
Sidebar will have a background color: 800080
Footer will have a background color: 444444
Mobile view is defined as a screen width less than 640px

Desktop view is defined as a screen width bigger than 640px

Some browsers create a margin inside the body tag. To get rid of it:

body {
margin: 0px !important;
}
Gandalf is not a big fan of margins. Gandalf is not a big fan of HTML5 (header/section/footer will be replaced by the tag div.) Gandalf will not find sections if they are not properly named and it will display an error about timeout.

Annex: Static Html Page Renderer
How to have a static html page renderer inside Docode:

0# Open your HTML file:

1# Click on the web preview button:

2# You can preview your html:

Season 02 SE Project 10:

My Sqlite Se

Technical details
Submit files my_sqlite_request. - my_sqlite_cli.
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
Part 00 Create a class called MySqliteRequest in my_sqlite_request.rb. It will have a similar behavior than a request on the real sqlite.

All methods, except run, will return an instance of my_sqlite_request. You will build the request by progressive call and execute the request by calling run.

Each row must have an ID.

We will do only 1 join and 1 where per request.

Example00:

request = MySqliteRequest.new
request = request.from('nba_player_data.csv')
request = request.select('name')
request = request.where('birth_state', 'Indiana')
request.run
=> [{"name" => "Andre Brown"]
Example01:

Input: MySqliteRequest.new('nba_player_data').select('name').where('birth_state', 'Indiana').run
Output: [{"name" => "Andre Brown"]
Constructor It will be prototyped:
def initialize

From Implement a from method which must be present on each request. From will take a parameter and it will be the name of the table. (technically a table_name is also a filename (.csv))
It will be prototyped:

def from(table_name)

Select Implement a where method which will take one argument a string OR an array of string. It will continue to build the request. During the run() you will collect on the result only the columns sent as parameters to select :-).
It will be prototyped:

def select(column_name) OR def select([column_name_a, column_name_b])

Where Implement a where method which will take 2 arguments: column_name and value. It will continue to build the request. During the run() you will filter the result which match the value.
It will be prototyped:

def where(column_name, criteria)

Join Implement a join method which will load another filename_db and will join both database on a on column.
It will be prototyped:

def join(column_on_db_a, filename_db_b, column_on_db_b)

Order Implement an order method which will received two parameters, order (:asc or :description) and column_name. It will sort depending on the order base on the column_name.
It will be prototyped:

def order(order, column_name)

Insert Implement a method to insert which will receive a table name (filename). It will continue to build the request.
def insert(table_name)

Values Implement a method to values which will receive data. (a hash of data on format (key => value)). It will continue to build the request. During the run() you do the insert.
def values(data)

Update Implement a method to update which will receive a table name (filename). It will continue to build the request. An update request might be associated with a where request.
def update(table_name)

Set Implement a method to update which will receive data (a hash of data on format (key => value)). It will perform the update of attributes on all matching row. An update request might be associated with a where request.
def set(data)

Delete Implement a delete method. It set the request to delete on all matching row. It will continue to build the request. An delete request might be associated with a where request.
def delete

Run Implement a run method and it will execute the request.
Part 01 Create a program which will be a Command Line Interface (CLI) to your MySqlite class. It will use readline and we will run it with ruby my_sqlite_cli.rb.

It will accept request with:

SELECT|INSERT|UPDATE|DELETE
FROM
WHERE (max 1 condition)
JOIN ON (max 1 condition) Note, you can have multiple WHERE. Yes, you should save and load the database from a file. :-)
** Example 00 ** (Ruby)

$>ruby my_sqlite_cli.rb class.db
MySQLite version 0.1 20XX-XX-XX
my_sqlite_cli> SELECT * FROM students;
Jane|me@janedoe.com|A|http://blog.janedoe.com
my_sqlite_cli>INSERT INTO students VALUES (John, john@johndoe.com, A, https://blog.johndoe.com);
my_sqlite_cli>UPDATE students SET email = 'jane@janedoe.com', blog = 'https://blog.janedoe.com' WHERE name = 'Jane';
my_sqlite_cli>DELETE FROM students WHERE name = 'John';
my_sqlite_cli>quit
$>
** Example 00 ** (Javascript)

$>node my_sqlite_cli.js class.db
MySQLite version 0.1 20XX-XX-XX
my_sqlite_cli> SELECT * FROM students;
Jane|me@janedoe.com|A|http://blog.janedoe.com
my_sqlite_cli>INSERT INTO students VALUES (John, john@johndoe.com, A, https://blog.johndoe.com);
my_sqlite_cli>UPDATE students SET email = 'jane@janedoe.com', blog = 'https://blog.janedoe.com' WHERE name = 'Jane';
my_sqlite_cli>DELETE FROM students WHERE name = 'John';
my_sqlite_cli>quit
$>
Our examples will use these CSV Nba Player Data Nba Players

In addition to accomplishing this challenge. You should take a read about those concepts:

B-Tree (not binary tree "B-Tree")
TRIE
Reverse Index
Season 02 Software Engineer

Season 02 SE Project 11:

My Curl

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Curl
Submit directory .
Submit files Makefile - _.c - _.h
Description
HTTP Protocol is used everywhere and pretty easy to read, this project will lead you to its world.

You will create a my_curl command (very similar to the UNIX command curl) my_curl is a tool to get data from a server, using HTTP. The command is designed to work without user interaction.

How does it work? You send an url as parameter and it will print the html content of a web page.

my_curl only supports HTTP.

$>./my_curl http://www.columbia.edu/~fdc/sample.html

<!DOCTYPE HTML>
<html lang="en">
<head>
...
<p>
<i>(End)</i>

<hr>
</body>  <!-- close the <body> begun above -->
</html>  <!-- close the <html> begun above -->
How would you be able to do this magic? Using sockets. They are file descriptors.

HTTP Protocol is pretty straightforward: RFC HTTP

Authorized functions
bind
connect
socket
write / read
close
select (optional)
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.

Season 02 SE Project 12:

My Libasm

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Libasm
Submit directory .
Submit files Makefile - _.c - _.S - \*.h
Description
Reading and writing assembly is a skill. You can see it in a binary way: those you can and those who can't.

This is one of your very rare opportinuty to be that person: "wowww, they know how to read assembly." And more important, you will be able to understand what is it really happening when you are calling a function. (copy of parameter, where is it stored the return value, how does the stack work?)

Assembly to machine code. ## What is Assembly? An assembly language is a low-level programming language designed for a specific type of processor. It may be produced by compiling source code from a high-level programming language (such as C/C++) but can also be written from scratch.
It means, it's a language, with lower level instructions. You will have to write more code in order to do the same operation than in a higher level language.

If you are looking how to declare variable, you can't. Variables are called: registers.

It exists multiple languages assembly

For this project we will use nasm 64.

Example of a main() calling the function puts() with "Hello, world":

$>cat hello.asm
global \_main
extern \_puts

section .text
\_main: push rbx ; Call stack must be aligned
lea rdi, [rel message] ; First argument is address of message
call \_puts ; puts(message)
pop rbx ; Fix up stack before returning
ret

section .data
message: db "Hello, world", 0 ; Strings need a zero byte at the end
$>
How to compile?

# OS X

# $>nasm -fmacho64 hello.asm

# Linux

$> nasm -felf hello.asm

# We are using gcc for the linker.

$>gcc hello.o -o hello
$>./hello
$>
Technical specifications
Here's what your my_libasm should have

- strlen -> my_strlen
- strchr -> my_strchr
- memset -> my_memset
- memcpy -> my_memcpy
- strcmp -> my_strcmp
- memmove -> my_memmove

- strncmp -> my_strncmp
- strcasecmp -> my_strcasecmp
- index -> my_index

- read -> my_read
- write -> my_write

Season 02 SE Project 13:

My Malloc

Remember to git add && git commit && git push each exercise!

We will execute your function with our test(s), please DO NOT PROVIDE ANY TEST(S) in your file

For each exercise, you will have to create a folder and in this folder, you will have additional files that contain your work. Folder names are provided at the beginning of each exercise under submit directory and specific file names for each exercise are also provided at the beginning of each exercise under submit file(s).

My Malloc
Submit directory .
Submit files Makefile - _.c - _.h
Description
My_malloc is certainly one of the project you will learn the most in term of UNIX / Algorithm / Implementation. It's an endless project, there is no best solution. Dive in with a plan in order to don't be stuck inside this project :-)

Stack and Heap

Memory is one of main avantage of using C, it's also one of the main difficulty: You have to manage it yourself. Interesting fact: to land on the moon, The Apollo guidance computer had only 4k of memory.

What are the differents types of memory?

An example of an implementation of memory. (Yes, there are differents implementation)

In this project, we will use the heap by recreating our own implementation of malloc(). But what is malloc? Malloc is a dynamic memory allocator — it gives you a block of memory on the heap during run time. You want to use malloc when you don’t know the memory size during compile time. It’s also useful when you need to allocate memory greater than the size of the stack. More commonly, malloc is used for objects that must exist beyond the scope of the current block.

To reserve memory from the heap, we used to do reserve memory by calling the syscall sbrk(), but it has been deprecated on OS X. Today, we are going to call another syscall: mmap()

It's straightforward to use:

#include <unistd.h>
#include <stdio.h>
#include <sys/mman.h>
#include <string.h>

void\* my_malloc(int size) {
return mmap(0, size, PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE, -1, 0);;
}

int main(int ac, char \**av) {
char *src = "hello";
char \*dest = my_malloc(strlen(src) + 1);

strcpy(dest, src);
printf("s\n", dest);
return 0;
}
Tada, we have done my_malloc(). Meh, where is the trick then...?

My_malloc is not a project about requesting memory. Calling mmap is very slow, we need to call it as minimum as we can.

If the user wants only 5 cells of memory, my_malloc will request a BIG chunk and divide it into smaller, so next time the user is calling my_malloc, it won't have to mmap again: It's a project about memory management.

Question are: how to keep track of memory sent to the user in order to reuse them? a struct? with a header? and all our structs stored inside a linked list?

struct s_elem {
struct s_elem* next;
int size;
void* ptr_for_the_user;
}

There are multiple implementation of malloc. (dlmalloc - jemalloc - ...)

Technical specifications
Create your own implementation of the malloc families functions in order to allocate memory:

my_malloc
my_free
my_calloc
my_realloc
Tip 00 Hash table are faster to search than a linked list. What about balanced tree? Red and Black Tree or AVL Tree?

Tip 01 Hash table are interviews materials. What is a hash function? How to handle collisions?
