import '../components/Game.css'
import { Button, Popup, Icon } from 'semantic-ui-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Game(props) {

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false,
        },
      },
    };

    const labels = Object.keys(props.stats);

    const data = {
      labels,
      datasets: [
        {
          label: 'Numbers',
          data: labels.map((item) => props.stats[item]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    };

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
            {props.showStats && props.filledCellsCount !== 0 &&
                <div className="game--stats">
                    <Bar options={options} data={data} />
                </div>
            }
            {props.filledCellsCount === 0 && <h2>Congratulations! You won!</h2>}
            <div className="grid-container">
                {props.gameElements}
            </div>
            <div className="card">
                <Button className="ui button" onClick={props.handleAddMore} icon labelPosition='left'>
                    <Icon name='plus' />
                    Add more
                </Button>

                <Button toggle active={props.showHints} className="ui button" onClick={props.handleShowHint} icon labelPosition='left'>
                    <Icon name='user secret' />
                    Show hints
                </Button>

                <Button toggle active={props.showStats} className="ui button" onClick={props.handleShowStats} icon labelPosition='left'>
                    <Icon name='chart bar' />
                    Show stats
                </Button>

                <Button className="ui button" onClick={props.handleRestart} icon labelPosition='left'>
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
