import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase.from('devices').select('*').eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('devices')
      .insert({
        user_id: user.id,
        device_name: body.device_name,
        rustdesk_id: body.rustdesk_id,
        password: body.password,
        client_name: body.client_name,
        client_email: body.client_email,
        notes: body.notes,
        group_name: body.group_name,
        status: 'offline',
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log access
    await supabase.from('access_logs').insert({
      user_id: user.id,
      device_id: data[0]?.id,
      action: 'DEVICE_CREATED',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { device_name: body.device_name },
    })

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
