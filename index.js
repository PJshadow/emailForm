const express = require('express');
const app = express();
const port = 5001;
const exphbs = require('express-handlebars');
const path = require('path'); // Native module that deals with paths
app.engine('handlebars', exphbs.engine()); 
app.set('view engine', 'handlebars'); 
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 
require('dotenv').config();
const multer = require('multer');



// Middleware that handles form data coming from front end http requests
app.use(express.json());

//Middleware that handles form data coming from front end http requests with pdf
const upload = multer({ 
  storage: multer.memoryStorage(), // Armazena o arquivo em memória
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Somente arquivos PDF são permitidos.'));
    }
  }
});


//Routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.get('/', (req, res) => {
    res.render('home');
});

//Contact Form
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Configuração do transporte SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Ex: smtp.gmail.com
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Conteúdo do e-mail
  const mailOptions = {
    from: process.env.SMTP_USER,/*`"${name}" <${email}>`,*/
    to: process.env.SMTP_USER,
    subject: 'Mensagem enviada pelo formulário do site',
    text: message,
    html: `<p>O usuário preencheu o formulário CONTACT do site com as seguintes informações:</p>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Email:</strong> ${phone}</p>
          <p><strong>Mensagem:</strong><br>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions); 
    res.json({ success: true, message: 'Form sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending form.' });
  }
});

//Hire form
app.post('/send-email-hire', upload.single('pdfAttachment'), async (req, res) => {
  const { name, email, phone, position, message } = req.body;
  const pdfFile = req.file;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: 'Você recebeu uma mensagem do formulário do site',
    text: message,
    html: `<p>O usuário preencheu o formulário HIRE do site com as seguintes informações:</p>
           <p><strong>Nome:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Fone:</strong> ${phone}</p>
           <p><strong>Cargo:</strong> ${position}</p>
           <p><strong>Mensagem:</strong><br>${message}</p><br>
           <p>Obs: Este email possui arquivo em anexo.</p>`,
    attachments: pdfFile ? [{
      filename: pdfFile.originalname,
      content: pdfFile.buffer,
      contentType: pdfFile.mimetype
    }] : []
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Form sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending form.' });
  }
});




app.listen(port, () => console.log(`Server running on port ${port}`));