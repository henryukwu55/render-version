-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 01 ARC 02 PROJECT CONTEXT
---

=================
Season01 Arc 02 Project 1: My Christmas Tree
=================

My Christmas Tree
Submit directory ex00
Submit file my_christmas_tree.c
Description
Create a program which can be run in the terminal that display a Christmas Tree.

Size will be given as the first parameter of the program.

Usage: ./my_christmas_tree <size></size>

Example 00:

$>./my_christmas_tree 0
$>
Example 01:

$>./my_christmas_tree 1

- ***

  ***

  ***

|

Example 02:

$>./my_christmas_tree 5 \*
**\*
\*\*\***
**\*\*\***
**\***
**\*\*\*** \***\*\*\*\*** \***\*\*\*\*\*\***
**\*\***\***\*\*** \***\*\*\*\*\*\***
**\*\***\***\*\***
**\*\***\*\*\***\*\***
**\*\*\*\***\***\*\*\*\***
**\*\*\*\***\*\*\***\*\*\*\*** \***\*\*\*\*\***\*\***\*\*\*\*\***
**\*\*\*\***\***\*\*\*\***
**\*\*\*\***\*\*\***\*\*\*\*** \***\*\*\*\*\***\*\***\*\*\*\*\*** \***\*\*\*\*\***\*\*\*\***\*\*\*\*\*** \***\*\*\*\*\*\*\***\*\***\*\*\*\*\*\*\*** \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
**\*\***\*\***\*\***\***\*\***\*\***\*\*** \***\*\*\*\*\*\*\***\*\***\*\*\*\*\*\*\*** \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
**\*\***\*\***\*\***\***\*\***\*\***\*\***
**\*\***\*\***\*\***\*\*\***\*\***\*\***\*\***

---

---

---

---

                 |||||
                 |||||
                 |||||
                 |||||
                 |||||

$>
From docode you can download the qwasar_my_christmas_tree by executing this command:

curl -s https://storage.googleapis.com/qwasar-public/qwasar_my_christmas_tree.tgz | tar zxvf - -C ./

=================
Season01 Arc 02 Project 2: My Ls
=================

My Ls
Submit directory .
Submit files Makefile - _.c - _.h
Description
SPECIFICATIONS
Write a programm called my_ls. Following the specifications of this man page.

NAME
my_ls -- list directory contents

SYNOPSIS
my_ls [-at] [file ...]

DESCRIPTION
For each operand that names a file of a type other than directory, my_ls displays its name as well as any requested, associated information. For each operand that names a file of type directory, my_ls displays the names of files contained within that directory, as well as any requested, associated information.

If no operands are given, the contents of the current directory are displayed. If more than one operand is given, non-directory operands are displayed first; directory and non-directory operands are sorted separately and in lexicographical order.

The following options are available:

-a Include directory entries whose names begin with a dot (.).
-t Sort by time modified (most recently modified first) before sorting the operands by lexicographical order.
Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Hint(s)
Watch out for memory leaks !
You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address
Global variables are strictly FORBIDDEN
tv_sec AND tv_nsec are used for the -t options ;-)
st_mtime is not what you want to use. You want to use st_mtim
Technical information
you must create a Makefile, and the ouput is the command itself
You can use:
malloc(3)
free(3)
printf(3)
write(2)
stat(2)
lstat(2)
opendir(2)
closedir(2)
readdir(2)
You can NOT use:
Any functions / syscalls which does not appear in the previous list
Yes, it includes exit
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
Your output needs to be respecting the "sorting" criteria and in one column. It will be compared with: ls -1.
$>./my_ls > my_ls.output
$>ls -1 > ls.output
$>diff my_ls.output ls.output
$>
Tips
Check /dev What is the difference between stat and lstat?

=================
Season01 Arc 02 Project 3:
=================

My Tar

My Tar
Submit directory .
Submit files Makefile - _.c - _.h
Description
my_tar
Command Name
my_tar

Description
my_tar is a command to manipulate tape archive. The first option to tar is a mode indicator from the following list:

-c Create a new archive containing the specified items.
-r Like -c, but new entries are appended to the archive. The -f option is required.
-t List archive contents to stdout.
-u Like -r, but new entries are added only if they have a modification date newer than the corresponding entry in the archive. The -f option is required.
-x Extract to disk from the archive. If a file with the same name appears more than once in the archive, each copy will be extracted, with later copies overwriting (replacing) earlier copies.
In -c, -r, or -u mode, each specified file or directory is added to the archive in the order specified on the command line. By default, the contents of each directory are also archived.

Unless specifically stated otherwise, options are applicable in all operating modes:

-f file Read the archive from or write the archive to the specified file. The filename can be standard input or standard output.
my_tar will not handle file inside subdirectory.

Exit Status
The tar utility returns 0 on success, and >0 if an error occurs.

Hints
https://www.gnu.org/software/tar/manual/html_node/Standard.html
Technical Information
You must create a Makefile, and the ouput is the command it self
You can use (the number is the man page):
chmod
close|(2)
free(3)
fstat(2)
getpwuid
getgrgid
getxattr
listxattr
lseek(2)
major
malloc(3)
minor
mkdir(2)
open(2)
opendir
read(2)
readdir
readlink
stat(2)
lstat(2)
symlink
unlink(2)
time
ctime
utime
write(2)
No other functions or system calls are allowed.

Global variables are strictly FORBIDDEN

Example
The following creates a new archive called file.tar that contains two files source.c and source.h:

> ./my_tar -cf file.tar source.c source.h
> To view a detailed table of contents for this archive:

> ./my_tar -tf file.tar
> source.c
> source.h
> Errors handling Errors will be written on STDERR.
> File not found (provided file is: i_don_t_exist): my_tar: i_don_t_exist: Cannot stat: No such file or directory

Error with the tarball file (provided file is: tarball.tar): my_tar: Cannot open tarball.tar

=================
Season01 Arc 02 Project 4: My Readline
=================

My Readline
Submit directory .
Submit file my_readline.c
Description
NAME
char \*my_readline(int fd);

Prolog
If you already played with another higher-level programming language, you know how easy it is to read a line from a file. For example in Python, you can even iterate through the file like for line in file:.

Unfortunately for you, this project will bring you back in the 1970s (again) when no such super power was available.

Fortunately for you, you will discover the concept of global variables and gain a deeper understanding of how the heap and the stack interact with each other.

Synopsis
The function my_readline reads a line from the strean represented by fd and returns it into an allocated string (heap or stack ?). It stops when either the newline character is read or when the end-of-file is reached, whichever comes first. The newline character is not copied to the string.

On success, a pointer to the string is returned. On error, a null pointer is returned. If the end-of-file occurs before any characters have been read, the string remains unchanged.

Number of characters read will be set by the global variable READLINE_READ_SIZE You are allowed to maximum two global variables (one for your "storage" and one for READLINE_READ_SIZE). Be ready, we will change the value of READLINE_READ_SIZE.

Requirements
Your code must be compiled with the flags -Wall -Wextra -Werror.
Technical description
In order to start reading another file you will also produce a function: void init_my_readline() which will init (or reinitialize) your global variable.

In the case of reinitialize, you will, obviously, free allocated resources. :-)

Hints
• Your function should work with any of streams, whether it be a file, standard input or a redirection...
• Your function should be able to be used in a loop to read an entire file (see example)
• Watch out for memory leaks !
• You can test your code against memory errors by compiling with the debugging flags -g3 -fsanitize=address
• Static variables are strictly FORBIDDEN
Authorized function(s)
• malloc(3)
• free
• read
• open
• close
Unauthorized function(s)
lseek
fread
fopen
Any other functions or system calls
Multiline macros are forbidden
Include another .c is forbidden
Macros with logic (while/if/variables/...) are forbidden
Example 00 (In C)

int READLINE_READ_SIZE = 512;

int main(int ac, char \**av)
{
char *str = NULL;

int fd = open("./file.txt", O_RDONLY);
while ((str = my_readline(fd)) != NULL)
{
printf("%s\n", str);
free(str);
}
close(fd);
//
// Yes it's also working with stdin :-)
// printf("%s", my_readline(0));
//

return 0;
}

=================
Season01 Arc 02 Project 5: My Blockchain
=================

My Blockchain
Submit directory .
Submit files Makefile - _.c - _.h
Description
Command Name
my_blockchain

Blockchain: the Beginning
my_blockchain -- create a blockchain

Synopsis
my_blockchain

Description
Blockchain is a command that allows for the creation and management of a blockchain. When the program starts (it loads a backup if there is one) then a prompt appears. This prompt allows to execute commands. When the commands are successful they display "ok" and if not, "nok: info" or info is an error message - see below:

add node nid add a nid identifier to the blockchain node.
rm node nid... remove nodes from the blockchain with a nid identifier. If nid is '_', then all nodes are impacted.
add block bid nid... add a bid identifier block to nodes identified by nid. If nid is '_', then all nodes are impacted.
rm block bid nid... remove the bid identified blocks from nodes identified by nid..
ls list all nodes by their identifiers. The option -l attaches the blocks bid's associated with each node.
sync synchronize all of the nodes with each other. Upon issuing this command, all of the nodes are composed of the same blocks.
quit save and leave the blockchain.
The blockchain prompt must display (see example below):

a [ character
a first letter that indicates the state of synchronization of the chain:
"s" if the blockchain is synchronized
"-" if the blockchain is not synchronized.
n number of nodes in the chain.
the "]> " string (with a space)
Error messages
1: no more resources available on the computer
2: this node already exists
3: this block already exists
4: node doesn't exist
5: block doesn't exist
6: command not found
Technical Information
$>my_blockhain
No Backup Found: Starting New Blockchain
[s0]> add node 12
OK
[s1]> add block 21 *
OK
[s1]> add node 13
OK
[-2]> sync
OK
[s2]> ls -l
12: 21
13: 21
[s2]> quit
Backing up blockchain...
$>my_blockhain
Restoring From Backup
[s2]> ls -l
12: 21
13: 21
[s2]>
you must create a Makefile, and the output is the command itself
NID is an integer, BID is a string
You can use:
• malloc(3)

• free(3)

• printf(3)

• write(2)

• open(2)

• read(2)

• close(2)

Multiline macros are forbidden

Include another .c is forbidden

Macros with logic (while/if/variables/...) are forbidden
