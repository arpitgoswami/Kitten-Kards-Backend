import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    instructor: {
        type: String,
        default: 0,
    }
})

const courses = mongoose.model("courses", userSchema)

export default courses;