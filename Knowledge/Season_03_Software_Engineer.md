-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 03 SE PROJECT CONTEXT
---

=================
Season03 Software Engineer CPP
=================

Season 03 Software Engineer CPP PROJECT 1:

My String

My String
Submit directory ex00
Submit file my_string.cpp
Description
Create a MyString class. It will behave exactly like the std::string class. Usage of std::string is not allowed. :-)

We will be able to instanciate your MyString in different ways:

MyString first_string MyString("hello");
MyString second_string MyString();

MyString another_string = "hello";
MyString another_another_string = "hello";
Your MyString class will allow to:

constructors
concat with operator+
append with operator+=
append with append()
replace pattern inside string
find
rfind
substr
compare with compare() and operator==()
operator<<
access c string with c_str()
Here is our main() :-)

int main(int ac, char \*\*av) {
{
std::cout << "## CONSTRUCTOR TEST" << std::endl;

        MyString s1;

        std::cout << "default constructor: ";
        std::cout << boolean_to_s(strcmp(s1.c_str(), "") == 0) << std::endl;

        MyString s2("Hello");

        std::cout << "const char* constructor: ";
        std::cout << boolean_to_s(strcmp(s2.c_str(), "Hello") == 0) << std::endl;

        MyString s3 = "Hello";

        std::cout << "operator= constructor: ";
        std::cout << boolean_to_s(strcmp(s3.c_str(), "Hello") == 0) << std::endl;

        MyString s4 = s2;

        std::cout << "operator= constructor: ";
        std::cout << boolean_to_s(strcmp(s4.c_str(), "Hello") == 0) << std::endl;
    }

    {
        std::cout << "## CONST CONSTRUCTOR TEST" << std::endl;

        const MyString s1;

        std::cout << "default constructor: ";
        std::cout << boolean_to_s(strcmp(s1.c_str(), "") == 0) << std::endl;

        const MyString s2("Hello");

        std::cout << "const char* constructor: ";
        std::cout << boolean_to_s(strcmp(s2.c_str(), "Hello") == 0) << std::endl;

        const MyString s3 = "Hello";

        std::cout << "operator= constructor: ";
        std::cout << boolean_to_s(strcmp(s3.c_str(), "Hello") == 0) << std::endl;

        const MyString s4 = s2;

        std::cout << "operator= constructor: ";
        std::cout << boolean_to_s(strcmp(s4.c_str(), "Hello") == 0) << std::endl;
    }

    {
        std::cout << "## SIZE" << std::endl;

        MyString u = "qwasar creating stars";

        std::cout << "size: ";
        std::cout << boolean_to_s(u.size() == 21) << std::endl;
    }

    {
        std::cout << "## VALUE SWAP" << std::endl;

        MyString c;
        MyString u = "qwasar";
        MyString v = "creating stars";

        c = u;
        u = v;
        v = c;
        std::cout << "Value swap: ";
        std::cout << boolean_to_s(strcmp(u.c_str(), "creating stars") == 0 && strcmp(v.c_str(), "qwasar") == 0) << std::endl;
    }

    {
        std::cout << "## OPERATOR+" << std::endl;

        MyString u = "qwasar ";
        MyString v = "creating stars";
        MyString w = u + v;

        std::cout << "operator+: ";
        std::cout << boolean_to_s(strcmp(w.c_str(), "qwasar creating stars") == 0) << std::endl;
    }

    {
        std::cout << "## OPERATOR[]" << std::endl;
        MyString t = "hello old friend.";
        t[0] = 'H';
        t[6] = 'O';
        t[10] = 'F';

        std::cout << "operator[]: ";
        std::cout << boolean_to_s(strcmp(t.c_str(), "Hello Old Friend.") == 0) << std::endl;
    }
    return 0;

}

Season 03 Software Engineer CPP PROJECT 2:

My Abstract Vm

Technical details
Submit files my_abstract_vm.cpp - Makefile
Description
MyAbstractVM is a machine with a stack that is able to compute simple arithmetic expressions. These arithmetic expressions are provided to the machine as basic assembly programs.

As an example is still better that all the possible explanations in the world, this is an example of an assembly program that your machine will be able to compute:

push int32(42)
push int32(33)

add

push float(44.55)

mul

push double(42.42)
push int32(42)

dump

pop

assert double(42.42)

exit
As for any assembly language, the language of MyAbstractVM is composed of a series of instructions, with one instruction per line. MyAbstractVM language has a type, which is a major difference from the others assembly languages.

Comments: Comments start with a ';' and finish with a newline. A comment can be either at the start of a line, or after an instruction.

push v: Stacks the value v at the top of the stack. The value v must have one of the following form:

int8(n): Creates an 8 bits integer with value n.
int16(n): Creates a 16 bits integer with value n.
int32(n): Creates a 32 bits integer with value n.
float(z): Creates a float with value z.
double(z): Creates a double with value z.
pop: Unstacks the value from the top of the stack. If the stack is empty, the program execution must stop with an error.

dump: Displays each value of the stack, from the most recent one to the oldest one WITHOUT CHANGING the stack. Each value is separated from the next one by a newline.

assert v: Verifies that the value at the top of the stack is equal to the one passed as parameter for this instruction. If it is not the case, the program execution must stop with an error. The v has the same form that those passed as parameters to the instruction push.

add: Unstacks the first two values on the stack, adds them together and stacks the result. If the number of values on the stack is strictly inferior to 2, the program execution must stop with an error.

sub: Unstacks the first two values on the stack, subtracts them, then stacks the result. If the number of values on the stack is strictly inferior to 2, the program execution must stop with an error.

mul: Unstacks the first two values on the stack, multiplies them, then stacks the result. If the number of values on the stack is strictly inferior to 2, the program execution must stop with an error.

div: Unstacks the first two values on the stack, divides them, then stacks the result. If the number of values on the stack is strictly inferior to 2, the program execution must stop with an error. Moreover if the divisor is equal to 0, the program execution must stop with an error too.

mod: Unstacks the first two values on the stack, calculates the modulus, then stacks the result. If the number of values on the stack is strictly inferior to 2, the program execution must stop with an error. Moreover if the divisor is equal to 0, the program execution must stop with an error too.

print: Verifies that the value at the top of the stack is an 8 bits integer. (If not, see the instruction assert), then interprets it as an ASCII value and displays the corresponding character on the standard output.

exit: Terminate the execution of the current program. If this instruction does not appears while all others instruction has been processes, the execution must stop with an error.

For non commutative operations, you must consider for the following stack: v1 on v2, the calculation in infix notation: v2 op v1.

When a calculation involves two operands from different types, the value returned has the type of the more precise operand. Please do note that because of the extensibility of the machine, the precision question is not a trivial one. This is covered more in details later in this document.

Grammar

The assembly language of MyAbstractVM is generated from the following grammar (# corresponds th the end of an entry, not to the character '#'):

S := [INSTR SEP]\* #

INSTR :=
push VALUE
| pop
| dump
| assert VALUE
| add
| sub
| mul
| div
| mod
| print
| exit

VALUE :=
int8(N)
| int16(N)
| int32(N)
| float(Z)
| double(Z)

N := [-]?[0..9]+

Z := [-]?[0..9]+.[0..9]+

SEP := '
'
Errors

When one of the following case happens, MyAbstractVM must raise an exception and stop the execution of the program neatly. It is forbidden to raise scalar exceptions. Moreover exception classes must inherit from std::exception of the STL.

The assembly program includes one or several lexical errors or syntactic errors. An instruction is known Overflow on a value Underflow on a value Instruction pop on an empty stack Division/modulo by 0 Le program don't have an instruction exit An instruction assert is not checked The stack is composed of strictly less that two values when an arithmetic instruction is executed.

Perhaps there are others errors. However, you machine must never crash! (segfault, bus error, infinite loop ...)

You machine must be able to run programs from files passed as parameters or from the standard entry. When parameters are passed by the standard entry, the end of the program is indicated by the special symbol ;;.

Be very careful avoiding conflicts during lexical or syntactic analysis between ";;" (end of a program read on the standard input) and ; (beginning of a comment.)

Now let see some examples of execution:

> ./avm
> push int32(2)
> push int32(3)
> add
> assert int32(5)
> dump
> exit
> ;;
> 5
>
> cat operation_1.avm
> ; -------------
> ; operation_1.avm -
> ; -------------

push int32(42)
push int32(33)
add
push float(44.55)
mul
push double(42.42)
push int32(42)
dump
pop
assert double(42.42)
exit

> ./avm ./operation_1.avm
> 42
> 42.42
> 3341.25
>
> ./avm
> pop
> ;;
> Line 1 : Error : Pop on empty stack
>
> In order to help you with your code, we give you the following instructions that you have to respect. For each instruction, you must understand why this particular one is imposed. We are not providing these instructions randomly or to bore you to death!

IOperand interface

Each of your operand classes MUST implement the following IOperand interface:

class IOperand
{
public:

virtual std::string const & toString() const = 0;

virtual int getPrecision() const = 0;
virtual eOperandType getType() const = 0;

virtual IOperand _ operator+(const IOperand &rhs) const = 0;
virtual IOperand _ operator-(const IOperand &rhs) const = 0;
virtual IOperand _ operator_(const IOperand &rhs) const = 0;
virtual IOperand _ operator/(const IOperand &rhs) const = 0;
virtual IOperand _ operator%(const IOperand &rhs) const = 0;

virtual ~IOperand() {}
};
Operand classes implementing the IOperand interface are the following ones: Int8: Representation of a signed integer coded on 8bits. Int16: Representation of a signed integer coded on 16bits. Int32: Representation of a signed integer coded on 32bits. Float: Representation of a float. Double: Representation of a double.

Important: It is FORBIDDEN to manipulate pointers or references on each of these 5 classes. You are allowed to manipulate pointers ONLY on IOperand.

Considering similarities between operand classes, it can be relevant to use template classes. However, this is not mandatory.

Creation of a new IOperand

You have to write a member function of a class relevant of your machine that will allows you to create new operands an a generic way. This function must have the following prototype:

IOperand \* createOperand(eOperandType type, const std::string & value);

The type eOperandType is an enum that can accept the following values:

Int8
Int16
Int32
Float
Double
Depending on the value of the enum passed as a parameter, the member function createOperand creates a new IOperand by calling one of the following private member function:

IOperand _ createInt8(const std::string & value); IOperand _ createInt16(const std::string & value); IOperand _ createInt32(const std::string & value); IOperand _ createFloat(const std::string & value); IOperand \* createDouble(const std::string & value);

In order to choose the right member function for the creation of the new IOperand, you MUST create and use an array (here, vector shows little interest) of pointers on member functions with enum values as index.

Precision

When an operation happens between two operands from the same type real, there is no problems. However, what about when the types real are different?

The usual method is to sequence types using their precision. For the machine you should use the following order: Int8 < Int16 < Int32 < Float < Double

To use this sequence for the machine, it is possible to associate an integer with each type to maintain the order, thanks to an enum for example.

The method pure getPrecision of the interface IOperand allows to get the precision of an operand. When an operation use two operands from two different types, the comparison of theirs precisions allows to figure out the result type of the operation.

For the project, the type returned is the more precise type of the two operands.

Stack

MyAbstractVM is a machine with a stack. It possesses a container behaving as a stack, or a stack itself. The choice seems obvious now, but perhaps you'll discover a subtlety later that will make you reconsider your choice.

The container must contain ONLY pointers on the abstract type IOperand! It is FORBIDDEN to store types real of operands in your container.

Season 03 Software Engineer CPP PROJECT 3:

My Ftp

Technical details
Submit files my_ftp.cpp - Makefile
my_ftp
Command Name
my_ftp

Description
Create a FTP server.

File Transfer Protocol (FTP) is a standard Internet protocol for transmitting files between computers on the Internet over TCP/IP connections. FTP is a client-server protocol where a client will ask for a file, and a local or remote server will provide it.

You will have to follow the protocol (RFC959)

The network communication will be achieved with TCP sockets.

Server will start with the port and the path of where file can be access:

Usage : ./server port path
port is the port number on which the server socket is listening.

path is the path to the home directory for the "Anonymous" user.

The server MUST be able to handle several clients at the same time by using a thread.

I think using a thread pool is cool. :-)

Your server must also have those features:

An authentication with an "Anonymous" account and an empty password
Data transfer MUST use "active" or "passive" mode as explained in the protocol.
Fact(s)
After this project you will be able to answer to the famous question: what does bind(0)

Season 03 Software Engineer CPP PROJECT 4:

My Cpp Redis Client

Technical details
Submit file \*.cpp
This page will describe the project my_redis_client. The following information will show you what you will have to implement. All features are required. A bonus section can be found at the very bottom.

NAME
my_redis_cli -h host -p port Default host (localhost) Default port (6379)

Prologue
The name Redis means REmote DIctionary Server. The Redis project began when Salvatore Sanfilippo (antirez), the original developer of Redis, was trying to improve the scalability of his Italian startup, developing a real-time web log analyzer. After encountering significant problems in scaling various types of workloads using traditional database systems, Sanfilippo began to prototype a first proof-of-concept version of Redis in Tcl (pronounced "tickle", a high-level, dynamic programming language, that is itself commonly embedded into C applications).

Later, Sanfilippo translated his prototype into the C language and implemented the first data type: the list. After a few weeks of using the project internally with success, Sanfilippo decided to make it open source, announcing the project on Hacker News (HN). The project began to gain traction, more so among the Ruby community, with GitHub and Instagram among the first companies adopt it.

Sanfilippo was hired by VMware in March, 2010.

In May, 2013, further Redis development was sponsored by Pivotal Software (a VMware spin-off).

In June, 2015, Redis Labs sponsored additional development.

In October, 2018, Redis 5.0 was released, which introduced Redis Stream - a new data structure that allows storage of multiple fields and string values with an automatic, time-based sequence at a single key.

In June, 2020, Salvatore Sanfilippo stepped down as `the Redis maintainer.

DESCRIPTION
You are to build my_redis_cli, a Common Line Interface (CLI), in CPP. It's a simple program that allows you to send commands to a Redis Server and read the replies.

It has two modes: 1# Read Eval Print Loop (REPL)

$>./my_redis_cli
127.0.0.1:6379> set "hello" "world"
OK
127.0.0.1:6379>
2# Shell arguments

$>./my_redis_cli set ciao mondo
OK
$>
Commands
Here is a list of commands that you need you to make available in my_redis_cli.

Common
• quit
• echo
• ping
• flushall
• info
Key/Value
• set
• get
• keys
• type
• del
• unlink
• expire
• rename
Lists
• llen
• lrem
• lindex
• lpop/rpop
• lpush/rpush
• lset
Hashes
• hget
• hexists
• hdel
• hgetall
• hkeys
• hlen
• hmset
• hset
• hvals
A complete description of each command and how they work is available here

Encryption
my_redis_cli should use a plain TCP connection.

Technical description
You will provide a Cargo-compatible project. Consider the following 4 items:

(At this point in the program, reading STDIN commands should be straightforward and fairly easy to code.)

Protocol
The Redis wire protocol documentation can be found here. Its implementation should be simple.

Design/Architecture
A Redis server will be implemented (in the next project at Qwasar). We recommend you abstract your structs protocol (parse/frame) and connection.

BONUS Bonus points if you add the following items into your solution: 0# Advanced logging (debug and tracing (you can use the crate tracing)) 1# Streams (publish/subscribe) Implementing Streams may require additional crates; you can use tokio-stream and async-stream.

2# SSL Implementing SSL will add the following arguments --tls with options --cacert or --cacertdir

Season 03 Software Engineer CPP PROJECT 5:

My Cpp Redis Server

Technical details
Submit file \*.cpp
This page will describe the project my_redis_server. The following information will show you what you will have to implement. All features are required. A bonus section can be found at the very bottom.

NAME
my_redis_server --port PORT Default port (6379)

Prologue
Redis’s exceptional performance, simplicity, and atomic manipulation of data structures lends itself to solving problems that are difficult or perform poorly when implemented with traditional relational databases. Here are some example use cases:

COMMON USE CASES
• Caching – Due to its performance, developers have turned to Redis when the volume of read and write operations exceed the capabilities of traditional databases. With Redis’s capability to easily persist the data to disk, it is a superior alternative to the traditional memcached solution for caching.

• Publish and Subscribe – Since version 2.0, Redis provides the capability to distribute data using the Publish/Subscribe messaging paradigm. Some organizations have moved to Redis and away from other message queuing systems (i.e., zeromq, RabbitMQ) due to Redis’s simplicity and performance.

• Queues – Projects such as Resque use Redis as the backend for queueing background jobs.

• Counters – Atomic commands such as HINCRBY allow for a simple and thread-safe implementation of counters. Creating a counter is as simple as determining a name for a key and issuing the HINCRBY command. There is no need to read the data before incrementing, and there are no database schemas to update. Since these are atomic operations, the counters will maintain consistency when accessed from multiple application servers.

DESCRIPTION
You are to build my_redis_server, a server that should be a data structure server. It should provide access to data which are sent through TCP sockets using redis protocol. This protocol should have been implemented in your previous project my_redis_client, meaning you could use your my_redis_client to communicate with my_redis_server.

Redis stores data. Data types can be string or integer values. There are 2 types of data structures:

0# list

$>./my_redis_server &
$>./my_redis_client
127.0.0.1:6379>LPUSH my_list 1
(integer) 1
127.0.0.1:6379>LPUSH my_list 2
(integer) 2
127.0.0.1:6379>
1# hash (k/v)

$>./my_redis_server &
$>./my_redis_client
127.0.0.1:6379>set "hello" "world"
OK
127.0.0.1:6379>get "hello"
"world"
127.0.0.1:6379>
Commands
In order to mirror your my_redis_client, you will implement the followings commands:

Common
• echo
• ping
• flushall
Key/Value
• set
• get
• keys
• type
• del
• unlink
• expire
• rename
Lists
• llen
• lrem
• lindex
• lpop/rpop
• lpush/rpush
• lset
Hashes
• hget
• hexists
• hdel
• hgetall
• hkeys
• hlen
• hmset
• hset
• hvals
A complete description of each command and how they work is available here

Encryption
my_redis_server should use a plain TCP connection.

Connection
my_redis_server must simultaneously accept multiple connections.

Persistence/backup
my_redis_server will save its database every 300 seconds into a file. This file will be located in the current directory and it will be named: dump.my_rdb.

RDB format is a binary representation of the memory in a redis-server. You can decide to follow its implementation or implement your own backup format.

Backups must happen as a background task.

Db
my_redis_server must provide 1 database.

Technical description
You will provide a Cargo-compatible project. Consider the following 7 items:

Atomic
Multiple clients can modify the same data at the same time. You will have to make sure this works.

Shutdown correctly
Signal ctrl_c must be caught in order to correctly shutdown the server. Before shutting down, you will save into the dump.my_rdb file.

Data storage
A custom data structure would be preferable but you can use vec and hashmap for data storage.

Protocol
The Redis wire protocol documentation can be found here. Its implementation should be simple.

Design/Architecture
You should reuse your protocols and connections structs from my_redis_client. At that moment, you will either proud of your previous implementation or it will be time to refactor it.

BONUS Bonus points if you add the following items into your solution: 0# Advanced logging (debug and tracing (you can use the crate tracing))

1# Provide multiple databases (with a maximum of 16 db)

2# Implementing move command (move a key from one db to another db)

3# Implementing Streams (publish/subscribe)

4# Implementing incr command (increment the value of a key)

5# Implementing SSL

Season 03 Software Engineer CPP PROJECT 6:

My Skype

Technical details
Submit files my_skype.cpp - Makefile
my_skype
my_skype

Create your skype like client-server.
