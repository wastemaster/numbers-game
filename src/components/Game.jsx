import { useState, useEffect } from 'react'
import '../components/Game.css'
import { Button, Popup, Icon } from 'semantic-ui-react'


export default function Game() {

    function getInitial() {
        // load initial state of the board
        const items = []
        const item = {selected:false, hinted:false}

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
    const [showHints, setShowHints] = useState(false)

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
        // reset all selections
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map(item => {
                return {...item, selected: false}
            })
        })
    }

    function reSelection(index) {
        // reset previous and select new
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map((item, idx) => {
                return (
                    (idx === index && item.value !== undefined) ?
                    {...item, selected: true} :
                    {...item, selected: false}
                )
            })
        })
    }

    function foundMatch(currentIndex) {
        const selectedIndex = getSelectedIndex()
        const [currentY, currentX] = getCoordinates(currentIndex)
        const [selectedY, selectedX] = getCoordinates(selectedIndex)

        //console.log(currentY, currentX)
        //console.log(selectedY, selectedX)

        // does not allow click twice same cell
        if (selectedIndex === currentIndex) {
            return
        }

        // values should match
        if (itemsMatch(currentIndex, selectedIndex)) {
            // all good
        } else {
            // console.log('Values are not paired')
            return false
        }

        // check items between the indexes (ltr)
        let [min, max] = [selectedIndex, currentIndex]

        if (selectedIndex > currentIndex) {
            [min, max] = [currentIndex, selectedIndex]
        }
        // console.log(`min max: ${min} ${max}`)
        let goodMatch = true
        for (let j = min + 1; j < max; j++) {
            // console.log(`pos: ${j} ${gameBoard[j].value}`)
            if (gameBoard[j].value !== undefined) {
                goodMatch = false
                break
            }
        }
        if (goodMatch) {
            return true
        }

        // same column
        if (currentX === selectedX) {

            let goodMatch = true
            for (let j = min + 9; j < max; j+=9) {
                // console.log(`Vpos: ${j} ${gameBoard[j].value}`)
                if (gameBoard[j].value !== undefined) {
                    goodMatch = false
                }
            }
            if (goodMatch) {
                return true
            }
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
        console.log('removeEmptyLines')
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
                // console.log('Not a match!')
            }
            // reset old selection and select new cell
            reSelection(index)
            return
        }

        // select current item
        selectCell(index)
    }

    function selectCell(index) {

        // select current item
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map((item, idx) => (
                idx === index ?
                {...item, selected: !item.selected } :
                item
                ))
        })

    }

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
        let cellClasses = "game--cell"
        if (item.hinted) {
            cellClasses = cellClasses + " hinted--cell"
        }
        if (item.selected) {
            cellClasses = cellClasses + " selected--cell"
        }
        return (
            <button
                className={cellClasses}
                onClick={() => handleClick  (index)}
                key={index}>
                <pre>
                {item.value ? item.value : <>&nbsp;</>}
                </pre>
            </button>
            )
    })

    function itemsMatch(sourceIndex, targetIndex) {
        console.log('itemsMatch')
        if (gameBoard[sourceIndex].value === gameBoard[targetIndex].value ||
        gameBoard[sourceIndex].value + gameBoard[targetIndex].value === 10) {
            // console.log('found match: ' + sourceIndex + " " + targetIndex)
            return true
        }
        return false
    }

    function removeHints() {
        // remove hints from board
        setGameBoard(prevGameBoard => prevGameBoard.map(item => {
            return {...item, hinted: false}
        }))
    }

    function placeHints(first, second) {
        // place hints and first index position and in second index position
        setGameBoard(prevGameBoard => prevGameBoard.map((item, idx) => {
            return (
                (idx === first || idx === second) ?
                {...item, hinted: true} :
                item
            )
        }))
    }

    function renderHints() {
        console.log('renderHints')
        let hints = []
        for(let i=0; i < gameBoard.length; i++) {
            if (gameBoard[i].value !== undefined) {
                // console.log('hint: checking item ' +i)
                // checking for horizontal hints
                for(let j=i + 1; j < gameBoard.length; j++) {
                    if (gameBoard[j].value === undefined) {
                        continue
                    }
                    if (itemsMatch(i, j)) {
                        hints.push(i)
                        hints.push(j)
                        break
                    }
                    break
                }

                // checking for vertical hints
                for(let j=i + 9; j < gameBoard.length; j+=9) {
                    // console.log('vert comparing ' + i + " " + j)
                    if (gameBoard[j].value === undefined) {
                        continue
                    }
                    if (itemsMatch(i, j)) {
                        hints.push(i)
                        hints.push(j)
                        break
                    }
                    break
                }
            }
        }
        // unique hint indexes
        const uniqueHints = [...new Set(hints)]
        for (let i =0; i < uniqueHints.length; i ++) {
            console.log(uniqueHints[i])
        }
        setGameBoard(prevGameBoard => {
            return prevGameBoard.map((item, idx) => {
                return (
                    hints.includes(idx) ?
                    {...item, hinted: true} :
                    {...item, hinted: false}
                )
            })
        })
    }

    function handleShowHint() {
        // show hint handler
        setShowHints(prevShowHints => !prevShowHints)
    }

    // use effect for removing empty lines
    useEffect(() => {
        removeEmptyLines()
    }, [gameBoard.filter(item => item.value !== undefined).length]);

    // use effect for hints
    useEffect(() => {
        if (showHints) {
            renderHints()
        } else {
            removeHints()
        }
    }, [gameBoard.filter(item => item.value !== undefined).length, showHints]);

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
                <Button className="ui button" onClick={handleAddMore} icon labelPosition='left'>
                    <Icon name='plus' />
                    Add more
                </Button>

                <Button toggle active={showHints} className="ui button" onClick={handleShowHint} icon labelPosition='left'>
                    <Icon name='user secret' />
                    Show hints
                </Button>

                <Button className="ui button" onClick={handleRestart} icon labelPosition='left'>
                    <Icon name='sync' />
                    Restart
                </Button>

                <Popup
                  content={gameRules}
                  wide
                  on='click'
                  pinned
                  position='top center'
                  trigger={<Button icon labelPosition='left'><Icon name='newspaper outline' />Game rules</Button>}
                />

            </div>
        </div>
    )
}
