import '@/app/global.css'
import { cookies } from 'next/headers'
import {
  getAllUsers,
  getAssignedReviews,
  getUserById,
  getFullReport,
} from '@/lib/get-data-api'
import { redirect } from 'next/navigation'
import DashboardTop from '@/components/ui/Dashboard/DashboardTop'
import UserNominationPanel from './(user)/(nomination)/UserNominationPanel'
import UserReviewPanel from './(user)/(review)/UserReviewPanel'
import UserReportsPanel from './(user)/(reports)/UserReportsPanel'

export const revalidate = 0

export default async function Dashboard() {
  const panelTitle = 'Team member Panel'
  const cookieStore = cookies()

  const token = cookieStore.get('token')
  const id = cookieStore.get('userId')

  if (token === undefined || !token.value || id === undefined || !id.value) {
    redirect('/')
  }
  const loggedUserId = id.value
  const loggedUser = await getUserById(id.value)

  let loggedUserFullName = loggedUser.fullName

  const loggedUserFirstName = loggedUserFullName
    ? loggedUserFullName.split(' ')[0]
    : ''

  const loggedUserLastName = loggedUserFullName
    ? loggedUserFullName.split(' ')[1]
    : ''

  const assignedReviews = await getAssignedReviews(loggedUserId)
  const assignedUsers = await Promise.all(
    assignedReviews.map(
      async (review) => await getUserById(review._id.targetId)
    )
  )

  const reportVars = {
    targetId: id.value,
  }
  const loggedUserReport = await getFullReport(reportVars.targetId)
  const peers = await getAllUsers()

  return (
    <>
      <DashboardTop
        firstName={loggedUserFirstName}
        lastName={loggedUserLastName}
        title={loggedUser.title}
        photo={loggedUser.photo}
        panelTitle={panelTitle}
      />
      <div className='pt-9 gap-14 flex'>
        <div className='gap-6 flex-col flex' id='horizontal'>
          <UserNominationPanel users={peers} loggedUserReport={loggedUserReport} loggedUserId={loggedUserId} />
          <UserReviewPanel />
        </div>
        <div id='vertical'>
          <UserReportsPanel />
        </div>
      </div>
    </>
  )
}
