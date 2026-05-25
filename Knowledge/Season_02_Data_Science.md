-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 02 DS PROJECT CONTEXT
---

=================
Season 02 DS Project 1: My Levenshtein Ds
=================

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

=================
Season 02 DS Project 2: My Roman Numerals Converter Ds
=================

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

=================
Season 02 DS Project 3: My Select Query
=================

My Select Query
Submit directory ex00
Submit file my_select_query\*
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
Description
Create a class MySelectQuery.
Your constructor will receive a CSV content (as a string), first line will be the name of the column.

Example:

"name,year_start,year_end,position,height,weight,birth_date,college\nAlaa Abdelnaby,1991,1995,F-C,6-10,240,'June 24, 1968',Duke University\nZaid Abdul-Aziz,1969,1978,C-F,6-9,235,'April 7, 1946',Iowa State University\nKareem Abdul-Jabbar,1970,1989,C,7-2,225,'April 16, 1947','University of California, Los Angeles
Mahmoud Abdul-Rauf,1991,2001,G,6-1,162,'March 9, 1969',Louisiana State University\n"
It will be prototyped:

constructor(csv_content)

Implement a where method which will take 2 arguments: column_name and value. It will return an array of strings which matches the value.

It will be prototyped:

where(column_name, criteria)

Our examples will use these CSV Nba Player Data Nba Players Nba Seasons Stats

Example00

Input: "name" && "Andre Brown"
Output: ["Andre Brown,2007,2009,F,6-9,245,birth_date,May 12, 1981,'DePaul University'"]

Season 02 DS Project 4:

My Nba Game Analysis

Technical details
Submit file my_nba_game_analysis.py
We have caught all the play_by_play happening during a NBA game so we have a flow of data and we want to create a nice array of hash which will sum everything.

Part I
Create a function analyse_nba_game(play_by_play_moves) which receives an array of play stat's and will return a dictionary summary of the game.

Each play follows this format:

PERIOD|REMAINING_SEC|RELEVANT_TEAM|AWAY_TEAM|HOME_TEAM|AWAY_SCORE|HOME_SCORE|DESCRIPTION
They are ordered by time.

The return dictionary (hash) will have this format:

{"home_team": {"name": TEAM_NAME, "players_data": DATA}, "away_team": {"name": TEAM_NAME, "players_data": DATA}}
DATA will be an array of hashes with this format:
{"player_name": XXX, "FG": XXX, "FGA": XXX, "FG%": XXX, "3P": XXX, "3PA": XXX, "3P%": XXX, "FT": XXX, "FTA": XXX, "FT%": XXX, "ORB": XXX, "DRB": XXX, "TRB": XXX, "AST": XXX, "STL": XXX, "BLK": XXX, "TOV": XXX, "PF": XXX, "PTS": XXX}
Percents are 100. Player is a string everything else are integers.

Example00

1|708.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|0|Turnover by K. Thompson (bad pass; steal by S. Adams)
1|703.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|0|Turnover by P. George (bad pass)
1|691.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|3|S. Curry makes 3-pt jump shot from 24 ft (assist by K. Durant)
1|673.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|3|S. Adams misses 2-pt jump shot from 12 ft
1|671.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|3|Offensive rebound by D. Schröder
1|667.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|3|P. George misses 3-pt jump shot from 26 ft
1|665.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|3|Defensive rebound by K. Durant
1|657.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|K. Durant makes 2-pt layup from 2 ft
1|638.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|D. Schröder misses 2-pt jump shot from 14 ft
1|636.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|Offensive rebound by D. Schröder
1|623.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|S. Adams misses 2-pt layup from 3 ft (block by K. Durant)
1|621.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|Defensive rebound by D. Green
1|618.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|0|5|Turnover by D. Green (out of bounds lost ball)
1|608.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|2|5|P. Patterson makes 2-pt layup from 2 ft (assist by S. Adams)
1|608.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|2|5|Shooting foul by D. Green (drawn by P. Patterson)
1|608.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|3|5|P. Patterson makes free throw 1 of 1
1|598.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|3|7|D. Jones makes 2-pt dunk from 1 ft (assist by D. Green)
1|581.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|3|7|P. Patterson misses 2-pt hook shot from 8 ft
1|580.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|3|7|Offensive rebound by P. Patterson
1|580.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|3|7|Shooting foul by K. Thompson (drawn by P. Patterson)
1|580.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|P. Patterson makes free throw 1 of 2
1|580.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|P. Patterson misses free throw 2 of 2
1|580.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|Defensive rebound by D. Green
1|569.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|D. Green misses 3-pt jump shot from 28 ft
1|567.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|Defensive rebound by D. Schröder
1|552.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|P. Patterson misses 2-pt jump shot from 16 ft
1|551.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|Defensive rebound by S. Curry
1|547.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|Turnover by S. Curry (bad pass; steal by P. George)
1|542.00|OKLAHOMA_CITY_THUNDER|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|7|Turnover by S. Adams (bad pass; steal by K. Durant)
1|533.00|GOLDEN_STATE_WARRIORS|OKLAHOMA_CITY_THUNDER|GOLDEN_STATE_WARRIORS|4|10|K. Thompson makes 3-pt jump shot from 26 ft (assist by D. Green)
Part II
Create a print_nba_game_stats(team_dict) function which will create a dictionary with name and players_data. The function will print with the following format (each column is separated by a tabulation (' ')):

HEADER
FOR PLAYER IN PLAYERS
PLAYER
TOTAL
Example 00

Players FG FGA FG% 3P 3PA 3P% FT FTA FT% ORB DRB TRB AST STL BLK TOV PF PTS
Player00 XX XX .XXX X XX .XXX XX XX .XXX XX XX XX XX X X XX XX XX
Totals XX XX .XXX X XX .XXX XX XX .XXX XX XX XX XX X X XX XX XX
Example 01

Players FG FGA FG% 3P 3PA 3P% FT FTA FT% ORB DRB TRB AST STL BLK TOV PF PTS
Kevin Durant 9 21 .429 0 5 .000 9 10 .900 1 7 8 6 1 1 3 4 27
Stephen Curry 11 20 .550 5 9 .556 5 5 1.000 0 8 8 9 1 0 3 4 32
Klay Thompson 5 20 .250 1 8 .125 3 3 1.000 1 3 4 0 0 0 2 3 14
Draymond Green 1 6 .167 0 1 .000 0 0 1 12 13 5 3 0 6 3 2
Damian Jones 6 7 .857 0 0 0 0 2 1 3 2 0 3 2 4 12
Kevon Looney 5 11 .455 0 0 0 0 8 2 10 2 1 2 1 4 10
Shaun Livingston 3 5 .600 0 0 0 0 2 1 3 1 1 0 1 2 6
Quinn Cook 1 2 .500 1 1 1.000 0 0 1 1 2 1 0 0 2 2 3
Andre Iguodala 1 2 .500 0 1 .000 0 0 0 2 2 2 0 0 0 0 2
Jordan Bell 0 0 0 0 0 0 1 1 2 0 0 1 0 1 0
Jonas Jerebko 0 0 0 0 0 0 0 3 3 0 0 0 1 2 0 0
Alfonzo McKinnie 0 1 .000 0 1 .000 0 0 0 0 0 0 0 0 0 0 0
Team Totals 42 95 .442 7 26 .269 17 18 .944 17 41 58 28 7 7 21 29 108
Tips What abbreviations like TRB means?

As data scientist, immersion inside your dataset is key and I think you can easily google it :-)

Example data files:

Warriors vs Thunders (16/10/2018)

Blazers vs Lakers (18/10/2018)

=================
Season 02 DS Project 6: My Mr Clean
=================

My Mr Clean
Submit directory .
Submit file my_mr_clean.ipynb
Description

Introduction
It is time to get our hands dirty and to manipulate some real world data. You have been hired by a new company named EncyclEarthpedia and your first task it build a search engine. EncyclEarthpedia is an online encyclopedia but specialized in the planet Earth, its geology, biology, and everything related to the Earth.

The search engine should be simple at first. The user needs to be able to type some words and the engine returns the most relevant articles.

There is a problem though. The engineers working on the database messed up and EncyclEarthpedia's database and API are not available for a week. This is a bummer ! If we can't have access to the articles, how are we going to build our engine ?

Instead of waiting for a week, we are going to build a simple model for some similar article from Wikipedia.

What we are going to do is:

Get some article from Wikipedia to work with.
Extract meaningful and usable content from this article.
Clean up and filter the data to narrow the scope to relevant words
Build a simple frequency model.
Analysing the article based on this model.
This first work of this article would be the start of our search engine, using some notion from Information Retrieval and tf-idf statistic.

Getting the data
We are going to work with an article about the Ozone Layer.

First things first: Let's get the content of this article into code variables.

→ Use Wikipedia's API to retrieve the content of the article

Create a function get_content(article_name) to retrieve information about an article.

→ Using pip install wikipedia and import wikipedia is strictly forbidden!

Printing your result, you should see something similiar to:

data = get_content("Ozone_layer")
print(data)

{'batchcomplete': True,
'query': {'normalized': [{'fromencoded': False,
'from': 'Ozone_layer',
'to': 'Ozone layer'}],
'pages': [{'pageid': 22834,
'ns': 0,
'title': 'Ozone layer',
'revisions': [{'slots': {'main': {'contentmodel': 'wikitext',
'contentformat': 'text/x-wiki',
'content': '{{pp-semi-indef}}
{{short description|Region of Earths stratosphere that absorbs most of the Suns ultraviolet radiation}}
[[File:Ozone cycle.svg|thumb|upright=1.5|[[Ozone-oxygen cycle]] in the ozone layer.]]

The ozone layer or ozone shield is a region of [[Earth]]s [[stratosphere]] that absorbs most of the [[Sun]]s [[ultraviolet]] radiation. It contains a high concentration of [[ozone]] (O<sub>3</sub>) in relation to other parts of the atmosphere, although still small in relation to other gases in the stratosphere. The ozone layer contains less than 10 parts per million of ozone, while the average ozone concentration in Earths atmosphere as a whole is about 0.3 parts per million. The ozone layer is mainly found in the lower portion of the stratosphere, from approximately {{convert|15|to|35|km|sp=us}} above Earth, although its thickness varies seasonally and geographically.<ref>{{cite web|url=http://www.ozonelayer.noaa.gov/science/basics.htm|title=Ozone Basics|website=NOAA|date=2008-03-20|access-date=2007-01-29|archive-url=https://web.archive.org/web/20171121051325/http://www.ozonelayer.noaa.gov/science/basics.htm|archive-date=2017-11-21|url-status=dead}}</ref>

The ozone layer was discovered in 1913 by the French physicists [[Charles Fabry]] and [[Henri Buisson]]. Measurements of the sun showed that the radiation sent out from its surface and reaching the ground on Earth is usually consistent with the spectrum of a [[black body]] with a temperature in the range of 5,500–6,000 K (5,227 to 5,727&nbsp;°C), except that there was no radiation below a wavelength of about 310&nbsp;nm at the ultraviolet end of the spectrum. It was deduced that the missing radiation was being absorbed by something in the atmosphere.
Cleaning
As you may have notice, the answer from the API is not very user-friendly. It is a big json objects with many keys and values that are not really relevant for us. What we really want to work with is the actual 'content' of the article. But what do we mean by "content" ? Are the titles or the table of contents useful? (yes). Are the hidden URL relevant to us?

Only the actual content interests us so we need somehow to remove all the flourish like markups, the urls, and any useless words or characters.

→ First merge and store all the meaningful contents from the big json into a handy variable. Any kind of data structure can be used. A simple list would do the trick though

def merge_contents(data):
...

merge_content = merge_contents(data)

Tokenization
Now that we retrieve all the contents in one place, it is time to dissect our data and build a list of all the words.

Usually a word is delimited by a space or a new line. With this rule, "Ozone-oxygen" is a word. But it means that "Ozone", "Oxygen", and "Ozone-oxygen" are three different words. Yet, if the end user type "Ozone" or "Ozone-oxygen" in the search bar, the same results should appear for both searchs! Personally, I think "Ozone-oxygen" should be broken into two words. But you might have another opinion!

→ Create a list of the "splitter" char. For example, if you think words should be delimited by spaces and new lines, your list is [" ", "\n"].

Now that you defined the words delimiters, let's tokenize our content.

→ Traverse your brand new data structure and tokenize the words: Create a list of all the words.

def tokenize(content):
...

collection = tokenize(merge_content)
Because we do not make any difference between Ozone or ozone or OZONE, a good idea is to have all words in lower case.

→ Update the collection of words for them to be only lower case.

def lower_collection(collection):
...

lower_collection(collection)

Term Frequency
From here, let's step back a little bit and recall what is our objectives. A search engine should find relevant articles based on words in a search bar. In this project we will build a simple frequency model. In other words, given a word, we need to find the articles in which this word is the most frequent. Let's build a frequency model.

→ Write a function to count the number of occurrences of each word in the collection.

→ What are the most frequent words? Write a function to print the n most frequent words along with their frenquency.

def count_frequency(collection):
...

def print_most_frequent(frequencies, n):
...

frequencies = count_frequency(collection)

print_most_frequent(frequencies, 10)

Visualizing
Printing the most frequent words is a good way to get a feel of the words distribution, but is not very telling.

→ Visualize the 20 most frequent words by plotting them in a histogram.

Here is the visualization of the most frequent words from the introduction of the article:

Filtering
But all the words are not equal. Some words have less importance than others. As we can see on the graph, determiners and articles do not really help understanding the topic of an article or a corpus. In the 10 most frequent words from the introduction, we see that only 2 of them are really useful to classify the article: "ozone" and "layer".

These "unsignificant" little words are called stop words.

→ Create a list of stop words to remove from the list of words.

stop_words = [ "the", "a", "of", "to", "in", "about" ... ]
→ Write a function 'remove_stop_words' that takes as parameters a list of tokens, removes the empty words provided this list and returns the new list resulting from this filtering.

def remove_stop_words(words, stop_words):
...

filtered_collection = remove_stop_words(collection, stop_words)

→ Visualize now in a historgram the 25 most frequent words in the filtered collection.

The most frequent words should be more relevant to match this Ozone layer article content. If the user's search is made of the words "Ozone" and "gas", we can vectorize articles and represent them with a vector of size 2. The coefficient of the vectorized article would be the frequencies of the words from the search. By vectorizing all articles this way, we can build some kind of distance between articles. Another data engineering technique we could have had explored is stemming to get even more insight about the article.

Here ends our little journey into data exploration and information retrieval. If the database engineers of our team are ready, we can use some of the techniques we have seen to build up a small proff of concept!

=================
Season 02 DS Project 7: My Allocine Ds
=================

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

=================
Season 02 Project 8: My Open The Iris
=================

My Open The Iris
Submit directory .
Submit file my_open_the_iris.ipynb
Description

Open the iris!

A common mistake businesses make is to assume machine learning is magic, so it's okay to skip thinking about what it means to do the task well.

Introduction
Time do to an end-to-end project in data science. which means:

Loading the dataset.
Summarizing the dataset.
Visualizing the dataset.
Evaluating some algorithms.
Making some predictions.
A must-see example of data science is the iris dataset. We will predict which class of iris plant a plant belongs to based on its characteristics.

Iris versicolor - Iris setosa - Iris virginica

Where to get started?
Environment. We will use Jupyter.

In Data Science, the winning combo is pandas (and/or numpy), matplotlib, sklearn (and/or keras). In this project, we will use:

pandas to load the data
matplotlib to do the visualization
sklearn to do the prediction
Load dataset
url = "URL"
dataset = read_csv(url)
Summarizing the dataset
A - Printing dataset dimension

print(dataset.shape)

# should something like: (150, 5)

B - It is also always a good idea to eyeball your data.

print(dataset.head(20))
C - Statistical Summary The statistical summary includes the count, mean, the min and max values, and some percentiles.

print(dataset.describe())
D - Class Distribution Group by to see how our data are distributed.

print(dataset.groupby('class').size())
Visualization
After having a basic idea about our dataset, we need to extend it with some visualizations.

For this dataset, we will focus on two types of plots:

Univariate plots to better understand each attribute.
Multivariate plots to better understand the relationships between attributes.
A - Univariate

from pandas import read_csv
from matplotlib import pyplot

dataset.hist()
pyplot.show()

It looks like perhaps two of the input variables have a Gaussian distribution. This is useful to note as we can use algorithms that can exploit this assumption.

B - Multivariate

from pandas import read_csv
from pandas.plotting import scatter_matrix
from matplotlib import pyplot

scatter_matrix(dataset)
pyplot.show()

We can note the diagonal grouping of some pairs of attributes. It suggests a high correlation and a predictable relationship. :-)

Building our code to evaluate some algorithms
it is time to create some data models and estimate their accuracy.

Here is what we are going to cover in this step:

Separate a validation dataset.

array = dataset.values
X = array[:,0:4]
y = array[:,4]
X_train, X_validation, Y_train, Y_validation = train_test_split(X, y, test_size=0.20, random_state=1)
Experiment!
Build multiple different models from different algorithms.

# DecisionTree

model = DecisionTreeClassifier()

# GaussianNB

model = GaussianNB()

# KNeighbors

model = KNeighborsClassifier()

# LogisticRegression

model = LogisticRegression(solver='liblinear', multi_class='ovr')

# LinearDiscriminant

model = LinearDiscriminantAnalysis()

# SVM

model = SVC(gamma='auto')
How to run the model?

cv_results = cross_val_score(model, X_train, Y_train, cv=kfold, scoring='accuracy')
Improving

Improving your data and your model is an iterative process, and you will have to loop through this process repeatedly.

Now it's time to do it!

Technical specifications
You will create an end-to-end analysis of the dataset.

Part I Load data
Create a function load_dataset(). It doesn't take any parameter. You will load the dataset and returns it.

Part II Summarizing the dataset
Summarizing the dataset: Create a function summarize_dataset(dataset), it will print (in this order):

its shape
its ten first lines
its statistical summary
Its distribution
Example:

Dataset dimension:
(37, 5)

First 10 rows of dataset:
sepal-length sepal-width petal-length petal-width class
0 5.1 3.5 1.4 0.2 Iris-setosa
1 4.9 3.0 1.4 0.2 Iris-setosa
2 4.7 3.2 1.3 0.2 Iris-setosa
3 4.6 3.1 1.5 0.2 Iris-setosa
4 5.0 3.6 1.4 0.2 Iris-setosa
5 5.4 3.9 1.7 0.4 Iris-setosa
6 4.6 3.4 1.4 0.3 Iris-setosa
7 5.0 3.4 1.5 0.2 Iris-setosa
8 4.4 2.9 1.4 0.2 Iris-setosa
9 4.9 3.1 1.5 0.1 Iris-setosa

Statistical summary:
sepal-length sepal-width petal-length petal-width
count 12.000000 12.000000 12.000000 12.000000
mean 5.843333 3.054000 3.758667 1.198667
std 0.828066 0.433594 1.764420 0.763161
min 4.300000 2.000000 1.000000 0.100000
25 5.100000 2.800000 1.600000 0.300000
50 5.800000 3.000000 4.350000 1.300000
75 6.400000 3.300000 5.100000 1.800000
max 7.900000 4.400000 6.900000 2.500000

Class Distribution:
class
Iris-setosa 12
Iris-versicolor 12
Iris-virginica 13
dtype: int64
Part III
Create two functions print_plot_univariate(dataset) and print_plot_multivariate(dataset). Each function will setup and show its corresponding plot.

Part IV
Create a function my_print_and_test_models(dataset), it will (in this order) DecisionTree, GaussianNB, KNeighbors, LogisticRegression, LinearDiscriminant, and SVM

Remember to split your dataset in two: train and validation.

Following this format:

# print('PERCENTs: PERCENTf (PERCENTf)' PERCENT (model_name, cv_results.mean(), cv_results.std()))

DecisionTree: 0.927191 (0.043263)
GaussianNB: 0.928858 (0.052113)
KNeighbors: 0.937191 (0.056322)
LogisticRegression: 0.920897 (0.043263)
LinearDiscriminant: 0.923974 (0.040110)
SVM: 0.973972 (0.032083)
Iris Dataset
Iris Dataset

Gandalf will not accept any pip install XXXX inside your file.

=================
Season 02 DS Project 9: My Ds Babel
=================

My Ds Babel
Submit directory .
Submit files my_ds_babel.py - list_volcano.db - list_fault_lines.csv
Description
Data is the heart of an information system. Converting data from a format to another or migrating them to another database is a critical skill.

It would be great if every information system could speak the same language.

Tower of Babel Your mission will be to help translate from one format to another.
We will work with two popular formats: SQL and CSV.

What is SQL?
It stands for Structured Query Language. It helps you perform queries in a database. The query will have the format of:

SELECT (GET)
INSERT
UPDATE
DELETE
It has a specific syntax:

SELECT \* FROM table;
INSERT INTO table_name(id, name) VALUES(1, 'Pacific Ocean');
UPDATE ...
DELETE ...
How to connect to an SQLite database?
Good question. Google might have an answer. :-)

What is CSV?
It stands for Comma Separated Values There are files with multiple lines and columns. Divider are , (comma) and new-line (\n)

id,name
1,Pacific Ocean
2,Atlantic Ocean
3,Indian Ocean
4,Arctic Ocean
5,Southern Ocean
Interesting fact: the Southern Ocean was recognized by the International Hydrographic Organization in 2000. It borders Antarctica in its entirety. wiki link

Example in ruby:

require "sqlite3"
require 'csv'

db = SQLite3::Database.new "volcanos.db"

# Create a database

rows = db.execute <<-SQL
create table volcanos (
volcano_name varchar(100),
latitude int,
.... OTHER FIELDS
);
SQL

csv = File.read('list_volcano.csv')

CSV.parse(csv, headers: true) do |row|
db.execute "insert into volcanos values ( ?, ?, ?, ?, ?, ? )", row.fields
end

p db.execute( "select \* from volcanos" )
Part I SQLtoCSV. We will start with the SQL format to CSV

Your function will receives a connection (an sqlite3 object from import sqlite3 which will be already connected), table_name. Your function will transform the content of table_name to CSV format and return it. (Columns separated by comma and rows separated by \n)

Part II CSVtoSQL Your function will transform the content to SQL format by creating the table_name and adding each row.

Part III a) You will use your function to convert the list of all volcanos from CSV to SQL.

b) You will use your function to convert the list of all fault lines from SQL to CSV. Data are inside the table named: fault_lines.

Technical specifications
Write two functions:

def sql_to_csv(database, table_name):
def csv_to_sql(csv_content, database, table_name):
1# sql_to_csv will receive two strings as parameters and return a string. the database is a filename where sql_to_csv will fetch the information. table_name is the table from the database file to fetch the information. your return value will be a CSV formatted string: "ColA,ColB,ColC\n1,2,3\n4,5,6\n"

2# csv_to_sql will receive three strings as parameters and return nothing. csv_content is a StringIO following the CSV format. the database is a filename where csv_to_sql will push the information. table_name is the table from the database file to insert the data.

DoYourJob libraries are not authorized. We won't list all of them. If you are not doing the sql request by yourself then you are using a "doyourjob library". An example is: sqlalchemy

Example:

print(sql_to_csv('sourse_all_fault_line.db','fault_lines'))

csv_content = open("sourse_list_volcano.csv")
csv_to_sql(csv_content, 'list_volcanos.db','volcanos')
Tip Google: Python sqlite3 Google: Python CSV Google: Python Class Google: SQL Format SELECT Google: create sqlite table Google: SQL Format INSERT

=================
Season 02 DS Project 10: My First Scraper Ds
=================

My First Scraper Ds
Submit directory .
Submit file my_first_scraper.py
Description
Introduction

HTML has been built to be "displayed". It's working very well... but when you want to build a script to collect actionable data, you are left with this:

Google search page engine HTML Euuh... I just wanted to collect all the links on the page...

It’s likely that there are libraries to navigate through the jungle. Let's scrap some Data!

Technical specifications
Static url to scrape = 'https://storage.googleapis.com/qwasar-public/track-ds/trending_14_06_2022'

Using python libraries requests and beautifulsoup4, return a CSV of the TOP 25 trending repositories from Github.

Request (with request)
Extract (with beautifulsoup4)
Transform
Format

Github trending's page

Part 0: Request Write a function prototyped: def request_github_trending(url) it will return the result of Request.

Part 1: Extract Write a function prototyped: def extract(page) to find_all instances of HTML code of repository rows and return it. You should use BeautifulSoup. :-)

Part 2: Transform Write a function prototyped: def transform(html_repos) taking an array of all the instances of HTML code of the repository row. It will return an array of hash following this format: [{'developer': NAME, 'repository_name': REPOS_NAME, 'nbr_stars': NBR_STARS}, ...]

Part 3: Format Write a function prototyped: def format(repositories_data) taking a repository array of hash and transforming it and returning it into a CSV string. Each column will be separated by , and each line by \n The columns will be Developer,Repository Name,Number of Stars

Tip Google: Request get python Google: BeautifulSoup python

=================
Season 02 DS Project 11: My Tu Verras
=================

My Tu Verras
Submit directory .
Submit file my_tu_verras.ipynb
Description

Description
House price is a recurring subject nowadays. In this project, you will build a model to predict the price base on predefined criteria.

We are providing a dataset, the Boston housing prices.

This project is divided into two parts: 1# Understand the data 2# Build a linear regression prediction model.

First Glance
Let's get down to the brass task.

From a quick look, we know what is inside our dataset, like the different attributes:

• CRIM per capita crime rate by town • ZN proportion of residential land zoned for lots over 25,000 sq.ft. • INDUS proportion of non-retail business acres per town • CHAS Charles River dummy variable (= 1 if tract bounds river; 0 otherwise) • NOX nitric oxides concentration (parts per 10 million) • RM average number of rooms per dwelling • AGE proportion of owner-occupied units built before 1940 • DIS weighted distances to five Boston employment centers • RAD index of accessibility to radial highways • TAX full-value property-tax rate per $10,000 • PTRATIO pupil-teacher ratio by town • B 1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town • LSTAT PERCENT lower status of the population • MEDV Median value of owner-occupied homes is $ 1000's

Now that we loaded the data let's peek at it.

→ Load the data in a data frame and print the first rows.

def load_dataset():
...

boston_dataframe = load_dataset()

def print_summarize_dataset(dataset):
print("Dataset dimension:")
print(XXXXXXXX)
print("
First 10 rows of dataset:")
print(XXXXXXXX)
print("
Statistical summary:")
print(XXXXXXXX)

print_summarize_dataset(dataset)
hint: Panda is cool.

We should see something similar to:

Now that we have loaded the data frame, it is easier to see and investigate the data. Play around a bit and print some more values. The data frame table is excellent but is hard to read. Can you tell from it what attributes have the most influence on the MEDV target?

From a quick sneak peek, we feel the MEDV decreases as the AGE increases. The correlation between MEDV and AGE is just a supposition, and we will try to corroborate it. Do you see any other relationship between attributes?

Cleaning and Pre-processing
Just like we did with Mr Clean, cleaning is one of the first steps after receiving a dataset to explore. Here the dataset was made to be very clean, but just to be sure, let's look for any missing values.

→ Make a function that cleans the dataset from lines which any missing values.

def clean_dataset(boston_dataframe):
...
After this function, we should have zero missing values in the dataset.

Data Analysis
Now we are ready to cut to the chase. We will see if our supposition was correct by visualizing the data.

Visualization is critical to understanding the relationship between the target and the other features.

A great way to get a feel of the data we are dealing with is to plot each attribute in a histogram.

→ Plot each attribute in a histogram.

Hint: You can use matplotlib, panda, seaborn or any other libraries.

Here is the result for some of the attributes:

→ Make a function that prints all the histograms.

def print_histograms(boston_dataframe):
...
Looking for correlations
So far, we have only taken a quick peek to get a general understanding of the kind of data we are manipulating. Now the goal will be to investigate deeper again.

The size of our dataset is not too large, so we can try to analyze linear correlations between every pair of attributes.

→ Write a function compute_correlations_matrix to compute Pearson's correlations between every pair of attributes.

The output of compute_correlation should be a dictionary. For example, print(correlations['MEDV']) should show the different correlation coefficients between the median value and other attributes.

def compute_correlations_matrix(boston_dataframe):
...

correlations = compute_correlations(boston_dataframe)

print(correlations['MEDV'])

When the coefficient is close to 1 (in absolute value), there is a strong correlation between the two variables. If it is positive, it means the linear correction is positive. If it is negative... you get it. Coefficients close to zero mean there is no linear correlation between the attributes.

→ What is the correlation coefficient between the median value and the number of rooms?

This coefficient is positive and is the biggest. It means that the median value increases when the number of rooms increases. Well, that makes sense; we expect a house with many rooms to be more expensive than a single-room apartment.

→ Analyse the correlations between the median value and the other attributes. Which attribute is the most negatively correlated with the median value? Does it make sense to you?

Mathematically, all this information can be seen in an object, the covariance matrix. The covariance matrix tells us a lot about our data's relationship and distribution. For example, it can be used in Principal Component Analysis to try and understand the most useful and relevant dimensions. But that's for another day.

Numbers are cool, but we, as human beings, love colors, pictures, and visual representations. We can easily spot correlations by visualizing the relationship between attributes on graphs.

→ Plot every attribute against each other.

hint: Visualizing every component against each other is usually done with a scatter matrix.

Here is an example:

Instead of representing straight lines, the main diagonal displays a histogram of the attributes.

→ Make a function that prints the scatter matrix.

def print_scatter_matrix(boston_dataframe):
...
Since the most linearly correlated feature is the average number of rooms, let's focus on the plot of MEDV as a function of RM.

→ Plot MEDV in function of RM

We should see what the numbers told us before. We clearly see an upward trend. A strong positive linear correlation exists between the number of rooms and the median value. Ok, now let's explore the influence of other attributes.

→ Plot the correlation scatter plot of the median value against LSTAT, AGE, and CRIME.

→ What can you observe? What can you say?.

→ Does the age seems to have any influence on the MEDV?

Well, not so fast! the MEDV / AGE scatterplot does not show an apparent correlation between these attributes. But we can see that the LSTAT feature DOES influence MEDV. The more LSTAT increases, the lower the MEDV value. We can see another correlation to be between LSTAT and MEDV. It is valuable information itself. Can we not go further?

Let's step back a minute. If LSAT influences MEDV, it means that if another attribute affects LSTAT itself, it actually circles back to influence MEDV!

→ Plot the scatter matrix or print the correlation coefficients for LSTAT. What are the attributes which are the most linearly correlated with LSAT?

Here is an example, LSTAT against AGE:

Again, we clearly see a trend here. Points are not too dispersed and have an upward trend. LSAT seems to be positively linearly correlated with AGE. So, all in all, AGE seems to influence (negatively) the median value. We could already observe this result on the graph of MEDV / AGE. Varying AGE cascades down (or back-propagates) to make MEDV varies.

You can go on experimenting with trying and finding more relationships between attributes to understand more deeply how they influence de MEDV target values.

Prediction
After exploring the data and gaining more insights, the next step is to do another round of data cleaning and find a model to predict the MEDV.

We are going to use a linear regression algorithm from sklearn.

from sklearn.linear_model import LinearRegression
→ Make a function that return a Fitted Estimator.

import sklearn

def boston_fit_model(boston_dataframe):

# SELECT two columns from our

model_dataset = boston_dataframe[["RM","MDEV"]]
regressor = sklearn.linear_model.LinearRegression()

# Extract column 1

x = model_dataset.iloc[:, :-1].values

# Extract column 2

y = model_dataset.iloc[:, 1].values

# Train the model

regressor.fit(x, y)
return regressor
→ Make a second function that will receive the Fitted Estimator and return a prediction.

# predict?

def boston_predict(estimator, array_to_predict):
...
data = [1, 2, 3]
estimator = boston_fit_model(dataset)
print(boston_predict(estimator, data))
Technical Description
You will have to implement multiple functions:

load_dataset()

# Analysis

print_summarize_dataset(dataset)
clean_dataset(dataset)
print_histograms(dataset)
compute_correlations_matrix(dataset)
print_scatter_matrix()

# Prediction

boston_fit_model(dataset)
boston_predict(estimator)
Gandalf will not accept any pip install XXXX inside your file.

Additional resources We like to print the evaluation prediction with this function:

def print_model_prediction_evaluator(base_test, prediction):
print('Mean Absolute Error:', metrics.mean_absolute_error(base_test, prediction))
print('Mean Squared Error:', metrics.mean_squared_error(base_test, prediction))
print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(base_test, prediction)))

=================
Season 02 DS Project 12: My M And A
=================

My M And A
Submit directory .
Submit files my_m_and_a.py - my_ds_babel.py
Description
You've worked as a Junior Data Engineer at Plastic Free Boutique for three months.

Your first mission was to build a strong, robust, and scalable customers database for the exponential growth the company will soon have. Your manager is delighted.

We've just acquired a new company, Only Wood Box, which will be a perfect solution for our packaging department. They are experts in making wood packages at a competitive, light, and cheap price.

Expert in their technology, they didn't believe in the digital world. Despite the decent number of customers, they didn't have to invest in their infrastructure. Before quitting, their engineer told us that at least we had stored all the information; I don't understand what he meant.

You should use import pandas as pd

Your mission will be to merge their three customers (yes 3 :D) table into ours.

Table 1

Table 2

Table 3

Technical description
Our database schema:

"gender" - 'string'
"firstname" - 'string'
"Lastname" - 'string'
"email" - 'string'
"age" - 'string'
"city" - 'string'
"country" - 'string'
"created_at" - 'string'
"referral" - 'string'
1# Your function will be called my_m_and_a and receive the 3 CSV content. 2# Import your function from my_ds_babel to save the CSV's content into SQL.

VERY IMPORTANT
We want to move on after this merge & acquisition; we don't want to keep their .csv; if they are seen in your repository during your 1-1 meeting (Peer Review), it will be considered a fail for this project.

Example00

merged_csv = my_m_and_a(content_database_1, content_database_2, content_database_3)
my_ds_babel.csv_to_sql(merged_csv, 'plastic_free_boutique.sql', 'customers')
Tip Google: .gitignore file :-)

=================
Season 02 DS Project 13: My Linear Regression
=================

My Linear Regression
Submit directory .
Submit file my_linear_regression
Description
Subject
Getting and analysing existing data is the very first task of a data scientist. The next step is to find tendencies and to generalize.

For example, let's say we want to know what a cat is. We can learn by heart some pictures of cats and then classify as cat animals that are similar to the pictures. We then need a way to "measure" similarity. This is called instance-based learning.

Another way of generalizing is by creating a model from the existing examples and make prediction based on that model.

For instance, let's say we want to analyze the relation between two attributes and plot one against the other:

We clearly see a trend here, eventhough the data is quite noisy, it looks like the feature 2 goes up linearly as the feature 1 increases. So in a model selection step, we can decide to go for a linear model.

feature_2 = θ0 + θ1 . feature_1

This model has two parameters, θ0 and θ1. After choosing the right values for them, we can make our model represent a linear function matching the data:

Everything stands in "choosing the right values". The "right values" are those for which our model performs "best". We then need to define a performance measure (how well the model performs) or a cost function (how bad the model performs).

These kind of problems and models are called Linear Regression. The goal of this journey is to explore linear and logistic regressions.

Introduction
A linear model makes predictions by computing a weighted sum of the features (plus a constant term called the bias term):

y = hθ(x) = θT·x = θnxn + ... + θ2x2 + θ1x1 + θ0

• y is the predicted value. • n is the number of features. • xi is the ith feature value (with x0 always equals to 1). • θj is the jth model feature weight (including the bias term θ0). • · is the dot product. • hθ is called the hypothesis function indexed by θ.

→ Write the linear hypothesis function.

def h(x, theta):
...
Now that we have our linear regression model, we need to define a cost function to train it, i.e measure how well the model performs and fits the data. One of the most commonly used function is the Root Mean Squared Error (RMSE). As it is a cost function, we will need to optimize it and find the value of theta which minimizes it.

Since the sqrt function is monotonous and increasing, we can minimize the square of RMSE, the Mean Square Error (MSE) and it will lead to the same result.

m MSE(X, hθ) = 1⁄m ∑ (θT·x(i) - y(i))2          k=1

• X is a matrix which contains all the feature values. There is one row per instance. • m is the number of instances. • xi is the feature values vector of the ith instance • yi is the label (desired value) of the ith instance.

→ Write the Mean Squared Error function between the predicted values and the labels.

def mean_squared_error(y_predicted, y_label):
...
Now our goal is to minimize this MSE function.

Closed-Form Solution
To find the value of θ that minimizes the cost function, we can differentiate the MSE with respect to θ. It directly gives us the correct θ in what we called the Normal Equation:

θ = (XT·X)-1·XT·y

(NB: This requires XTX to be inversible).

→ Write a class LeastSquareRegression to calculate the θ feature weights and make predictions.

hint Checkout Numpy's linear algebra module

class LeastSquaresRegression():
def **init**(self,):
self.theta\_ = None

    def fit(self, X, y):
        # Calculates theta that minimizes the MSE and updates self.theta_


    def predict(self, X):
        # Make predictions for data X, i.e output y = h(X) (See equation in Introduction)

Let's now use this class on data we are going to generate. Here is some code to generate some random points.

import numpy as np
import matplotlib.pyplot as plt

X = 4 _ np.random.rand(100, 1)
y = 10 + 2 _ X + np.random.randn(100, 1)
→ Plot these points to get a feel of the distribution.

As you can see, these points are generated in a linear way with some Gaussian noise. Before calculating our weights, we will account for the bias term (x0 = 1).

→ Write a function which adds one to each instance

def bias_column(X):
...

X_new = bias_column(x)

print(X[:5])
print(" ---- ")
print(X_new[:5])
You should see something similar to:

[[0.91340515]
 [0.14765626]
 [3.75646273]
 [2.23004972]
 [1.94209257]]

---

[[1.         0.91340515]
 [1.         0.14765626]
 [1.         3.75646273]
 [1.         2.23004972]
 [1.         1.94209257]]

→ Calculate the weights with the LeastSquaresRegression class

model = LeastSquaresRegression()
model.fit(X_new, y)

print(model.theta\_)
→ Are the values consistent with the generating equation (i.e 10 and 2) ?

Let's see what our model predicts !

→ Use your model to predict values from X and plot the two set of points superimposed.

y_new = model.predict(X_new)

def my_plot(X, y, y_new):
...

my_plot(X, y, y_new)

You should see something similar to the pictures in the subject introduction.

→ What is the computational complexity of this method? → How does the training complexity compare to the predictions complexity?

Gradient Descent
Reminder about Gradient Descent
As you may have noticed, our MSE cost function is a convex function. This means that to find the minimum, a strategy based on a gradient descent will always lead us to a global optimum. Remember that the gradient descent moves toward the direction of the steepest slope.

We will write a class to perform the gradient descent optimization.

class GradientDescentOptimizer():

    def __init__(self, f, fprime, start, learning_rate = 0.1):
        self.f_      = f                       # The function
        self.fprime_ = fprime                  # The gradient of f
        self.current_ = start                  # The current point being evaluated
        self.learning_rate_ = learning_rate    # Does this need a comment ?

        # Save history as attributes
        self.history_ = [start]

    def step(self):
        # Take a gradient descent step
        # 1. Compute the new value and update selt.current_
        # 2. Append the new value to history
        # Does not return anything


    def optimize(self, iterations = 100):
        # Use the gradient descent to get closer to the minimum:
        # For each iteration, take a gradient step

    def getCurrentValue():
      # Getter for current_

    def print_result(self):
        print("Best theta found is " + str(self.current_))
        print("Value of f at this theta: f(theta) = " + str(self.f_(self.current_)))
        print("Value of f prime at this theta: f'(theta) = " + str(self.fprime_(self.current_)))

Let's use this optimizer with a simple function: f(x) = 3 + (x - (2 6)T)T · (x - (2 6)T). The input of f is a vector of size 2.

→ Write the f function

def f(x):
...
→ Write the fprime function

def fprime(x):
...
→ Use the the gradient descent optimizer to try to find the best theta value

grad = GradientDescentOptimizer(f, fprime, np.random.normal(size=(2,)), 0.1)
grad.optimize(10)
grad.print_result()
Don't hesitate to tweak the hyper parameters (the learning rate and the number of iterations).

→ Plot the function f in 3D

→ Plot the progression of the gradient by using the history variable inside the class

We should clearly see the gradient moving toward the cavity of the function f !

→ How does the learning rate and the number of iterations influence the result ?

→ How to tune hyperparameters and choose a good learning rate?

→ What about the number of iterations? What is the Convergence Rate?

The batch gradient descent is good but suffers from a huge difficulty: it uses the whole training data set, which can be computationally and memory expensive. The time to train a model can be very long, Thus, a lot of variants of the implementation of the gradient descent exists to try to increase its efficiency. For example, a more light weight strategy is the Stochastic Gradient Descent.

Technical Description
You will have to implement multiple functions and 2 classes:

Functions

- def h(x, theta)
  Write the linear hypothesis function. (see above)

- def mean_squared_error(y_pred, y_label)
  Write the Mean Squared Error function between the predicted values and the labels.

- def bias_column(x)
  Write a function which adds one to each instance.

X_new = bias_column(x)

print(X[:5])
print(" ---- ")
print(X_new[:5])

You should see something similar to:

[[0.91340515]
 [0.14765626]
 [3.75646273]
 [2.23004972]
 [1.94209257]]

---

[[1.         0.91340515]
 [1.         0.14765626]
 [1.         3.75646273]
 [1.         2.23004972]
 [1.         1.94209257]]
Classes
class LeastSquaresRegression: (see description above)
def **init**(self, )
def fit()
def predict

class GradientDescentOptimizer: (see description above)
def **init**()
def step()
def optimize()
def getCurrentValue()

=================
Season 02 DS Project 14: My Convex Optimization
=================

My Convex Optimization
Submit directory .
Submit file my_convex_optimization
Description
Subject
One of the main challenges of Data Science and more specifically in Machine Learning is the performance measure. How to measure performance efficiently so that our model predictions meet the business objectives?

For example, let's pretend our goal is to classify fruits to know if a fruit is an apple, an orange, or something else, depending on some attributes (color, shape, weight...).

Intuitively, the measure of 'how far' is our model prediction from the correct answer tells us about the effectiveness of our algorithm. The farther is our prediction the worse is our performance. We can then define a cost function based on this 'distance'. We want to minimize this cost function in order to have the best prediction possible, i.e we want to find the point where the value of this cost function is the lowest.

Generally, minimizing a function is not an easy task. However, some functions are easier to optimize than others: Convex functions.

On the left, the function is said to be convex: it is beautifully round. On the contrary, the function on the right has a lot of valleys and bumps. The minimum of the convex function is much easier to reach: we just need to follow the slope ! With non convex function, following the slope would not work since reaching a cavity does not ensure that this cavity is the lowest one !

Finding the minimum of a convex function is called ... Convex Optimization ! You might have already heard about something called Gradient Descent before. This is an algorithm which does exactly that: following the slope to the cavity.

This project is meant to be an introduction to some convex optimization tools and to implement your own optimization algorithm.

Introduction
To get a feel with the problem, we are going to start with a simple function to optimize:

f(x) = (x - 1)^4 + x^2

Which translates in python to: f = lambda x : (x - 1)**4 + x**2

→ Plot this function to get a feel of what it looks like !

To find the minimum of our little f function, we are going to use its derivative f' (f prime). The zero of f prime (the point where it evaluates to zero) matches with the minimum of the f function.

Our goal is hence to find where f prime cancels out.

→ Write a simple dichotomous algorithm (bisection method) to find the zero of a function.

def find_root(f, a, b) should returns x such that f(x) = 0. Since computers only understand discrete value, we will have a precision of 0.001, i.e find x such that |f(x)| < 0.001 (|.| is the absolute value function).

If your dichotomous find_root function works well, you can try other root-finding algorithms like Newton-Raphson's or Muller's method (but they are many more).

Once you are done playing around with root-finding methods, we will use find_root to find the minimum of f. As explained above, the root of f', the derivative of f, is where f reaches its minimum.

→ Use find_root to find the root of f prime.

f' = 4\*(x - 1)^3 + 2x

To make sure the answer is correct, we will check it against Brent's method for optimization. Brent's method works as a combination of the secant method and parabola fittings.

import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import minimize_scalar

res = minimize_scalar(f, method='brent')
print('x_min: .02f, f(x_min): .02f' (res.x, res.fun))

# plot curve

x = np.linspace(res.x - 1, res.x + 1, 100)
y = [f(val) for val in x]
plt.plot(x, y, color='blue', label='f')

# plot optima

plt.scatter(res.x, res.fun, color='red', marker='x', label='Minimum')

plt.grid()
plt.legend(loc = 1)
You should see something similar to:

Gradient Descent Methods
Suppose you are lost at the top of a hill at night. You cannot see anything, you can only feel the ground beneath your feet. An intuitive way to reach the village downhill as fast as possible is to follow the steepest slope.

This is the idea behind the gradient descent. It measures the local gradient of the cost function and goes towards the direction of the descending gradient. Once the gradient cancels out, it means we reached a minimum.

xk + 1 = xk - α ∇f(xk)

where ∇f is the gradient of f and α is called the learning rate. This is how big you step towards the direction of the descending gradient.

In our one dimension example, the gradient of f is simply the derivative of f.

Here is an example in 3D:

→ How does the learning rate influence the efficiency of the algorithm? What happens if it is very small? What if it is very big?

→ Write a simple gradient descent function which finds the minimum of a function f

Similarly, we will stop our search with a precision of 0.001.

def gradient_descent(f, f_prime, start, learning_rate = 0.1)
...

f = lambda x : (x - 1) ** 4 + x ** 2
f_prime = lambda x : 4*((x-1)\*\*3) + 2*x
start = -1
x_min = gradient_descent(f, f_prime, start, 0.01)
f_min = f(x_min)

print("xmin: 0.2f, f(x_min): 0.2f" (x_min, f_min))

Is the result similar to the previous Brent's method?

Using the gradient_descent, you should find a value similar to the previous methods.

Gradient Descent methods are the workhorse of machine learning, from linear regression to deep neural nets. Here, we used it in a one dimension problem, but it can be used with any number of dimensions !

To go further
Adding linear constraints to a convex function does not change its convexity, it remains convex. What it does though is restricting the space of solutions by intersecting it with hyperplanes. If our convex function solution space is a spherical orange, applying linear constraints is like slicing the orange. It remains convex but sharper.

More specifically, let us consider the following linear problem with two variables:

maximize   z = x + 2y subject to       • 2x + y ≤ 10       • -4x + 5y ≤ 8       • x - 2y ≤ 3       • x, y ≥ 0

Which can be rewritten as:

maximize   z = cT·x subject to       • Ax ≤ b       • x ≥ 0

z is called the objective function, A a coefficients matrix, and b the non-negative constraints. The space defined by the constraints equations is called the feasible region. This is a convex polytope. It can be shown that so solutions which maximizes the objective function are located on the vertices of this polytope.

On the picture, we can visualize the feasible region in beige in the middle. The red line represents the function 2x +y = 10, the white one -4x +5y = 8 and blue one represents the function x - 2y = 3. The area inside the orange polytope is the intersection between all the constraints inequalities.

→ Initialize A, b, and c as numpy arrays

A = ...
b = ...
c = ...
Simplex algorithm
We are going to solve this linear problem with the Simplex method. The simplex algorithm is pretty straightforward: it moves from a vertex to another until it finds a solution which maximizes the objective function.

→ Solve the linear problem using simplex method

hint: You can use scipy's implementation of Simplex.

def solve_linear_problem(A, b, c):
...

optimal_value, optimal_arg = solve_linear_problem(A, b, c)

print("The optimal value is: ", optimal_value, " and is reached for x = ", optimal_arg)

→ Is the solution you found located on the edge of the polytope? Why?

hint: The idea is very similar to the Gauss' pivot

Technical Description
You will have to implement multiple functions:

- def print_a_function(f, values)
  It will plot the function with the values received as parameters.

- def find_root_bisection(f, min, max)
  It will return the zero of a function using simple dichotomous algorithm between min and max for the function f.

- def find_root_newton_raphson(f, f_deriv)
  It will return the zero of a function using the Newton-Raphson's method between min and max for the function f.

- def gradient_descent(f, f_prime, start, learning_rate = 0.1)
  Write a simple gradient descent function which finds the minimum of a function f

- def solve_linear_problem(A, b, c):
  Write a function solving the linear problem using simplex method. (see the first part to have more details)
  A = np.array([[2,1],[-4,5],[1,-2]])
  b = np.array([10,8,3])
  c = np.array([-1,-2])

=================
Season 02 DS Project 15: My Mobapp Studio
=================

My Mobapp Studio
Submit directory .
Submit files my_mobapp_studio - link_to_blog_post.txt
Description
Welcome!

We are very pleased to hired as Junior Data Scientist here at My MobApp Studio. As I told you during your very first interview, data science is very new for us but you succeeded to convinced that it's one of the key factor to be successful in our digital world, as you said: data is life.

Last management meeting, we decided we will allocate resource to create a new mobile app and I have to say that I have already received multiple emails showing the enthusiasm from our employees who wants to be part of the team. We have all in-house the different skills we need to make this project a success (marketing, design, game design, software engineer)

Before moving forward, I will need a report on the market. In order to complete our portfolio, this new App will be first publish on the Google Play Store, so you can focus your research on it.

I will just shoot some questions here:

What is the size of the market? numbers of download and $
Same question but per category? (percentages please)
Depending on each category, what are the ratio of download per app?
Any additional information you will find useful for us to take the right decision.
I remembered you told me you are also a developer, I'm myself an old developer, so I'm thinking maybe if you can build some code it would be great and display your results on the terminal.

I will invite my vp marketing and vp designer to the meeting, formatting will be a real plus, and if they have additional questions be ready to jump back in the code.

Best, John

Technical specification
We are expecting two files:

First will be your notebook jupyter with your calculation You will have to implement multiple functions:
load_dataset()

# Analysis

print_summarize_dataset(dataset)
clean_dataset(dataset)
print_histograms(dataset)
compute_correlations_matrix(dataset)
print_scatter_matrix()
Second will be a report. You will publish it on any blog platform of your choice. To drive your Analysis:

Plot with bar diagram the most populars paid apps of Family category

Plot with a pie diagram the most popular genres according to the number of installations from paid family

An array with the number of installation per category

Plot a pie with the number of installation per category

Plot a bar with the mean price per category

Most expensive apps per category

You can inspire yourself from this very interesting blog post on kubernetes.

You are in data science, so your blog post needs to report as a "scientific experiment"; you need to write your assumption, every step of the experiment, and the conclusion. Usually, with an opening to what you follow, what to experiment next?

We will use this data set: Data set

Season 02 DS Project 16:

My Vivino

Technical details
Submit file my_vivino.ipynb
My Vivino is an online marketplace. We have a vast wine database, and we have 27 million users, mainly in North America.

One of our leading services is a wine recommendation system. It is starting to be a little old, rules-based. We are selling wine based on our customer visit/research.

You've just finished a meeting with your product manager. Data science is the future, and our competitor my_wine.com has invested a lot in it.

Following your suggestion, my_vivino's CEO has decided to allocate a budget to move forward on the data science project you've proposed.

_Which project, did we just get approved to build something?_

What are the success criteria?

During our next meeting, you will have to show us some data (plot? report?) of what you've been building.
Impact on the business. We need to make our customers happy.
What to expect?

Slides presentation.
And the DevOps team should be able to push it to production.
You've heard the CEO will be joining the meeting. It's a reminder if you do well, you can quickly expect the promotion you are expecting.

Technical specification
What is to be a Data Scientist?

Data Collecting / Cleaning
Data Exploration
Data Visualization
Machine Learning
Communication
You will have to prove yourself in each of these. We are confident you've already done it! :)

Where to find the data? Any where. Scrap Vivino / Bevmo / Delectable / Wine-Searcher / ...

It's an open project. You are free to find something you find will be useful to do some data analysis on:

Rating system?
Comments system? detect most valuable comments?
Wine suggestion?
Wine classification?
Wine quality?
Size of the market analysis?
Suggestion base on a meal recipe?
Reminder, it will be one of your portfolio projects. You can find a lot of different ideas. Plagiarism is not tolerated in the company either here. :-) If you don't find enough information on wine, why not moving to the Whisky market, Beer market, or Coca? any beverage market? :-)

You are a DATA SCIENTIST, so your blog post needs to report as a SCIENTIFIC EXPERIMENT; you need to write your assumption, every step of the experiment, and the conclusion. Usually, with an opening to what you follow, what to experiment next?

The scope is vast. You will find your idea :)

How will this project be graded?

Your scientific approach

Formulating clear hypotheses or questions.
Collecting and validating data systematically.
Applying rigorous methods and analysis.
Documenting the process clearly.
The portability of your code

The git history

The level of professionalism displayed in presentation.

Your blog post (You can inspire yourself from this fascinating blog post on Kubernetes.)
