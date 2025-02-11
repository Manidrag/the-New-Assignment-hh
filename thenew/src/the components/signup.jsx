import { useState } from "react";

export function Signup() {
  let [email, setEmail] = useState("");
   let [password, setPassword] = useState("");
   const handleSubmit = async (e) => {
      e.preventDefault();
      try{
         
          const res = await fetch("http://localhost:3000/signup", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  email,
                  password,
              }),
            });
           
            const data = await res.json();
            
            if (data.message === "user created") {
                console.log("success");
                alert("user Created")
                window.location.href = "/Signin";
            }
        }
        catch (e) {
            console.log(e);
        }
    };
         
  return (
    <>
      <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" onSubmit={handleSubmit}>
          <h5 class="text-xl font-medium text-gray-900 dark:text-white">
            Sign Up for Chat AI
          </h5>
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div class="flex items-start">
            <div class="flex items-start"></div>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign UP
          </button>
        </form>
      </div>
    </>
  );
}
