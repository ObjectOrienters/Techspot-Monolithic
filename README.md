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


## Pictures Demo
![image](https://github.com/user-attachments/assets/de03c7f0-60de-46c2-9174-40a64d1a8607)
![WhatsApp Image 2024-08-10 at 8 34 21 PM (1)](https://github.com/user-attachments/assets/e8d6ae98-9036-497e-9724-ecadd088cf34)
![WhatsApp Image 2024-08-10 at 8 37 52 PM](https://github.com/user-attachments/assets/db8b074e-19b8-4ff7-841c-d3f2897d7d07)
![WhatsApp Image 2024-08-10 at 8 37 52 PM (1)](https://github.com/user-attachments/assets/d639fca6-b43e-4b91-8b19-625d4855187e)
![WhatsApp Image 2024-08-10 at 8 37 51 PM](https://github.com/user-attachments/assets/e9dad167-e33a-4cbf-9e04-f7bddedab67e)
![WhatsApp Image 2024-08-10 at 8 37 51 PM (1)](https://github.com/user-attachments/assets/4ca47d2f-937b-4cea-ba0a-d0fac6c1a11c)
![WhatsApp Image 2024-08-10 at 8 37 51 PM (2)](https://github.com/user-attachments/assets/d90dbb56-6eec-4c01-af20-a223232d99cd)
![WhatsApp Image 2024-08-10 at 8 37 50 PM](https://github.com/user-attachments/assets/94df06a5-7b08-4dbe-a1bd-f75a8ed80a2a)
![WhatsApp Image 2024-08-10 at 8 34 21 PM](https://github.com/user-attachments/assets/b292f60f-f844-43ac-88b3-0c217408a27a)
![WhatsApp Image 2024-08-10 at 8 24 22 PM](https://github.com/user-attachments/assets/fa9b0359-94e4-4e8c-9c2a-f0947251bd98)
![WhatsApp Image 2024-08-10 at 8 24 21 PM](https://github.com/user-attachments/assets/2ad429a3-86a6-4c37-a337-79cb0e91ecfc)

