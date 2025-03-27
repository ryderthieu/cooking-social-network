const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "30d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { email, password, lastName, firstName, gender, birthDay } = req.body;

  try {
    const user = await User.register(email, password, lastName, firstName, gender, birthDay);
    res
      .status(200)
      .json({ message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." });
  } catch (error) {
    console.log(error.message)

    res.status(400).json({ error: error.message });
  }
};

const sendOtpEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP Xác Nhận Đặt Lại Mật Khẩu",
    text: `Mã OTP của bạn để đặt lại mật khẩu là: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("OTP sent:", info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email không tồn tại!");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 3600000;
    await user.save();

    sendOtpEmail(email, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const confirmOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }
    console.log(otp)

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Mã OTP không đúng!" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ error: "Mã OTP đã hết hạn!" });
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Xác nhận OTP thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
}
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(402).json({ message: "OTP đã hết hạn" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {login, register, forgotPassword, resetPassword, confirmOtp}