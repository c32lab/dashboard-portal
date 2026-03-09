interface Props {
  src: string
}

export default function DashboardFrame({ src }: Props) {
  return (
    <iframe
      src={src}
      title="dashboard"
      className="w-full h-full border-0"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
    />
  )
}
