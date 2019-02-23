/*
    Jonty Shah
    CSE 154 AI
    TA: Christine Ta
    Homework 7
    05/31/17
    This is a sql file to setup and create a database
    and a table with specific columns and of specific
    data type.

*/

CREATE DATABASE hw7;
use hw7;

CREATE TABLE IF NOT EXISTS Pokedex(
    name VARCHAR(20),
    nickname VARCHAR(20),
    datefound DATETIME,
    PRIMARY KEY(name)
);