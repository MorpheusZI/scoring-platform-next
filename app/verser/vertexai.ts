import { JWTInput } from "google-auth-library"
import { VertexAI, GenerateContentRequest } from "@google-cloud/vertexai"

const project = process.env.GC_SA_PID ? process.env.GC_SA_PID : ''
const region = process.env.GC_SA_PROJECT_REGION ? process.env.GC_SA_PROJECT_REGION : ""
const textModel = 'gemini-1.0-pro-001'

export const GC_Credentials: JWTInput = {
  type: process.env.GC_SA_TYPE,
  client_id: process.env.GC_SA_CLIENT_ID,
  project_id: project,
  private_key: process.env.GC_SA_PRIVATE_KEY,
  client_email: process.env.GC_SA_CLIENT_EMAIL,
  private_key_id: process.env.GC_SA_PRIVATE_KEY_ID,
  universe_domain: process.env.GC_SA_UNIVERSE_DOMAIN
}

const VxAI = new VertexAI({
  project: project,
  location: region,
  googleAuthOptions: {
    credentials: GC_Credentials
  }
})

const genModel = VxAI.getGenerativeModel({
  model: textModel,
  generation_config: { max_output_tokens: 500 }
})

export { VxAI, genModel }

