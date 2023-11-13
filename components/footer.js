import Link from "next/link";
import Image from "next/image";
// import "react-tooltip/dist/react-tooltip.css";

const linkStyles =
  "inline-block relative w-12 h-12 mx-2 opacity-40 hover:opacity-100 transition-all duration-200";
const imageStyles =
  "p-3 hover:p-1  transition-all duration-200  hover:saturate-100";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="">
        <p className="text-center">
          Scribble Scribble , An AI powered tool to generate images from
          sketches.
        </p>

        <nav className="text-center mt-16"></nav>
      </div>
    </footer>
  );
}
