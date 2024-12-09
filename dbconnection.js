import mongoose from 'mongoose'

connect().catch(err => console.log(err))

async function connect() {
  await mongoose.connect('mongodb://localhost:27017/')
  console.log("Connected to the Database")
}

const runApp = async () => {
  await connect();
  mongoose.connection.close();
  return "Connected"
};

export default runApp