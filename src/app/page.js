"use client"
import {Experience} from "@/components/Experience";
import { Suspense } from "react";


export default function Home() {
  
  
  return (
    <main className="h-screen min-h-screen">
       <Suspense fallback={<div>Loading ...</div>}>
        <Experience />
      </Suspense>
    </main>
  );
}
