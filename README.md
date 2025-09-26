# Acredge Backend Assignment

This project is a backend API for property listings, built with Node.js, Express, and MongoDB. It supports property search, recommendations, and pagination.

## How to Run Locally

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd Acredge_Backend_Assignment
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   PORT=3500
   MONGO_URL=<your-mongodb-connection-string>
   ```

4. **Start the server**
   ```sh
   npm run dev
   ```
   The server will run on `http://localhost:3500`.

## API Endpoints

- `GET /properties`  
  List all properties (supports pagination, sorting).

- `GET /properties/search`  
  Search properties by query, BHK, location.

- `GET /properties/:id`  
  Get details of a property by ID.

- `GET /properties/recommendations/:id`  
  Get recommended properties for a given property.

## Design Decisions

### Scalability

- **Pagination:** All property listing endpoints support pagination and limit parameters to handle large datasets efficiently.
- **Text Indexing:** MongoDB text indexes are used for fast search on `title`, `description`, and `location`.
- **Lean Queries:** `.lean()` is used in Mongoose queries for faster read operations and lower memory usage.

### Microservice Structure

- **Separation of Concerns:**  
  - `controllers/`: Handles HTTP request/response logic.
  - `services/`: Contains business logic and data processing.
  - `model/`: Mongoose schema and model definitions.
  - `routes/`: API route definitions.
  - `config/`: Database connection setup.

- **Extensibility:**  
  The structure allows easy addition of new features (e.g., authentication, more services) and can be split into microservices if needed (e.g., separate recommendation service).

- **Environment Configuration:**  
  Sensitive data (like DB credentials) is managed via `.env` and not committed to source control.

## Future Improvements

- Add authentication and authorization.
- Implement caching for frequently accessed endpoints.
- Containerize with Docker for easier deployment.
- Split into microservices for search, recommendations, and property management as the system grows.

---

