export function PublishedBadge({ createdAt }: { createdAt: string }) {
  const publishedDate = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - publishedDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let text: string
  if (diffDays === 0) {
    text = 'Publicado hoy'
  } else if (diffDays === 1) {
    text = 'Publicado hace 1 día'
  } else if (diffDays < 4) {
    text = `Publicado hace ${diffDays} días`
  } else {
    return null // Don't show for older properties
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-surface text-muted-foreground font-medium">
      {text}
    </span>
  )
}
