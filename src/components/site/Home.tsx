import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "./Preloader";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Purpose } from "./Purpose";
import { Group } from "./Group";
import { Journey } from "./Journey";
import { Principles } from "./Principles";
import { Practice, Writing } from "./Practice";
import { Contact } from "./Contact";

export function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Purpose />
        <Group />
        <Journey />
        <Principles />
        <Practice />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
