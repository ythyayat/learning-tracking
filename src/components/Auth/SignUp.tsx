"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z.string().min(1, "Required"),
});

const SignUp = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signUp({ email, password }: z.infer<typeof FormSchema>) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      toast({
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    } else {
      toast({
        description:
          "Account created. Please check your email for verification link.",
        duration: 4000,
      });
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(signUp)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-start mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="text-start mb-10">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link">
          <Link href="/sign-in">Already have an account? Sign In.</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
