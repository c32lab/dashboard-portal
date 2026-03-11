import { useLocation, useNavigate } from 'react-router-dom'
import { TAB_CONFIG } from '../config'
import { useServiceHealth } from '../hooks/useServiceHealth'

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const health = useServiceHealth()

  const overviewActive = location.pathname === '/overview'

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 flex items-center h-14 shrink-0">
      <h1 className="text-white font-semibold text-lg mr-10 whitespace-nowrap">
        Amani Trading System
      </h1>

      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => navigate('/overview')}
          className={`relative px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
            overviewActive
              ? 'text-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Overview
          {overviewActive && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>

        {TAB_CONFIG.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    health[tab.healthUrl] === 'ok'
                      ? 'bg-green-500'
                      : health[tab.healthUrl] === 'reachable'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
