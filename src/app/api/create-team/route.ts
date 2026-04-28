import { createTeam } from '@/app/actions/create-team'

export async function POST(request: Request) {
  const formData = await request.formData()
  const result = await createTeam(formData)

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json(result)
}
