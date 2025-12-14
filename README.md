# Fit-Plan-Hub

**FIT PLAN HUB** is a fitness management application designed to help users manage and track their workout plans. This project consists of a **Spring Boot backend** and a **React frontend**.

---

## Project Structure

```
Fit-Plan-Hub/
│
├── fit-plan-hub/           # Backend (Spring Boot)
│   ├── src/
│   ├── pom.xml
│   └── ... 
│
└── fitplanhub-frontend/    # Frontend (React)
    ├── src/
    ├── package.json
    └── ...
```

---

## Features

* User authentication and authorization.
* Dynamic fitness plan management.
* Dashboard to view all plans.
* Responsive frontend built with React.
* REST APIs built with Spring Boot.

---

## Technologies Used

**Backend:**

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL / H2 Database

**Frontend:**

* React
* HTML, CSS, JavaScript
* Fetch API for consuming backend endpoints

---

## Installation

### Backend

1. Navigate to the backend folder:

```bash
cd fit-plan-hub
```

2. Build the project using Maven:

```bash
mvn clean install
```

3. Run the Spring Boot application:

```bash
mvn spring-boot:run
```

> The backend will start at `http://localhost:8080`.

---

### Frontend

1. Navigate to the frontend folder:

```bash
cd fitplanhub-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React application:

```bash
npm start
```

> The frontend will start at `http://localhost:3000`.

---

## Usage

* Register or login to access the dashboard.
* Create, view, and manage fitness plans.
* Frontend communicates with backend via REST APIs.

---

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request.

---

## License

This project is open-source and available under the MIT License.

---

**FIT PLAN HUB** — Helping you stay fit, one plan at a time.
