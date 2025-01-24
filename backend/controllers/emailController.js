// Endpoint to send email with the report attached
exports.sendMail = async (req, res) => {
  const { email } = req.body
  const file = req.file

  if (!file || !email) {
    return res.status(400).send("File and email are required.")
  }

  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tejachennu17@gmail.com",
      pass: "thye wtbx anwr bckq",
    },
  })

  // Email options
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your Social Media Report",
    text: "Please find the attached report.",
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer,
      },
    ],
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.response)
    res.status(200).send("Report sent successfully")
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).send("Failed to send email")
  }
}