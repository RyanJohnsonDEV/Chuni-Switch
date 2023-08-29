/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import classes from './Card.module.css'
import { useState } from 'react'

function Card(props) {
  const [generatedName, setGeneratedName] = useState('')
  const [generatedNumber, setGeneratedNumber] = useState('')

  function cardNumberChangeHandler(event) {
    props.setCardNumber(event.target.value)
    console.log(event.target.value, 'from card')
  }

  function cardNameChangeHandler(event) {
    props.setCardName(event.target.value)
  }

  function switchToCard() {
    props.clearSelected()
    props.writeAime()
  }

  function generateNumber() {
    const generateNum = `72745697420213456${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`
    setGeneratedNumber(generateNum)
    props.setCardNumber(generateNum)
  }

  function generateName() {
    const generateName = `Player ${props.id}`
    setGeneratedName(generateName)
    props.setCardName(generateName)
  }

  return (
    <div className={`${classes.card} ${props.selected && classes.selected}`}>
      <div className={classes.verticalAlign}>
        <p>{props.id}.</p>
      </div>
      <div className={classes.cardInfo}>
        <p>Card Number:</p>
        <input
          type="text"
          defaultValue={props.cardNumber ? props.cardNumber : generatedNumber}
          placeholder="Enter Card Number"
          onChange={cardNumberChangeHandler}
          className="numberInput"
        />
        <div>
          <button
            className={classes.generateButton}
            disabled={props.cardNumber}
            onClick={generateNumber}
          >
            Generate Card Number
          </button>
        </div>
      </div>
      <div className={classes.cardInfo}>
        <p>Name:</p>
        <input
          type="text"
          placeholder="Enter Card Name"
          defaultValue={props.cardName ? props.cardName : generatedName}
          onChange={cardNameChangeHandler}
          className="nameInput"
        />
        <div>
          <button
            className={classes.generateButton}
            disabled={props.cardName}
            onClick={generateName}
          >
            Generate Card Name
          </button>
        </div>
      </div>
      <div className={classes.verticalAlign}>
        <button disabled={props.selected} onClick={switchToCard}>
          Switch
        </button>
      </div>
    </div>
  )
}
export default Card
