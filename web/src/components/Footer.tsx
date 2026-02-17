export default function Footer() {
  return (
    <footer className="flex justify-center items-center w-full p-2 bg-linear-to-l from-blue-600 to-blue-800 text-white text-sm">
      All rights reserved &copy; {new Date().getFullYear()} PeerDrop
    </footer>
  )
}
