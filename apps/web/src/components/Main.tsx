interface ChildrenProps {
  children: React.ReactNode
}

export default function Main({ children }: ChildrenProps) {
  return (
    <main className="flex flex-1 justify-center items-center w-full p-4 bg-[#f3f3f3]">
      {children}
    </main>
  )
}
