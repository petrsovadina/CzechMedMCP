export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="text-lg font-bold">
              <span className="text-primary">Czech</span>Med
              <span className="text-primary">MCP</span>
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              Open source MCP server pro české zdravotnictví
            </p>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="/docs" className="transition hover:text-foreground">
              Dokumentace
            </a>
            <a
              href="https://github.com/petrsovadina/biomcp"
              target="_blank"
              rel="noopener"
              className="transition hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://github.com/petrsovadina/biomcp/issues"
              target="_blank"
              rel="noopener"
              className="transition hover:text-foreground"
            >
              Issues
            </a>
            <a
              href="https://medevio.com"
              target="_blank"
              rel="noopener"
              className="transition hover:text-foreground"
            >
              Medevio
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          MIT {new Date().getFullYear()} &copy;{' '}
          <a
            href="https://github.com/petrsovadina"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-4"
          >
            Petr Sovadina
          </a>
        </div>
      </div>
    </footer>
  )
}
