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
  Team: z.enum(['engineer', 'TalentScientist', 'Designer', 'HR', 'Finance']),
  Position: z.enum(['Manager', 'AnggotaTim']),
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
      Position: values.Position,
      Team: values.Team,
    }
    const CreatedUser = createUser(usr).then(r => {
      localStorage.setItem('UserStore', JSON.stringify(r))
      const TeamData = localStorage.getItem('UserStore')
      const Team = TeamData ? JSON.parse(TeamData) : ''
      if (Team) {
        router.push(`/ListMentee/${Team.Team}`)
      }
      setLoadState(false)
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
          <FormField
            control={form.control}
            name="Team"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Team</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih team anda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="TalentScientist">Talent Scientist</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="Position"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Dalam tim, saya adalah seorang:</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-10">
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Manager" />
                      </FormControl>
                      <FormLabel className="font-normal">Manager</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="AnggotaTim" />
                      </FormControl>
                      <FormLabel className="font-normal">Anggota Tim</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <div className="flex items-center gap-3 mt-4 self-end">
            <div className="flex items-center text-xs gap-[2px]">
              <p >Sudah punya akun? </p>
              <Button asChild variant="link" className="px-1 text-xs">
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
