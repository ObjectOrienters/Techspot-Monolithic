# TechSpot

TechSpot is a social media application hub designed for developers and tech-interested individuals.

## Table of Contents

- [Project Main Features](#project-main-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Roadmap](#roadmap)
- [Credits & Contact](#credits--contact)

## Project Main Features

### Main Social Media Features
- Following Users
- Posting Pictures, Videos, and Audio Content
- Commenting on Posts
- Reacting to Posts and Comments
- Sharing Posts
- Tagging posts by Topic
- Posting posts with code content supported by markdown
- One-to-One Chat Messaging Feature
- Feed of Posts by Tag
- Feed of Posts by Following Users 
- Searching Posts by Tag
- Searching Users by Name or Username


## Demo
![image](https://github.com/user-attachments/assets/de03c7f0-60de-46c2-9174-40a64d1a8607)


## Technologies Used

### Backend

This social media app is built using the `Spring framework` in an MVC architecture. It utilizes a Relational `Database (MySQL)` for storing user data and a NoSQL Real-Time `Database (Firebase)` for storing messages history. `WebSockets` technology is employed to provide real-time one-to-one chat functionality.

### Frontend

We used `ReactJS` integrated with `Chakra UI` library. 

## Installation

### Prerequisites
- Java Development Kit (JDK) installed
- Apache Maven installed
- MySQL database server installed and running
- NodeJS

### Configuration

Connect to a MySQL database named `oop` with user `root` and no password.
Import the schema for the database. It can be found in the backend folder `schema.sql`.

### Steps (Manually Without Docker)
1. Clone the repository & navigate to the project directory.
    ```bash
    git clone https://github.com/ObjectOrienters/Techspot-Monolithic.git
    cd Techspot-Monolithic
    ```
2. Run Backend
    ```bash
    cd backend
    mvn clean install
    java -jar "target\techspot-0.0.1-SNAPSHOT.jar"
    ```
3. Run Frontend in new terminal from root
    ```bash
    cd frontend
    npm install
    npm start
    ```


### Run With Docker

1. Clone the repository & navigate to the project directory.
    ```bash
    git clone https://github.com/ObjectOrienters/Techspot-Monolithic.git
    cd Techspot-Monolithic
    ```
2. initialize docker & docker compose
    ```bash
    docker compose up
    ```

## Credits & Contact

Developed by [Angela Salem](https://github.com/SilverBullet70), [Husam Ramoni](https://github.com/RamHusam111), and [Yousef Albandak](https://github.com/YousefBandak) for the third-year software engineering project at Bethlehem University.

Contact us: object.orienter@gmail.com
