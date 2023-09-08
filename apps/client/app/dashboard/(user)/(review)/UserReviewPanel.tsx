import SelfReview from '@/components/review/Self'
import { Panel, PanelContent, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { User } from '@/src/__generated__/graphql'
import CallToAction from '../CallToAction'
import ReviewTarget from './ReviewTarget'

type UserReviewPanelProps = {
  loggedUser: User
  peersToReviewCount: number
  assignedUsers: User[]
}

function UserReviewPanel({ loggedUser, peersToReviewCount, assignedUsers }: UserReviewPanelProps) {
  return (
    <Panel size='horizontal'>
      <PanelHeader>
        <PanelTitle>Reviews</PanelTitle>
      </PanelHeader>
      <PanelContent className='p-4'>
        <SelfReview user={loggedUser} />
        <div className='mt-6 gap-4 flex-col flex'>
          <CallToAction action='review' numberOfPeers={peersToReviewCount} />
          {assignedUsers?.map((user: User) => (
            <ReviewTarget
              key={user._id}
              user={user}
            />
          ))}
        </div>
      </PanelContent>
    </Panel>
  )
}

export default UserReviewPanel