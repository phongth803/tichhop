import transporter from '../config/nodemailer.js'

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
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
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' })
  }
}
