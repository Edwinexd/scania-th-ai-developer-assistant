import dotenv from "dotenv";

dotenv.config();

interface Config {
  MISTRAL_API_KEY: string;
}

const config: Config = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY!,
};

export default config;
