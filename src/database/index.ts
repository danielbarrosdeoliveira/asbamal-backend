import mongoose from "mongoose";

const mongoConnect = async () => {
	mongoose
		.connect(process.env.MONGODB + "?retryWrites=true&w=majority")
		.then(() => console.log("Mongo connected!"))
		.catch((err) => console.log("Mongo error: ", err));

	return mongoose;
};

export { mongoConnect };
