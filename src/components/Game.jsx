import { useState, useEffect } from 'react'
import '../components/Game.css'
import { Button, Popup } from 'semantic-ui-react'


export default function Game() {

    function getInitial() {
        const items = []
        const item = {selected:false}

        for (let i = 1; i < 19 + 1; i ++) {
            if (i == 10) {
                continue
            }

            if (i > 10) {
                items.push({...item, value: (i - (i % 10)) / 10})
                items.push({...item, value: i % 10})
            } else {
                items.push({...item, value: i})
            }
        }
        return items
    }

    const [gameBoard, setGameBoard] = useState(getInitial())

    function selectionExists() {
        // Checks if something was previously selected
        const selectedItems = gameBoard.filter(item => item.selected)
        return selectedItems.length > 0 ? true : false
    }

    function getCoordinates(index) {
        const x = Math.floor(index / 9)
        const y = index % 9
        return [x, y]
    }

    function resetSelection() {
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map(item => {
                return {...item, selected: false}
            })
        })
    }

    function foundMatch(currentIndex) {
        const selectedIndex = getSelectedIndex()
        const [currentY, currentX] = getCoordinates(currentIndex)
        const [selectedY, selectedX] = getCoordinates(selectedIndex)

        console.log(currentY, currentX)
        console.log(selectedY, selectedX)

        // does not allow click twice same cell
        if (selectedIndex === currentIndex) {
            return
        }

        // values should match
        if (gameBoard[currentIndex].value === gameBoard[selectedIndex].value ||
        gameBoard[currentIndex].value + gameBoard[selectedIndex].value === 10) {
            // all good
        } else {
            console.log('Values are not paired')
            return false
        }

        // check items between the indexes (ltr)
        let [min, max] = [selectedIndex, currentIndex]

        if (selectedIndex > currentIndex) {
            [min, max] = [currentIndex, selectedIndex]
        }
        console.log(`min max: ${min} ${max}`)
        let goodMatch = true
        for (let j = min + 1; j < max; j++) {
            console.log(`pos: ${j} ${gameBoard[j].value}`)
            if (gameBoard[j].value !== undefined) {
                goodMatch = false
            }
        }
        if (goodMatch) {
            return true
        }



        // same column
        if (currentX === selectedX) {
            // there are items between our items
            if (Math.abs(currentY - selectedY) !==1) {
                let [min, max] = [currentY, selectedY]
                if (currentY > selectedY) {
                    [min, max] = [selectedY, currentY]
                }
                for (let i = min + 1; i < max; i ++) {
                    const idx = currentX + (i * 9)
                    if (gameBoard[idx].value !== undefined) {
                        return false
                    }
                    return true
                }
                return false
            }
            return true
        }

        return false
    }

    function getSelectedIndex() {
        for (let i=0; i < gameBoard.length; i++) {
            if (gameBoard[i].selected) {
                return i
            }
        }
    }

    function removeEmptyLines() {
        // remove one empty line
        const chunkSize = 9;
        for (let i = 0; i < gameBoard.length; i += chunkSize) {
            const chunk = gameBoard.slice(i, i + chunkSize);
            const filtered = chunk.filter(item => item.value === undefined)
            if (filtered.length === 9) {
                setGameBoard(prevGameBoard => {
                    return prevGameBoard.slice(0, i).concat(
                        prevGameBoard.slice(i + 9)
                    )
                })
                break
            }
        }
    }

    function resetItem(index) {
        // remove previously selected item
        const selectedIndex = getSelectedIndex()

        // remove current and selected item
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map((item, idx) => {
                return (
                    idx === index || idx === selectedIndex ?
                    {...item, value: undefined} :
                    item
                )
            })
        })
    }

    // use effect because need to check board after state change
    useEffect(() => {
        removeEmptyLines()
    }, [gameBoard]);


    function handleClick(index) {
        // if empty value clicked - skip
        if (gameBoard[index].value === undefined) {
            return
        }
        // if previous selection exists
        if (selectionExists()) {

            // it current item matches with previously selected
            if (foundMatch(index)) {
                // remove these items
                resetItem(index)
            } else {
                console.log('Not a match!')
            }
            // reset selections
            resetSelection()
            return
        }

        // select current item
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map((item, idx) => (
                idx === index ?
                {...item, selected: !item.selected } :
                item
                ))
        })}

    function handleAddMore() {
        // add all the numbers again
        resetSelection()
        setGameBoard(prevGameBoard => {
            // clean board tail - do not count empty cell at the end
            const cleanedGameBoard = []
            let isEmptyTail = true
            for (let i=prevGameBoard.length - 1; i >= 0 ; i--) {
                if (isEmptyTail && prevGameBoard[i].value === undefined) {
                    continue
                } else {
                    cleanedGameBoard.push(prevGameBoard[i])
                    isEmptyTail = false
                }
            }
            // find non empty lines and add them to original set
            const newItems = prevGameBoard.filter(item => item.value !== undefined)
            return cleanedGameBoard.toReversed().concat(newItems)
        })
    }

    function handleRestart() {
        setGameBoard(getInitial())
    }

    function getFilledCellsCount() {
        return gameBoard.filter(item => item.value !== undefined).length
    }

    const gameElements = gameBoard.map((item, index) => {
        return (
            <button
                style={{backgroundColor: item.selected? "#c9c9c9" : "#fff"}}
                onClick={() => handleClick  (index)}
                key={index}>
                <pre>
                {item.value ? item.value : <>&nbsp;</>}
                </pre>
            </button>
            )
    })

    const gameRules = (
        <div>
            <p>The goal of the game is to cross out all the numbers.</p>
            <p>You can cross out any identical or giving a total of 10 numbers, standing next to each other horizontally or vertically.</p>
            <p>You can cross out the last in a line with the first in the next line if they are the same or add up to 10.</p>
            <p>Numbers that have been crossed out no longer count.</p>
            <p>Example: there is 1 * * 1, where * is a crossed out number, in this case it is considered that the ones are next to each other and can be crossed out.</p>
            <p>If there are no more moves, you must click on "Add more", All numbers will automatically be rewritten down and you can continue to play.</p>
        </div>
    )

    return (
        <div>
            <div>
                <span>Cells: {gameBoard.length}</span>
                <br />
                <span>Filled cells: {getFilledCellsCount()}</span>
            </div>
            {getFilledCellsCount() === 0 && <h2>Congratulations! You won!</h2>}
            <div className="grid-container">
                {gameElements}
            </div>
            <div className="card">
                <button className="ui button" onClick={handleAddMore}>Add more</button>
                <button className="ui button" onClick={handleRestart}>Restart game</button>

                <Popup
                  content={gameRules}
                  wide
                  on='click'
                  pinned
                  position='top center'
                  trigger={<Button content='Game rules' />}
                />

            </div>
        </div>
    )
}

// <button>Revert move</button>