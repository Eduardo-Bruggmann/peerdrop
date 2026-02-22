interface PeersListProps {
  peers: string[]
}

export default function PeersList({ peers }: PeersListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-w-75">
      <h2 className="font-semibold mb-3">Connected Peers</h2>

      {peers.length === 0 ? (
        <p className="text-gray-500">Waiting for someone...</p>
      ) : (
        <ul className="space-y-2">
          {peers.map(p => (
            <li key={p} className="bg-gray-100 p-2 rounded text-sm">
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
