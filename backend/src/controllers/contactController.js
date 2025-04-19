import transporter from '../config/nodemailer.js'
import sendToN8n from '../service/sendToN8n.js'

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Split ADMIN_EMAIL by comma to support multiple admin emails
    const adminEmails = process.env.ADMIN_EMAIL.split(',').map(email => email.trim())

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    }

    await transporter.sendMail(mailOptions)
    // await sendToN8n('contact', { name, email, phone, message })
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' })
  }
}
