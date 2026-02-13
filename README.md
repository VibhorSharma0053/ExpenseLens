# 💰 ExpenseLens

<div align="center">

**Transform Your PhonePe Payment History into Actionable Financial Insights**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)


</div>

---

## 🎯 About

**ExpenseLens** is a powerful web application that helps you gain deep insights into your spending habits by analyzing your PhonePe payment history. Simply upload your PhonePe transaction PDF, and ExpenseLens will automatically extract, categorize, and visualize your financial data with intelligent duplicate detection.

### Why ExpenseLens?

- 📊 **Visual Analytics** - Beautiful charts showing where your money goes
- 🎯 **Smart Categorization** - Automatic transaction categorization
- 🔒 **Privacy First** - Your data stays secure, never shared
- 🚀 **Lightning Fast** - Process thousands of transactions in seconds
- 🔄 **Duplicate Detection** - Smart handling of overlapping PDFs
- 📱 **Responsive Design** - Works on all devices

---

## ✨ Key Features

### 🎨 Core Functionality

- ✅ **PDF Upload & Parsing**
  - Drag-and-drop interface
  - Automatic PhonePe PDF parsing
  - Real-time progress tracking
  - Support for all PhonePe formats

- ✅ **Smart Transaction Management**
  - **Automatic duplicate detection** (NEW!)
  - Transaction categorization
  - Advanced filters (category, type, date)
  - Search and sort
  - Transaction details view

- ✅ **Advanced Analytics**
  - Spending summary dashboard
  - Monthly trend analysis
  - Category-wise breakdown
  - Interactive charts
  - Percentage distribution

- ✅ **Secure Authentication**
  - JWT-based auth
  - Session management
  - Password encryption
  - Multi-device support

### 🆕 Unique Features

| Feature | Description |
|---------|-------------|
| **Duplicate Prevention** | Upload same PDF multiple times without creating duplicates |
| **Overlap Handling** | Smart detection of overlapping date ranges in multiple PDFs |
| **Visual Feedback** | Clear stats showing added/skipped/failed transactions |
| **Transaction ID Tracking** | Uses PhonePe's unique IDs for accuracy |
| **UTR Matching** | Secondary detection using UPI reference numbers |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor async)
- **Authentication**: JWT (PyJWT)
- **PDF Processing**: pdfplumber, pypdf
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18+
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP**: Axios
- **Build**: Vite

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 16+
- MongoDB 6.0+

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/expenselens.git
cd expenselens

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URL and SECRET_KEY

# Run backend
python main.py
```

Backend available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env
# Edit VITE_API_URL=http://localhost:8000/api

# Run frontend
npm run dev
```

Frontend available at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend (.env)
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=expenselens

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📘 Usage

### 1. Create Account
```
1. Navigate to http://localhost:5173
2. Click "Get Started"
3. Enter name, email, password (min 8 chars)
4. Click "Create Account"
```

### 2. Upload PhonePe PDF
```
1. Log in
2. Go to "Upload PDF"
3. Drag and drop PhonePe statement PDF
4. Wait for processing (5-10 seconds)
5. View results with duplicate detection stats
```

### 3. View Analytics
```
1. Navigate to Dashboard
2. See spending summary
3. View category breakdown
4. Analyze monthly trends
```

### 4. Browse Transactions
```
1. Go to Transactions page
2. Filter by category, type, date range
3. Click transaction for details
4. Delete if needed
```

---

## 🔄 Duplicate Detection

ExpenseLens intelligently handles duplicate transactions:

### How It Works

```
1. Upload PDF → Extract transactions
2. Check existing transactions in database
3. Compare by:
   - Transaction ID (PhonePe unique ID)
   - UTR Number (UPI reference)
4. Mark duplicates → Skip
5. Save only NEW transactions
```

### Example Scenarios

**Scenario 1: Same File Re-upload**
```
Upload: PhonePe_Aug_Oct.pdf (200 transactions)
First upload:  ✅ Added 200, ⚠️ Skipped 0
Second upload: ✅ Added 0,   ⚠️ Skipped 200 (all duplicates!)
```

**Scenario 2: Overlapping Dates**
```
First PDF: Aug-Oct (200 transactions) → Added 200
Second PDF: Sep-Nov (250 transactions)
  - Sep+Oct = 100 duplicates (overlap)
  - Nov = 150 new transactions
Result: ✅ Added 150, ⚠️ Skipped 100
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication

#### POST `/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### POST `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Transactions

#### POST `/transactions/upload`
Upload PhonePe PDF (multipart/form-data)

**Response:**
```json
{
  "message": "Added 150 new transactions, skipped 50 duplicates",
  "transactions_added": 150,
  "transactions_skipped": 50,
  "transactions_failed": 0
}
```

#### GET `/transactions`
Get transactions with filters

**Query Params:**
- `page`, `page_size`
- `category`, `transaction_type`
- `start_date`, `end_date`

#### DELETE `/transactions/{id}`
Delete transaction

### Analytics

#### GET `/analytics/summary`
Spending summary

#### GET `/analytics/monthly-trend`
Monthly trends

#### GET `/analytics/category-breakdown`
Category distribution

**Full Docs:** `http://localhost:8000/docs`

---

## 📁 Project Structure

```
expenselens/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── pdf_parser.py        # PDF parsing
│   ├── requirements.txt     # Dependencies
│   └── .env                 # Config
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Auth context
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🗄️ Database Schema

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password_hash: String,
  created_at: DateTime
}
```

### Transactions
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  transaction_date: DateTime,
  description: String,
  amount: Float,
  type: "DEBIT" | "CREDIT",
  category: String,
  transaction_id: String,    // PhonePe ID
  utr_number: String,        // UPI reference
  created_at: DateTime
}
```

### Sessions
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  refresh_token: String,
  expires_at: DateTime
}
```

---

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with cost factor 12
- **Protected Routes** - All endpoints secured
- **CORS Configuration** - Controlled origins
- **Input Validation** - Pydantic models
- **Session Management** - Refresh token rotation

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### MongoDB connection failed
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Verify connection string
MONGODB_URL=mongodb://localhost:27017
```

### Frontend can't connect
```javascript
// Check .env
VITE_API_URL=http://localhost:8000/api

// Check backend CORS
allow_origins=["http://localhost:5173"]
```

### PDF upload fails
- Ensure PDF is from PhonePe (not other UPI apps)
- Check PDF not password protected
- Verify contains transaction history
- Check backend logs

### Duplicates not detected
```javascript
// Verify MongoDB index exists
db.transactions.getIndexes()

// Create if missing
db.transactions.createIndex({ 
  user_id: 1, 
  transaction_id: 1 
})
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/Feature`)
3. Commit changes (`git commit -m 'Add Feature'`)
4. Push to branch (`git push origin feature/Feature`)
5. Open Pull Request

---


## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python framework
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Recharts](https://recharts.org/) - Charts
- [Lucide](https://lucide.dev/) - Icons

---

## 📞 Contact

- **Email**: vibhorsharma0053@gmail.com
- **GitHub**: [@VibhorSharma0053](https://github.com/VibhorSharma0053)
- **Project**: [ExpenseLens](https://github.com/VibhorSharma0053/expenselens)

---

## 🗺️ Roadmap

- [x] PDF upload and parsing
- [x] Transaction categorization
- [x] Dashboard analytics
- [x] **Duplicate detection** ✨
- [ ] Export to CSV/Excel
- [ ] Budget tracking
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Mobile app
- [ ] AI-powered insights

---

## 💡 Tips

### Get PhonePe PDF
```
1. Open PhonePe app
2. Profile → Statements
3. Select date range (max 6 months)
4. Download PDF
5. Upload to ExpenseLens!
```

### Backup Data
```bash
# Export MongoDB
mongodump --db expenselens --out backup/

# Restore
mongorestore --db expenselens backup/expenselens/
```

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ for better financial tracking

</div>
