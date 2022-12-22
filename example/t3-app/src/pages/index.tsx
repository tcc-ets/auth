import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const items = trpc.example.getAll.useQuery();
  const createItem = trpc.example.create.useMutation({
    onSuccess: () => {
      items.refetch();
    },
  });
  const [item, setItem] = useState("");

  const {
    data: meData,
    isLoading,
    isError,
  } = useQuery(["me"], () =>
    fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      credentials: "include",
    }).then((res) => res.json())
  );

  const handleSignin = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_AUTH_WEB_URL}/signin?callbackUrl=${process.env.NEXT_PUBLIC_HOST_URL}${router.asPath}`
    );
  };

  const handleSignOut = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_AUTH_WEB_URL}/signout?callbackUrl=${process.env.NEXT_PUBLIC_HOST_URL}${router.asPath}`
    );
  };

  const handleItemSubmit = (e: any) => {
    e.preventDefault();
    createItem.mutate({ name: item });
  };

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error!</p>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>T3 Stack - Auth MS Example</h1>
        <h2>Items:</h2>
        {JSON.stringify(items.data, null, 2)}
        <hr />
        <h2>User:</h2>
        <p>{JSON.stringify(meData, null, 2)}</p>
        {"user" in meData ? (
          <div>
            <p>You are signed in as {meData.user.email}</p>
            <button onClick={handleSignOut}>Logout</button>
            <hr></hr>
            <h3>Create item</h3>
            <form onSubmit={handleItemSubmit}>
              <label htmlFor="name">Item name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
              <button type="submit">Create</button>
            </form>
          </div>
        ) : (
          <div>
            <p>Not signed in</p>
            <button onClick={handleSignin}>Sign in</button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
