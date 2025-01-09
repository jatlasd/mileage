"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  amount: z.string().min(2).max(50),
  month: z.string(),
  week: z.string(),
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AddIncome = ({ refresh, setRefresh }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      month: "",
      week: "",
    },
  });

  const { toast } = useToast()

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      form.reset();
      toast({
        type: "success",
        title: "Income added successfully",
        duration: 3000,
      })
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto border border-text/10 bg-card rounded-lg shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel className="text-text/70">Month</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-background border-text/10 h-10 text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-text/10">
                      {months.map((month, index) => (
                        <SelectItem key={index} value={month} className="text-sm">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="week"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel className="text-text/70">Week</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-background border-text/10 h-10 text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-text/10">
                      {[...Array(5)].map((_, index) => (
                        <SelectItem key={index} value={String(index + 1)} className="text-sm">
                          Week {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel className="text-text/70">Amount</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter amount" 
                    {...field} 
                    className="bg-background border-text/10 h-10 text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 transition-colors w-full md:w-auto h-10"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Income'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddIncome;
