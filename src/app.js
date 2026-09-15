require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');

const app = express();
const authRoutes = require('./routes/auth');

const csrfProtection = require('./middlewares/csrf');
const ordersRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middlewares/errorHandler');

// Headers de securite (SR-004) : CSP, X-Frame-Options, etc.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-origin' },
}));

app.use(express.json());

// Session securisee : HttpOnly + Secure (en prod) + SameSite=Strict + timeout 30 min
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000,
  },
}));

app.get('/', (req, res) => {
  res.json({ message: 'SecurePipeline API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);

app.use(csrfProtection);

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});
app.use('/orders', ordersRoutes);
app.use('/upload', uploadRoutes);
app.use(errorHandler);

module.exports = app;
