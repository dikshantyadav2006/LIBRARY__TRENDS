import React from 'react'
import SubmitFeedbackCard from './SubmitFeedbackCard'
import AllFeedbacks from './AllFeedbacks'

const Feedback = ({ loggedInUser }) => {
  // console.log("loggedInUser in Feedback:", loggedInUser) // Debug line
  return (
    <div>
      <AllFeedbacks loggedInUser={loggedInUser} />
      <SubmitFeedbackCard loggedInUser={loggedInUser} />
    </div>
  )
}

export default Feedback