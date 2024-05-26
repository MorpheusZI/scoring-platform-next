"use client"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UserServe, createUser } from './Server/CreateUser'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, {
    message: "Password length cannot be less than 5"
  }),
  username: z.string().min(3, {
    message: "username length cannot be less than 3"
  }),
})

export default function Home() {
  const router = useRouter()
  const [LoadState, setLoadState] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadState(true)
    const usr: UserServe = {
      username: values.username,
      password: values.password,
      email: values.email,
    }
    createUser(usr).then(r => {
      localStorage.setItem('UserStore', JSON.stringify(r))
      const userStringData = localStorage.getItem('UserStore')
      const UserData = userStringData ? JSON.parse(userStringData) : null
      setLoadState(false)
      router.push(`/PreInteraksi/${UserData.username}`)
      return r
    })
  }
  return (
    <div className="flex w-[100vw] h-[100vh] items-center justify-center bg-gray-100">
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[40%] flex-col gap-5 bg-white p-5 rounded-xl">
          <h1 className="text-3xl self-center mb-2">Register</h1>
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <div className="flex items-center gap-3 mt-4 self-end">
            <div className="flex items-center text-xs gap-[2px]">
              <p >Sudah punya akun? </p>
              <Button asChild variant="link" className="px-1 text-xs hover:text-purple-500">
                <Link href="/Login">Login</Link>
              </Button>
            </div>
            {LoadState ? <Button className="w-fit"><Loader2 className="animate-spin" /></Button> : <Button className="w-fit" type="submit">Masuk</Button>}
          </div>
        </form>
      </Form>
    </div>
  )
}
