import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"

export const SearchBar = ({ query,
     setQuery }:
     { query: string,
         setQuery: Dispatch<SetStateAction<string>> }) => {
    // const [query,setQuery] = useState("");
    const formSchema = z.object({
        query: z.string().min(0).max(50),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            query:""
        }
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setQuery(values.query)
    }
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-cen">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input  {...field} placeholder="Your File name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button size= "sm" type="submit"
                        // disabled={form.formState.isSubmitting}
                        >
                        {/* {form.formState.isSubmitting && 
                        (<Loader2 className=" h-4 w-4 animate-spin" />)} */}
                        <SearchIcon />Search 
                    </Button>
                </form>
            </Form>
        </>
    )
}