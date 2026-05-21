import { supabase } from '@/lib/supabase'

export async function sendOtpEmail(email: string, isSignup = false) {
  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '') + '/#/auth/callback'

  if (isSignup) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    })
    if (error) throw error
    return
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })
  if (error) throw error
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw error
  return data
}

export async function upsertProfile(fullName: string, email: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      role: 'user',
    },
    { onConflict: 'id' }
  )
  if (error) throw error
}
