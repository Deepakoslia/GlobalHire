# GlobalHire

GlobalHire is a global HR, payroll, compliance, and workforce management platform. This repository contains the marketing website, Python API backend, and MySQL database schema.

## Project structure

```
GlobalHire/
├── frontend/           # HTML, CSS, JavaScript
│   ├── index.html
│   ├── css/
│   └── js/
├── backend/            # Flask API
│   ├── app.py
│   ├── config.py
│   ├── db/
│   ├── routes/
│   ├── services/
│   └── utils/
├── database/
│   └── schema.sql      # MySQL schema
└── .env.example
```

## Prerequisites

- Python 3.10+
- MySQL 8.0+
- A modern web browser

## Database setup

1. Start MySQL and create the schema:

```bash
mysql -u root -p < database/schema.sql
```

2. Create an application user (recommended):

```sql
CREATE USER 'globalhire_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE ON globalhire.* TO 'globalhire_app'@'localhost';
FLUSH PRIVILEGES;
```

## Backend setup

1. Copy the environment file and configure your database credentials:

```bash
copy .env.example .env
```

2. Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. Start the server:

```bash
python app.py
```

The site and API will be available at `http://localhost:5000`.

## API endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/api/health`      | Health check             |
| POST   | `/api/contact`     | Contact form submission  |
| POST   | `/api/demo`        | Demo request submission  |
| POST   | `/api/newsletter`  | Newsletter signup        |

### Example: demo request

```bash
curl -X POST http://localhost:5000/api/demo \
  -H "Content-Type: application/json" \
  -d "{\"first_name\":\"Jane\",\"last_name\":\"Doe\",\"email\":\"jane@company.com\",\"company\":\"Acme Inc\"}"
```

## Frontend features

- Sticky responsive navigation with mobile hamburger menu
- Hero section with interactive dashboard mockup
- Customer logo strip, features, compliance, testimonials, pricing
- FAQ accordion (JavaScript)
- Contact and demo forms with client-side validation
- Newsletter signup in footer
- Scroll animations and accessible markup

## Security notes

- All SQL queries use parameterized statements
- Server-side validation on every API endpoint
- Configure a strong `SECRET_KEY` in production
- Restrict database user permissions to required operations only
- Serve over HTTPS in production

