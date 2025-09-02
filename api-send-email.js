// File: /api/send-email.js
const nodemailer = require('nodemailer');

// Configuración del transporter de Gmail
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Headers para CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Función principal
export default async function handler(req, res) {
  // Manejar preflight para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeaders(headers).end();
  }

  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).setHeaders(headers).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  try {
    const { name, email, company, message } = req.body;

    // Validación básica
    if (!name || !email || !message) {
      return res.status(400).setHeaders(headers).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, email y mensaje'
      });
    }

    // Configurar el email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'nirxxxx@gmail.com',
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}${company ? ` (${company})` : ''}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Enviado desde el formulario de contacto de Nirmatic</small></p>
      `,
      text: `
        Nuevo mensaje de contacto
        -------------------------
        Nombre: ${name}
        Email: ${email}
        ${company ? `Empresa: ${company}` : ''}
        Mensaje:
        ${message}
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    // Respuesta exitosa
    res.status(200).setHeaders(headers).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).setHeaders(headers).json({
      success: false,
      error: 'Error interno del servidor al enviar el mensaje'
    });
  }
}