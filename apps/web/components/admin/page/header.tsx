import type React from "react"
interface HeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function Header({ title, subtitle, children, ...props }: HeaderProps) {
  return (
    <section className="bg-background py-4 rounded-xl shadow-sm border border-sidebar-border md:h-20 h-auto " {...props}>
      <div className="mx-auto px-6 h-full">
        <div className="flex flex-col md:flex-row md:justify-between h-full md:gap-2 gap-4 ">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl tracking-tight font-semibold">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>


          <div className="h-full flex items-stretch">{children}</div>
        </div>
      </div>
    </section>
  )
}

