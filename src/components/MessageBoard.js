import React from "react"

const MessageBoard = ({ messages }) => {

  const displayBoard = (<ul>
    { messages.map(( item, ind ) => 
      <li key={ ind }>
        <time dateTime={ item.date }>{ item.date }</time>
        { ` From: ${ item.from } - ${ item.message }` }
      </li>) }
  </ul>)

  return (
    <div>
      { displayBoard }
    </div>
  )
}

export default MessageBoard