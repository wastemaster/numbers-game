import { useState, useEffect } from 'react'
import '../components/Game.css'

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

        // values should match
        if (true || gameBoard[currentIndex].value === gameBoard[selectedIndex].value ||
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

            // it current item matches previously selected
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
        resetSelection()
        setGameBoard(prevGameBoard => {
            const newItems = prevGameBoard.filter(item => item.value !== undefined)
            return prevGameBoard.concat(newItems)
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
                <button onClick={handleAddMore}>Add more</button>
                <button>Revert move</button>
                <button onClick={handleRestart}>Restart game</button>
            </div>
        </div>
    )
}