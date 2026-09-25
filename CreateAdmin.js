const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserModel = require("./models/UserModel");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await UserModel.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = "Admin";

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingAdmin.password
      );

      if (!isPasswordCorrect) {
        existingAdmin.password = await bcrypt.hash(password, 10);
      }

      await existingAdmin.save();
      
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.create({
        name: "Admin",
        email,
        password: hashedPassword,
        role: "Admin",
      });
     
    }

    await mongoose.disconnect();   
    
  } catch (error) {
    console.error("Error creating Admin:", error);
    process.exit(1);
  }
};

createAdmin();