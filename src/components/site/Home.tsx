import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "./Preloader";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Philosophy } from "./Philosophy";
import { Purpose } from "./Purpose";
import { Group } from "./Group";
import { Journey } from "./Journey";
import { Principles } from "./Principles";
import { Practice, Writing } from "./Practice";
import { Contact } from "./Contact";
import { StarBand } from "./Dubai";

export function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <Purpose />
        <StarBand />
        <Group />
        <Journey />
        <Principles />
        <Practice />
        {/* <Writing /> */}
        <StarBand />
        <Contact />
      </main>
    </>
  );
}
