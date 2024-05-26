import app from "./app";
import { PORT } from "./secrets";

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
