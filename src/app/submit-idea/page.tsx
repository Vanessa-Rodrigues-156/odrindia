
import type { Metadata } from "next"
import SubmitIdeaClientPage from "./SubmitIdeaClientPage"


export const metadata: Metadata = {
  title: "Got an idea for a better, tech-enabled justice system?",
  description: "Drop it on the Idea Board — every great change starts with a single seed.",
}

export default function SubmitIdeaPage() {
  return <SubmitIdeaClientPage />
}
