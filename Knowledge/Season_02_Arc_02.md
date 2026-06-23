# Season 01 Arc 02 Projects

---

Project Name: My Christmas Tree
Project Submission: Submit directory ex00 | Submit file my_christmas_tree.c
Project Description: Create a C program that displays a Christmas tree in the terminal. Size is given as first argument. Tree is made of asterisks forming triangular layers with a trunk of pipe characters at the bottom.
Examples: ./my_christmas_tree 0 displays nothing | ./my_christmas_tree 1 displays one star layer and a pipe trunk | ./my_christmas_tree 5 displays 5 increasingly wide star layers with a wider trunk
Hints: Download reference binary: curl -s https://storage.googleapis.com/qwasar-public/qwasar_my_christmas_tree.tgz | tar zxvf - -C ./ | Each layer gets wider | Trunk is centered pipes
You can do: printf | write | atoi | argc and argv
You cannot do: Use library functions beyond what is listed
Project Technical Specification: Usage is ./my_christmas_tree followed by size integer. Compare output with reference binary.
Common Mistakes: Wrong number of spaces for centering | Incorrect layer widths | Trunk not centered | Off-by-one on number of layers

---

Project Name: My Ls
Project Submission: Submit directory . | Submit files Makefile and .c and .h files
Project Description: Implement my_ls command that lists directory contents following ls specifications. Supports -a flag to include hidden files starting with dot and -t flag to sort by modification time. Default sorts lexicographically in one column.
Examples: ./my_ls lists current directory one file per line | ./my_ls -a includes dotfiles | ./my_ls -t sorts by modification time newest first | Compare with ls -1 output
Hints: Watch for memory leaks | Use -g3 -fsanitize=address | Global variables strictly FORBIDDEN | Use st_mtim not st_mtime | tv_sec and tv_nsec used for -t option | Check /dev for difference between stat and lstat
You can do: malloc(3) | free(3) | printf(3) | write(2) | stat(2) | lstat(2) | opendir(2) | closedir(2) | readdir(2)
You cannot do: exit | Any functions not in the allowed list | Global variables | Multiline macros | Include another .c file | Macros with logic
Project Technical Specification: Compile with -Wall -Wextra -Werror. Create Makefile. Output must match ls -1 exactly. Sort lexicographically by default. Use st_mtim for time sorting.
Allowed Functions: malloc(3) | free(3) | printf(3) | write(2) | stat(2) | lstat(2) | opendir(2) | closedir(2) | readdir(2)
Common Mistakes: Using st_mtime instead of st_mtim | Global variables | Memory leaks | Wrong sort order | Not handling -a and -t flags correctly

---

Project Name: My Tar
Project Submission: Submit directory . | Submit files Makefile and .c and .h files
Project Description: Implement my_tar command to manipulate tape archives. Supports -c to create archive, -r to append, -t to list contents, -u to update, -x to extract. The -f flag specifies the archive file.
Examples: ./my_tar -cf file.tar source.c source.h creates archive | ./my_tar -tf file.tar lists source.c and source.h | Error: my_tar: i_dont_exist: Cannot stat: No such file or directory | Error: my_tar: Cannot open tarball.tar
Hints: See https://www.gnu.org/software/tar/manual/html_node/Standard.html for tar format | Errors written to STDERR | Does not handle files inside subdirectories | Global variables strictly FORBIDDEN
You can do: chmod | close(2) | free(3) | fstat(2) | getpwuid | getgrgid | getxattr | listxattr | lseek(2) | major | malloc(3) | minor | mkdir(2) | open(2) | opendir | read(2) | readdir | readlink | stat(2) | lstat(2) | symlink | unlink(2) | time | ctime | utime | write(2)
You cannot do: Any functions not in the allowed list | Global variables
Project Technical Specification: Must create Makefile. Returns 0 on success and greater than 0 on error. Does not handle subdirectory contents.
Allowed Functions: chmod | close(2) | free(3) | fstat(2) | getpwuid | getgrgid | lseek(2) | malloc(3) | mkdir(2) | open(2) | read(2) | stat(2) | lstat(2) | unlink(2) | time | write(2)
Common Mistakes: Not writing errors to STDERR | Incorrect tar header format | Wrong exit codes | Handling subdirectories incorrectly | Global variables

---

Project Name: My Readline
Project Submission: Submit directory . | Submit file my_readline.c
Project Description: Implement char *my_readline(int fd) that reads one line from a file descriptor. Stops at newline or EOF. Newline is not included in returned string. Returns null pointer on error. Also implement void init_my_readline() to reinitialize global state.
Examples: Read file line by line in a while loop | Works with regular files | Works with stdin | Works with redirections | READLINE_READ_SIZE global variable controls buffer size
Hints: Watch for memory leaks | Use -g3 -fsanitize=address | You may use maximum two global variables | Static variables strictly FORBIDDEN | Qwasar will change READLINE_READ_SIZE value during testing
You can do: malloc(3) | free | read | open | close
You cannot do: lseek | fread | fopen | Any other functions or system calls | Static variables | Multiline macros | Include another .c file | Macros with logic
Project Technical Specification: Function signature char *my_readline(int fd). Global int READLINE_READ_SIZE controls read chunk size. Must compile with -Wall -Wextra -Werror. Maximum two global variables allowed.
Allowed Functions: malloc(3) | free | read | open | close
Common Mistakes: Using static variables | Memory leaks | Not handling EOF correctly | Not reinitializing properly in init_my_readline | Not freeing buffer on reinitialization

---

Project Name: My Blockchain
Project Submission: Submit directory . | Submit files Makefile and .c and .h files
Project Description: Implement a blockchain command-line program that manages nodes and blocks. Supports commands: add node, rm node, add block, rm block, ls, sync, quit. Program saves state to backup file and restores on restart.
Examples: add node 12 creates node | add block 21 * adds block to all nodes | sync synchronizes all nodes | ls -l lists nodes with their blocks | quit saves and exits | Prompt shows [s2]> when 2 synchronized nodes
Hints: Prompt format is [ then s or - then number of nodes then ]> | s means synchronized - means not synchronized | NID is integer BID is string | Backup file loaded on start if exists
You can do: malloc(3) | free(3) | printf(3) | write(2) | open(2) | read(2) | close(2)
You cannot do: Multiline macros | Include another .c file | Macros with logic | Any functions not in allowed list
Project Technical Specification: Must create Makefile. Error messages: 1 no resources | 2 node exists | 3 block exists | 4 node not found | 5 block not found | 6 command not found. Successful commands print OK.
Allowed Functions: malloc(3) | free(3) | printf(3) | write(2) | open(2) | read(2) | close(2)
Common Mistakes: Wrong prompt format | Not saving backup on quit | Not restoring from backup on start | Wrong sync logic | Incorrect error codes
