"use client"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { checkUser } from './Server/CheckUser'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export default function Home() {
  const [LoadState, setLoadState] = useState(false)
  const [ErrorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadState(true)
    const arr = checkUser(values.email, values.password).then(r => {
      if (!r) {
        setErrorMsg("User Not found")
        setLoadState(false)
        setTimeout(() => {
          setErrorMsg('')
        }, 1000)
        return
      }
      localStorage.setItem('UserStore', JSON.stringify(r))
      setLoadState(false)
      const TeamData = localStorage.getItem('UserStore')
      const Team = TeamData ? JSON.parse(TeamData) : 'Engineer'
      router.push(`/OneOnOne/${Team.username}`)
      return r
    })
  }
  return (
    <div className="flex w-[100vw] h-[100vh] items-center justify-center bg-gray-100">
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[40%] flex-col gap-7 bg-white p-10 rounded-xl">
          <h1 className="text-4xl self-center mb-3">Login</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          {ErrorMsg && <p className="text-red-200">{ErrorMsg}</p>}
          <div className="flex items-center gap-3 self-end">
            <div className="flex items-center text-xs gap-[2px]">
              <p >Belum punya akun? </p>
              <Button asChild variant="link" className="px-1 text-xs">
                <Link href="/Register">Register</Link>
              </Button>
            </div>
            {LoadState ? <Button className="w-fit"><Loader2 className="animate-spin" /></Button> : <Button className="w-fit" type="submit">Masuk</Button>}

          </div>
        </form>
      </Form>
    </div>
  )
}
