const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastName: { type: String },
    firstName: { type: String },
    gender: { type: String, enum: ["Nam", "Nữ"], default: "Nam" },
    otp: { type: String },
    otpExpire: { type: Date },
    savedRecipe: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
    savedPost: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    savedVideo: [{ type: Schema.Types.ObjectId, ref: "Video", default: [] }],
    ingredients: [
      { type: Schema.Types.ObjectId, ref: "Ingredient", default: [] },
    ],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    birthday: { type: Date },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dfaq5hbmx/image/upload/v1748692877/sushi_x1k4mg.png",
    },
    username: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.register = async function (
  email,
  password,
  lastName,
  firstName,
  gender,
  birthday,
) {
  if (
    !email ||
    !password ||
    !lastName ||
    !firstName ||
    !gender ||
    !birthday 
  ) {
    console.log(
      email,
      password,
      lastName,
      firstName,
      gender,
      birthday,
    );
    throw Error("Bạn chưa điền hết thông tin!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email không hợp lệ!");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email đã được sử dụng");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    lastName,
    firstName,
    gender,
    birthday,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Bạn chưa điền hết thông tin!");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Email không đúng!");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Mật khẩu không đúng");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
