import React from 'react'
import SubmitFeedbackCard from './SubmitFeedbackCard'
import AllFeedbacks from './AllFeedbacks'

const Feedback = ({ loggedInUser }) => {
  return (
    <div>
      <SubmitFeedbackCard loggedInUser={loggedInUser} />
      <AllFeedbacks loggedInUser={loggedInUser} />
    </div>
  )
}

export default Feedback