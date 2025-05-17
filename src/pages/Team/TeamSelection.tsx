import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../core/contexts/AuthContext'

import { Team } from '../../types/teams'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TeamNotFoundPage = () => {
  const { currentUser, setCurrentTeam, logOut } = useAuth()
  const navigation = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${API_URL}/teams/mine`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!res.ok) throw new Error('No se pudo cargar equipos')
        const data = await res.json()
        setTeams(data.map((t: any) => ({ id: t.team.id, name: t.team.name, logo: t.team.logo })))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchTeams()
    }
  }, [currentUser])

  const handleChangeEmail = () => {
    logOut()
  }

  const handleEnterTeam = (team: Team) => {
    console.log(team)
    setCurrentTeam(team)
    navigation('/dashboard')
  }

  return (
    <div className='min-h-screen flex flex-col bg-secondary items-center justify-center gap-10 px-15'>
      <div className='flex flex-col lg:flex-row items-center justify-center max-w-6xl w-full gap-12 '>
        <div className='w-full lg:w-1/2 space-y-6 text-center flex justify-center items-center flex-col'>
          <div className='bg-white border border-gray-300 rounded-full px-4 py-1 text-sm inline-block'>
            Se confirmó como <strong>{currentUser?.email}</strong>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Primeros pasos en Lade</h1>
          <p className='text-gray-600 text-base text-center'>
            Lade es una nueva forma de coordinar tu logística de manera simple y organizada. Puedes
            comenzar ahora creando o uniéndote a un equipo.
          </p>
          <Link
            to={'/equipos/crear'}
            className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition'
          >
            Crear un espacio de trabajo
          </Link>
          <p className='text-[10px] text-gray-500'>
            Al continuar, aceptas los Términos de servicio y la Política de privacidad de Lade.
          </p>
        </div>

        <div className='w-full lg:w-1/2'>
          <img
            src='/assets/stats-teams.svg'
            alt='Ilustración de bienvenida'
            className='w-full max-w-[60%] mx-auto'
          />
        </div>
      </div>

      <div className='bg-white mt-16 p-6 rounded-md shadow-md w-full max-w-xl border text-center'>
        {loading ? (
          <p className='text-gray-500'>Cargando equipos...</p>
        ) : teams.length === 0 ? (
          <>
            <h2 className='font-semibold text-gray-700'>¿Tu equipo ya usa Lade?</h2>
            <p className='text-sm text-gray-600 mt-2'>
              No encontramos ningún equipo asociado al correo <strong>{currentUser?.email}</strong>.
              Pídele al administrador de tu equipo que te agregue para poder empezar.
            </p>
            <button
              onClick={handleChangeEmail}
              className='mt-4 border border-gray-300 text-sm py-2 px-4 rounded-md hover:bg-secondary transition'
            >
              Probar con otro correo electrónico
            </button>
          </>
        ) : (
          <>
            <h2 className='font-semibold text-gray-700'>Tus equipos disponibles</h2>
            <div className='max-h-80 overflow-y-auto mt-4 text-left space-y-3'>
              {teams.map((team) => (
                <div
                  onClick={() => handleEnterTeam(team)}
                  key={team.id}
                  className='flex items-center justify-between border rounded-md p-3 hover:bg-gray-100 transition'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={team.logo || '/assets/logo-placeholder.svg'}
                      alt={team.name}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                    <span className='font-medium'>{team.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {teams.length !== 0 ? (
          <>
            <div className='flex items-center justify-center w-full my-6'>
              <div className='flex-grow border-t border-gray-300'></div>
              <span className='mx-4 text-gray-500 text-sm uppercase'>O cambia de cuenta</span>
              <div className='flex-grow border-t border-gray-300'></div>
            </div>

            <button
              onClick={handleChangeEmail}
              className='mt-4 border border-gray-300 text-sm py-2 px-4 rounded-md hover:bg-secondary transition w-full'
            >
              Probar con otro correo electrónico
            </button>
          </>
        ) : null}
      </div>

      <div className='text-xs text-gray-400 pt-12 space-x-4'>
        <a href='#' className='hover:text-gray-700 transition'>
          Privacidad y términos
        </a>
        <a href='#' className='hover:text-gray-700 transition'>
          Contactarnos
        </a>
      </div>
    </div>
  )
}

export default TeamNotFoundPage
