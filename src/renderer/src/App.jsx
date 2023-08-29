import { useState, useEffect, useCallback } from 'react'
import Card from './components/Card.jsx'
import './App.css'

function App() {
  const [cards, setCards] = useState([])
  const [importError, setImportError] = useState(false)
  const [aimePath, setAimePath] = useState('')
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  useEffect(() => {
    if (window.localStorage.getItem('Cards')) {
      const savedCards = localStorage.getItem('Cards')
      setCards(JSON.parse(savedCards))
    }
    if (window.localStorage.getItem('aimePath')) {
      setAimePath(window.localStorage.getItem('aimePath'))
    }
  }, [])

  const cardsList = cards.map((card, index) => {
    function setCardNumber(cardNumber) {
      card.cardNumber = cardNumber
      console.log(cards)
      window.localStorage.setItem('Cards', JSON.stringify(cards))
    }

    function setCardName(cardName) {
      card.cardName = cardName
      console.log(cards)
      window.localStorage.setItem('Cards', JSON.stringify(cards))
    }

    function clearSelected() {
      cards.forEach((card) => {
        card.selected = false
      })
      card.selected = true
      window.localStorage.setItem('Cards', JSON.stringify(cards))
      forceUpdate()
    }

    function updateCards() {
      window.localStorage.setItem('Cards', JSON.stringify(cards))
    }

    function writeAime() {
      const fs = window.require('fs')
      const data = card.cardNumber.toString()
      fs.writeFile(aimePath, data, (err) => {
        if (err) throw err
      })
    }

    return (
      <div key={index}>
        <Card
          cardNumber={card.cardNumber}
          cardName={card.cardName}
          id={card.id}
          selected={card.selected}
          setCardNumber={setCardNumber}
          setCardName={setCardName}
          clearSelected={clearSelected}
          updateCards={updateCards}
          writeAime={writeAime}
        />
      </div>
    )
  })

  useEffect(() => {
    if (cards.length > 0) {
      window.localStorage.setItem('Cards', JSON.stringify(cards))
    }
  }, cardsList)

  function clearSelected() {
    cards.forEach((card) => {
      card.selected = false
    })
    window.localStorage.setItem('Cards', JSON.stringify(cards))
    forceUpdate()
  }

  async function getDir(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    setAimePath(event.target.files[0].path)
    window.localStorage.setItem('aimePath', event.target.files[0].path)
    reader.onload = function () {
      if (this.result !== '' && this.result.length === 20) {
        setImportError(false)
        console.log(this.result)
        setCards((prevList) => [
          ...prevList,
          {
            id: prevList.length + 1,
            cardNumber: this.result.toString(),
            cardName: '',
            selected: true
          }
        ])
        window.localStorage.setItem(
          'Cards',
          JSON.stringify([
            {
              id: 1,
              cardNumber: this.result.toString(),
              cardName: '',
              selected: true
            }
          ])
        )
      } else {
        setImportError(true)
      }
    }
    reader.readAsText(file)
  }

  async function changeDir(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    let shouldImport = true
    setAimePath(event.target.files[0].path)
    window.localStorage.setItem('aimePath', event.target.files[0].path)
    reader.onload = async function () {
      if (this.result !== '' && this.result.length === 20) {
        setImportError(false)
        console.log(this.result)
        console.log(cards)
        clearSelected()
        await cards.forEach((card) => {
          if (card.cardNumber === this.result.toString()) {
            console.log(card.cardNumber, this.result, '???')
            shouldImport = false
            card.selected = true
          }
        })
        if (shouldImport) {
          setCards((prevList) => [
            ...prevList,
            {
              id: prevList.length + 1,
              cardNumber: this.result.toString(),
              cardName: '',
              selected: true
            }
          ])
          window.localStorage.setItem(
            'Cards',
            JSON.stringify([
              {
                id: 1,
                cardNumber: this.result.toString(),
                cardName: '',
                selected: true
              }
            ])
          )
        }
      } else {
        setImportError(true)
      }
    }
    reader.readAsText(file)
  }

  function addCard() {
    setCards((prevList) => [
      ...prevList,
      {
        id: prevList.length + 1,
        cardNumber: '',
        cardName: '',
        selected: false
      }
    ])
  }

  return (
    <div className="root">
      <div>
        <h1>Chuni Switch</h1>
        <div>
          <label
            htmlFor=""
            style={{ color: 'red' }}
            className={aimePath !== '' && !importError ? 'hidden' : undefined}
          >
            {!importError
              ? 'Please import your current aime.txt file'
              : 'File does not meet aime number requirements'}
          </label>
          {aimePath !== '' && (
            <div>
              <p>{aimePath}</p>
              <label htmlFor="file-upload" className="custom-file-upload">
                Change Directory
              </label>
              <input id="file-upload" type="file" onChange={changeDir} />
            </div>
          )}
          <div>
            <input
              type="file"
              onChange={getDir}
              className={`fileSelect ${aimePath !== '' && 'hidden'}`}
            />
          </div>
        </div>
        <div>
          <div className="cardsList">{cardsList}</div>
          <div>
            <button
              onClick={addCard}
              style={{ marginTop: '1rem' }}
              className={aimePath === '' ? 'hidden' : undefined}
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
