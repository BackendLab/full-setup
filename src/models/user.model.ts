import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;
  watchHistory: mongoose.Schema.Types.ObjectId;
  subscribers: number;
  channelSubscribed: mongoose.Schema.Types.ObjectId;
  refreshToken: string;
  avatar: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      // must store hasehed password
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    subscribers: {
      type: Number,
      required: true,
    },
    channelSubscribed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      // Cloudinary Image String
      type: String,
    },
    coverImage: {
      // Cloudinary Image String
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Adding password hashing algorithm using bcrypt
// NOTE: hashing password must be written inside user schema because it helps us to segregate the logic
userSchema.pre("save", async function () {
  // adding check for password do not get hashed on every save
  if (!this.isModified("password")) return;
  // hashing the password before save
  this.password = await bcrypt.hash(this.password, 10);
});

// Adding Comparing password algorith using bcrypt
// NOTE: This bcrypt method helps in comapring password with getting password as a string and hashed password

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// adding method for Access token using jwt - This function will be a syncronous function
userSchema.methods.generateAccessToken = function () {
  const payload = { _id: this._id };
  const secret = Bun.env.ACCESS_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: Number(Bun.env.ACCESS_TOKEN_EXPIRY),
  };
  return jwt.sign(payload, secret, options);
};

// adding mehtod for refresh token using jwt - This func also a sync func
userSchema.methods.generateRefrshToken = function () {
  const payload = { _id: this._id };
  const secret = Bun.env.REFRESH_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: Number(Bun.env.REFRESH_TOKEN_SECRET),
  };

  return jwt.sign(payload, secret, options);
};

export const User = mongoose.model<IUser>("User", userSchema);
